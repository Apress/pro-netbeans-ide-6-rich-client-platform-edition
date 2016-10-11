/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Toaster");
djd43.require("djd43.widget.*");
djd43.require("djd43.lfx.*");
djd43.require("djd43.html.iframe");
djd43.widget.defineWidget("djd43.widget.Toaster", djd43.widget.HtmlWidget, {templateString:"<div dojoAttachPoint=\"clipNode\"><div dojoAttachPoint=\"containerNode\" dojoAttachEvent=\"onClick:onSelect\"><div dojoAttachPoint=\"contentNode\"></div></div></div>", templateCssString:".dojoToasterClip {\n\tposition: absolute;\n\toverflow: hidden;\n}\n\n.dojoToasterContainer {\n\tdisplay: block;\n\tposition: absolute;\n\twidth: 17.5em;\n\tz-index: 5000;\n\tmargin: 0px;\n\tfont:0.75em Tahoma, Helvetica, Verdana, Arial;\n}\n\n.dojoToasterContent{\n\tpadding:1em;\n\tpadding-top:0.25em;\n\tbackground:#73c74a;\n}\n\n.dojoToasterMessage{ \n\tcolor:#fff;\n}\n.dojoToasterWarning{ }\n.dojoToasterError,\n.dojoToasterFatal{\n\tfont-weight:bold;\n\tcolor:#fff;\n}\n\n\n.dojoToasterWarning .dojoToasterContent{\n\tpadding:1em;\n\tpadding-top:0.25em;\n\tbackground:#d4d943;\n} \n\n.dojoToasterError .dojoToasterContent{\n\tpadding:1em;\n\tpadding-top:0.25em;\n\tbackground:#c46600;\n} \n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "templates/Toaster.css"), messageTopic:"", messageTypes:{MESSAGE:"MESSAGE", WARNING:"WARNING", ERROR:"ERROR", FATAL:"FATAL"}, defaultType:"MESSAGE", clipCssClass:"dojoToasterClip", containerCssClass:"dojoToasterContainer", contentCssClass:"dojoToasterContent", messageCssClass:"dojoToasterMessage", warningCssClass:"dojoToasterWarning", errorCssClass:"dojoToasterError", fatalCssClass:"dojoToasterFatal", positionDirection:"br-up", positionDirectionTypes:["br-up", "br-left", "bl-up", "bl-right", "tr-down", "tr-left", "tl-down", "tl-right"], showDelay:2000, postCreate:function () {
	this.hide();
	djd43.html.setClass(this.clipNode, this.clipCssClass);
	djd43.html.addClass(this.containerNode, this.containerCssClass);
	djd43.html.setClass(this.contentNode, this.contentCssClass);
	if (this.messageTopic) {
		djd43.event.topic.subscribe(this.messageTopic, this, "_handleMessage");
	}
	if (!this.positionDirection || !djd43.lang.inArray(this.positionDirectionTypes, this.positionDirection)) {
		this.positionDirection = this.positionDirectionTypes.BRU;
	}
}, _handleMessage:function (msg) {
	if (djd43.lang.isString(msg)) {
		this.setContent(msg);
	} else {
		this.setContent(msg["message"], msg["type"], msg["delay"]);
	}
}, setContent:function (msg, messageType, delay) {
	var delay = delay || this.showDelay;
	if (this.slideAnim && this.slideAnim.status() == "playing") {
		djd43.lang.setTimeout(50, djd43.lang.hitch(this, function () {
			this.setContent(msg, messageType);
		}));
		return;
	} else {
		if (this.slideAnim) {
			this.slideAnim.stop();
			if (this.fadeAnim) {
				this.fadeAnim.stop();
			}
		}
	}
	if (!msg) {
		djd43.debug(this.widgetId + ".setContent() incoming content was null, ignoring.");
		return;
	}
	if (!this.positionDirection || !djd43.lang.inArray(this.positionDirectionTypes, this.positionDirection)) {
		djd43.raise(this.widgetId + ".positionDirection is an invalid value: " + this.positionDirection);
	}
	djd43.html.removeClass(this.containerNode, this.messageCssClass);
	djd43.html.removeClass(this.containerNode, this.warningCssClass);
	djd43.html.removeClass(this.containerNode, this.errorCssClass);
	djd43.html.removeClass(this.containerNode, this.fatalCssClass);
	djd43.html.clearOpacity(this.containerNode);
	if (msg instanceof String || typeof msg == "string") {
		this.contentNode.innerHTML = msg;
	} else {
		if (djd43.html.isNode(msg)) {
			this.contentNode.innerHTML = djd43.html.getContentAsString(msg);
		} else {
			djd43.raise("Toaster.setContent(): msg is of unknown type:" + msg);
		}
	}
	switch (messageType) {
	  case this.messageTypes.WARNING:
		djd43.html.addClass(this.containerNode, this.warningCssClass);
		break;
	  case this.messageTypes.ERROR:
		djd43.html.addClass(this.containerNode, this.errorCssClass);
		break;
	  case this.messageTypes.FATAL:
		djd43.html.addClass(this.containerNode, this.fatalCssClass);
		break;
	  case this.messageTypes.MESSAGE:
	  default:
		djd43.html.addClass(this.containerNode, this.messageCssClass);
		break;
	}
	this.show();
	var nodeSize = djd43.html.getMarginBox(this.containerNode);
	if (this.positionDirection.indexOf("-up") >= 0) {
		this.containerNode.style.left = 0 + "px";
		this.containerNode.style.top = nodeSize.height + 10 + "px";
	} else {
		if (this.positionDirection.indexOf("-left") >= 0) {
			this.containerNode.style.left = nodeSize.width + 10 + "px";
			this.containerNode.style.top = 0 + "px";
		} else {
			if (this.positionDirection.indexOf("-right") >= 0) {
				this.containerNode.style.left = 0 - nodeSize.width - 10 + "px";
				this.containerNode.style.top = 0 + "px";
			} else {
				if (this.positionDirection.indexOf("-down") >= 0) {
					this.containerNode.style.left = 0 + "px";
					this.containerNode.style.top = 0 - nodeSize.height - 10 + "px";
				} else {
					djd43.raise(this.widgetId + ".positionDirection is an invalid value: " + this.positionDirection);
				}
			}
		}
	}
	this.slideAnim = djd43.lfx.html.slideTo(this.containerNode, {top:0, left:0}, 450, null, djd43.lang.hitch(this, function (nodes, anim) {
		djd43.lang.setTimeout(djd43.lang.hitch(this, function (evt) {
			if (this.bgIframe) {
				this.bgIframe.hide();
			}
			this.fadeAnim = djd43.lfx.html.fadeOut(this.containerNode, 1000, null, djd43.lang.hitch(this, function (evt) {
				this.hide();
			})).play();
		}), delay);
	})).play();
}, _placeClip:function () {
	var scroll = djd43.html.getScroll();
	var view = djd43.html.getViewport();
	var nodeSize = djd43.html.getMarginBox(this.containerNode);
	this.clipNode.style.height = nodeSize.height + "px";
	this.clipNode.style.width = nodeSize.width + "px";
	if (this.positionDirection.match(/^t/)) {
		this.clipNode.style.top = scroll.top + "px";
	} else {
		if (this.positionDirection.match(/^b/)) {
			this.clipNode.style.top = (view.height - nodeSize.height - 2 + scroll.top) + "px";
		}
	}
	if (this.positionDirection.match(/^[tb]r-/)) {
		this.clipNode.style.left = (view.width - nodeSize.width - 1 - scroll.left) + "px";
	} else {
		if (this.positionDirection.match(/^[tb]l-/)) {
			this.clipNode.style.left = 0 + "px";
		}
	}
	this.clipNode.style.clip = "rect(0px, " + nodeSize.width + "px, " + nodeSize.height + "px, 0px)";
	if (djd43.render.html.ie) {
		if (!this.bgIframe) {
			this.bgIframe = new djd43.html.BackgroundIframe(this.containerNode);
			this.bgIframe.setZIndex(this.containerNode);
		}
		this.bgIframe.onResized();
		this.bgIframe.show();
	}
}, onSelect:function (e) {
}, show:function () {
	djd43.widget.Toaster.superclass.show.call(this);
	this._placeClip();
	if (!this._scrollConnected) {
		this._scrollConnected = true;
		djd43.event.connect(window, "onscroll", this, "_placeClip");
	}
}, hide:function () {
	djd43.widget.Toaster.superclass.hide.call(this);
	if (this._scrollConnected) {
		this._scrollConnected = false;
		djd43.event.disconnect(window, "onscroll", this, "_placeClip");
	}
	djd43.html.setOpacity(this.containerNode, 1);
}});

