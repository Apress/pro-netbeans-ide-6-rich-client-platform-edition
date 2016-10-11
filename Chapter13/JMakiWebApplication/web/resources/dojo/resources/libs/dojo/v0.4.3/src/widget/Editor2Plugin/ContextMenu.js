/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Editor2Plugin.ContextMenu");
djd43.require("djd43.widget.Menu2");
djd43.event.topic.subscribe("djd43.widget.Editor2::onLoad", function (editor) {
	djd43.widget.Editor2Plugin.ContextMenuManager.getContextMenu(editor);
});
djd43.widget.Editor2Plugin.ContextMenuManager = {menuGroups:["Generic", "Link", "Anchor", "Image", "List", "Table"], _contextMenuGroupSets:{}, _registeredGroups:{}, _menus:{}, registerGroup:function (name, handler) {
	if (this._registeredGroups[name]) {
		alert("djd43.widget.Editor2Plugin.ContextMenuManager.registerGroup: menu group " + name + "is already registered. Ignored.");
		return;
	}
	this._registeredGroups[name] = handler;
}, removeGroup:function (name) {
	delete this._registeredGroups[name];
}, getGroup:function (name, contextmenuplugin) {
	if (this._registeredGroups[name]) {
		var item = this._registeredGroups[name](name, contextmenuplugin);
		if (item) {
			return item;
		}
	}
	switch (name) {
	  case "Generic":
	  case "Link":
	  case "Image":
		return new djd43.widget.Editor2Plugin[name + "ContextMenuGroup"](contextmenuplugin);
	  case "Anchor":
	  case "List":
	}
}, registerGroupSet:function (name, set) {
	this._contextMenuGroupSets[name] = set;
}, removeGroupSet:function (name) {
	var set = this._contextMenuGroupSets[name];
	delete this._contextMenuGroupSets[name];
	return set;
}, getContextMenu:function (editor) {
	var set = editor.contextMenuGroupSet || "defaultDojoEditor2MenuGroupSet";
	if (this._menus[set]) {
		this._menus[set].bindEditor(editor);
		return this._menus[set];
	}
	var gs = (editor.contextMenuGroupSet && this._contextMenuGroupSets[editor.contextMenuGroupSet]) || this.menuGroups;
	var menu = new djd43.widget.Editor2Plugin.ContextMenu(editor, gs);
	this._menus[set] = menu;
	return menu;
}};
djd43.declare("djd43.widget.Editor2Plugin.ContextMenu", null, function (editor, gs) {
	this.groups = [];
	this.separators = [];
	this.editor = editor;
	this.editor.registerLoadedPlugin(this);
	this.contextMenu = djd43.widget.createWidget("PopupMenu2", {});
	djd43.body().appendChild(this.contextMenu.domNode);
	this.bindEditor(this.editor);
	djd43.event.connect(this.contextMenu, "aboutToShow", this, "aboutToShow");
	djd43.event.connect(this.editor, "destroy", this, "destroy");
	this.setup(gs);
}, {bindEditor:function (editor) {
	this.contextMenu.bindDomNode(editor.document.body);
}, setup:function (gs) {
	for (var i in gs) {
		var g = djd43.widget.Editor2Plugin.ContextMenuManager.getGroup(gs[i], this);
		if (g) {
			this.groups.push(g);
		}
	}
}, aboutToShow:function () {
	var first = true;
	for (var i in this.groups) {
		if (i > 0 && this.separators.length != this.groups.length - 1) {
			this.separators.push(djd43.widget.createWidget("MenuSeparator2", {}));
			this.contextMenu.addChild(this.separators[this.separators.length - 1]);
		}
		if (this.groups[i].refresh()) {
			if (i > 0) {
				if (first) {
					this.separators[i - 1].hide();
				} else {
					this.separators[i - 1].show();
				}
			}
			if (first) {
				first = false;
			}
		} else {
			if (i > 0) {
				this.separators[i - 1].hide();
			}
		}
	}
}, destroy:function () {
	this.editor.unregisterLoadedPlugin(this);
	delete this.groups;
	delete this.separators;
	this.contextMenu.destroy();
	delete this.contextMenu;
}});
djd43.widget.defineWidget("djd43.widget.Editor2ContextMenuItem", djd43.widget.MenuItem2, {command:"", buildRendering:function () {
	var curInst = djd43.widget.Editor2Manager.getCurrentInstance();
	this.caption = curInst.getCommand(this.command).getText();
	djd43.widget.Editor2ContextMenuItem.superclass.buildRendering.apply(this, arguments);
}, onClick:function () {
	var curInst = djd43.widget.Editor2Manager.getCurrentInstance();
	if (curInst) {
		var _command = curInst.getCommand(this.command);
		if (_command) {
			_command.execute();
		}
	}
}, refresh:function () {
	var curInst = djd43.widget.Editor2Manager.getCurrentInstance();
	if (curInst) {
		var _command = curInst.getCommand(this.command);
		if (_command) {
			if (_command.getState() == djd43.widget.Editor2Manager.commandState.Disabled) {
				this.disable();
				return false;
			} else {
				this.enable();
				return true;
			}
		}
	}
}, hide:function () {
	this.domNode.style.display = "none";
}, show:function () {
	this.domNode.style.display = "";
}});
djd43.declare("djd43.widget.Editor2Plugin.SimpleContextMenuGroup", null, function (contextmenuplugin) {
	this.contextMenu = contextmenuplugin.contextMenu;
	this.items = [];
	djd43.event.connect(contextmenuplugin, "destroy", this, "destroy");
}, {refresh:function () {
	if (!this.items.length) {
		this.createItems();
		for (var i in this.items) {
			this.contextMenu.addChild(this.items[i]);
		}
	}
	return this.checkVisibility();
}, destroy:function () {
	this.contextmenu = null;
	delete this.items;
	delete this.contextMenu;
}, createItems:function () {
}, checkVisibility:function () {
	var show = false;
	for (var i in this.items) {
		show = show || this.items[i].refresh();
	}
	var action = show ? "show" : "hide";
	for (var i in this.items) {
		this.items[i][action]();
	}
	return show;
}});
djd43.declare("djd43.widget.Editor2Plugin.GenericContextMenuGroup", djd43.widget.Editor2Plugin.SimpleContextMenuGroup, {createItems:function () {
	this.items.push(djd43.widget.createWidget("Editor2ContextMenuItem", {command:"cut", iconClass:"dojoE2TBIcon dojoE2TBIcon_Cut"}));
	this.items.push(djd43.widget.createWidget("Editor2ContextMenuItem", {command:"copy", iconClass:"dojoE2TBIcon dojoE2TBIcon_Copy"}));
	this.items.push(djd43.widget.createWidget("Editor2ContextMenuItem", {command:"paste", iconClass:"dojoE2TBIcon dojoE2TBIcon_Paste"}));
}});
djd43.declare("djd43.widget.Editor2Plugin.LinkContextMenuGroup", djd43.widget.Editor2Plugin.SimpleContextMenuGroup, {createItems:function () {
	this.items.push(djd43.widget.createWidget("Editor2ContextMenuItem", {command:"createlink", iconClass:"dojoE2TBIcon dojoE2TBIcon_Link"}));
	this.items.push(djd43.widget.createWidget("Editor2ContextMenuItem", {command:"unlink", iconClass:"dojoE2TBIcon dojoE2TBIcon_UnLink"}));
}, checkVisibility:function () {
	var show = this.items[1].refresh();
	if (show) {
		this.items[0].refresh();
		for (var i in this.items) {
			this.items[i].show();
		}
	} else {
		for (var i in this.items) {
			this.items[i].hide();
		}
	}
	return show;
}});
djd43.declare("djd43.widget.Editor2Plugin.ImageContextMenuGroup", djd43.widget.Editor2Plugin.SimpleContextMenuGroup, {createItems:function () {
	this.items.push(djd43.widget.createWidget("Editor2ContextMenuItem", {command:"insertimage", iconClass:"dojoE2TBIcon dojoE2TBIcon_Image"}));
}, checkVisibility:function () {
	var curInst = djd43.widget.Editor2Manager.getCurrentInstance();
	var img = djd43.withGlobal(curInst.window, "getSelectedElement", djd43.html.selection);
	if (img && img.tagName.toLowerCase() == "img") {
		this.items[0].show();
		return true;
	} else {
		this.items[0].hide();
		return false;
	}
}});

