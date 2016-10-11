/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Toggler");
djd43.require("djd43.widget.*");
djd43.require("djd43.event.*");
djd43.widget.defineWidget("djd43.widget.Toggler", djd43.widget.HtmlWidget, {targetId:"", fillInTemplate:function () {
	djd43.event.connect(this.domNode, "onclick", this, "onClick");
}, onClick:function () {
	var pane = djd43.widget.byId(this.targetId);
	if (!pane) {
		return;
	}
	pane.explodeSrc = this.domNode;
	pane.toggleShowing();
}});

