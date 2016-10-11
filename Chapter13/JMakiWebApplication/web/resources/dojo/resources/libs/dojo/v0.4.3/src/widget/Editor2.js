/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Editor2");
djd43.require("djd43.io.*");
djd43.require("djd43.widget.RichText");
djd43.require("djd43.widget.Editor2Toolbar");
djd43.require("djd43.uri.cache");
djd43.widget.Editor2Manager = new djd43.widget.HandlerManager;
djd43.lang.mixin(djd43.widget.Editor2Manager, {_currentInstance:null, commandState:{Disabled:0, Latched:1, Enabled:2}, getCurrentInstance:function () {
	return this._currentInstance;
}, setCurrentInstance:function (inst) {
	this._currentInstance = inst;
}, getCommand:function (editor, name) {
	var oCommand;
	name = name.toLowerCase();
	for (var i = 0; i < this._registeredHandlers.length; i++) {
		oCommand = this._registeredHandlers[i](editor, name);
		if (oCommand) {
			return oCommand;
		}
	}
	switch (name) {
	  case "htmltoggle":
		oCommand = new djd43.widget.Editor2BrowserCommand(editor, name);
		break;
	  case "formatblock":
		oCommand = new djd43.widget.Editor2FormatBlockCommand(editor, name);
		break;
	  case "anchor":
		oCommand = new djd43.widget.Editor2Command(editor, name);
		break;
	  case "createlink":
		oCommand = new djd43.widget.Editor2DialogCommand(editor, name, {contentFile:"djd43.widget.Editor2Plugin.CreateLinkDialog", contentClass:"Editor2CreateLinkDialog", title:"Insert/Edit Link", width:"300px", height:"200px"});
		break;
	  case "insertimage":
		oCommand = new djd43.widget.Editor2DialogCommand(editor, name, {contentFile:"djd43.widget.Editor2Plugin.InsertImageDialog", contentClass:"Editor2InsertImageDialog", title:"Insert/Edit Image", width:"400px", height:"270px"});
		break;
	  default:
		var curtInst = this.getCurrentInstance();
		if ((curtInst && curtInst.queryCommandAvailable(name)) || (!curtInst && djd43.widget.Editor2.prototype.queryCommandAvailable(name))) {
			oCommand = new djd43.widget.Editor2BrowserCommand(editor, name);
		} else {
			djd43.debug("djd43.widget.Editor2Manager.getCommand: Unknown command " + name);
			return;
		}
	}
	return oCommand;
}, destroy:function () {
	this._currentInstance = null;
	djd43.widget.HandlerManager.prototype.destroy.call(this);
}});
djd43.addOnUnload(djd43.widget.Editor2Manager, "destroy");
djd43.lang.declare("djd43.widget.Editor2Command", null, function (editor, name) {
	this._editor = editor;
	this._updateTime = 0;
	this._name = name;
}, {_text:"Unknown", execute:function (para) {
	djd43.unimplemented("djd43.widget.Editor2Command.execute");
}, getText:function () {
	return this._text;
}, getState:function () {
	return djd43.widget.Editor2Manager.commandState.Enabled;
}, destroy:function () {
}});
djd43.widget.Editor2BrowserCommandNames = {"bold":"Bold", "copy":"Copy", "cut":"Cut", "Delete":"Delete", "indent":"Indent", "inserthorizontalrule":"Horizental Rule", "insertorderedlist":"Numbered List", "insertunorderedlist":"Bullet List", "italic":"Italic", "justifycenter":"Align Center", "justifyfull":"Justify", "justifyleft":"Align Left", "justifyright":"Align Right", "outdent":"Outdent", "paste":"Paste", "redo":"Redo", "removeformat":"Remove Format", "selectall":"Select All", "strikethrough":"Strikethrough", "subscript":"Subscript", "superscript":"Superscript", "underline":"Underline", "undo":"Undo", "unlink":"Remove Link", "createlink":"Create Link", "insertimage":"Insert Image", "htmltoggle":"HTML Source", "forecolor":"Foreground Color", "hilitecolor":"Background Color", "plainformatblock":"Paragraph Style", "formatblock":"Paragraph Style", "fontsize":"Font Size", "fontname":"Font Name"};
djd43.lang.declare("djd43.widget.Editor2BrowserCommand", djd43.widget.Editor2Command, function (editor, name) {
	var text = djd43.widget.Editor2BrowserCommandNames[name.toLowerCase()];
	if (text) {
		this._text = text;
	}
}, {execute:function (para) {
	this._editor.execCommand(this._name, para);
}, getState:function () {
	if (this._editor._lastStateTimestamp > this._updateTime || this._state == undefined) {
		this._updateTime = this._editor._lastStateTimestamp;
		try {
			if (this._editor.queryCommandEnabled(this._name)) {
				if (this._editor.queryCommandState(this._name)) {
					this._state = djd43.widget.Editor2Manager.commandState.Latched;
				} else {
					this._state = djd43.widget.Editor2Manager.commandState.Enabled;
				}
			} else {
				this._state = djd43.widget.Editor2Manager.commandState.Disabled;
			}
		}
		catch (e) {
			this._state = djd43.widget.Editor2Manager.commandState.Enabled;
		}
	}
	return this._state;
}, getValue:function () {
	try {
		return this._editor.queryCommandValue(this._name);
	}
	catch (e) {
	}
}});
djd43.lang.declare("djd43.widget.Editor2FormatBlockCommand", djd43.widget.Editor2BrowserCommand, {});
djd43.require("djd43.widget.FloatingPane");
djd43.widget.defineWidget("djd43.widget.Editor2Dialog", [djd43.widget.HtmlWidget, djd43.widget.FloatingPaneBase, djd43.widget.ModalDialogBase], {templateString:"<div id=\"${this.widgetId}\" class=\"dojoFloatingPane\">\n\t<span dojoattachpoint=\"tabStartOuter\" dojoonfocus=\"trapTabs\" dojoonblur=\"clearTrap\"\ttabindex=\"0\"></span>\n\t<span dojoattachpoint=\"tabStart\" dojoonfocus=\"trapTabs\" dojoonblur=\"clearTrap\" tabindex=\"0\"></span>\n\t<div dojoAttachPoint=\"titleBar\" class=\"dojoFloatingPaneTitleBar\"  style=\"display:none\">\n\t  \t<img dojoAttachPoint=\"titleBarIcon\"  class=\"dojoFloatingPaneTitleBarIcon\">\n\t\t<div dojoAttachPoint=\"closeAction\" dojoAttachEvent=\"onClick:hide\"\n   \t  \t\tclass=\"dojoFloatingPaneCloseIcon\"></div>\n\t\t<div dojoAttachPoint=\"restoreAction\" dojoAttachEvent=\"onClick:restoreWindow\"\n   \t  \t\tclass=\"dojoFloatingPaneRestoreIcon\"></div>\n\t\t<div dojoAttachPoint=\"maximizeAction\" dojoAttachEvent=\"onClick:maximizeWindow\"\n   \t  \t\tclass=\"dojoFloatingPaneMaximizeIcon\"></div>\n\t\t<div dojoAttachPoint=\"minimizeAction\" dojoAttachEvent=\"onClick:minimizeWindow\"\n   \t  \t\tclass=\"dojoFloatingPaneMinimizeIcon\"></div>\n\t  \t<div dojoAttachPoint=\"titleBarText\" class=\"dojoFloatingPaneTitleText\">${this.title}</div>\n\t</div>\n\n\t<div id=\"${this.widgetId}_container\" dojoAttachPoint=\"containerNode\" class=\"dojoFloatingPaneClient\"></div>\n\t<span dojoattachpoint=\"tabEnd\" dojoonfocus=\"trapTabs\" dojoonblur=\"clearTrap\" tabindex=\"0\"></span>\n\t<span dojoattachpoint=\"tabEndOuter\" dojoonfocus=\"trapTabs\" dojoonblur=\"clearTrap\" tabindex=\"0\"></span>\n\t<div dojoAttachPoint=\"resizeBar\" class=\"dojoFloatingPaneResizebar\" style=\"display:none\"></div>\n</div>\n", modal:true, width:"", height:"", windowState:"minimized", displayCloseAction:true, contentFile:"", contentClass:"", fillInTemplate:function (args, frag) {
	this.fillInFloatingPaneTemplate(args, frag);
	djd43.widget.Editor2Dialog.superclass.fillInTemplate.call(this, args, frag);
}, postCreate:function () {
	if (this.contentFile) {
		djd43.require(this.contentFile);
	}
	if (this.modal) {
		djd43.widget.ModalDialogBase.prototype.postCreate.call(this);
	} else {
		with (this.domNode.style) {
			zIndex = 999;
			display = "none";
		}
	}
	djd43.widget.FloatingPaneBase.prototype.postCreate.apply(this, arguments);
	djd43.widget.Editor2Dialog.superclass.postCreate.call(this);
	if (this.width && this.height) {
		with (this.domNode.style) {
			width = this.width;
			height = this.height;
		}
	}
}, createContent:function () {
	if (!this.contentWidget && this.contentClass) {
		this.contentWidget = djd43.widget.createWidget(this.contentClass);
		this.addChild(this.contentWidget);
	}
}, show:function () {
	if (!this.contentWidget) {
		djd43.widget.Editor2Dialog.superclass.show.apply(this, arguments);
		this.createContent();
		djd43.widget.Editor2Dialog.superclass.hide.call(this);
	}
	if (!this.contentWidget || !this.contentWidget.loadContent()) {
		return;
	}
	this.showFloatingPane();
	djd43.widget.Editor2Dialog.superclass.show.apply(this, arguments);
	if (this.modal) {
		this.showModalDialog();
	}
	if (this.modal) {
		this.bg.style.zIndex = this.domNode.style.zIndex - 1;
	}
}, onShow:function () {
	djd43.widget.Editor2Dialog.superclass.onShow.call(this);
	this.onFloatingPaneShow();
}, closeWindow:function () {
	this.hide();
	djd43.widget.Editor2Dialog.superclass.closeWindow.apply(this, arguments);
}, hide:function () {
	if (this.modal) {
		this.hideModalDialog();
	}
	djd43.widget.Editor2Dialog.superclass.hide.call(this);
}, checkSize:function () {
	if (this.isShowing()) {
		if (this.modal) {
			this._sizeBackground();
		}
		this.placeModalDialog();
		this.onResized();
	}
}});
djd43.widget.defineWidget("djd43.widget.Editor2DialogContent", djd43.widget.HtmlWidget, {widgetsInTemplate:true, loadContent:function () {
	return true;
}, cancel:function () {
	this.parent.hide();
}});
djd43.lang.declare("djd43.widget.Editor2DialogCommand", djd43.widget.Editor2BrowserCommand, function (editor, name, dialogParas) {
	this.dialogParas = dialogParas;
}, {execute:function () {
	if (!this.dialog) {
		if (!this.dialogParas.contentFile || !this.dialogParas.contentClass) {
			alert("contentFile and contentClass should be set for djd43.widget.Editor2DialogCommand.dialogParas!");
			return;
		}
		this.dialog = djd43.widget.createWidget("Editor2Dialog", this.dialogParas);
		djd43.body().appendChild(this.dialog.domNode);
		djd43.event.connect(this, "destroy", this.dialog, "destroy");
	}
	this.dialog.show();
}, getText:function () {
	return this.dialogParas.title || djd43.widget.Editor2DialogCommand.superclass.getText.call(this);
}});
djd43.widget.Editor2ToolbarGroups = {};
djd43.widget.defineWidget("djd43.widget.Editor2", djd43.widget.RichText, function () {
	this._loadedCommands = {};
}, {toolbarAlwaysVisible:false, toolbarWidget:null, scrollInterval:null, toolbarTemplatePath:djd43.uri.cache.set(djd43.uri.moduleUri("djd43.widget", "templates/EditorToolbarOneline.html"), "<div class=\"EditorToolbarDomNode EditorToolbarSmallBg\">\n\t<table cellpadding=\"1\" cellspacing=\"0\" border=\"0\">\n\t\t<tbody>\n\t\t\t<tr valign=\"top\" align=\"left\">\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"htmltoggle\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon\" \n\t\t\t\t\t\tstyle=\"background-image: none; width: 30px;\" >&lt;h&gt;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"copy\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Copy\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"paste\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Paste\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"undo\">\n\t\t\t\t\t\t<!-- FIXME: should we have the text \"undo\" here? -->\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Undo\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"redo\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Redo\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td isSpacer=\"true\">\n\t\t\t\t\t<span class=\"iconContainer\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Sep\"\tstyle=\"width: 5px; min-width: 5px;\"></span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"createlink\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Link\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"insertimage\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Image\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"inserthorizontalrule\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_HorizontalLine \">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"bold\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Bold\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"italic\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Italic\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"underline\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Underline\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"strikethrough\">\n\t\t\t\t\t\t<span \n\t\t\t\t\t\t\tclass=\"dojoE2TBIcon dojoE2TBIcon_StrikeThrough\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td isSpacer=\"true\">\n\t\t\t\t\t<span class=\"iconContainer\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Sep\" \n\t\t\t\t\t\t\tstyle=\"width: 5px; min-width: 5px;\"></span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"insertunorderedlist\">\n\t\t\t\t\t\t<span \n\t\t\t\t\t\t\tclass=\"dojoE2TBIcon dojoE2TBIcon_BulletedList\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"insertorderedlist\">\n\t\t\t\t\t\t<span \n\t\t\t\t\t\t\tclass=\"dojoE2TBIcon dojoE2TBIcon_NumberedList\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td isSpacer=\"true\">\n\t\t\t\t\t<span class=\"iconContainer\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Sep\" style=\"width: 5px; min-width: 5px;\"></span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"indent\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Indent\" \n\t\t\t\t\t\t\tunselectable=\"on\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"outdent\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Outdent\" \n\t\t\t\t\t\t\tunselectable=\"on\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td isSpacer=\"true\">\n\t\t\t\t\t<span class=\"iconContainer\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Sep\" style=\"width: 5px; min-width: 5px;\"></span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"forecolor\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_TextColor\" \n\t\t\t\t\t\t\tunselectable=\"on\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"hilitecolor\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_BackgroundColor\" \n\t\t\t\t\t\t\tunselectable=\"on\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td isSpacer=\"true\">\n\t\t\t\t\t<span class=\"iconContainer\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Sep\" style=\"width: 5px; min-width: 5px;\"></span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"justifyleft\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_LeftJustify\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"justifycenter\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_CenterJustify\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"justifyright\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_RightJustify\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"justifyfull\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_BlockJustify\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\t\n\t\t\t\t<td>\n\t\t\t\t\t<select class=\"dojoEditorToolbarItem\" dojoETItemName=\"plainformatblock\">\n\t\t\t\t\t\t<!-- FIXME: using \"p\" here inserts a paragraph in most cases! -->\n\t\t\t\t\t\t<option value=\"\">-- format --</option>\n\t\t\t\t\t\t<option value=\"p\">Normal</option>\n\t\t\t\t\t\t<option value=\"pre\">Fixed Font</option>\n\t\t\t\t\t\t<option value=\"h1\">Main Heading</option>\n\t\t\t\t\t\t<option value=\"h2\">Section Heading</option>\n\t\t\t\t\t\t<option value=\"h3\">Sub-Heading</option>\n\t\t\t\t\t\t<!-- <option value=\"blockquote\">Block Quote</option> -->\n\t\t\t\t\t</select>\n\t\t\t\t</td>\n\t\t\t\t<td><!-- uncomment to enable save button -->\n\t\t\t\t\t<!-- save -->\n\t\t\t\t\t<!--span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"save\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Save\">&nbsp;</span>\n\t\t\t\t\t</span-->\n\t\t\t\t</td>\n\t\t\t\t<td width=\"*\">&nbsp;</td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>\n</div>\n"), toolbarTemplateCssPath:null, toolbarPlaceHolder:"", _inSourceMode:false, _htmlEditNode:null, toolbarGroup:"", shareToolbar:false, contextMenuGroupSet:"", editorOnLoad:function () {
	djd43.event.topic.publish("djd43.widget.Editor2::preLoadingToolbar", this);
	if (this.toolbarAlwaysVisible) {
		djd43.require("djd43.widget.Editor2Plugin.AlwaysShowToolbar");
	}
	if (this.toolbarWidget) {
		this.toolbarWidget.show();
		djd43.html.insertBefore(this.toolbarWidget.domNode, this.domNode.firstChild);
	} else {
		if (this.shareToolbar) {
			djd43.deprecated("Editor2:shareToolbar is deprecated in favor of toolbarGroup", "0.5");
			this.toolbarGroup = "defaultDojoToolbarGroup";
		}
		if (this.toolbarGroup) {
			if (djd43.widget.Editor2ToolbarGroups[this.toolbarGroup]) {
				this.toolbarWidget = djd43.widget.Editor2ToolbarGroups[this.toolbarGroup];
			}
		}
		if (!this.toolbarWidget) {
			var tbOpts = {shareGroup:this.toolbarGroup, parent:this};
			tbOpts.templateString = djd43.uri.cache.get(this.toolbarTemplatePath);
			if (this.toolbarTemplateCssPath) {
				tbOpts.templateCssPath = this.toolbarTemplateCssPath;
				tbOpts.templateCssString = djd43.uri.cache.get(this.toolbarTemplateCssPath);
			}
			if (this.toolbarPlaceHolder) {
				this.toolbarWidget = djd43.widget.createWidget("Editor2Toolbar", tbOpts, djd43.byId(this.toolbarPlaceHolder), "after");
			} else {
				this.toolbarWidget = djd43.widget.createWidget("Editor2Toolbar", tbOpts, this.domNode.firstChild, "before");
			}
			if (this.toolbarGroup) {
				djd43.widget.Editor2ToolbarGroups[this.toolbarGroup] = this.toolbarWidget;
			}
			djd43.event.connect(this, "close", this.toolbarWidget, "hide");
			this.toolbarLoaded();
		}
	}
	djd43.event.topic.registerPublisher("Editor2.clobberFocus", this, "clobberFocus");
	djd43.event.topic.subscribe("Editor2.clobberFocus", this, "setBlur");
	djd43.event.topic.publish("djd43.widget.Editor2::onLoad", this);
}, toolbarLoaded:function () {
}, registerLoadedPlugin:function (obj) {
	if (!this.loadedPlugins) {
		this.loadedPlugins = [];
	}
	this.loadedPlugins.push(obj);
}, unregisterLoadedPlugin:function (obj) {
	for (var i in this.loadedPlugins) {
		if (this.loadedPlugins[i] === obj) {
			delete this.loadedPlugins[i];
			return;
		}
	}
	djd43.debug("djd43.widget.Editor2.unregisterLoadedPlugin: unknow plugin object: " + obj);
}, execCommand:function (command, argument) {
	switch (command.toLowerCase()) {
	  case "htmltoggle":
		this.toggleHtmlEditing();
		break;
	  default:
		djd43.widget.Editor2.superclass.execCommand.apply(this, arguments);
	}
}, queryCommandEnabled:function (command, argument) {
	switch (command.toLowerCase()) {
	  case "htmltoggle":
		return true;
	  default:
		if (this._inSourceMode) {
			return false;
		}
		return djd43.widget.Editor2.superclass.queryCommandEnabled.apply(this, arguments);
	}
}, queryCommandState:function (command, argument) {
	switch (command.toLowerCase()) {
	  case "htmltoggle":
		return this._inSourceMode;
	  default:
		return djd43.widget.Editor2.superclass.queryCommandState.apply(this, arguments);
	}
}, onClick:function (e) {
	djd43.widget.Editor2.superclass.onClick.call(this, e);
	if (djd43.widget.PopupManager) {
		if (!e) {
			e = this.window.event;
		}
		djd43.widget.PopupManager.onClick(e);
	}
}, clobberFocus:function () {
}, toggleHtmlEditing:function () {
	if (this === djd43.widget.Editor2Manager.getCurrentInstance()) {
		if (!this._inSourceMode) {
			var html = this.getEditorContent();
			this._inSourceMode = true;
			if (!this._htmlEditNode) {
				this._htmlEditNode = djd43.doc().createElement("textarea");
				djd43.html.insertAfter(this._htmlEditNode, this.editorObject);
			}
			this._htmlEditNode.style.display = "";
			this._htmlEditNode.style.width = "100%";
			this._htmlEditNode.style.height = djd43.html.getBorderBox(this.editNode).height + "px";
			this._htmlEditNode.value = html;
			with (this.editorObject.style) {
				position = "absolute";
				left = "-2000px";
				top = "-2000px";
			}
		} else {
			this._inSourceMode = false;
			this._htmlEditNode.blur();
			with (this.editorObject.style) {
				position = "";
				left = "";
				top = "";
			}
			var html = this._htmlEditNode.value;
			djd43.lang.setTimeout(this, "replaceEditorContent", 1, html);
			this._htmlEditNode.style.display = "none";
			this.focus();
		}
		this.onDisplayChanged(null, true);
	}
}, setFocus:function () {
	if (djd43.widget.Editor2Manager.getCurrentInstance() === this) {
		return;
	}
	this.clobberFocus();
	djd43.widget.Editor2Manager.setCurrentInstance(this);
}, setBlur:function () {
}, saveSelection:function () {
	this._bookmark = null;
	this._bookmark = djd43.withGlobal(this.window, djd43.html.selection.getBookmark);
}, restoreSelection:function () {
	if (this._bookmark) {
		this.focus();
		djd43.withGlobal(this.window, "moveToBookmark", djd43.html.selection, [this._bookmark]);
		this._bookmark = null;
	} else {
		djd43.debug("restoreSelection: no saved selection is found!");
	}
}, _updateToolbarLastRan:null, _updateToolbarTimer:null, _updateToolbarFrequency:500, updateToolbar:function (force) {
	if ((!this.isLoaded) || (!this.toolbarWidget)) {
		return;
	}
	var diff = new Date() - this._updateToolbarLastRan;
	if ((!force) && (this._updateToolbarLastRan) && ((diff < this._updateToolbarFrequency))) {
		clearTimeout(this._updateToolbarTimer);
		var _this = this;
		this._updateToolbarTimer = setTimeout(function () {
			_this.updateToolbar();
		}, this._updateToolbarFrequency / 2);
		return;
	} else {
		this._updateToolbarLastRan = new Date();
	}
	if (djd43.widget.Editor2Manager.getCurrentInstance() !== this) {
		return;
	}
	this.toolbarWidget.update();
}, destroy:function (finalize) {
	this._htmlEditNode = null;
	djd43.event.disconnect(this, "close", this.toolbarWidget, "hide");
	if (!finalize) {
		this.toolbarWidget.destroy();
	}
	djd43.widget.Editor2.superclass.destroy.call(this);
}, _lastStateTimestamp:0, onDisplayChanged:function (e, forceUpdate) {
	this._lastStateTimestamp = (new Date()).getTime();
	djd43.widget.Editor2.superclass.onDisplayChanged.call(this, e);
	this.updateToolbar(forceUpdate);
}, onLoad:function () {
	try {
		djd43.widget.Editor2.superclass.onLoad.call(this);
	}
	catch (e) {
		djd43.debug(e);
	}
	this.editorOnLoad();
}, onFocus:function () {
	djd43.widget.Editor2.superclass.onFocus.call(this);
	this.setFocus();
}, getEditorContent:function () {
	if (this._inSourceMode) {
		return this._htmlEditNode.value;
	}
	return djd43.widget.Editor2.superclass.getEditorContent.call(this);
}, replaceEditorContent:function (html) {
	if (this._inSourceMode) {
		this._htmlEditNode.value = html;
		return;
	}
	djd43.widget.Editor2.superclass.replaceEditorContent.apply(this, arguments);
}, getCommand:function (name) {
	if (this._loadedCommands[name]) {
		return this._loadedCommands[name];
	}
	var cmd = djd43.widget.Editor2Manager.getCommand(this, name);
	this._loadedCommands[name] = cmd;
	return cmd;
}, shortcuts:[["bold"], ["italic"], ["underline"], ["selectall", "a"], ["insertunorderedlist", "\\"]], setupDefaultShortcuts:function () {
	var exec = function (cmd) {
		return function () {
			cmd.execute();
		};
	};
	var self = this;
	djd43.lang.forEach(this.shortcuts, function (item) {
		var cmd = self.getCommand(item[0]);
		if (cmd) {
			self.addKeyHandler(item[1] ? item[1] : item[0].charAt(0), item[2] == undefined ? self.KEY_CTRL : item[2], exec(cmd));
		}
	});
}});

