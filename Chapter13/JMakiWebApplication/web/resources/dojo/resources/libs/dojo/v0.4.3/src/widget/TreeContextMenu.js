/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.TreeContextMenu");
djd43.require("djd43.event.*");
djd43.require("djd43.io.*");
djd43.require("djd43.widget.Menu2");
djd43.widget.defineWidget("djd43.widget.TreeContextMenu", djd43.widget.PopupMenu2, function () {
	this.listenedTrees = [];
}, {open:function (x, y, parentMenu, explodeSrc) {
	var result = djd43.widget.PopupMenu2.prototype.open.apply(this, arguments);
	djd43.event.topic.publish(this.eventNames.open, {menu:this});
	return result;
}, listenTree:function (tree) {
	var nodes = tree.getDescendants();
	for (var i = 0; i < nodes.length; i++) {
		if (!nodes[i].isTreeNode) {
			continue;
		}
		this.bindDomNode(nodes[i].labelNode);
	}
	var _this = this;
	djd43.event.topic.subscribe(tree.eventNames.createDOMNode, this, "onCreateDOMNode");
	djd43.event.topic.subscribe(tree.eventNames.moveFrom, this, "onMoveFrom");
	djd43.event.topic.subscribe(tree.eventNames.moveTo, this, "onMoveTo");
	djd43.event.topic.subscribe(tree.eventNames.removeNode, this, "onRemoveNode");
	djd43.event.topic.subscribe(tree.eventNames.addChild, this, "onAddChild");
	djd43.event.topic.subscribe(tree.eventNames.treeDestroy, this, "onTreeDestroy");
	this.listenedTrees.push(tree);
}, unlistenTree:function (tree) {
	djd43.event.topic.unsubscribe(tree.eventNames.createDOMNode, this, "onCreateDOMNode");
	djd43.event.topic.unsubscribe(tree.eventNames.moveFrom, this, "onMoveFrom");
	djd43.event.topic.unsubscribe(tree.eventNames.moveTo, this, "onMoveTo");
	djd43.event.topic.unsubscribe(tree.eventNames.removeNode, this, "onRemoveNode");
	djd43.event.topic.unsubscribe(tree.eventNames.addChild, this, "onAddChild");
	djd43.event.topic.unsubscribe(tree.eventNames.treeDestroy, this, "onTreeDestroy");
	for (var i = 0; i < this.listenedTrees.length; i++) {
		if (this.listenedTrees[i] === tree) {
			this.listenedTrees.splice(i, 1);
			break;
		}
	}
}, onTreeDestroy:function (message) {
	this.unlistenTree(message.source);
}, bindTreeNode:function (node) {
	var _this = this;
	djd43.lang.forEach(node.getDescendants(), function (e) {
		_this.bindDomNode(e.labelNode);
	});
}, unBindTreeNode:function (node) {
	var _this = this;
	djd43.lang.forEach(node.getDescendants(), function (e) {
		_this.unBindDomNode(e.labelNode);
	});
}, onCreateDOMNode:function (message) {
	this.bindTreeNode(message.source);
}, onMoveFrom:function (message) {
	if (!djd43.lang.inArray(this.listenedTrees, message.newTree)) {
		this.unBindTreeNode(message.child);
	}
}, onMoveTo:function (message) {
	if (djd43.lang.inArray(this.listenedTrees, message.newTree)) {
		this.bindTreeNode(message.child);
	}
}, onRemoveNode:function (message) {
	this.unBindTreeNode(message.child);
}, onAddChild:function (message) {
	if (message.domNodeInitialized) {
		this.bindTreeNode(message.child);
	}
}});
djd43.widget.defineWidget("djd43.widget.TreeMenuItem", djd43.widget.MenuItem2, {treeActions:"", initialize:function (args, frag) {
	this.treeActions = this.treeActions.split(",");
	for (var i = 0; i < this.treeActions.length; i++) {
		this.treeActions[i] = this.treeActions[i].toUpperCase();
	}
}, getTreeNode:function () {
	var menu = this;
	while (!(menu instanceof djd43.widget.TreeContextMenu)) {
		menu = menu.parent;
	}
	var source = menu.getTopOpenEvent().target;
	while (!source.getAttribute("treeNode") && source.tagName != "body") {
		source = source.parentNode;
	}
	if (source.tagName == "body") {
		djd43.raise("treeNode not detected");
	}
	var treeNode = djd43.widget.manager.getWidgetById(source.getAttribute("treeNode"));
	return treeNode;
}, menuOpen:function (message) {
	var treeNode = this.getTreeNode();
	this.setDisabled(false);
	var _this = this;
	djd43.lang.forEach(_this.treeActions, function (action) {
		_this.setDisabled(treeNode.actionIsDisabled(action));
	});
}, toString:function () {
	return "[" + this.widgetType + " node " + this.getTreeNode() + "]";
}});

