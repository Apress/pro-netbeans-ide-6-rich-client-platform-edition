/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.TreeEmphasizeOnSelect");
djd43.require("djd43.widget.HtmlWidget");
djd43.require("djd43.widget.TreeSelectorV3");
djd43.require("djd43.html.selection");
djd43.widget.defineWidget("djd43.widget.TreeEmphasizeOnSelect", djd43.widget.HtmlWidget, {selector:"", initialize:function () {
	this.selector = djd43.widget.byId(this.selector);
	djd43.event.topic.subscribe(this.selector.eventNames.select, this, "onSelect");
	djd43.event.topic.subscribe(this.selector.eventNames.deselect, this, "onDeselect");
}, onSelect:function (message) {
	message.node.viewEmphasize();
}, onDeselect:function (message) {
	message.node.viewUnemphasize();
}});

