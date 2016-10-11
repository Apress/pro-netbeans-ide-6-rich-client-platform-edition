/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Button");
djd43.require("djd43.lang.extras");
djd43.require("djd43.html.*");
djd43.require("djd43.html.selection");
djd43.require("djd43.widget.*");
djd43.widget.defineWidget("djd43.widget.Button", djd43.widget.HtmlWidget, {isContainer:true, caption:"", templateString:"<div dojoAttachPoint=\"buttonNode\" class=\"dojoButton\" style=\"position:relative;\" dojoAttachEvent=\"onMouseOver; onMouseOut; onMouseDown; onMouseUp; onClick:buttonClick; onKey:onKey; onFocus;\">\n  <div class=\"dojoButtonContents\" align=center dojoAttachPoint=\"containerNode\" style=\"position:absolute;z-index:2;\"></div>\n  <img dojoAttachPoint=\"leftImage\" style=\"position:absolute;left:0px;\">\n  <img dojoAttachPoint=\"centerImage\" style=\"position:absolute;z-index:1;\">\n  <img dojoAttachPoint=\"rightImage\" style=\"position:absolute;top:0px;right:0px;\">\n</div>\n", templateCssString:"/* ---- button --- */\n.dojoButton {\n\tpadding: 0 0 0 0;\n\tfont-size: 8pt;\n\twhite-space: nowrap;\n\tcursor: pointer;\n\tfont-family: Myriad, Tahoma, Verdana, sans-serif;\n}\n\n.dojoButton .dojoButtonContents {\n\tpadding: 2px 2px 2px 2px;\n\ttext-align: center;\t\t/* if icon and label are split across two lines, center icon */\n\tcolor: white;\n}\n\n.dojoButtonLeftPart .dojoButtonContents {\n\tpadding-right: 8px;\n}\n\n.dojoButtonDisabled {\n\tcursor: url(\"images/no.gif\"), default;\n}\n\n\n.dojoButtonContents img {\n\tvertical-align: middle;\t/* if icon and label are on same line, center them */\n}\n\n/* -------- colors ------------ */\n\n.dojoButtonHover .dojoButtonContents {\n}\n\n.dojoButtonDepressed .dojoButtonContents {\n\tcolor: #293a4b;\n}\n\n.dojoButtonDisabled .dojoButtonContents {\n\tcolor: #aaa;\n}\n\n\n/* ---------- drop down button specific ---------- */\n\n/* border between label and arrow (for drop down buttons */\n.dojoButton .border {\n\twidth: 1px;\n\tbackground: gray;\n}\n\n/* button arrow */\n.dojoButton .downArrow {\n\tpadding-left: 10px;\n\ttext-align: center;\n}\n\n.dojoButton.disabled .downArrow {\n\tcursor : default;\n}\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "templates/ButtonTemplate.css"), inactiveImg:"templates/images/soriaButton-", activeImg:"templates/images/soriaActive-", pressedImg:"templates/images/soriaPressed-", disabledImg:"templates/images/soriaDisabled-", width2height:1 / 3, fillInTemplate:function () {
	if (this.caption) {
		this.containerNode.appendChild(document.createTextNode(this.caption));
	}
	djd43.html.disableSelection(this.containerNode);
}, postCreate:function () {
	this._sizeMyself();
}, _sizeMyself:function () {
	if (this.domNode.parentNode) {
		var placeHolder = document.createElement("span");
		djd43.html.insertBefore(placeHolder, this.domNode);
	}
	djd43.body().appendChild(this.domNode);
	this._sizeMyselfHelper();
	if (placeHolder) {
		djd43.html.insertBefore(this.domNode, placeHolder);
		djd43.html.removeNode(placeHolder);
	}
}, _sizeMyselfHelper:function () {
	var mb = djd43.html.getMarginBox(this.containerNode);
	this.height = mb.height;
	this.containerWidth = mb.width;
	var endWidth = this.height * this.width2height;
	this.containerNode.style.left = endWidth + "px";
	this.leftImage.height = this.rightImage.height = this.centerImage.height = this.height;
	this.leftImage.width = this.rightImage.width = endWidth + 1;
	this.centerImage.width = this.containerWidth;
	this.centerImage.style.left = endWidth + "px";
	this._setImage(this.disabled ? this.disabledImg : this.inactiveImg);
	if (this.disabled) {
		djd43.html.prependClass(this.domNode, "dojoButtonDisabled");
		this.domNode.removeAttribute("tabIndex");
		djd43.widget.wai.setAttr(this.domNode, "waiState", "disabled", true);
	} else {
		djd43.html.removeClass(this.domNode, "dojoButtonDisabled");
		this.domNode.setAttribute("tabIndex", "0");
		djd43.widget.wai.setAttr(this.domNode, "waiState", "disabled", false);
	}
	this.domNode.style.height = this.height + "px";
	this.domNode.style.width = (this.containerWidth + 2 * endWidth) + "px";
}, onMouseOver:function (e) {
	if (this.disabled) {
		return;
	}
	if (!djd43.html.hasClass(this.buttonNode, "dojoButtonHover")) {
		djd43.html.prependClass(this.buttonNode, "dojoButtonHover");
	}
	this._setImage(this.activeImg);
}, onMouseDown:function (e) {
	if (this.disabled) {
		return;
	}
	djd43.html.prependClass(this.buttonNode, "dojoButtonDepressed");
	djd43.html.removeClass(this.buttonNode, "dojoButtonHover");
	this._setImage(this.pressedImg);
}, onMouseUp:function (e) {
	if (this.disabled) {
		return;
	}
	djd43.html.prependClass(this.buttonNode, "dojoButtonHover");
	djd43.html.removeClass(this.buttonNode, "dojoButtonDepressed");
	this._setImage(this.activeImg);
}, onMouseOut:function (e) {
	if (this.disabled) {
		return;
	}
	if (e.toElement && djd43.html.isDescendantOf(e.toElement, this.buttonNode)) {
		return;
	}
	djd43.html.removeClass(this.buttonNode, "dojoButtonHover");
	djd43.html.removeClass(this.buttonNode, "dojoButtonDepressed");
	this._setImage(this.inactiveImg);
}, onKey:function (e) {
	if (!e.key) {
		return;
	}
	var menu = djd43.widget.getWidgetById(this.menuId);
	if (e.key == e.KEY_ENTER || e.key == " ") {
		this.onMouseDown(e);
		this.buttonClick(e);
		djd43.lang.setTimeout(this, "onMouseUp", 75, e);
		djd43.event.browser.stopEvent(e);
	}
	if (menu && menu.isShowingNow && e.key == e.KEY_DOWN_ARROW) {
		djd43.event.disconnect(this.domNode, "onblur", this, "onBlur");
	}
}, onFocus:function (e) {
	var menu = djd43.widget.getWidgetById(this.menuId);
	if (menu) {
		djd43.event.connectOnce(this.domNode, "onblur", this, "onBlur");
	}
}, onBlur:function (e) {
	var menu = djd43.widget.getWidgetById(this.menuId);
	if (!menu) {
		return;
	}
	if (menu.close && menu.isShowingNow) {
		menu.close();
	}
}, buttonClick:function (e) {
	if (!this.disabled) {
		try {
			this.domNode.focus();
		}
		catch (e2) {
		}
		this.onClick(e);
	}
}, onClick:function (e) {
}, _setImage:function (prefix) {
	this.leftImage.src = djd43.uri.moduleUri("djd43.widget", prefix + "l.gif");
	this.centerImage.src = djd43.uri.moduleUri("djd43.widget", prefix + "c.gif");
	this.rightImage.src = djd43.uri.moduleUri("djd43.widget", prefix + "r.gif");
}, _toggleMenu:function (menuId) {
	var menu = djd43.widget.getWidgetById(menuId);
	if (!menu) {
		return;
	}
	if (menu.open && !menu.isShowingNow) {
		var pos = djd43.html.getAbsolutePosition(this.domNode, false);
		menu.open(pos.x, pos.y + this.height, this);
		djd43.event.disconnect(this.domNode, "onblur", this, "onBlur");
	} else {
		if (menu.close && menu.isShowingNow) {
			menu.close();
		} else {
			menu.toggle();
		}
	}
}, setCaption:function (content) {
	this.caption = content;
	this.containerNode.innerHTML = content;
	this._sizeMyself();
}, setDisabled:function (disabled) {
	this.disabled = disabled;
	this._sizeMyself();
}});
djd43.widget.defineWidget("djd43.widget.DropDownButton", djd43.widget.Button, {menuId:"", downArrow:"templates/images/whiteDownArrow.gif", disabledDownArrow:"templates/images/whiteDownArrow.gif", fillInTemplate:function () {
	djd43.widget.DropDownButton.superclass.fillInTemplate.apply(this, arguments);
	this.arrow = document.createElement("img");
	djd43.html.setClass(this.arrow, "downArrow");
	djd43.widget.wai.setAttr(this.domNode, "waiState", "haspopup", this.menuId);
}, _sizeMyselfHelper:function () {
	this.arrow.src = djd43.uri.moduleUri("djd43.widget", this.disabled ? this.disabledDownArrow : this.downArrow);
	this.containerNode.appendChild(this.arrow);
	djd43.widget.DropDownButton.superclass._sizeMyselfHelper.call(this);
}, onClick:function (e) {
	this._toggleMenu(this.menuId);
}});
djd43.widget.defineWidget("djd43.widget.ComboButton", djd43.widget.Button, {menuId:"", templateString:"<div class=\"dojoButton\" style=\"position:relative;top:0px;left:0px; text-align:none;\" dojoAttachEvent=\"onKey;onFocus\">\n\n\t<div dojoAttachPoint=\"buttonNode\" class=\"dojoButtonLeftPart\" style=\"position:absolute;left:0px;top:0px;\"\n\t\tdojoAttachEvent=\"onMouseOver; onMouseOut; onMouseDown; onMouseUp; onClick:buttonClick;\">\n\t\t<div class=\"dojoButtonContents\" dojoAttachPoint=\"containerNode\" style=\"position:absolute;top:0px;right:0px;z-index:2;\"></div>\n\t\t<img dojoAttachPoint=\"leftImage\" style=\"position:absolute;left:0px;top:0px;\">\n\t\t<img dojoAttachPoint=\"centerImage\" style=\"position:absolute;right:0px;top:0px;z-index:1;\">\n\t</div>\n\n\t<div dojoAttachPoint=\"rightPart\" class=\"dojoButtonRightPart\" style=\"position:absolute;top:0px;right:0px;\"\n\t\tdojoAttachEvent=\"onMouseOver:rightOver; onMouseOut:rightOut; onMouseDown:rightDown; onMouseUp:rightUp; onClick:rightClick;\">\n\t\t<img dojoAttachPoint=\"arrowBackgroundImage\" style=\"position:absolute;top:0px;left:0px;z-index:1;\">\n\t\t<img src=\"${dojoWidgetModuleUri}templates/images/whiteDownArrow.gif\"\n\t\t  \t\tstyle=\"z-index:2;position:absolute;left:3px;top:50%;\">\n\t\t<img dojoAttachPoint=\"rightImage\" style=\"position:absolute;top:0px;right:0px;\">\n\t</div>\n\n</div>\n", splitWidth:2, arrowWidth:5, _sizeMyselfHelper:function (e) {
	var mb = djd43.html.getMarginBox(this.containerNode);
	this.height = mb.height;
	this.containerWidth = mb.width;
	var endWidth = this.height / 3;
	if (this.disabled) {
		djd43.widget.wai.setAttr(this.domNode, "waiState", "disabled", true);
		this.domNode.removeAttribute("tabIndex");
	} else {
		djd43.widget.wai.setAttr(this.domNode, "waiState", "disabled", false);
		this.domNode.setAttribute("tabIndex", "0");
	}
	this.leftImage.height = this.rightImage.height = this.centerImage.height = this.arrowBackgroundImage.height = this.height;
	this.leftImage.width = endWidth + 1;
	this.centerImage.width = this.containerWidth;
	this.buttonNode.style.height = this.height + "px";
	this.buttonNode.style.width = endWidth + this.containerWidth + "px";
	this._setImage(this.disabled ? this.disabledImg : this.inactiveImg);
	this.arrowBackgroundImage.width = this.arrowWidth;
	this.rightImage.width = endWidth + 1;
	this.rightPart.style.height = this.height + "px";
	this.rightPart.style.width = this.arrowWidth + endWidth + "px";
	this._setImageR(this.disabled ? this.disabledImg : this.inactiveImg);
	this.domNode.style.height = this.height + "px";
	var totalWidth = this.containerWidth + this.splitWidth + this.arrowWidth + 2 * endWidth;
	this.domNode.style.width = totalWidth + "px";
}, _setImage:function (prefix) {
	this.leftImage.src = djd43.uri.moduleUri("djd43.widget", prefix + "l.gif");
	this.centerImage.src = djd43.uri.moduleUri("djd43.widget", prefix + "c.gif");
}, rightOver:function (e) {
	if (this.disabled) {
		return;
	}
	djd43.html.prependClass(this.rightPart, "dojoButtonHover");
	this._setImageR(this.activeImg);
}, rightDown:function (e) {
	if (this.disabled) {
		return;
	}
	djd43.html.prependClass(this.rightPart, "dojoButtonDepressed");
	djd43.html.removeClass(this.rightPart, "dojoButtonHover");
	this._setImageR(this.pressedImg);
}, rightUp:function (e) {
	if (this.disabled) {
		return;
	}
	djd43.html.prependClass(this.rightPart, "dojoButtonHover");
	djd43.html.removeClass(this.rightPart, "dojoButtonDepressed");
	this._setImageR(this.activeImg);
}, rightOut:function (e) {
	if (this.disabled) {
		return;
	}
	djd43.html.removeClass(this.rightPart, "dojoButtonHover");
	djd43.html.removeClass(this.rightPart, "dojoButtonDepressed");
	this._setImageR(this.inactiveImg);
}, rightClick:function (e) {
	if (this.disabled) {
		return;
	}
	try {
		this.domNode.focus();
	}
	catch (e2) {
	}
	this._toggleMenu(this.menuId);
}, _setImageR:function (prefix) {
	this.arrowBackgroundImage.src = djd43.uri.moduleUri("djd43.widget", prefix + "c.gif");
	this.rightImage.src = djd43.uri.moduleUri("djd43.widget", prefix + "r.gif");
}, onKey:function (e) {
	if (!e.key) {
		return;
	}
	var menu = djd43.widget.getWidgetById(this.menuId);
	if (e.key == e.KEY_ENTER || e.key == " ") {
		this.onMouseDown(e);
		this.buttonClick(e);
		djd43.lang.setTimeout(this, "onMouseUp", 75, e);
		djd43.event.browser.stopEvent(e);
	} else {
		if (e.key == e.KEY_DOWN_ARROW && e.altKey) {
			this.rightDown(e);
			this.rightClick(e);
			djd43.lang.setTimeout(this, "rightUp", 75, e);
			djd43.event.browser.stopEvent(e);
		} else {
			if (menu && menu.isShowingNow && e.key == e.KEY_DOWN_ARROW) {
				djd43.event.disconnect(this.domNode, "onblur", this, "onBlur");
			}
		}
	}
}});

