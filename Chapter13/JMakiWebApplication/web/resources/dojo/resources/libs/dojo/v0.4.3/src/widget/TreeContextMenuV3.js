/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.TreeContextMenuV3");
djd43.require("djd43.event.*");
djd43.require("djd43.io.*");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.Menu2");
djd43.require("djd43.widget.TreeCommon");
djd43.widget.defineWidget("djd43.widget.TreeContextMenuV3", [djd43.widget.PopupMenu2, djd43.widget.TreeCommon], function () {
	this.listenedTrees = {};
}, {listenTreeEvents:["afterTreeCreate", "beforeTreeDestroy"], listenNodeFilter:function (elem) {
	return elem instanceof djd43.widget.Widget;
}, onAfterTreeCreate:function (message) {
	var tree = message.source;
	this.bindDomNode(tree.domNode);
}, onBeforeTreeDestroy:function (message) {
	this.unBindDomNode(message.source.domNode);
}, getTreeNode:function () {
	var source = this.getTopOpenEvent().target;
	var treeNode = this.domElement2TreeNode(source);
	return treeNode;
}, open:function () {
	var result = djd43.widget.PopupMenu2.prototype.open.apply(this, arguments);
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].menuOpen) {
			this.children[i].menuOpen(this.getTreeNode());
		}
	}
	return result;
}, close:function () {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].menuClose) {
			this.children[i].menuClose(this.getTreeNode());
		}
	}
	var result = djd43.widget.PopupMenu2.prototype.close.apply(this, arguments);
	return result;
}});
djd43.widget.defineWidget("djd43.widget.TreeMenuItemV3", [djd43.widget.MenuItem2, djd43.widget.TreeCommon], function () {
	this.treeActions = [];
}, {treeActions:"", initialize:function (args, frag) {
	for (var i = 0; i < this.treeActions.length; i++) {
		this.treeActions[i] = this.treeActions[i].toUpperCase();
	}
}, getTreeNode:function () {
	var menu = this;
	while (!(menu instanceof djd43.widget.TreeContextMenuV3)) {
		menu = menu.parent;
	}
	var treeNode = menu.getTreeNode();
	return treeNode;
}, menuOpen:function (treeNode) {
	treeNode.viewEmphasize();
	this.setDisabled(false);
	var _this = this;
	djd43.lang.forEach(_this.treeActions, function (action) {
		_this.setDisabled(treeNode.actionIsDisabledNow(action));
	});
}, menuClose:function (treeNode) {
	treeNode.viewUnemphasize();
}, toString:function () {
	return "[" + this.widgetType + " node " + this.getTreeNode() + "]";
}});

