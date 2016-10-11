/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.ResizeHandle");
djd43.require("djd43.widget.*");
djd43.require("djd43.html.layout");
djd43.require("djd43.event.*");
djd43.widget.defineWidget("djd43.widget.ResizeHandle", djd43.widget.HtmlWidget, {targetElmId:"", templateCssString:".dojoHtmlResizeHandle {\n\tfloat: right;\n\tposition: absolute;\n\tright: 2px;\n\tbottom: 2px;\n\twidth: 13px;\n\theight: 13px;\n\tz-index: 20;\n\tcursor: nw-resize;\n\tbackground-image: url(grabCorner.gif);\n\tline-height: 0px;\n}\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "templates/ResizeHandle.css"), templateString:"<div class=\"dojoHtmlResizeHandle\"><div></div></div>", postCreate:function () {
	djd43.event.connect(this.domNode, "onmousedown", this, "_beginSizing");
}, _beginSizing:function (e) {
	if (this._isSizing) {
		return false;
	}
	this.targetWidget = djd43.widget.byId(this.targetElmId);
	this.targetDomNode = this.targetWidget ? this.targetWidget.domNode : djd43.byId(this.targetElmId);
	if (!this.targetDomNode) {
		return;
	}
	this._isSizing = true;
	this.startPoint = {"x":e.clientX, "y":e.clientY};
	var mb = djd43.html.getMarginBox(this.targetDomNode);
	this.startSize = {"w":mb.width, "h":mb.height};
	djd43.event.kwConnect({srcObj:djd43.body(), srcFunc:"onmousemove", targetObj:this, targetFunc:"_changeSizing", rate:25});
	djd43.event.connect(djd43.body(), "onmouseup", this, "_endSizing");
	e.preventDefault();
}, _changeSizing:function (e) {
	try {
		if (!e.clientX || !e.clientY) {
			return;
		}
	}
	catch (e) {
		return;
	}
	var dx = this.startPoint.x - e.clientX;
	var dy = this.startPoint.y - e.clientY;
	var newW = this.startSize.w - dx;
	var newH = this.startSize.h - dy;
	if (this.minSize) {
		var mb = djd43.html.getMarginBox(this.targetDomNode);
		if (newW < this.minSize.w) {
			newW = mb.width;
		}
		if (newH < this.minSize.h) {
			newH = mb.height;
		}
	}
	if (this.targetWidget) {
		this.targetWidget.resizeTo(newW, newH);
	} else {
		djd43.html.setMarginBox(this.targetDomNode, {width:newW, height:newH});
	}
	e.preventDefault();
}, _endSizing:function (e) {
	djd43.event.disconnect(djd43.body(), "onmousemove", this, "_changeSizing");
	djd43.event.disconnect(djd43.body(), "onmouseup", this, "_endSizing");
	this._isSizing = false;
}});

