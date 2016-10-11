/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.TreeV3");
djd43.require("djd43.widget.TreeWithNode");
djd43.require("djd43.widget.*");
djd43.require("djd43.event.*");
djd43.require("djd43.io.*");
djd43.require("djd43.widget.HtmlWidget");
djd43.require("djd43.widget.TreeNodeV3");
djd43.widget.defineWidget("djd43.widget.TreeV3", [djd43.widget.HtmlWidget, djd43.widget.TreeWithNode], function () {
	this.eventNames = {};
	this.DndAcceptTypes = [];
	this.actionsDisabled = [];
	this.listeners = [];
	this.tree = this;
}, {DndMode:"", defaultChildWidget:null, defaultChildTitle:"New Node", eagerWidgetInstantiation:false, eventNamesDefault:{afterTreeCreate:"afterTreeCreate", beforeTreeDestroy:"beforeTreeDestroy", beforeNodeDestroy:"beforeNodeDestroy", afterChangeTree:"afterChangeTree", afterSetFolder:"afterSetFolder", afterUnsetFolder:"afterUnsetFolder", beforeMoveFrom:"beforeMoveFrom", beforeMoveTo:"beforeMoveTo", afterMoveFrom:"afterMoveFrom", afterMoveTo:"afterMoveTo", afterAddChild:"afterAddChild", afterDetach:"afterDetach", afterExpand:"afterExpand", beforeExpand:"beforeExpand", afterSetTitle:"afterSetTitle", afterCollapse:"afterCollapse", beforeCollapse:"beforeCollapse"}, classPrefix:"Tree", style:"", allowAddChildToLeaf:true, unsetFolderOnEmpty:true, DndModes:{BETWEEN:1, ONTO:2}, DndAcceptTypes:"", templateCssString:"/* indent for all tree children excepts root */\n.TreeNode {\n	background-image : url('../templates/images/TreeV3/i.gif');\n	background-position : top left;\n	background-repeat : repeat-y;\n	margin-left: 19px;\n	zoom: 1;\n}\n.TreeIsRoot {\n	margin-left: 0;\n}\n \n/* left vertical line (grid) for all nodes */\n.TreeIsLast {\n	background-image: url('../templates/images/TreeV3/i_half.gif');\n	background-repeat : no-repeat;\n}\n \n.TreeExpandOpen .TreeExpand {\n	background-image: url('../templates/images/TreeV3/expand_minus.gif');\n}\n \n/* closed is higher priority than open */\n.TreeExpandClosed .TreeExpand {\n	background-image: url('../templates/images/TreeV3/expand_plus.gif');\n}\n \n/* highest priority */\n.TreeExpandLeaf .TreeExpand {\n	background-image: url('../templates/images/TreeV3/expand_leaf.gif');\n}\n\n/* \nshould always override any expand setting, but do not touch children.\nif I add .TreeExpand .TreeExpandLoading same time and put it to top/bottom, then it will take precedence over +- for all descendants or always fail\nso I have to remove TreeExpand and process this one specifically\n*/\n\n.TreeExpandLoading   {\n	width: 18px;\n	height: 18px;\n	float: left;\n	display: inline;\n	background-repeat : no-repeat;\n	background-image: url('../templates/images/TreeV3/expand_loading.gif');\n}\n \n.TreeContent {\n	min-height: 18px;\n	min-width: 18px;\n	margin-left:18px;\n	cursor: default;\n	/* can't make inline - multiline bugs */\n}\n\n.TreeIEContent {\n\theight: 18px;\n}\n \n.TreeExpand {\n	width: 18px;\n	height: 18px;\n	float: left;\n	display: inline;\n	background-repeat : no-repeat;\n}\n \n/* same style as IE selection */\n.TreeNodeEmphasized {\n	background-color: Highlight;\n	color: HighlightText;\n}\n \n.TreeContent .RichTextEditable, .TreeContent .RichTextEditable iframe {\n	  background-color: #ffc;\n	  color: black;\n}\n\n/* don't use :focus due to opera's lack of support on div's */\n.TreeLabelFocused {\n	  outline: 1px invert dotted;\n}\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "templates/TreeV3.css"), templateString:"<div style=\"${this.style}\">\n</div>", isExpanded:true, isTree:true, createNode:function (data) {
	data.tree = this.widgetId;
	if (data.widgetName) {
		return djd43.widget.createWidget(data.widgetName, data);
	} else {
		if (this.defaultChildWidget.prototype.createSimple) {
			return this.defaultChildWidget.prototype.createSimple(data);
		} else {
			var ns = this.defaultChildWidget.prototype.ns;
			var wt = this.defaultChildWidget.prototype.widgetType;
			return djd43.widget.createWidget(ns + ":" + wt, data);
		}
	}
}, makeNodeTemplate:function () {
	var domNode = document.createElement("div");
	djd43.html.setClass(domNode, this.classPrefix + "Node " + this.classPrefix + "ExpandLeaf " + this.classPrefix + "ChildrenNo");
	this.nodeTemplate = domNode;
	var expandNode = document.createElement("div");
	var clazz = this.classPrefix + "Expand";
	if (djd43.render.html.ie) {
		clazz = clazz + " " + this.classPrefix + "IEExpand";
	}
	djd43.html.setClass(expandNode, clazz);
	this.expandNodeTemplate = expandNode;
	var labelNode = document.createElement("span");
	djd43.html.setClass(labelNode, this.classPrefix + "Label");
	this.labelNodeTemplate = labelNode;
	var contentNode = document.createElement("div");
	var clazz = this.classPrefix + "Content";
	if (djd43.render.html.ie && !djd43.render.html.ie70) {
		clazz = clazz + " " + this.classPrefix + "IEContent";
	}
	djd43.html.setClass(contentNode, clazz);
	this.contentNodeTemplate = contentNode;
	domNode.appendChild(expandNode);
	domNode.appendChild(contentNode);
	contentNode.appendChild(labelNode);
}, makeContainerNodeTemplate:function () {
	var div = document.createElement("div");
	div.style.display = "none";
	djd43.html.setClass(div, this.classPrefix + "Container");
	this.containerNodeTemplate = div;
}, actions:{ADDCHILD:"ADDCHILD"}, getInfo:function () {
	var info = {widgetId:this.widgetId, objectId:this.objectId};
	return info;
}, adjustEventNames:function () {
	for (var name in this.eventNamesDefault) {
		if (djd43.lang.isUndefined(this.eventNames[name])) {
			this.eventNames[name] = this.widgetId + "/" + this.eventNamesDefault[name];
		}
	}
}, adjustDndMode:function () {
	var _this = this;
	var DndMode = 0;
	djd43.lang.forEach(this.DndMode.split(";"), function (elem) {
		var mode = _this.DndModes[djd43.string.trim(elem).toUpperCase()];
		if (mode) {
			DndMode = DndMode | mode;
		}
	});
	this.DndMode = DndMode;
}, destroy:function () {
	djd43.event.topic.publish(this.tree.eventNames.beforeTreeDestroy, {source:this});
	return djd43.widget.HtmlWidget.prototype.destroy.apply(this, arguments);
}, initialize:function (args) {
	this.domNode.widgetId = this.widgetId;
	for (var i = 0; i < this.actionsDisabled.length; i++) {
		this.actionsDisabled[i] = this.actionsDisabled[i].toUpperCase();
	}
	if (!args.defaultChildWidget) {
		this.defaultChildWidget = djd43.widget.TreeNodeV3;
	} else {
		this.defaultChildWidget = djd43.lang.getObjPathValue(args.defaultChildWidget);
	}
	this.adjustEventNames();
	this.adjustDndMode();
	this.makeNodeTemplate();
	this.makeContainerNodeTemplate();
	this.containerNode = this.domNode;
	djd43.html.setClass(this.domNode, this.classPrefix + "Container");
	var _this = this;
	djd43.lang.forEach(this.listeners, function (elem) {
		var t = djd43.lang.isString(elem) ? djd43.widget.byId(elem) : elem;
		t.listenTree(_this);
	});
}, postCreate:function () {
	djd43.event.topic.publish(this.eventNames.afterTreeCreate, {source:this});
}, move:function (child, newParent, index) {
	if (!child.parent) {
		djd43.raise(this.widgetType + ": child can be moved only while it's attached");
	}
	var oldParent = child.parent;
	var oldTree = child.tree;
	var oldIndex = child.getParentIndex();
	var newTree = newParent.tree;
	var newParent = newParent;
	var newIndex = index;
	var message = {oldParent:oldParent, oldTree:oldTree, oldIndex:oldIndex, newParent:newParent, newTree:newTree, newIndex:newIndex, child:child};
	djd43.event.topic.publish(oldTree.eventNames.beforeMoveFrom, message);
	djd43.event.topic.publish(newTree.eventNames.beforeMoveTo, message);
	this.doMove.apply(this, arguments);
	djd43.event.topic.publish(oldTree.eventNames.afterMoveFrom, message);
	djd43.event.topic.publish(newTree.eventNames.afterMoveTo, message);
}, doMove:function (child, newParent, index) {
	child.doDetach();
	newParent.doAddChild(child, index);
}, toString:function () {
	return "[" + this.widgetType + " ID:" + this.widgetId + "]";
}});

