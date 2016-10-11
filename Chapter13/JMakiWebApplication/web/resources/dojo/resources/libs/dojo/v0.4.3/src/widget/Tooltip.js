/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Tooltip");
djd43.require("djd43.widget.ContentPane");
djd43.require("djd43.widget.PopupContainer");
djd43.require("djd43.uri.Uri");
djd43.require("djd43.widget.*");
djd43.require("djd43.event.*");
djd43.require("djd43.html.style");
djd43.require("djd43.html.util");
djd43.widget.defineWidget("djd43.widget.Tooltip", [djd43.widget.ContentPane, djd43.widget.PopupContainerBase], {caption:"", showDelay:500, hideDelay:100, connectId:"", templateCssString:".dojoTooltip {\n\tborder: solid black 1px;\n\tbackground: beige;\n\tcolor: black;\n\tposition: absolute;\n\tfont-size: small;\n\tpadding: 2px 2px 2px 2px;\n\tz-index: 10;\n\tdisplay: block;\n}\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "templates/TooltipTemplate.css"), fillInTemplate:function (args, frag) {
	if (this.caption != "") {
		this.domNode.appendChild(document.createTextNode(this.caption));
	}
	this._connectNode = djd43.byId(this.connectId);
	djd43.widget.Tooltip.superclass.fillInTemplate.call(this, args, frag);
	this.addOnLoad(this, "_loadedContent");
	djd43.html.addClass(this.domNode, "dojoTooltip");
	var source = this.getFragNodeRef(frag);
	djd43.html.copyStyle(this.domNode, source);
	this.applyPopupBasicStyle();
}, postCreate:function (args, frag) {
	djd43.event.connect(this._connectNode, "onmouseover", this, "_onMouseOver");
	djd43.widget.Tooltip.superclass.postCreate.call(this, args, frag);
}, _onMouseOver:function (e) {
	this._mouse = {x:e.pageX, y:e.pageY};
	if (!this._tracking) {
		djd43.event.connect(document.documentElement, "onmousemove", this, "_onMouseMove");
		this._tracking = true;
	}
	this._onHover(e);
}, _onMouseMove:function (e) {
	this._mouse = {x:e.pageX, y:e.pageY};
	if (djd43.html.overElement(this._connectNode, e) || djd43.html.overElement(this.domNode, e)) {
		this._onHover(e);
	} else {
		this._onUnHover(e);
	}
}, _onHover:function (e) {
	if (this._hover) {
		return;
	}
	this._hover = true;
	if (this._hideTimer) {
		clearTimeout(this._hideTimer);
		delete this._hideTimer;
	}
	if (!this.isShowingNow && !this._showTimer) {
		this._showTimer = setTimeout(djd43.lang.hitch(this, "open"), this.showDelay);
	}
}, _onUnHover:function (e) {
	if (!this._hover) {
		return;
	}
	this._hover = false;
	if (this._showTimer) {
		clearTimeout(this._showTimer);
		delete this._showTimer;
	}
	if (this.isShowingNow && !this._hideTimer) {
		this._hideTimer = setTimeout(djd43.lang.hitch(this, "close"), this.hideDelay);
	}
	if (!this.isShowingNow) {
		djd43.event.disconnect(document.documentElement, "onmousemove", this, "_onMouseMove");
		this._tracking = false;
	}
}, open:function () {
	if (this.isShowingNow) {
		return;
	}
	djd43.widget.PopupContainerBase.prototype.open.call(this, this._mouse.x, this._mouse.y, null, [this._mouse.x, this._mouse.y], "TL,TR,BL,BR", [10, 15]);
}, close:function () {
	if (this.isShowingNow) {
		if (this._showTimer) {
			clearTimeout(this._showTimer);
			delete this._showTimer;
		}
		if (this._hideTimer) {
			clearTimeout(this._hideTimer);
			delete this._hideTimer;
		}
		djd43.event.disconnect(document.documentElement, "onmousemove", this, "_onMouseMove");
		this._tracking = false;
		djd43.widget.PopupContainerBase.prototype.close.call(this);
	}
}, _position:function () {
	this.move(this._mouse.x, this._mouse.y, [10, 15], "TL,TR,BL,BR");
}, _loadedContent:function () {
	if (this.isShowingNow) {
		this._position();
	}
}, checkSize:function () {
}, uninitialize:function () {
	this.close();
	djd43.event.disconnect(this._connectNode, "onmouseover", this, "_onMouseOver");
}});

