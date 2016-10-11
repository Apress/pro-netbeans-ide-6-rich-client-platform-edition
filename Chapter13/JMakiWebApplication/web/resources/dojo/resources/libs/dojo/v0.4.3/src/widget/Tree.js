/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Tree");
djd43.require("djd43.widget.*");
djd43.require("djd43.event.*");
djd43.require("djd43.io.*");
djd43.require("djd43.widget.HtmlWidget");
djd43.require("djd43.widget.TreeNode");
djd43.require("djd43.html.common");
djd43.require("djd43.html.selection");
djd43.widget.defineWidget("djd43.widget.Tree", djd43.widget.HtmlWidget, function () {
	this.eventNames = {};
	this.tree = this;
	this.DNDAcceptTypes = [];
	this.actionsDisabled = [];
}, {widgetType:"Tree", eventNamesDefault:{createDOMNode:"createDOMNode", treeCreate:"treeCreate", treeDestroy:"treeDestroy", treeClick:"treeClick", iconClick:"iconClick", titleClick:"titleClick", moveFrom:"moveFrom", moveTo:"moveTo", addChild:"addChild", removeNode:"removeNode", expand:"expand", collapse:"collapse"}, isContainer:true, DNDMode:"off", lockLevel:0, strictFolders:true, DNDModes:{BETWEEN:1, ONTO:2}, DNDAcceptTypes:"", templateCssString:"\n.dojoTree {\n\tfont: caption;\n\tfont-size: 11px;\n\tfont-weight: normal;\n\toverflow: auto;\n}\n\n\n.dojoTreeNodeLabelTitle {\n\tpadding-left: 2px;\n\tcolor: WindowText;\n}\n\n.dojoTreeNodeLabel {\n\tcursor:hand;\n\tcursor:pointer;\n}\n\n.dojoTreeNodeLabelTitle:hover {\n\ttext-decoration: underline;\n}\n\n.dojoTreeNodeLabelSelected {\n\tbackground-color: Highlight;\n\tcolor: HighlightText;\n}\n\n.dojoTree div {\n\twhite-space: nowrap;\n}\n\n.dojoTree img, .dojoTreeNodeLabel img {\n\tvertical-align: middle;\n}\n\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "templates/images/Tree/Tree.css"), templateString:"<div class=\"dojoTree\"></div>", isExpanded:true, isTree:true, objectId:"", controller:"", selector:"", menu:"", expandLevel:"", blankIconSrc:djd43.uri.moduleUri("djd43.widget", "templates/images/Tree/treenode_blank.gif"), gridIconSrcT:djd43.uri.moduleUri("djd43.widget", "templates/images/Tree/treenode_grid_t.gif"), gridIconSrcL:djd43.uri.moduleUri("djd43.widget", "templates/images/Tree/treenode_grid_l.gif"), gridIconSrcV:djd43.uri.moduleUri("djd43.widget", "templates/images/Tree/treenode_grid_v.gif"), gridIconSrcP:djd43.uri.moduleUri("djd43.widget", "templates/images/Tree/treenode_grid_p.gif"), gridIconSrcC:djd43.uri.moduleUri("djd43.widget", "templates/images/Tree/treenode_grid_c.gif"), gridIconSrcX:djd43.uri.moduleUri("djd43.widget", "templates/images/Tree/treenode_grid_x.gif"), gridIconSrcY:djd43.uri.moduleUri("djd43.widget", "templates/images/Tree/treenode_grid_y.gif"), gridIconSrcZ:djd43.uri.moduleUri("djd43.widget", "templates/images/Tree/treenode_grid_z.gif"), expandIconSrcPlus:djd43.uri.moduleUri("djd43.widget", "templates/images/Tree/treenode_expand_plus.gif"), expandIconSrcMinus:djd43.uri.moduleUri("djd43.widget", "templates/images/Tree/treenode_expand_minus.gif"), expandIconSrcLoading:djd43.uri.moduleUri("djd43.widget", "templates/images/Tree/treenode_loading.gif"), iconWidth:18, iconHeight:18, showGrid:true, showRootGrid:true, actionIsDisabled:function (action) {
	var _this = this;
	return djd43.lang.inArray(_this.actionsDisabled, action);
}, actions:{ADDCHILD:"ADDCHILD"}, getInfo:function () {
	var info = {widgetId:this.widgetId, objectId:this.objectId};
	return info;
}, initializeController:function () {
	if (this.controller != "off") {
		if (this.controller) {
			this.controller = djd43.widget.byId(this.controller);
		} else {
			djd43.require("djd43.widget.TreeBasicController");
			this.controller = djd43.widget.createWidget("TreeBasicController", {DNDController:(this.DNDMode ? "create" : ""), dieWithTree:true});
		}
		this.controller.listenTree(this);
	} else {
		this.controller = null;
	}
}, initializeSelector:function () {
	if (this.selector != "off") {
		if (this.selector) {
			this.selector = djd43.widget.byId(this.selector);
		} else {
			djd43.require("djd43.widget.TreeSelector");
			this.selector = djd43.widget.createWidget("TreeSelector", {dieWithTree:true});
		}
		this.selector.listenTree(this);
	} else {
		this.selector = null;
	}
}, initialize:function (args, frag) {
	var _this = this;
	for (name in this.eventNamesDefault) {
		if (djd43.lang.isUndefined(this.eventNames[name])) {
			this.eventNames[name] = this.widgetId + "/" + this.eventNamesDefault[name];
		}
	}
	for (var i = 0; i < this.actionsDisabled.length; i++) {
		this.actionsDisabled[i] = this.actionsDisabled[i].toUpperCase();
	}
	if (this.DNDMode == "off") {
		this.DNDMode = 0;
	} else {
		if (this.DNDMode == "between") {
			this.DNDMode = this.DNDModes.ONTO | this.DNDModes.BETWEEN;
		} else {
			if (this.DNDMode == "onto") {
				this.DNDMode = this.DNDModes.ONTO;
			}
		}
	}
	this.expandLevel = parseInt(this.expandLevel);
	this.initializeSelector();
	this.initializeController();
	if (this.menu) {
		this.menu = djd43.widget.byId(this.menu);
		this.menu.listenTree(this);
	}
	this.containerNode = this.domNode;
}, postCreate:function () {
	this.createDOMNode();
}, createDOMNode:function () {
	djd43.html.disableSelection(this.domNode);
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].parent = this;
		var node = this.children[i].createDOMNode(this, 0);
		this.domNode.appendChild(node);
	}
	if (!this.showRootGrid) {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].expand();
		}
	}
	djd43.event.topic.publish(this.eventNames.treeCreate, {source:this});
}, destroy:function () {
	djd43.event.topic.publish(this.tree.eventNames.treeDestroy, {source:this});
	return djd43.widget.HtmlWidget.prototype.destroy.apply(this, arguments);
}, addChild:function (child, index) {
	var message = {child:child, index:index, parent:this, domNodeInitialized:child.domNodeInitialized};
	this.doAddChild.apply(this, arguments);
	djd43.event.topic.publish(this.tree.eventNames.addChild, message);
}, doAddChild:function (child, index) {
	if (djd43.lang.isUndefined(index)) {
		index = this.children.length;
	}
	if (!child.isTreeNode) {
		djd43.raise("You can only add TreeNode widgets to a " + this.widgetType + " widget!");
		return;
	}
	if (this.isTreeNode) {
		if (!this.isFolder) {
			this.setFolder();
		}
	}
	var _this = this;
	djd43.lang.forEach(child.getDescendants(), function (elem) {
		elem.tree = _this.tree;
	});
	child.parent = this;
	if (this.isTreeNode) {
		this.state = this.loadStates.LOADED;
	}
	if (index < this.children.length) {
		djd43.html.insertBefore(child.domNode, this.children[index].domNode);
	} else {
		this.containerNode.appendChild(child.domNode);
		if (this.isExpanded && this.isTreeNode) {
			this.showChildren();
		}
	}
	this.children.splice(index, 0, child);
	if (child.domNodeInitialized) {
		var d = this.isTreeNode ? this.depth : -1;
		child.adjustDepth(d - child.depth + 1);
		child.updateIconTree();
	} else {
		child.depth = this.isTreeNode ? this.depth + 1 : 0;
		child.createDOMNode(child.tree, child.depth);
	}
	var prevSibling = child.getPreviousSibling();
	if (child.isLastChild() && prevSibling) {
		prevSibling.updateExpandGridColumn();
	}
}, makeBlankImg:function () {
	var img = document.createElement("img");
	img.style.width = this.iconWidth + "px";
	img.style.height = this.iconHeight + "px";
	img.src = this.blankIconSrc;
	img.style.verticalAlign = "middle";
	return img;
}, updateIconTree:function () {
	if (!this.isTree) {
		this.updateIcons();
	}
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].updateIconTree();
	}
}, toString:function () {
	return "[" + this.widgetType + " ID:" + this.widgetId + "]";
}, move:function (child, newParent, index) {
	var oldParent = child.parent;
	var oldTree = child.tree;
	this.doMove.apply(this, arguments);
	var newParent = child.parent;
	var newTree = child.tree;
	var message = {oldParent:oldParent, oldTree:oldTree, newParent:newParent, newTree:newTree, child:child};
	djd43.event.topic.publish(oldTree.eventNames.moveFrom, message);
	djd43.event.topic.publish(newTree.eventNames.moveTo, message);
}, doMove:function (child, newParent, index) {
	child.parent.doRemoveNode(child);
	newParent.doAddChild(child, index);
}, removeNode:function (child) {
	if (!child.parent) {
		return;
	}
	var oldTree = child.tree;
	var oldParent = child.parent;
	var removedChild = this.doRemoveNode.apply(this, arguments);
	djd43.event.topic.publish(this.tree.eventNames.removeNode, {child:removedChild, tree:oldTree, parent:oldParent});
	return removedChild;
}, doRemoveNode:function (child) {
	if (!child.parent) {
		return;
	}
	var parent = child.parent;
	var children = parent.children;
	var index = child.getParentIndex();
	if (index < 0) {
		djd43.raise("Couldn't find node " + child + " for removal");
	}
	children.splice(index, 1);
	djd43.html.removeNode(child.domNode);
	if (parent.children.length == 0 && !parent.isTree) {
		parent.containerNode.style.display = "none";
	}
	if (index == children.length && index > 0) {
		children[index - 1].updateExpandGridColumn();
	}
	if (parent instanceof djd43.widget.Tree && index == 0 && children.length > 0) {
		children[0].updateExpandGrid();
	}
	child.parent = child.tree = null;
	return child;
}, markLoading:function () {
}, unMarkLoading:function () {
}, lock:function () {
	!this.lockLevel && this.markLoading();
	this.lockLevel++;
}, unlock:function () {
	if (!this.lockLevel) {
		djd43.raise("unlock: not locked");
	}
	this.lockLevel--;
	!this.lockLevel && this.unMarkLoading();
}, isLocked:function () {
	var node = this;
	while (true) {
		if (node.lockLevel) {
			return true;
		}
		if (node instanceof djd43.widget.Tree) {
			break;
		}
		node = node.parent;
	}
	return false;
}, flushLock:function () {
	this.lockLevel = 0;
	this.unMarkLoading();
}});

