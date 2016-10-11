/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.TitlePane");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.ContentPane");
djd43.require("djd43.html.style");
djd43.require("djd43.lfx.*");
djd43.widget.defineWidget("djd43.widget.TitlePane", djd43.widget.ContentPane, {labelNodeClass:"", containerNodeClass:"", label:"", open:true, templateString:"<div dojoAttachPoint=\"domNode\">\n<div dojoAttachPoint=\"labelNode\" dojoAttachEvent=\"onclick: onLabelClick\"></div>\n<div dojoAttachPoint=\"containerNode\"></div>\n</div>\n", postCreate:function () {
	if (this.label) {
		this.labelNode.appendChild(document.createTextNode(this.label));
	}
	if (this.labelNodeClass) {
		djd43.html.addClass(this.labelNode, this.labelNodeClass);
	}
	if (this.containerNodeClass) {
		djd43.html.addClass(this.containerNode, this.containerNodeClass);
	}
	if (!this.open) {
		djd43.html.hide(this.containerNode);
	}
	djd43.widget.TitlePane.superclass.postCreate.apply(this, arguments);
}, onLabelClick:function () {
	if (this.open) {
		djd43.lfx.wipeOut(this.containerNode, 250).play();
		this.open = false;
	} else {
		djd43.lfx.wipeIn(this.containerNode, 250).play();
		this.open = true;
	}
}, setLabel:function (label) {
	this.labelNode.innerHTML = label;
}});

