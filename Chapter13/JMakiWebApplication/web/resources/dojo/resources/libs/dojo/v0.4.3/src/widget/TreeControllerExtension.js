/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.TreeControllerExtension");
djd43.declare("djd43.widget.TreeControllerExtension", null, {saveExpandedIndices:function (node, field) {
	var obj = {};
	for (var i = 0; i < node.children.length; i++) {
		if (node.children[i].isExpanded) {
			var key = djd43.lang.isUndefined(field) ? i : node.children[i][field];
			obj[key] = this.saveExpandedIndices(node.children[i], field);
		}
	}
	return obj;
}, restoreExpandedIndices:function (node, savedIndices, field) {
	var _this = this;
	var handler = function (node, savedIndices) {
		this.node = node;
		this.savedIndices = savedIndices;
		this.process = function () {
			_this.restoreExpandedIndices(this.node, this.savedIndices, field);
		};
	};
	for (var i = 0; i < node.children.length; i++) {
		var child = node.children[i];
		var found = false;
		var key = -1;
		if (djd43.lang.isUndefined(field) && savedIndices[i]) {
			found = true;
			key = i;
		}
		if (field) {
			for (var key in savedIndices) {
				if (key == child[field]) {
					found = true;
					break;
				}
			}
		}
		if (found) {
			var h = new handler(child, savedIndices[key]);
			_this.expand(child, false, h, h.process);
		} else {
			if (child.isExpanded) {
				djd43.lang.forEach(child.getDescendants(), function (elem) {
					_this.collapse(elem);
				});
			}
		}
	}
}});

