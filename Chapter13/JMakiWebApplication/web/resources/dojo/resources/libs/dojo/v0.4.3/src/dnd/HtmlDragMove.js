/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.dnd.HtmlDragMove");
djd43.require("djd43.dnd.*");
djd43.declare("djd43.dnd.HtmlDragMoveSource", djd43.dnd.HtmlDragSource, {onDragStart:function () {
	var dragObj = new djd43.dnd.HtmlDragMoveObject(this.dragObject, this.type);
	if (this.constrainToContainer) {
		dragObj.constrainTo(this.constrainingContainer);
	}
	return dragObj;
}, onSelected:function () {
	for (var i = 0; i < this.dragObjects.length; i++) {
		djd43.dnd.dragManager.selectedSources.push(new djd43.dnd.HtmlDragMoveSource(this.dragObjects[i]));
	}
}});
djd43.declare("djd43.dnd.HtmlDragMoveObject", djd43.dnd.HtmlDragObject, {onDragStart:function (e) {
	djd43.html.clearSelection();
	this.dragClone = this.domNode;
	if (djd43.html.getComputedStyle(this.domNode, "position") != "absolute") {
		this.domNode.style.position = "relative";
	}
	var left = parseInt(djd43.html.getComputedStyle(this.domNode, "left"));
	var top = parseInt(djd43.html.getComputedStyle(this.domNode, "top"));
	this.dragStartPosition = {x:isNaN(left) ? 0 : left, y:isNaN(top) ? 0 : top};
	this.scrollOffset = djd43.html.getScroll().offset;
	this.dragOffset = {y:this.dragStartPosition.y - e.pageY, x:this.dragStartPosition.x - e.pageX};
	this.containingBlockPosition = {x:0, y:0};
	if (this.constrainToContainer) {
		this.constraints = this.getConstraints();
	}
	djd43.event.connect(this.domNode, "onclick", this, "_squelchOnClick");
}, onDragEnd:function (e) {
}, setAbsolutePosition:function (x, y) {
	if (!this.disableY) {
		this.domNode.style.top = y + "px";
	}
	if (!this.disableX) {
		this.domNode.style.left = x + "px";
	}
}, _squelchOnClick:function (e) {
	djd43.event.browser.stopEvent(e);
	djd43.event.disconnect(this.domNode, "onclick", this, "_squelchOnClick");
}});

