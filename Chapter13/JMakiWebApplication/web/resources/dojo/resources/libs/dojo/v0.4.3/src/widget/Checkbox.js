/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Checkbox");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.HtmlWidget");
djd43.require("djd43.event.*");
djd43.require("djd43.html.style");
djd43.require("djd43.html.selection");
djd43.widget.defineWidget("djd43.widget.Checkbox", djd43.widget.HtmlWidget, {templateString:"<span style=\"display: inline-block;\" tabIndex=\"${this.tabIndex}\" waiRole=\"checkbox\" id=\"${this.id}\">\n\t<img dojoAttachPoint=\"imageNode\" class=\"dojoHtmlCheckbox\" src=\"${dojoWidgetModuleUri}templates/images/blank.gif\" alt=\"\" />\n\t<input type=\"checkbox\" name=\"${this.name}\" style=\"display: none\" value=\"${this.value}\"\n\t\tdojoAttachPoint=\"inputNode\">\n</span>\n", templateCssString:".dojoHtmlCheckbox {\n\tborder: 0px;\n\twidth: 16px;\n\theight: 16px;\n\tmargin: 2px;\n\tvertical-align: middle;\n}\n\n.dojoHtmlCheckboxOn {\n\tbackground: url(check.gif) 0px 0px;\n}\n.dojoHtmlCheckboxOff {\n\tbackground: url(check.gif) -16px 0px;\n}\n.dojoHtmlCheckboxDisabledOn {\n\tbackground: url(check.gif) -32px 0px;\n}\n.dojoHtmlCheckboxDisabledOff {\n\tbackground: url(check.gif) -48px 0px;\n}\n.dojoHtmlCheckboxOnHover {\n\tbackground: url(check.gif) -64px 0px;\n}\n.dojoHtmlCheckboxOffHover {\n\tbackground: url(check.gif) -80px 0px;\n}\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "templates/Checkbox.css"), name:"", id:"", checked:false, tabIndex:"", value:"on", postMixInProperties:function () {
	djd43.widget.Checkbox.superclass.postMixInProperties.apply(this, arguments);
	if (!this.disabled && this.tabIndex == "") {
		this.tabIndex = "0";
	}
}, fillInTemplate:function () {
	this._setInfo();
}, postCreate:function () {
	var notcon = true;
	this.id = this.id != "" ? this.id : this.widgetId;
	if (this.id != "") {
		var labels = document.getElementsByTagName("label");
		if (labels != null && labels.length > 0) {
			for (var i = 0; i < labels.length; i++) {
				if (labels[i].htmlFor == this.id) {
					labels[i].id = (labels[i].htmlFor + "label");
					this._connectEvents(labels[i]);
					djd43.widget.wai.setAttr(this.domNode, "waiState", "labelledby", labels[i].id);
					break;
				}
			}
		}
	}
	this._connectEvents(this.domNode);
	this.inputNode.checked = this.checked;
}, _connectEvents:function (node) {
	djd43.event.connect(node, "onmouseover", this, "mouseOver");
	djd43.event.connect(node, "onmouseout", this, "mouseOut");
	djd43.event.connect(node, "onkey", this, "onKey");
	djd43.event.connect(node, "onclick", this, "_onClick");
	djd43.html.disableSelection(node);
}, _onClick:function (e) {
	if (this.disabled == false) {
		this.checked = !this.checked;
		this._setInfo();
	}
	e.preventDefault();
	e.stopPropagation();
	this.onClick();
}, setValue:function (bool) {
	if (this.disabled == false) {
		this.checked = bool;
		this._setInfo();
	}
}, onClick:function () {
}, onKey:function (e) {
	var k = djd43.event.browser.keys;
	if (e.key == " ") {
		this._onClick(e);
	}
}, mouseOver:function (e) {
	this._hover(e, true);
}, mouseOut:function (e) {
	this._hover(e, false);
}, _hover:function (e, isOver) {
	if (this.disabled == false) {
		var state = this.checked ? "On" : "Off";
		var style = "dojoHtmlCheckbox" + state + "Hover";
		if (isOver) {
			djd43.html.addClass(this.imageNode, style);
		} else {
			djd43.html.removeClass(this.imageNode, style);
		}
	}
}, _setInfo:function () {
	var state = "dojoHtmlCheckbox" + (this.disabled ? "Disabled" : "") + (this.checked ? "On" : "Off");
	djd43.html.setClass(this.imageNode, "dojoHtmlCheckbox " + state);
	this.inputNode.checked = this.checked;
	if (this.disabled) {
		this.inputNode.setAttribute("disabled", true);
	} else {
		this.inputNode.removeAttribute("disabled");
	}
	djd43.widget.wai.setAttr(this.domNode, "waiState", "checked", this.checked);
}});
djd43.widget.defineWidget("djd43.widget.a11y.Checkbox", djd43.widget.Checkbox, {templateString:"<span class='dojoHtmlCheckbox'>\n\t<input type=\"checkbox\" name=\"${this.name}\" tabIndex=\"${this.tabIndex}\" id=\"${this.id}\" value=\"${this.value}\"\n\t\t dojoAttachEvent=\"onClick: _onClick;\" dojoAttachPoint=\"inputNode\"> \n</span>\n", fillInTemplate:function () {
}, postCreate:function (args, frag) {
	this.inputNode.checked = this.checked;
	if (this.disabled) {
		this.inputNode.setAttribute("disabled", true);
	}
}, _onClick:function () {
	this.onClick();
}});

