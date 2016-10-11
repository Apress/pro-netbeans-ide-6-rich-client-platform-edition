/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Dialog");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.ContentPane");
djd43.require("djd43.event.*");
djd43.require("djd43.gfx.color");
djd43.require("djd43.html.layout");
djd43.require("djd43.html.display");
djd43.require("djd43.html.iframe");
djd43.declare("djd43.widget.ModalDialogBase", null, {isContainer:true, focusElement:"", bgColor:"black", bgOpacity:0.4, followScroll:true, closeOnBackgroundClick:false, trapTabs:function (e) {
	if (e.target == this.tabStartOuter) {
		if (this._fromTrap) {
			this.tabStart.focus();
			this._fromTrap = false;
		} else {
			this._fromTrap = true;
			this.tabEnd.focus();
		}
	} else {
		if (e.target == this.tabStart) {
			if (this._fromTrap) {
				this._fromTrap = false;
			} else {
				this._fromTrap = true;
				this.tabEnd.focus();
			}
		} else {
			if (e.target == this.tabEndOuter) {
				if (this._fromTrap) {
					this.tabEnd.focus();
					this._fromTrap = false;
				} else {
					this._fromTrap = true;
					this.tabStart.focus();
				}
			} else {
				if (e.target == this.tabEnd) {
					if (this._fromTrap) {
						this._fromTrap = false;
					} else {
						this._fromTrap = true;
						this.tabStart.focus();
					}
				}
			}
		}
	}
}, clearTrap:function (e) {
	var _this = this;
	setTimeout(function () {
		_this._fromTrap = false;
	}, 100);
}, postCreate:function () {
	with (this.domNode.style) {
		position = "absolute";
		zIndex = 999;
		display = "none";
		overflow = "visible";
	}
	var b = djd43.body();
	b.appendChild(this.domNode);
	this.bg = document.createElement("div");
	this.bg.className = "dialogUnderlay";
	with (this.bg.style) {
		position = "absolute";
		left = top = "0px";
		zIndex = 998;
		display = "none";
	}
	b.appendChild(this.bg);
	this.setBackgroundColor(this.bgColor);
	this.bgIframe = new djd43.html.BackgroundIframe();
	if (this.bgIframe.iframe) {
		with (this.bgIframe.iframe.style) {
			position = "absolute";
			left = top = "0px";
			zIndex = 90;
			display = "none";
		}
	}
	if (this.closeOnBackgroundClick) {
		djd43.event.kwConnect({srcObj:this.bg, srcFunc:"onclick", adviceObj:this, adviceFunc:"onBackgroundClick", once:true});
	}
}, uninitialize:function () {
	this.bgIframe.remove();
	djd43.html.removeNode(this.bg, true);
}, setBackgroundColor:function (color) {
	if (arguments.length >= 3) {
		color = new djd43.gfx.color.Color(arguments[0], arguments[1], arguments[2]);
	} else {
		color = new djd43.gfx.color.Color(color);
	}
	this.bg.style.backgroundColor = color.toString();
	return this.bgColor = color;
}, setBackgroundOpacity:function (op) {
	if (arguments.length == 0) {
		op = this.bgOpacity;
	}
	djd43.html.setOpacity(this.bg, op);
	try {
		this.bgOpacity = djd43.html.getOpacity(this.bg);
	}
	catch (e) {
		this.bgOpacity = op;
	}
	return this.bgOpacity;
}, _sizeBackground:function () {
	if (this.bgOpacity > 0) {
		var viewport = djd43.html.getViewport();
		var h = viewport.height;
		var w = viewport.width;
		with (this.bg.style) {
			width = w + "px";
			height = h + "px";
		}
		var scroll_offset = djd43.html.getScroll().offset;
		this.bg.style.top = scroll_offset.y + "px";
		this.bg.style.left = scroll_offset.x + "px";
		var viewport = djd43.html.getViewport();
		if (viewport.width != w) {
			this.bg.style.width = viewport.width + "px";
		}
		if (viewport.height != h) {
			this.bg.style.height = viewport.height + "px";
		}
	}
	this.bgIframe.size(this.bg);
}, _showBackground:function () {
	if (this.bgOpacity > 0) {
		this.bg.style.display = "block";
	}
	if (this.bgIframe.iframe) {
		this.bgIframe.iframe.style.display = "block";
	}
}, placeModalDialog:function () {
	var scroll_offset = djd43.html.getScroll().offset;
	var viewport_size = djd43.html.getViewport();
	var mb;
	if (this.isShowing()) {
		mb = djd43.html.getMarginBox(this.domNode);
	} else {
		djd43.html.setVisibility(this.domNode, false);
		djd43.html.show(this.domNode);
		mb = djd43.html.getMarginBox(this.domNode);
		djd43.html.hide(this.domNode);
		djd43.html.setVisibility(this.domNode, true);
	}
	var x = scroll_offset.x + (viewport_size.width - mb.width) / 2;
	var y = scroll_offset.y + (viewport_size.height - mb.height) / 2;
	with (this.domNode.style) {
		left = x + "px";
		top = y + "px";
	}
}, _onKey:function (evt) {
	if (evt.key) {
		var node = evt.target;
		while (node != null) {
			if (node == this.domNode) {
				return;
			}
			node = node.parentNode;
		}
		if (evt.key != evt.KEY_TAB) {
			djd43.event.browser.stopEvent(evt);
		} else {
			if (!djd43.render.html.opera) {
				try {
					this.tabStart.focus();
				}
				catch (e) {
				}
			}
		}
	}
}, showModalDialog:function () {
	if (this.followScroll && !this._scrollConnected) {
		this._scrollConnected = true;
		djd43.event.connect(window, "onscroll", this, "_onScroll");
	}
	djd43.event.connect(document.documentElement, "onkey", this, "_onKey");
	this.placeModalDialog();
	this.setBackgroundOpacity();
	this._sizeBackground();
	this._showBackground();
	this._fromTrap = true;
	setTimeout(djd43.lang.hitch(this, function () {
		try {
			this.tabStart.focus();
		}
		catch (e) {
		}
	}), 50);
}, hideModalDialog:function () {
	if (this.focusElement) {
		djd43.byId(this.focusElement).focus();
		djd43.byId(this.focusElement).blur();
	}
	this.bg.style.display = "none";
	this.bg.style.width = this.bg.style.height = "1px";
	if (this.bgIframe.iframe) {
		this.bgIframe.iframe.style.display = "none";
	}
	djd43.event.disconnect(document.documentElement, "onkey", this, "_onKey");
	if (this._scrollConnected) {
		this._scrollConnected = false;
		djd43.event.disconnect(window, "onscroll", this, "_onScroll");
	}
}, _onScroll:function () {
	var scroll_offset = djd43.html.getScroll().offset;
	this.bg.style.top = scroll_offset.y + "px";
	this.bg.style.left = scroll_offset.x + "px";
	this.placeModalDialog();
}, checkSize:function () {
	if (this.isShowing()) {
		this._sizeBackground();
		this.placeModalDialog();
		this.onResized();
	}
}, onBackgroundClick:function () {
	if (this.lifetime - this.timeRemaining >= this.blockDuration) {
		return;
	}
	this.hide();
}});
djd43.widget.defineWidget("djd43.widget.Dialog", [djd43.widget.ContentPane, djd43.widget.ModalDialogBase], {templateString:"<div id=\"${this.widgetId}\" class=\"dojoDialog\" dojoattachpoint=\"wrapper\">\n\t<span dojoattachpoint=\"tabStartOuter\" dojoonfocus=\"trapTabs\" dojoonblur=\"clearTrap\"\ttabindex=\"0\"></span>\n\t<span dojoattachpoint=\"tabStart\" dojoonfocus=\"trapTabs\" dojoonblur=\"clearTrap\" tabindex=\"0\"></span>\n\t<div dojoattachpoint=\"containerNode\" style=\"position: relative; z-index: 2;\"></div>\n\t<span dojoattachpoint=\"tabEnd\" dojoonfocus=\"trapTabs\" dojoonblur=\"clearTrap\" tabindex=\"0\"></span>\n\t<span dojoattachpoint=\"tabEndOuter\" dojoonfocus=\"trapTabs\" dojoonblur=\"clearTrap\" tabindex=\"0\"></span>\n</div>\n", blockDuration:0, lifetime:0, closeNode:"", postMixInProperties:function () {
	djd43.widget.Dialog.superclass.postMixInProperties.apply(this, arguments);
	if (this.closeNode) {
		this.setCloseControl(this.closeNode);
	}
}, postCreate:function () {
	djd43.widget.Dialog.superclass.postCreate.apply(this, arguments);
	djd43.widget.ModalDialogBase.prototype.postCreate.apply(this, arguments);
}, show:function () {
	if (this.lifetime) {
		this.timeRemaining = this.lifetime;
		if (this.timerNode) {
			this.timerNode.innerHTML = Math.ceil(this.timeRemaining / 1000);
		}
		if (this.blockDuration && this.closeNode) {
			if (this.lifetime > this.blockDuration) {
				this.closeNode.style.visibility = "hidden";
			} else {
				this.closeNode.style.display = "none";
			}
		}
		if (this.timer) {
			clearInterval(this.timer);
		}
		this.timer = setInterval(djd43.lang.hitch(this, "_onTick"), 100);
	}
	this.showModalDialog();
	djd43.widget.Dialog.superclass.show.call(this);
}, onLoad:function () {
	this.placeModalDialog();
	djd43.widget.Dialog.superclass.onLoad.call(this);
}, fillInTemplate:function () {
}, hide:function () {
	this.hideModalDialog();
	djd43.widget.Dialog.superclass.hide.call(this);
	if (this.timer) {
		clearInterval(this.timer);
	}
}, setTimerNode:function (node) {
	this.timerNode = node;
}, setCloseControl:function (node) {
	this.closeNode = djd43.byId(node);
	djd43.event.connect(this.closeNode, "onclick", this, "hide");
}, setShowControl:function (node) {
	node = djd43.byId(node);
	djd43.event.connect(node, "onclick", this, "show");
}, _onTick:function () {
	if (this.timer) {
		this.timeRemaining -= 100;
		if (this.lifetime - this.timeRemaining >= this.blockDuration) {
			if (this.closeNode) {
				this.closeNode.style.visibility = "visible";
			}
		}
		if (!this.timeRemaining) {
			clearInterval(this.timer);
			this.hide();
		} else {
			if (this.timerNode) {
				this.timerNode.innerHTML = Math.ceil(this.timeRemaining / 1000);
			}
		}
	}
}});

