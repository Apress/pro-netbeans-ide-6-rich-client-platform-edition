/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.DebugConsole");
djd43.require("djd43.widget.Widget");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.FloatingPane");
djd43.widget.defineWidget("djd43.widget.DebugConsole", djd43.widget.FloatingPane, {fillInTemplate:function () {
	djd43.widget.DebugConsole.superclass.fillInTemplate.apply(this, arguments);
	this.containerNode.id = "debugConsoleClientPane";
	djConfig.isDebug = true;
	djConfig.debugContainerId = this.containerNode.id;
}});

