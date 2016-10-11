/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.RadioGroup");
djd43.require("djd43.lang.common");
djd43.require("djd43.event.browser");
djd43.require("djd43.html.selection");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.HtmlWidget");
djd43.widget.defineWidget("djd43.widget.RadioGroup", djd43.widget.HtmlWidget, function () {
	this.selectedItem = null;
	this.items = [];
	this.selected = [];
	this.groupCssClass = "radioGroup";
	this.selectedCssClass = "selected";
	this.itemContentCssClass = "itemContent";
}, {isContainer:false, templatePath:null, templateCssPath:null, postCreate:function () {
	this._parseStructure();
	djd43.html.addClass(this.domNode, this.groupCssClass);
	this._setupChildren();
	djd43.event.browser.addListener(this.domNode, "onclick", djd43.lang.hitch(this, "onSelect"));
	if (this.selectedItem) {
		this._selectItem(this.selectedItem);
	}
}, _parseStructure:function () {
	if (this.domNode.tagName.toLowerCase() != "ul" && this.domNode.tagName.toLowerCase() != "ol") {
		djd43.raise("RadioGroup: Expected ul or ol content.");
		return;
	}
	this.items = [];
	var nl = this.domNode.getElementsByTagName("li");
	for (var i = 0; i < nl.length; i++) {
		if (nl[i].parentNode == this.domNode) {
			this.items.push(nl[i]);
		}
	}
}, add:function (node) {
	if (node.parentNode != this.domNode) {
		this.domNode.appendChild(node);
	}
	this.items.push(node);
	this._setup(node);
}, remove:function (node) {
	var idx = -1;
	for (var i = 0; i < this.items.length; i++) {
		if (this.items[i] == node) {
			idx = i;
			break;
		}
	}
	if (idx < 0) {
		return;
	}
	this.items.splice(idx, 1);
	node.parentNode.removeChild(node);
}, clear:function () {
	for (var i = 0; i < this.items.length; i++) {
		this.domNode.removeChild(this.items[i]);
	}
	this.items = [];
}, clearSelections:function () {
	for (var i = 0; i < this.items.length; i++) {
		djd43.html.removeClass(this.items[i], this.selectedCssClass);
	}
	this.selectedItem = null;
}, _setup:function (node) {
	var span = document.createElement("span");
	djd43.html.disableSelection(span);
	djd43.html.addClass(span, this.itemContentCssClass);
	djd43.dom.moveChildren(node, span);
	node.appendChild(span);
	if (this.selected.length > 0) {
		var uid = djd43.html.getAttribute(node, "id");
		if (uid && uid == this.selected) {
			this.selectedItem = node;
		}
	}
	djd43.event.browser.addListener(node, "onclick", djd43.lang.hitch(this, "onItemSelect"));
	if (djd43.html.hasAttribute(node, "onitemselect")) {
		var tn = djd43.lang.nameAnonFunc(new Function(djd43.html.getAttribute(node, "onitemselect")), this);
		djd43.event.browser.addListener(node, "onclick", djd43.lang.hitch(this, tn));
	}
}, _setupChildren:function () {
	for (var i = 0; i < this.items.length; i++) {
		this._setup(this.items[i]);
	}
}, _selectItem:function (node, event, nofire) {
	if (this.selectedItem) {
		djd43.html.removeClass(this.selectedItem, this.selectedCssClass);
	}
	this.selectedItem = node;
	djd43.html.addClass(this.selectedItem, this.selectedCssClass);
	if (!dj_undef("currentTarget", event)) {
		return;
	}
	if (!nofire) {
		if (djd43.render.html.ie) {
			this.selectedItem.fireEvent("onclick");
		} else {
			var e = document.createEvent("MouseEvents");
			e.initEvent("click", true, false);
			this.selectedItem.dispatchEvent(e);
		}
	}
}, getValue:function () {
	return this.selectedItem;
}, onSelect:function (e) {
}, onItemSelect:function (e) {
	if (!dj_undef("currentTarget", e)) {
		this._selectItem(e.currentTarget, e);
	}
}});

