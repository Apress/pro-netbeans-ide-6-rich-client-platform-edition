/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Editor2Plugin.SimpleSignalCommands");
djd43.require("djd43.widget.Editor2");
djd43.declare("djd43.widget.Editor2Plugin.SimpleSignalCommand", djd43.widget.Editor2Command, function (editor, name) {
	if (djd43.widget.Editor2.prototype[name] == undefined) {
		djd43.widget.Editor2.prototype[name] = function () {
		};
	}
}, {execute:function () {
	this._editor[this._name]();
}});
if (djd43.widget.Editor2Plugin["SimpleSignalCommands"]) {
	djd43.widget.Editor2Plugin["_SimpleSignalCommands"] = djd43.widget.Editor2Plugin["SimpleSignalCommands"];
}
djd43.widget.Editor2Plugin.SimpleSignalCommands = {signals:["save", "insertImage"], Handler:function (name) {
	if (name.toLowerCase() == "save") {
		return new djd43.widget.Editor2ToolbarButton("Save");
	} else {
		if (name.toLowerCase() == "insertimage") {
			return new djd43.widget.Editor2ToolbarButton("InsertImage");
		}
	}
}, getCommand:function (editor, name) {
	var signal;
	djd43.lang.every(this.signals, function (s) {
		if (s.toLowerCase() == name.toLowerCase()) {
			signal = s;
			return false;
		}
		return true;
	});
	if (signal) {
		return new djd43.widget.Editor2Plugin.SimpleSignalCommand(editor, signal);
	}
}};
if (djd43.widget.Editor2Plugin["_SimpleSignalCommands"]) {
	djd43.lang.mixin(djd43.widget.Editor2Plugin.SimpleSignalCommands, djd43.widget.Editor2Plugin["_SimpleSignalCommands"]);
}
djd43.widget.Editor2Manager.registerHandler(djd43.widget.Editor2Plugin.SimpleSignalCommands, "getCommand");
djd43.widget.Editor2ToolbarItemManager.registerHandler(djd43.widget.Editor2Plugin.SimpleSignalCommands.Handler);

