/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.dnd.TreeDragAndDrop");
djd43.require("djd43.dnd.HtmlDragAndDrop");
djd43.require("djd43.lang.func");
djd43.require("djd43.lang.array");
djd43.require("djd43.lang.extras");
djd43.require("djd43.html.layout");
djd43.dnd.TreeDragSource = function (node, syncController, type, treeNode) {
	this.controller = syncController;
	this.treeNode = treeNode;
	djd43.dnd.HtmlDragSource.call(this, node, type);
};
djd43.inherits(djd43.dnd.TreeDragSource, djd43.dnd.HtmlDragSource);
djd43.lang.extend(djd43.dnd.TreeDragSource, {onDragStart:function () {
	var dragObject = djd43.dnd.HtmlDragSource.prototype.onDragStart.call(this);
	dragObject.treeNode = this.treeNode;
	dragObject.onDragStart = djd43.lang.hitch(dragObject, function (e) {
		this.savedSelectedNode = this.treeNode.tree.selector.selectedNode;
		if (this.savedSelectedNode) {
			this.savedSelectedNode.unMarkSelected();
		}
		var result = djd43.dnd.HtmlDragObject.prototype.onDragStart.apply(this, arguments);
		var cloneGrid = this.dragClone.getElementsByTagName("img");
		for (var i = 0; i < cloneGrid.length; i++) {
			cloneGrid.item(i).style.backgroundImage = "url()";
		}
		return result;
	});
	dragObject.onDragEnd = function (e) {
		if (this.savedSelectedNode) {
			this.savedSelectedNode.markSelected();
		}
		return djd43.dnd.HtmlDragObject.prototype.onDragEnd.apply(this, arguments);
	};
	return dragObject;
}, onDragEnd:function (e) {
	var res = djd43.dnd.HtmlDragSource.prototype.onDragEnd.call(this, e);
	return res;
}});
djd43.dnd.TreeDropTarget = function (domNode, controller, type, treeNode) {
	this.treeNode = treeNode;
	this.controller = controller;
	djd43.dnd.HtmlDropTarget.apply(this, [domNode, type]);
};
djd43.inherits(djd43.dnd.TreeDropTarget, djd43.dnd.HtmlDropTarget);
djd43.lang.extend(djd43.dnd.TreeDropTarget, {autoExpandDelay:1500, autoExpandTimer:null, position:null, indicatorStyle:"2px black solid", showIndicator:function (position) {
	if (this.position == position) {
		return;
	}
	this.hideIndicator();
	this.position = position;
	if (position == "before") {
		this.treeNode.labelNode.style.borderTop = this.indicatorStyle;
	} else {
		if (position == "after") {
			this.treeNode.labelNode.style.borderBottom = this.indicatorStyle;
		} else {
			if (position == "onto") {
				this.treeNode.markSelected();
			}
		}
	}
}, hideIndicator:function () {
	this.treeNode.labelNode.style.borderBottom = "";
	this.treeNode.labelNode.style.borderTop = "";
	this.treeNode.unMarkSelected();
	this.position = null;
}, onDragOver:function (e) {
	var accepts = djd43.dnd.HtmlDropTarget.prototype.onDragOver.apply(this, arguments);
	if (accepts && this.treeNode.isFolder && !this.treeNode.isExpanded) {
		this.setAutoExpandTimer();
	}
	return accepts;
}, accepts:function (dragObjects) {
	var accepts = djd43.dnd.HtmlDropTarget.prototype.accepts.apply(this, arguments);
	if (!accepts) {
		return false;
	}
	var sourceTreeNode = dragObjects[0].treeNode;
	if (djd43.lang.isUndefined(sourceTreeNode) || !sourceTreeNode || !sourceTreeNode.isTreeNode) {
		djd43.raise("Source is not TreeNode or not found");
	}
	if (sourceTreeNode === this.treeNode) {
		return false;
	}
	return true;
}, setAutoExpandTimer:function () {
	var _this = this;
	var autoExpand = function () {
		if (djd43.dnd.dragManager.currentDropTarget === _this) {
			_this.controller.expand(_this.treeNode);
		}
	};
	this.autoExpandTimer = djd43.lang.setTimeout(autoExpand, _this.autoExpandDelay);
}, getDNDMode:function () {
	return this.treeNode.tree.DNDMode;
}, getAcceptPosition:function (e, sourceTreeNode) {
	var DNDMode = this.getDNDMode();
	if (DNDMode & djd43.widget.Tree.prototype.DNDModes.ONTO && !(!this.treeNode.actionIsDisabled(djd43.widget.TreeNode.prototype.actions.ADDCHILD) && sourceTreeNode.parent !== this.treeNode && this.controller.canMove(sourceTreeNode, this.treeNode))) {
		DNDMode &= ~djd43.widget.Tree.prototype.DNDModes.ONTO;
	}
	var position = this.getPosition(e, DNDMode);
	if (position == "onto" || (!this.isAdjacentNode(sourceTreeNode, position) && this.controller.canMove(sourceTreeNode, this.treeNode.parent))) {
		return position;
	} else {
		return false;
	}
}, onDragOut:function (e) {
	this.clearAutoExpandTimer();
	this.hideIndicator();
}, clearAutoExpandTimer:function () {
	if (this.autoExpandTimer) {
		clearTimeout(this.autoExpandTimer);
		this.autoExpandTimer = null;
	}
}, onDragMove:function (e, dragObjects) {
	var sourceTreeNode = dragObjects[0].treeNode;
	var position = this.getAcceptPosition(e, sourceTreeNode);
	if (position) {
		this.showIndicator(position);
	}
}, isAdjacentNode:function (sourceNode, position) {
	if (sourceNode === this.treeNode) {
		return true;
	}
	if (sourceNode.getNextSibling() === this.treeNode && position == "before") {
		return true;
	}
	if (sourceNode.getPreviousSibling() === this.treeNode && position == "after") {
		return true;
	}
	return false;
}, getPosition:function (e, DNDMode) {
	var node = djd43.byId(this.treeNode.labelNode);
	var mousey = e.pageY || e.clientY + djd43.body().scrollTop;
	var nodey = djd43.html.getAbsolutePosition(node).y;
	var height = djd43.html.getBorderBox(node).height;
	var relY = mousey - nodey;
	var p = relY / height;
	var position = "";
	if (DNDMode & djd43.widget.Tree.prototype.DNDModes.ONTO && DNDMode & djd43.widget.Tree.prototype.DNDModes.BETWEEN) {
		if (p <= 0.3) {
			position = "before";
		} else {
			if (p <= 0.7) {
				position = "onto";
			} else {
				position = "after";
			}
		}
	} else {
		if (DNDMode & djd43.widget.Tree.prototype.DNDModes.BETWEEN) {
			if (p <= 0.5) {
				position = "before";
			} else {
				position = "after";
			}
		} else {
			if (DNDMode & djd43.widget.Tree.prototype.DNDModes.ONTO) {
				position = "onto";
			}
		}
	}
	return position;
}, getTargetParentIndex:function (sourceTreeNode, position) {
	var index = position == "before" ? this.treeNode.getParentIndex() : this.treeNode.getParentIndex() + 1;
	if (this.treeNode.parent === sourceTreeNode.parent && this.treeNode.getParentIndex() > sourceTreeNode.getParentIndex()) {
		index--;
	}
	return index;
}, onDrop:function (e) {
	var position = this.position;
	this.onDragOut(e);
	var sourceTreeNode = e.dragObject.treeNode;
	if (!djd43.lang.isObject(sourceTreeNode)) {
		djd43.raise("TreeNode not found in dragObject");
	}
	if (position == "onto") {
		return this.controller.move(sourceTreeNode, this.treeNode, 0);
	} else {
		var index = this.getTargetParentIndex(sourceTreeNode, position);
		return this.controller.move(sourceTreeNode, this.treeNode.parent, index);
	}
}});
djd43.dnd.TreeDNDController = function (treeController) {
	this.treeController = treeController;
	this.dragSources = {};
	this.dropTargets = {};
};
djd43.lang.extend(djd43.dnd.TreeDNDController, {listenTree:function (tree) {
	djd43.event.topic.subscribe(tree.eventNames.createDOMNode, this, "onCreateDOMNode");
	djd43.event.topic.subscribe(tree.eventNames.moveFrom, this, "onMoveFrom");
	djd43.event.topic.subscribe(tree.eventNames.moveTo, this, "onMoveTo");
	djd43.event.topic.subscribe(tree.eventNames.addChild, this, "onAddChild");
	djd43.event.topic.subscribe(tree.eventNames.removeNode, this, "onRemoveNode");
	djd43.event.topic.subscribe(tree.eventNames.treeDestroy, this, "onTreeDestroy");
}, unlistenTree:function (tree) {
	djd43.event.topic.unsubscribe(tree.eventNames.createDOMNode, this, "onCreateDOMNode");
	djd43.event.topic.unsubscribe(tree.eventNames.moveFrom, this, "onMoveFrom");
	djd43.event.topic.unsubscribe(tree.eventNames.moveTo, this, "onMoveTo");
	djd43.event.topic.unsubscribe(tree.eventNames.addChild, this, "onAddChild");
	djd43.event.topic.unsubscribe(tree.eventNames.removeNode, this, "onRemoveNode");
	djd43.event.topic.unsubscribe(tree.eventNames.treeDestroy, this, "onTreeDestroy");
}, onTreeDestroy:function (message) {
	this.unlistenTree(message.source);
}, onCreateDOMNode:function (message) {
	this.registerDNDNode(message.source);
}, onAddChild:function (message) {
	this.registerDNDNode(message.child);
}, onMoveFrom:function (message) {
	var _this = this;
	djd43.lang.forEach(message.child.getDescendants(), function (node) {
		_this.unregisterDNDNode(node);
	});
}, onMoveTo:function (message) {
	var _this = this;
	djd43.lang.forEach(message.child.getDescendants(), function (node) {
		_this.registerDNDNode(node);
	});
}, registerDNDNode:function (node) {
	if (!node.tree.DNDMode) {
		return;
	}
	var source = null;
	var target = null;
	if (!node.actionIsDisabled(node.actions.MOVE)) {
		var source = new djd43.dnd.TreeDragSource(node.labelNode, this, node.tree.widgetId, node);
		this.dragSources[node.widgetId] = source;
	}
	var target = new djd43.dnd.TreeDropTarget(node.labelNode, this.treeController, node.tree.DNDAcceptTypes, node);
	this.dropTargets[node.widgetId] = target;
}, unregisterDNDNode:function (node) {
	if (this.dragSources[node.widgetId]) {
		djd43.dnd.dragManager.unregisterDragSource(this.dragSources[node.widgetId]);
		delete this.dragSources[node.widgetId];
	}
	if (this.dropTargets[node.widgetId]) {
		djd43.dnd.dragManager.unregisterDropTarget(this.dropTargets[node.widgetId]);
		delete this.dropTargets[node.widgetId];
	}
}});

