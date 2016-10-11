/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.LinkPane");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.ContentPane");
djd43.require("djd43.html.style");
djd43.widget.defineWidget("djd43.widget.LinkPane", djd43.widget.ContentPane, {templateString:"<div class=\"dojoLinkPane\"></div>", fillInTemplate:function (args, frag) {
	var source = this.getFragNodeRef(frag);
	this.label += source.innerHTML;
	var source = this.getFragNodeRef(frag);
	djd43.html.copyStyle(this.domNode, source);
}});

