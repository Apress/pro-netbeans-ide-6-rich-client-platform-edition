/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.TreeDocIconExtension");
djd43.require("djd43.widget.HtmlWidget");
djd43.require("djd43.widget.TreeExtension");
djd43.widget.defineWidget("djd43.widget.TreeDocIconExtension", [djd43.widget.TreeExtension], {templateCssString:"\n/* CSS for TreeDocIconExtension */\n\n\n/* long vertical line under docIcon, connecting w/ children */\n.TreeStateChildrenYes-ExpandOpen .TreeIconContent {\n	background-image : url('../templates/images/TreeV3/i_long.gif');\n	background-repeat : no-repeat;\n	background-position: 18px 9px;\n}\n\n/* close has higher priority */\n.TreeStateChildrenYes-ExpandClosed .TreeIconContent {\n	background-image : url();\n}\n\n/* higher priotity: same length and appear after background-definition */\n.TreeStateChildrenNo-ExpandLeaf .TreeIconContent {\n	background-image : url();\n}\n\n.TreeStateChildrenNo-ExpandClosed .TreeIconContent {\n	background-image : url();\n}\n\n.TreeStateChildrenNo-ExpandOpen .TreeIconContent {\n	background-image : url();\n}\n\n\n/* highest priority */\n.TreeIconDocument {\n	background-image: url('../templates/images/TreeV3/document.gif');\n}\n\n.TreeExpandOpen .TreeIconFolder {\n	background-image: url('../templates/images/TreeV3/open.gif');\n}\n\n.TreeExpandClosed .TreeIconFolder {\n	background-image: url('../templates/images/TreeV3/closed.gif');\n}\n\n/* generic class for docIcon */\n.TreeIcon {\n	width: 18px;\n	height: 18px;\n	float: left;\n	display: inline;\n	background-repeat : no-repeat;\n}\n\ndiv.TreeContent {\n	margin-left: 36px;\n}\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "templates/TreeDocIcon.css"), listenTreeEvents:["afterChangeTree", "afterSetFolder", "afterUnsetFolder"], listenNodeFilter:function (elem) {
	return elem instanceof djd43.widget.Widget;
}, getnodeDocType:function (node) {
	var nodeDocType = node.getnodeDocType();
	if (!nodeDocType) {
		nodeDocType = node.isFolder ? "Folder" : "Document";
	}
	return nodeDocType;
}, setnodeDocTypeClass:function (node) {
	var reg = new RegExp("(^|\\s)" + node.tree.classPrefix + "Icon\\w+", "g");
	var clazz = djd43.html.getClass(node.iconNode).replace(reg, "") + " " + node.tree.classPrefix + "Icon" + this.getnodeDocType(node);
	djd43.html.setClass(node.iconNode, clazz);
}, onAfterSetFolder:function (message) {
	if (message.source.iconNode) {
		this.setnodeDocTypeClass(message.source);
	}
}, onAfterUnsetFolder:function (message) {
	this.setnodeDocTypeClass(message.source);
}, listenNode:function (node) {
	node.contentIconNode = document.createElement("div");
	var clazz = node.tree.classPrefix + "IconContent";
	if (djd43.render.html.ie) {
		clazz = clazz + " " + node.tree.classPrefix + "IEIconContent";
	}
	djd43.html.setClass(node.contentIconNode, clazz);
	node.contentNode.parentNode.replaceChild(node.contentIconNode, node.expandNode);
	node.iconNode = document.createElement("div");
	djd43.html.setClass(node.iconNode, node.tree.classPrefix + "Icon" + " " + node.tree.classPrefix + "Icon" + this.getnodeDocType(node));
	node.contentIconNode.appendChild(node.expandNode);
	node.contentIconNode.appendChild(node.iconNode);
	djd43.dom.removeNode(node.contentNode);
	node.contentIconNode.appendChild(node.contentNode);
}, onAfterChangeTree:function (message) {
	var _this = this;
	if (!message.oldTree || !this.listenedTrees[message.oldTree.widgetId]) {
		this.processDescendants(message.node, this.listenNodeFilter, this.listenNode);
	}
}});

