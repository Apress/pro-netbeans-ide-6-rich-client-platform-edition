/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Editor");
djd43.deprecated("djd43.widget.Editor", "is replaced by djd43.widget.Editor2", "0.5");
djd43.require("djd43.io.*");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.Toolbar");
djd43.require("djd43.widget.RichText");
djd43.require("djd43.widget.ColorPalette");
djd43.require("djd43.string.extras");
djd43.widget.tags.addParseTreeHandler("dojo:Editor");
djd43.widget.Editor = function () {
	djd43.widget.HtmlWidget.call(this);
	this.contentFilters = [];
	this._toolbars = [];
};
djd43.inherits(djd43.widget.Editor, djd43.widget.HtmlWidget);
djd43.widget.Editor.itemGroups = {textGroup:["bold", "italic", "underline", "strikethrough"], blockGroup:["formatBlock", "fontName", "fontSize"], justifyGroup:["justifyleft", "justifycenter", "justifyright"], commandGroup:["save", "cancel"], colorGroup:["forecolor", "hilitecolor"], listGroup:["insertorderedlist", "insertunorderedlist"], indentGroup:["outdent", "indent"], linkGroup:["createlink", "insertimage", "inserthorizontalrule"]};
djd43.widget.Editor.formatBlockValues = {"Normal":"p", "Main heading":"h2", "Sub heading":"h3", "Sub sub heading":"h4", "Preformatted":"pre"};
djd43.widget.Editor.fontNameValues = {"Arial":"Arial, Helvetica, sans-serif", "Verdana":"Verdana, sans-serif", "Times New Roman":"Times New Roman, serif", "Courier":"Courier New, monospace"};
djd43.widget.Editor.fontSizeValues = {"1 (8 pt)":"1", "2 (10 pt)":"2", "3 (12 pt)":"3", "4 (14 pt)":"4", "5 (18 pt)":"5", "6 (24 pt)":"6", "7 (36 pt)":"7"};
djd43.widget.Editor.defaultItems = ["commandGroup", "|", "blockGroup", "|", "textGroup", "|", "colorGroup", "|", "justifyGroup", "|", "listGroup", "indentGroup", "|", "linkGroup"];
djd43.widget.Editor.supportedCommands = ["save", "cancel", "|", "-", "/", " "];
djd43.lang.extend(djd43.widget.Editor, {widgetType:"Editor", saveUrl:"", saveMethod:"post", saveArgName:"editorContent", closeOnSave:false, items:djd43.widget.Editor.defaultItems, formatBlockItems:djd43.lang.shallowCopy(djd43.widget.Editor.formatBlockValues), fontNameItems:djd43.lang.shallowCopy(djd43.widget.Editor.fontNameValues), fontSizeItems:djd43.lang.shallowCopy(djd43.widget.Editor.fontSizeValues), getItemProperties:function (name) {
	var props = {};
	switch (name.toLowerCase()) {
	  case "bold":
	  case "italic":
	  case "underline":
	  case "strikethrough":
		props.toggleItem = true;
		break;
	  case "justifygroup":
		props.defaultButton = "justifyleft";
		props.preventDeselect = true;
		props.buttonGroup = true;
		break;
	  case "listgroup":
		props.buttonGroup = true;
		break;
	  case "save":
	  case "cancel":
		props.label = djd43.string.capitalize(name);
		break;
	  case "forecolor":
	  case "hilitecolor":
		props.name = name;
		props.toggleItem = true;
		props.icon = this.getCommandImage(name);
		break;
	  case "formatblock":
		props.name = "formatBlock";
		props.values = this.formatBlockItems;
		break;
	  case "fontname":
		props.name = "fontName";
		props.values = this.fontNameItems;
	  case "fontsize":
		props.name = "fontSize";
		props.values = this.fontSizeItems;
	}
	return props;
}, validateItems:true, focusOnLoad:true, minHeight:"1em", _richText:null, _richTextType:"RichText", _toolbarContainer:null, _toolbarContainerType:"ToolbarContainer", _toolbars:[], _toolbarType:"Toolbar", _toolbarItemType:"ToolbarItem", buildRendering:function (args, frag) {
	var node = frag["dojo:" + this.widgetType.toLowerCase()]["nodeRef"];
	var trt = djd43.widget.createWidget(this._richTextType, {focusOnLoad:this.focusOnLoad, minHeight:this.minHeight}, node);
	var _this = this;
	setTimeout(function () {
		_this.setRichText(trt);
		_this.initToolbar();
		_this.fillInTemplate(args, frag);
	}, 0);
}, setRichText:function (richText) {
	if (this._richText && this._richText == richText) {
		djd43.debug("Already set the richText to this richText!");
		return;
	}
	if (this._richText && !this._richText.isClosed) {
		djd43.debug("You are switching richTexts yet you haven't closed the current one. Losing reference!");
	}
	this._richText = richText;
	djd43.event.connect(this._richText, "close", this, "onClose");
	djd43.event.connect(this._richText, "onLoad", this, "onLoad");
	djd43.event.connect(this._richText, "onDisplayChanged", this, "updateToolbar");
	if (this._toolbarContainer) {
		this._toolbarContainer.enable();
		this.updateToolbar(true);
	}
}, initToolbar:function () {
	if (this._toolbarContainer) {
		return;
	}
	this._toolbarContainer = djd43.widget.createWidget(this._toolbarContainerType);
	var tb = this.addToolbar();
	var last = true;
	for (var i = 0; i < this.items.length; i++) {
		if (this.items[i] == "\n") {
			tb = this.addToolbar();
		} else {
			if ((this.items[i] == "|") && (!last)) {
				last = true;
			} else {
				last = this.addItem(this.items[i], tb);
			}
		}
	}
	this.insertToolbar(this._toolbarContainer.domNode, this._richText.domNode);
}, insertToolbar:function (tbNode, richTextNode) {
	djd43.html.insertBefore(tbNode, richTextNode);
}, addToolbar:function (toolbar) {
	this.initToolbar();
	if (!(toolbar instanceof djd43.widget.Toolbar)) {
		toolbar = djd43.widget.createWidget(this._toolbarType);
	}
	this._toolbarContainer.addChild(toolbar);
	this._toolbars.push(toolbar);
	return toolbar;
}, addItem:function (item, tb, dontValidate) {
	if (!tb) {
		tb = this._toolbars[0];
	}
	var cmd = ((item) && (!djd43.lang.isUndefined(item["getValue"]))) ? cmd = item["getValue"]() : item;
	var groups = djd43.widget.Editor.itemGroups;
	if (item instanceof djd43.widget.ToolbarItem) {
		tb.addChild(item);
	} else {
		if (groups[cmd]) {
			var group = groups[cmd];
			var worked = true;
			if (cmd == "justifyGroup" || cmd == "listGroup") {
				var btnGroup = [cmd];
				for (var i = 0; i < group.length; i++) {
					if (dontValidate || this.isSupportedCommand(group[i])) {
						btnGroup.push(this.getCommandImage(group[i]));
					} else {
						worked = false;
					}
				}
				if (btnGroup.length) {
					var btn = tb.addChild(btnGroup, null, this.getItemProperties(cmd));
					djd43.event.connect(btn, "onClick", this, "_action");
					djd43.event.connect(btn, "onChangeSelect", this, "_action");
				}
				return worked;
			} else {
				for (var i = 0; i < group.length; i++) {
					if (!this.addItem(group[i], tb)) {
						worked = false;
					}
				}
				return worked;
			}
		} else {
			if ((!dontValidate) && (!this.isSupportedCommand(cmd))) {
				return false;
			}
			if (dontValidate || this.isSupportedCommand(cmd)) {
				cmd = cmd.toLowerCase();
				if (cmd == "formatblock") {
					var select = djd43.widget.createWidget("ToolbarSelect", {name:"formatBlock", values:this.formatBlockItems});
					tb.addChild(select);
					var _this = this;
					djd43.event.connect(select, "onSetValue", function (item, value) {
						_this.onAction("formatBlock", value);
					});
				} else {
					if (cmd == "fontname") {
						var select = djd43.widget.createWidget("ToolbarSelect", {name:"fontName", values:this.fontNameItems});
						tb.addChild(select);
						djd43.event.connect(select, "onSetValue", djd43.lang.hitch(this, function (item, value) {
							this.onAction("fontName", value);
						}));
					} else {
						if (cmd == "fontsize") {
							var select = djd43.widget.createWidget("ToolbarSelect", {name:"fontSize", values:this.fontSizeItems});
							tb.addChild(select);
							djd43.event.connect(select, "onSetValue", djd43.lang.hitch(this, function (item, value) {
								this.onAction("fontSize", value);
							}));
						} else {
							if (djd43.lang.inArray(cmd, ["forecolor", "hilitecolor"])) {
								var btn = tb.addChild(djd43.widget.createWidget("ToolbarColorDialog", this.getItemProperties(cmd)));
								djd43.event.connect(btn, "onSetValue", this, "_setValue");
							} else {
								var btn = tb.addChild(this.getCommandImage(cmd), null, this.getItemProperties(cmd));
								if (cmd == "save") {
									djd43.event.connect(btn, "onClick", this, "_save");
								} else {
									if (cmd == "cancel") {
										djd43.event.connect(btn, "onClick", this, "_close");
									} else {
										djd43.event.connect(btn, "onClick", this, "_action");
										djd43.event.connect(btn, "onChangeSelect", this, "_action");
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return true;
}, enableToolbar:function () {
	if (this._toolbarContainer) {
		this._toolbarContainer.domNode.style.display = "";
		this._toolbarContainer.enable();
	}
}, disableToolbar:function (hide) {
	if (hide) {
		if (this._toolbarContainer) {
			this._toolbarContainer.domNode.style.display = "none";
		}
	} else {
		if (this._toolbarContainer) {
			this._toolbarContainer.disable();
		}
	}
}, _updateToolbarLastRan:null, _updateToolbarTimer:null, _updateToolbarFrequency:500, updateToolbar:function (force) {
	if (!this._toolbarContainer) {
		return;
	}
	var diff = new Date() - this._updateToolbarLastRan;
	if (!force && this._updateToolbarLastRan && (diff < this._updateToolbarFrequency)) {
		clearTimeout(this._updateToolbarTimer);
		var _this = this;
		this._updateToolbarTimer = setTimeout(function () {
			_this.updateToolbar();
		}, this._updateToolbarFrequency / 2);
		return;
	} else {
		this._updateToolbarLastRan = new Date();
	}
	var items = this._toolbarContainer.getItems();
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item instanceof djd43.widget.ToolbarSeparator) {
			continue;
		}
		var cmd = item._name;
		if (cmd == "save" || cmd == "cancel") {
			continue;
		} else {
			if (cmd == "justifyGroup") {
				try {
					if (!this._richText.queryCommandEnabled("justifyleft")) {
						item.disable(false, true);
					} else {
						item.enable(false, true);
						var jitems = item.getItems();
						for (var j = 0; j < jitems.length; j++) {
							var name = jitems[j]._name;
							var value = this._richText.queryCommandValue(name);
							if (typeof value == "boolean" && value) {
								value = name;
								break;
							} else {
								if (typeof value == "string") {
									value = "justify" + value;
								} else {
									value = null;
								}
							}
						}
						if (!value) {
							value = "justifyleft";
						}
						item.setValue(value, false, true);
					}
				}
				catch (err) {
				}
			} else {
				if (cmd == "listGroup") {
					var litems = item.getItems();
					for (var j = 0; j < litems.length; j++) {
						this.updateItem(litems[j]);
					}
				} else {
					this.updateItem(item);
				}
			}
		}
	}
}, updateItem:function (item) {
	try {
		var cmd = item._name;
		var enabled = this._richText.queryCommandEnabled(cmd);
		item.setEnabled(enabled, false, true);
		var active = this._richText.queryCommandState(cmd);
		if (active && cmd == "underline") {
			active = !this._richText.queryCommandEnabled("unlink");
		}
		item.setSelected(active, false, true);
		return true;
	}
	catch (err) {
		return false;
	}
}, supportedCommands:djd43.widget.Editor.supportedCommands.concat(), isSupportedCommand:function (cmd) {
	var yes = djd43.lang.inArray(cmd, this.supportedCommands);
	if (!yes) {
		try {
			var richText = this._richText || djd43.widget.HtmlRichText.prototype;
			yes = richText.queryCommandAvailable(cmd);
		}
		catch (E) {
		}
	}
	return yes;
}, getCommandImage:function (cmd) {
	if (cmd == "|") {
		return cmd;
	} else {
		return djd43.uri.moduleUri("djd43.widget", "templates/buttons/" + cmd + ".gif");
	}
}, _action:function (e) {
	this._fire("onAction", e.getValue());
}, _setValue:function (a, b) {
	this._fire("onAction", a.getValue(), b);
}, _save:function (e) {
	if (!this._richText.isClosed) {
		if (this.saveUrl.length) {
			var content = {};
			content[this.saveArgName] = this.getHtml();
			djd43.io.bind({method:this.saveMethod, url:this.saveUrl, content:content});
		} else {
			djd43.debug("please set a saveUrl for the editor");
		}
		if (this.closeOnSave) {
			this._richText.close(e.getName().toLowerCase() == "save");
		}
	}
}, _close:function (e) {
	if (!this._richText.isClosed) {
		this._richText.close(e.getName().toLowerCase() == "save");
	}
}, onAction:function (cmd, value) {
	switch (cmd) {
	  case "createlink":
		if (!(value = prompt("Please enter the URL of the link:", "http://"))) {
			return;
		}
		break;
	  case "insertimage":
		if (!(value = prompt("Please enter the URL of the image:", "http://"))) {
			return;
		}
		break;
	}
	this._richText.execCommand(cmd, value);
}, fillInTemplate:function (args, frag) {
}, _fire:function (eventName) {
	if (djd43.lang.isFunction(this[eventName])) {
		var args = [];
		if (arguments.length == 1) {
			args.push(this);
		} else {
			for (var i = 1; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
		}
		this[eventName].apply(this, args);
	}
}, getHtml:function () {
	this._richText.contentFilters = this._richText.contentFilters.concat(this.contentFilters);
	return this._richText.getEditorContent();
}, getEditorContent:function () {
	return this.getHtml();
}, onClose:function (save, hide) {
	this.disableToolbar(hide);
	if (save) {
		this._fire("onSave");
	} else {
		this._fire("onCancel");
	}
}, onLoad:function () {
}, onSave:function () {
}, onCancel:function () {
}});

