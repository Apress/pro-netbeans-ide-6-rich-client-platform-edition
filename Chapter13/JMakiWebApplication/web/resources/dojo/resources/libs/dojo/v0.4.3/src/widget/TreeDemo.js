/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.TreeDemo");
djd43.require("djd43.Deferred");
djd43.widget.TreeDemo = {reportIfDefered:function (res) {
	if (res instanceof djd43.Deferred) {
		res.addCallbacks(function (res) {
			return res;
		}, function (err) {
			djd43.debug("Error");
			djd43.debugShallow(err);
		});
	}
}, resetRandomChildren:function (maxCount) {
	this.randomChildrenMaxCount = maxCount;
	this.randomChildrenCount = 0;
	this.randomChildrenDepth = 0;
}, makeRandomChildren:function (title) {
	this.randomChildrenDepth++;
	var children = [];
	for (var i = 1; i <= 5; i++) {
		var t = title + (this.randomChildrenDepth == 1 ? "" : ".") + i;
		var node = {title:t};
		children.push(node);
		this.randomChildrenCount++;
		if (this.randomChildrenCount >= this.randomChildrenMaxCount) {
			break;
		}
	}
	var i = 1;
	var _this = this;
	djd43.lang.forEach(children, function (child) {
		var t = title + (_this.randomChildrenDepth == 1 ? "" : ".") + i;
		i++;
		if (_this.randomChildrenCount < _this.randomChildrenMaxCount && (_this.randomChildrenDepth == 1 && child === children[0] || _this.randomChildrenDepth < 5 && Math.random() > 0.3)) {
			child.children = _this.makeRandomChildren(t);
		}
	});
	this.randomChildrenDepth--;
	return children;
}, bindDemoMenu:function (controller) {
	var _t = this;
	djd43.event.topic.subscribe("treeContextMenuDestroy/engage", function (menuItem) {
		var node = menuItem.getTreeNode();
		_t.reportIfDefered(controller.destroyChild(node));
	});
	djd43.event.topic.subscribe("treeContextMenuRefresh/engage", function (menuItem) {
		var node = menuItem.getTreeNode();
		_t.reportIfDefered(controller.refreshChildren(node));
	});
	djd43.event.topic.subscribe("treeContextMenuCreate/engage", function (menuItem) {
		var node = menuItem.getTreeNode();
		var d = controller.createAndEdit(node, 0);
		_t.reportIfDefered(d);
	});
	djd43.event.topic.subscribe("treeContextMenuUp/engage", function (menuItem) {
		var node = menuItem.getTreeNode();
		if (node.isFirstChild()) {
			return;
		}
		_t.reportIfDefered(controller.move(node, node.parent, node.getParentIndex() - 1));
	});
	djd43.event.topic.subscribe("treeContextMenuDown/engage", function (menuItem) {
		var node = menuItem.getTreeNode();
		if (node.isLastChild()) {
			return;
		}
		_t.reportIfDefered(controller.move(node, node.parent, node.getParentIndex() + 1));
	});
	djd43.event.topic.subscribe("treeContextMenuEdit/engage", function (menuItem) {
		var node = menuItem.getTreeNode();
		_t.reportIfDefered(controller.editLabelStart(node));
	});
}};

