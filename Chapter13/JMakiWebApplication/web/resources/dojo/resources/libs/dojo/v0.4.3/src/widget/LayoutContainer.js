/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.LayoutContainer");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.html.layout");
djd43.widget.defineWidget("djd43.widget.LayoutContainer", djd43.widget.HtmlWidget, {isContainer:true, layoutChildPriority:"top-bottom", postCreate:function () {
	djd43.widget.html.layout(this.domNode, this.children, this.layoutChildPriority);
}, addChild:function (child, overrideContainerNode, pos, ref, insertIndex) {
	djd43.widget.LayoutContainer.superclass.addChild.call(this, child, overrideContainerNode, pos, ref, insertIndex);
	djd43.widget.html.layout(this.domNode, this.children, this.layoutChildPriority);
}, removeChild:function (pane) {
	djd43.widget.LayoutContainer.superclass.removeChild.call(this, pane);
	djd43.widget.html.layout(this.domNode, this.children, this.layoutChildPriority);
}, onResized:function () {
	djd43.widget.html.layout(this.domNode, this.children, this.layoutChildPriority);
}, show:function () {
	this.domNode.style.display = "";
	this.checkSize();
	this.domNode.style.display = "none";
	this.domNode.style.visibility = "";
	djd43.widget.LayoutContainer.superclass.show.call(this);
}});
djd43.lang.extend(djd43.widget.Widget, {layoutAlign:"none"});

