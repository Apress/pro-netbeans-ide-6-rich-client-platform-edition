/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.dnd.HtmlDragCopy");
djd43.require("djd43.dnd.*");
djd43.declare("djd43.dnd.HtmlDragCopySource", djd43.dnd.HtmlDragSource, function (node, type, copyOnce) {
	this.copyOnce = copyOnce;
	this.makeCopy = true;
}, {onDragStart:function () {
	var dragObj = new djd43.dnd.HtmlDragCopyObject(this.dragObject, this.type, this);
	if (this.dragClass) {
		dragObj.dragClass = this.dragClass;
	}
	if (this.constrainToContainer) {
		dragObj.constrainTo(this.constrainingContainer || this.domNode.parentNode);
	}
	return dragObj;
}, onSelected:function () {
	for (var i = 0; i < this.dragObjects.length; i++) {
		djd43.dnd.dragManager.selectedSources.push(new djd43.dnd.HtmlDragCopySource(this.dragObjects[i]));
	}
}});
djd43.declare("djd43.dnd.HtmlDragCopyObject", djd43.dnd.HtmlDragObject, function (dragObject, type, source) {
	this.copySource = source;
}, {onDragStart:function (e) {
	djd43.dnd.HtmlDragCopyObject.superclass.onDragStart.apply(this, arguments);
	if (this.copySource.makeCopy) {
		this.sourceNode = this.domNode;
		this.domNode = this.domNode.cloneNode(true);
	}
}, onDragEnd:function (e) {
	switch (e.dragStatus) {
	  case "dropFailure":
		var startCoords = djd43.html.getAbsolutePosition(this.dragClone, true);
		var endCoords = {left:this.dragStartPosition.x + 1, top:this.dragStartPosition.y + 1};
		var anim = djd43.lfx.slideTo(this.dragClone, endCoords, 500, djd43.lfx.easeOut);
		var dragObject = this;
		djd43.event.connect(anim, "onEnd", function (e) {
			djd43.lang.setTimeout(function () {
				djd43.html.removeNode(dragObject.dragClone);
				dragObject.dragClone = null;
				if (dragObject.copySource.makeCopy) {
					djd43.html.removeNode(dragObject.domNode);
					dragObject.domNode = dragObject.sourceNode;
					dragObject.sourceNode = null;
				}
			}, 200);
		});
		anim.play();
		djd43.event.topic.publish("dragEnd", {source:this});
		return;
	}
	djd43.dnd.HtmlDragCopyObject.superclass.onDragEnd.apply(this, arguments);
	this.copySource.dragObject = this.domNode;
	if (this.copySource.copyOnce) {
		this.copySource.makeCopy = false;
	}
	new djd43.dnd.HtmlDragCopySource(this.sourceNode, this.type, this.copySource.copyOnce);
	this.sourceNode = null;
}});

