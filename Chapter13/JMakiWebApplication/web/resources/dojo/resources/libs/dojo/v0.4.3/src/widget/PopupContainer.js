/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.PopupContainer");
djd43.require("djd43.html.style");
djd43.require("djd43.html.layout");
djd43.require("djd43.html.selection");
djd43.require("djd43.html.iframe");
djd43.require("djd43.event.*");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.HtmlWidget");
djd43.declare("djd43.widget.PopupContainerBase", null, function () {
	this.queueOnAnimationFinish = [];
}, {isShowingNow:false, currentSubpopup:null, beginZIndex:1000, parentPopup:null, parent:null, popupIndex:0, aroundBox:djd43.html.boxSizing.BORDER_BOX, openedForWindow:null, processKey:function (evt) {
	return false;
}, applyPopupBasicStyle:function () {
	with (this.domNode.style) {
		display = "none";
		position = "absolute";
	}
}, aboutToShow:function () {
}, open:function (x, y, parent, explodeSrc, orient, padding) {
	if (this.isShowingNow) {
		return;
	}
	if (this.animationInProgress) {
		this.queueOnAnimationFinish.push(this.open, arguments);
		return;
	}
	this.aboutToShow();
	var around = false, node, aroundOrient;
	if (typeof x == "object") {
		node = x;
		aroundOrient = explodeSrc;
		explodeSrc = parent;
		parent = y;
		around = true;
	}
	this.parent = parent;
	djd43.body().appendChild(this.domNode);
	explodeSrc = explodeSrc || parent["domNode"] || [];
	var parentPopup = null;
	this.isTopLevel = true;
	while (parent) {
		if (parent !== this && (parent.setOpenedSubpopup != undefined && parent.applyPopupBasicStyle != undefined)) {
			parentPopup = parent;
			this.isTopLevel = false;
			parentPopup.setOpenedSubpopup(this);
			break;
		}
		parent = parent.parent;
	}
	this.parentPopup = parentPopup;
	this.popupIndex = parentPopup ? parentPopup.popupIndex + 1 : 1;
	if (this.isTopLevel) {
		var button = djd43.html.isNode(explodeSrc) ? explodeSrc : null;
		djd43.widget.PopupManager.opened(this, button);
	}
	if (this.isTopLevel && !djd43.withGlobal(this.openedForWindow || djd43.global(), djd43.html.selection.isCollapsed)) {
		this._bookmark = djd43.withGlobal(this.openedForWindow || djd43.global(), djd43.html.selection.getBookmark);
	} else {
		this._bookmark = null;
	}
	if (explodeSrc instanceof Array) {
		explodeSrc = {left:explodeSrc[0], top:explodeSrc[1], width:0, height:0};
	}
	with (this.domNode.style) {
		display = "";
		zIndex = this.beginZIndex + this.popupIndex;
	}
	if (around) {
		this.move(node, padding, aroundOrient);
	} else {
		this.move(x, y, padding, orient);
	}
	this.domNode.style.display = "none";
	this.explodeSrc = explodeSrc;
	this.show();
	this.isShowingNow = true;
}, move:function (x, y, padding, orient) {
	var around = (typeof x == "object");
	if (around) {
		var aroundOrient = padding;
		var node = x;
		padding = y;
		if (!aroundOrient) {
			aroundOrient = {"BL":"TL", "TL":"BL"};
		}
		djd43.html.placeOnScreenAroundElement(this.domNode, node, padding, this.aroundBox, aroundOrient);
	} else {
		if (!orient) {
			orient = "TL,TR,BL,BR";
		}
		djd43.html.placeOnScreen(this.domNode, x, y, padding, true, orient);
	}
}, close:function (force) {
	if (force) {
		this.domNode.style.display = "none";
	}
	if (this.animationInProgress) {
		this.queueOnAnimationFinish.push(this.close, []);
		return;
	}
	this.closeSubpopup(force);
	this.hide();
	if (this.bgIframe) {
		this.bgIframe.hide();
		this.bgIframe.size({left:0, top:0, width:0, height:0});
	}
	if (this.isTopLevel) {
		djd43.widget.PopupManager.closed(this);
	}
	this.isShowingNow = false;
	if (this.parent) {
		setTimeout(djd43.lang.hitch(this, function () {
			try {
				if (this.parent["focus"]) {
					this.parent.focus();
				} else {
					this.parent.domNode.focus();
				}
			}
			catch (e) {
				djd43.debug("No idea how to focus to parent", e);
			}
		}), 10);
	}
	if (this._bookmark && djd43.withGlobal(this.openedForWindow || djd43.global(), djd43.html.selection.isCollapsed)) {
		if (this.openedForWindow) {
			this.openedForWindow.focus();
		}
		try {
			djd43.withGlobal(this.openedForWindow || djd43.global(), "moveToBookmark", djd43.html.selection, [this._bookmark]);
		}
		catch (e) {
		}
	}
	this._bookmark = null;
}, closeAll:function (force) {
	if (this.parentPopup) {
		this.parentPopup.closeAll(force);
	} else {
		this.close(force);
	}
}, setOpenedSubpopup:function (popup) {
	this.currentSubpopup = popup;
}, closeSubpopup:function (force) {
	if (this.currentSubpopup == null) {
		return;
	}
	this.currentSubpopup.close(force);
	this.currentSubpopup = null;
}, onShow:function () {
	djd43.widget.PopupContainer.superclass.onShow.apply(this, arguments);
	this.openedSize = {w:this.domNode.style.width, h:this.domNode.style.height};
	if (djd43.render.html.ie) {
		if (!this.bgIframe) {
			this.bgIframe = new djd43.html.BackgroundIframe();
			this.bgIframe.setZIndex(this.domNode);
		}
		this.bgIframe.size(this.domNode);
		this.bgIframe.show();
	}
	this.processQueue();
}, processQueue:function () {
	if (!this.queueOnAnimationFinish.length) {
		return;
	}
	var func = this.queueOnAnimationFinish.shift();
	var args = this.queueOnAnimationFinish.shift();
	func.apply(this, args);
}, onHide:function () {
	djd43.widget.HtmlWidget.prototype.onHide.call(this);
	if (this.openedSize) {
		with (this.domNode.style) {
			width = this.openedSize.w;
			height = this.openedSize.h;
		}
	}
	this.processQueue();
}});
djd43.widget.defineWidget("djd43.widget.PopupContainer", [djd43.widget.HtmlWidget, djd43.widget.PopupContainerBase], {isContainer:true, fillInTemplate:function () {
	this.applyPopupBasicStyle();
	djd43.widget.PopupContainer.superclass.fillInTemplate.apply(this, arguments);
}});
djd43.widget.PopupManager = new function () {
	this.currentMenu = null;
	this.currentButton = null;
	this.currentFocusMenu = null;
	this.focusNode = null;
	this.registeredWindows = [];
	this.registerWin = function (win) {
		if (!win.__PopupManagerRegistered) {
			djd43.event.connect(win.document, "onmousedown", this, "onClick");
			djd43.event.connect(win, "onscroll", this, "onClick");
			djd43.event.connect(win.document, "onkey", this, "onKey");
			win.__PopupManagerRegistered = true;
			this.registeredWindows.push(win);
		}
	};
	this.registerAllWindows = function (targetWindow) {
		if (!targetWindow) {
			targetWindow = djd43.html.getDocumentWindow(window.top && window.top.document || window.document);
		}
		this.registerWin(targetWindow);
		for (var i = 0; i < targetWindow.frames.length; i++) {
			try {
				var win = djd43.html.getDocumentWindow(targetWindow.frames[i].document);
				if (win) {
					this.registerAllWindows(win);
				}
			}
			catch (e) {
			}
		}
	};
	this.unRegisterWin = function (win) {
		if (win.__PopupManagerRegistered) {
			djd43.event.disconnect(win.document, "onmousedown", this, "onClick");
			djd43.event.disconnect(win, "onscroll", this, "onClick");
			djd43.event.disconnect(win.document, "onkey", this, "onKey");
			win.__PopupManagerRegistered = false;
		}
	};
	this.unRegisterAllWindows = function () {
		for (var i = 0; i < this.registeredWindows.length; ++i) {
			this.unRegisterWin(this.registeredWindows[i]);
		}
		this.registeredWindows = [];
	};
	djd43.addOnLoad(this, "registerAllWindows");
	djd43.addOnUnload(this, "unRegisterAllWindows");
	this.closed = function (menu) {
		if (this.currentMenu == menu) {
			this.currentMenu = null;
			this.currentButton = null;
			this.currentFocusMenu = null;
		}
	};
	this.opened = function (menu, button) {
		if (menu == this.currentMenu) {
			return;
		}
		if (this.currentMenu) {
			this.currentMenu.close();
		}
		this.currentMenu = menu;
		this.currentFocusMenu = menu;
		this.currentButton = button;
	};
	this.setFocusedMenu = function (menu) {
		this.currentFocusMenu = menu;
	};
	this.onKey = function (e) {
		if (!e.key) {
			return;
		}
		if (!this.currentMenu || !this.currentMenu.isShowingNow) {
			return;
		}
		var m = this.currentFocusMenu;
		while (m) {
			if (m.processKey(e)) {
				e.preventDefault();
				e.stopPropagation();
				break;
			}
			m = m.parentPopup || m.parentMenu;
		}
	}, this.onClick = function (e) {
		if (!this.currentMenu) {
			return;
		}
		var scrolloffset = djd43.html.getScroll().offset;
		var m = this.currentMenu;
		while (m) {
			if (djd43.html.overElement(m.domNode, e) || djd43.html.isDescendantOf(e.target, m.domNode)) {
				return;
			}
			m = m.currentSubpopup;
		}
		if (this.currentButton && djd43.html.overElement(this.currentButton, e)) {
			return;
		}
		this.currentMenu.closeAll(true);
	};
};

