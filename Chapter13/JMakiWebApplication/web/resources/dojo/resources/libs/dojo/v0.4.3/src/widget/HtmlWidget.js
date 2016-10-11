/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.HtmlWidget");
djd43.require("djd43.widget.DomWidget");
djd43.require("djd43.html.util");
djd43.require("djd43.html.display");
djd43.require("djd43.html.layout");
djd43.require("djd43.lang.extras");
djd43.require("djd43.lang.func");
djd43.require("djd43.lfx.toggle");
djd43.declare("djd43.widget.HtmlWidget", djd43.widget.DomWidget, {templateCssPath:null, templatePath:null, lang:"", toggle:"plain", toggleDuration:150, initialize:function (args, frag) {
}, postMixInProperties:function (args, frag) {
	if (this.lang === "") {
		this.lang = null;
	}
	this.toggleObj = djd43.lfx.toggle[this.toggle.toLowerCase()] || djd43.lfx.toggle.plain;
}, createNodesFromText:function (txt, wrap) {
	return djd43.html.createNodesFromText(txt, wrap);
}, destroyRendering:function (finalize) {
	try {
		if (this.bgIframe) {
			this.bgIframe.remove();
			delete this.bgIframe;
		}
		if (!finalize && this.domNode) {
			djd43.event.browser.clean(this.domNode);
		}
		djd43.widget.HtmlWidget.superclass.destroyRendering.call(this);
	}
	catch (e) {
	}
}, isShowing:function () {
	return djd43.html.isShowing(this.domNode);
}, toggleShowing:function () {
	if (this.isShowing()) {
		this.hide();
	} else {
		this.show();
	}
}, show:function () {
	if (this.isShowing()) {
		return;
	}
	this.animationInProgress = true;
	this.toggleObj.show(this.domNode, this.toggleDuration, null, djd43.lang.hitch(this, this.onShow), this.explodeSrc);
}, onShow:function () {
	this.animationInProgress = false;
	this.checkSize();
}, hide:function () {
	if (!this.isShowing()) {
		return;
	}
	this.animationInProgress = true;
	this.toggleObj.hide(this.domNode, this.toggleDuration, null, djd43.lang.hitch(this, this.onHide), this.explodeSrc);
}, onHide:function () {
	this.animationInProgress = false;
}, _isResized:function (w, h) {
	if (!this.isShowing()) {
		return false;
	}
	var wh = djd43.html.getMarginBox(this.domNode);
	var width = w || wh.width;
	var height = h || wh.height;
	if (this.width == width && this.height == height) {
		return false;
	}
	this.width = width;
	this.height = height;
	return true;
}, checkSize:function () {
	if (!this._isResized()) {
		return;
	}
	this.onResized();
}, resizeTo:function (w, h) {
	djd43.html.setMarginBox(this.domNode, {width:w, height:h});
	if (this.isShowing()) {
		this.onResized();
	}
}, resizeSoon:function () {
	if (this.isShowing()) {
		djd43.lang.setTimeout(this, this.onResized, 0);
	}
}, onResized:function () {
	djd43.lang.forEach(this.children, function (child) {
		if (child.checkSize) {
			child.checkSize();
		}
	});
}});

