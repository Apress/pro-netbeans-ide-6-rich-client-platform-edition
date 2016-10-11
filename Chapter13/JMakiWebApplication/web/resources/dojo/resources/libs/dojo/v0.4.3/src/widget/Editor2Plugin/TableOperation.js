/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Editor2Plugin.TableOperation");
djd43.require("djd43.widget.Editor2");
djd43.event.topic.subscribe("djd43.widget.RichText::init", function (editor) {
	if (djd43.render.html.ie) {
		editor.contentDomPreFilters.push(djd43.widget.Editor2Plugin.TableOperation.showIETableBorder);
		editor.contentDomPostFilters.push(djd43.widget.Editor2Plugin.TableOperation.removeIEFakeClass);
	}
	editor.getCommand("toggletableborder");
});
djd43.lang.declare("djd43.widget.Editor2Plugin.deleteTableCommand", djd43.widget.Editor2Command, {execute:function () {
	var table = djd43.withGlobal(this._editor.window, "getAncestorElement", djd43.html.selection, ["table"]);
	if (table) {
		djd43.withGlobal(this._editor.window, "selectElement", djd43.html.selection, [table]);
		this._editor.execCommand("inserthtml", " ");
	}
}, getState:function () {
	if (this._editor._lastStateTimestamp > this._updateTime || this._state == undefined) {
		this._updateTime = this._editor._lastStateTimestamp;
		var table = djd43.withGlobal(this._editor.window, "hasAncestorElement", djd43.html.selection, ["table"]);
		this._state = table ? djd43.widget.Editor2Manager.commandState.Enabled : djd43.widget.Editor2Manager.commandState.Disabled;
	}
	return this._state;
}, getText:function () {
	return "Delete Table";
}});
djd43.lang.declare("djd43.widget.Editor2Plugin.toggleTableBorderCommand", djd43.widget.Editor2Command, function () {
	this._showTableBorder = false;
	djd43.event.connect(this._editor, "editorOnLoad", this, "execute");
}, {execute:function () {
	if (this._showTableBorder) {
		this._showTableBorder = false;
		if (djd43.render.html.moz) {
			this._editor.removeStyleSheet(djd43.uri.moduleUri("djd43.widget", "templates/Editor2/showtableborder_gecko.css"));
		} else {
			if (djd43.render.html.ie) {
				this._editor.removeStyleSheet(djd43.uri.moduleUri("djd43.widget", "templates/Editor2/showtableborder_ie.css"));
			}
		}
	} else {
		this._showTableBorder = true;
		if (djd43.render.html.moz) {
			this._editor.addStyleSheet(djd43.uri.moduleUri("djd43.widget", "templates/Editor2/showtableborder_gecko.css"));
		} else {
			if (djd43.render.html.ie) {
				this._editor.addStyleSheet(djd43.uri.moduleUri("djd43.widget", "templates/Editor2/showtableborder_ie.css"));
			}
		}
	}
}, getText:function () {
	return "Toggle Table Border";
}, getState:function () {
	return this._showTableBorder ? djd43.widget.Editor2Manager.commandState.Latched : djd43.widget.Editor2Manager.commandState.Enabled;
}});
djd43.widget.Editor2Plugin.TableOperation = {getCommand:function (editor, name) {
	switch (name.toLowerCase()) {
	  case "toggletableborder":
		return new djd43.widget.Editor2Plugin.toggleTableBorderCommand(editor, name);
	  case "inserttable":
		return new djd43.widget.Editor2DialogCommand(editor, "inserttable", {contentFile:"djd43.widget.Editor2Plugin.InsertTableDialog", contentClass:"Editor2InsertTableDialog", title:"Insert/Edit Table", width:"450px", height:"250px"});
	  case "deletetable":
		return new djd43.widget.Editor2Plugin.deleteTableCommand(editor, name);
	}
}, getToolbarItem:function (name) {
	var name = name.toLowerCase();
	var item;
	switch (name) {
	  case "inserttable":
	  case "toggletableborder":
		item = new djd43.widget.Editor2ToolbarButton(name);
	}
	return item;
}, getContextMenuGroup:function (name, contextmenuplugin) {
	return new djd43.widget.Editor2Plugin.TableContextMenuGroup(contextmenuplugin);
}, showIETableBorder:function (dom) {
	var tables = dom.getElementsByTagName("table");
	djd43.lang.forEach(tables, function (t) {
		djd43.html.addClass(t, "dojoShowIETableBorders");
	});
	return dom;
}, removeIEFakeClass:function (dom) {
	var tables = dom.getElementsByTagName("table");
	djd43.lang.forEach(tables, function (t) {
		djd43.html.removeClass(t, "dojoShowIETableBorders");
	});
	return dom;
}};
djd43.widget.Editor2Manager.registerHandler(djd43.widget.Editor2Plugin.TableOperation.getCommand);
djd43.widget.Editor2ToolbarItemManager.registerHandler(djd43.widget.Editor2Plugin.TableOperation.getToolbarItem);
if (djd43.widget.Editor2Plugin.ContextMenuManager) {
	djd43.widget.Editor2Plugin.ContextMenuManager.registerGroup("Table", djd43.widget.Editor2Plugin.TableOperation.getContextMenuGroup);
	djd43.declare("djd43.widget.Editor2Plugin.TableContextMenuGroup", djd43.widget.Editor2Plugin.SimpleContextMenuGroup, {createItems:function () {
		this.items.push(djd43.widget.createWidget("Editor2ContextMenuItem", {caption:"Delete Table", command:"deletetable"}));
		this.items.push(djd43.widget.createWidget("Editor2ContextMenuItem", {caption:"Table Property", command:"inserttable", iconClass:"TB_Button_Icon TB_Button_Table"}));
	}, checkVisibility:function () {
		var curInst = djd43.widget.Editor2Manager.getCurrentInstance();
		var table = djd43.withGlobal(curInst.window, "hasAncestorElement", djd43.html.selection, ["table"]);
		if (djd43.withGlobal(curInst.window, "hasAncestorElement", djd43.html.selection, ["table"])) {
			this.items[0].show();
			this.items[1].show();
			return true;
		} else {
			this.items[0].hide();
			this.items[1].hide();
			return false;
		}
	}});
}

