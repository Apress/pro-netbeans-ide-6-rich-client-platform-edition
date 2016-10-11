/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.TreeLinkExtension");
djd43.require("djd43.widget.HtmlWidget");
djd43.require("djd43.widget.TreeExtension");
djd43.widget.defineWidget("djd43.widget.TreeLinkExtension", djd43.widget.TreeExtension, function () {
	this.params = {};
}, {listenTreeEvents:["afterChangeTree"], listenTree:function (tree) {
	djd43.widget.TreeCommon.prototype.listenTree.call(this, tree);
	var labelNode = tree.labelNodeTemplate;
	var newLabel = this.makeALabel();
	djd43.html.setClass(newLabel, djd43.html.getClass(labelNode));
	labelNode.parentNode.replaceChild(newLabel, labelNode);
}, makeALabel:function () {
	var newLabel = document.createElement("a");
	for (var key in this.params) {
		if (key in {}) {
			continue;
		}
		newLabel.setAttribute(key, this.params[key]);
	}
	return newLabel;
}, onAfterChangeTree:function (message) {
	var _this = this;
	if (!message.oldTree) {
		this.listenNode(message.node);
	}
}, listenNode:function (node) {
	for (var key in node.object) {
		if (key in {}) {
			continue;
		}
		node.labelNode.setAttribute(key, node.object[key]);
	}
}});

