/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.DropdownContainer");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.HtmlWidget");
djd43.require("djd43.widget.PopupContainer");
djd43.require("djd43.event.*");
djd43.require("djd43.html.layout");
djd43.require("djd43.html.display");
djd43.require("djd43.html.iframe");
djd43.require("djd43.html.util");
djd43.widget.defineWidget("djd43.widget.DropdownContainer", djd43.widget.HtmlWidget, {inputWidth:"7em", id:"", inputId:"", inputName:"", iconURL:djd43.uri.moduleUri("djd43.widget", "templates/images/combo_box_arrow.png"), copyClasses:false, iconAlt:"", containerToggle:"plain", containerToggleDuration:150, templateString:"<span style=\"white-space:nowrap\"><input type=\"hidden\" name=\"\" value=\"\" dojoAttachPoint=\"valueNode\" /><input name=\"\" type=\"text\" value=\"\" style=\"vertical-align:middle;\" dojoAttachPoint=\"inputNode\" autocomplete=\"off\" /> <img src=\"${this.iconURL}\" alt=\"${this.iconAlt}\" dojoAttachEvent=\"onclick:onIconClick\" dojoAttachPoint=\"buttonNode\" style=\"vertical-align:middle; cursor:pointer; cursor:hand\" /></span>", templateCssPath:"", isContainer:true, attachTemplateNodes:function () {
	djd43.widget.DropdownContainer.superclass.attachTemplateNodes.apply(this, arguments);
	this.popup = djd43.widget.createWidget("PopupContainer", {toggle:this.containerToggle, toggleDuration:this.containerToggleDuration});
	this.containerNode = this.popup.domNode;
}, fillInTemplate:function (args, frag) {
	this.domNode.appendChild(this.popup.domNode);
	if (this.id) {
		this.domNode.id = this.id;
	}
	if (this.inputId) {
		this.inputNode.id = this.inputId;
	}
	if (this.inputName) {
		this.inputNode.name = this.inputName;
	}
	this.inputNode.style.width = this.inputWidth;
	this.inputNode.disabled = this.disabled;
	if (this.copyClasses) {
		this.inputNode.style = "";
		this.inputNode.className = this.getFragNodeRef(frag).className;
	}
	djd43.event.connect(this.inputNode, "onchange", this, "onInputChange");
}, onIconClick:function (evt) {
	if (this.disabled) {
		return;
	}
	if (!this.popup.isShowingNow) {
		this.popup.open(this.inputNode, this, this.buttonNode);
	} else {
		this.popup.close();
	}
}, hideContainer:function () {
	if (this.popup.isShowingNow) {
		this.popup.close();
	}
}, onInputChange:function () {
}, enable:function () {
	this.inputNode.disabled = false;
	djd43.widget.DropdownContainer.superclass.enable.apply(this, arguments);
}, disable:function () {
	this.inputNode.disabled = true;
	djd43.widget.DropdownContainer.superclass.disable.apply(this, arguments);
}});

