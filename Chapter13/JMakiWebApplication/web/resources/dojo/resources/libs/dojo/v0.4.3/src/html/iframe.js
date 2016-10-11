/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.html.iframe");
djd43.require("djd43.html.util");
djd43.html.iframeContentWindow = function (iframe_el) {
	var win = djd43.html.getDocumentWindow(djd43.html.iframeContentDocument(iframe_el)) || djd43.html.iframeContentDocument(iframe_el).__parent__ || (iframe_el.name && document.frames[iframe_el.name]) || null;
	return win;
};
djd43.html.iframeContentDocument = function (iframe_el) {
	var doc = iframe_el.contentDocument || ((iframe_el.contentWindow) && (iframe_el.contentWindow.document)) || ((iframe_el.name) && (document.frames[iframe_el.name]) && (document.frames[iframe_el.name].document)) || null;
	return doc;
};
djd43.html.BackgroundIframe = function (node) {
	if (djd43.render.html.ie55 || djd43.render.html.ie60) {
		var html = "<iframe src='javascript:false'" + " style='position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;" + "z-index: -1; filter:Alpha(Opacity=\"0\");' " + ">";
		this.iframe = djd43.doc().createElement(html);
		this.iframe.tabIndex = -1;
		if (node) {
			node.appendChild(this.iframe);
			this.domNode = node;
		} else {
			djd43.body().appendChild(this.iframe);
			this.iframe.style.display = "none";
		}
	}
};
djd43.lang.extend(djd43.html.BackgroundIframe, {iframe:null, onResized:function () {
	if (this.iframe && this.domNode && this.domNode.parentNode) {
		var outer = djd43.html.getMarginBox(this.domNode);
		if (outer.width == 0 || outer.height == 0) {
			djd43.lang.setTimeout(this, this.onResized, 100);
			return;
		}
		this.iframe.style.width = outer.width + "px";
		this.iframe.style.height = outer.height + "px";
	}
}, size:function (node) {
	if (!this.iframe) {
		return;
	}
	var coords = djd43.html.toCoordinateObject(node, true, djd43.html.boxSizing.BORDER_BOX);
	with (this.iframe.style) {
		width = coords.width + "px";
		height = coords.height + "px";
		left = coords.left + "px";
		top = coords.top + "px";
	}
}, setZIndex:function (node) {
	if (!this.iframe) {
		return;
	}
	if (djd43.dom.isNode(node)) {
		this.iframe.style.zIndex = djd43.html.getStyle(node, "z-index") - 1;
	} else {
		if (!isNaN(node)) {
			this.iframe.style.zIndex = node;
		}
	}
}, show:function () {
	if (this.iframe) {
		this.iframe.style.display = "block";
	}
}, hide:function () {
	if (this.iframe) {
		this.iframe.style.display = "none";
	}
}, remove:function () {
	if (this.iframe) {
		djd43.html.removeNode(this.iframe, true);
		delete this.iframe;
		this.iframe = null;
	}
}});

