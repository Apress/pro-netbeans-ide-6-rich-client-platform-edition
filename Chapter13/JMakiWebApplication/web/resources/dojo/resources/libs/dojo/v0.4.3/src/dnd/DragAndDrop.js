/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.require("djd43.lang.common");
djd43.require("djd43.lang.func");
djd43.require("djd43.lang.declare");
djd43.provide("djd43.dnd.DragAndDrop");
djd43.declare("djd43.dnd.DragSource", null, {type:"", onDragEnd:function (evt) {
}, onDragStart:function (evt) {
}, onSelected:function (evt) {
}, unregister:function () {
	djd43.dnd.dragManager.unregisterDragSource(this);
}, reregister:function () {
	djd43.dnd.dragManager.registerDragSource(this);
}});
djd43.declare("djd43.dnd.DragObject", null, {type:"", register:function () {
	var dm = djd43.dnd.dragManager;
	if (dm["registerDragObject"]) {
		dm.registerDragObject(this);
	}
}, onDragStart:function (evt) {
}, onDragMove:function (evt) {
}, onDragOver:function (evt) {
}, onDragOut:function (evt) {
}, onDragEnd:function (evt) {
}, onDragLeave:djd43.lang.forward("onDragOut"), onDragEnter:djd43.lang.forward("onDragOver"), ondragout:djd43.lang.forward("onDragOut"), ondragover:djd43.lang.forward("onDragOver")});
djd43.declare("djd43.dnd.DropTarget", null, {acceptsType:function (type) {
	if (!djd43.lang.inArray(this.acceptedTypes, "*")) {
		if (!djd43.lang.inArray(this.acceptedTypes, type)) {
			return false;
		}
	}
	return true;
}, accepts:function (dragObjects) {
	if (!djd43.lang.inArray(this.acceptedTypes, "*")) {
		for (var i = 0; i < dragObjects.length; i++) {
			if (!djd43.lang.inArray(this.acceptedTypes, dragObjects[i].type)) {
				return false;
			}
		}
	}
	return true;
}, unregister:function () {
	djd43.dnd.dragManager.unregisterDropTarget(this);
}, onDragOver:function (evt) {
}, onDragOut:function (evt) {
}, onDragMove:function (evt) {
}, onDropStart:function (evt) {
}, onDrop:function (evt) {
}, onDropEnd:function () {
}}, function () {
	this.acceptedTypes = [];
});
djd43.dnd.DragEvent = function () {
	this.dragSource = null;
	this.dragObject = null;
	this.target = null;
	this.eventStatus = "success";
};
djd43.declare("djd43.dnd.DragManager", null, {selectedSources:[], dragObjects:[], dragSources:[], registerDragSource:function (source) {
}, dropTargets:[], registerDropTarget:function (target) {
}, lastDragTarget:null, currentDragTarget:null, onKeyDown:function () {
}, onMouseOut:function () {
}, onMouseMove:function () {
}, onMouseUp:function () {
}});

