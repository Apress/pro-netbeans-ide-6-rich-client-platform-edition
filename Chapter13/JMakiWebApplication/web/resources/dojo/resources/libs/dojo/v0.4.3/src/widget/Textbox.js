/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Textbox");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.HtmlWidget");
djd43.require("djd43.widget.Manager");
djd43.require("djd43.widget.Parse");
djd43.require("djd43.xml.Parse");
djd43.require("djd43.lang.array");
djd43.require("djd43.lang.common");
djd43.require("djd43.i18n.common");
djd43.requireLocalization("djd43.widget", "validate", null, "zh-cn,ja,ROOT,fr");
djd43.widget.defineWidget("djd43.widget.Textbox", djd43.widget.HtmlWidget, {className:"", name:"", value:"", type:"", trim:false, uppercase:false, lowercase:false, ucFirst:false, digit:false, htmlfloat:"none", templateString:"<span style='float:${this.htmlfloat};'>\n\t<input dojoAttachPoint='textbox' dojoAttachEvent='onblur;onfocus'\n\t\tid='${this.widgetId}' name='${this.name}'\n\t\tclass='${this.className}' type='${this.type}' >\n</span>\n", textbox:null, fillInTemplate:function () {
	this.textbox.value = this.value;
}, filter:function () {
	if (this.trim) {
		this.textbox.value = this.textbox.value.replace(/(^\s*|\s*$)/g, "");
	}
	if (this.uppercase) {
		this.textbox.value = this.textbox.value.toUpperCase();
	}
	if (this.lowercase) {
		this.textbox.value = this.textbox.value.toLowerCase();
	}
	if (this.ucFirst) {
		this.textbox.value = this.textbox.value.replace(/\b\w+\b/g, function (word) {
			return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
		});
	}
	if (this.digit) {
		this.textbox.value = this.textbox.value.replace(/\D/g, "");
	}
}, onfocus:function () {
}, onblur:function () {
	this.filter();
}, mixInProperties:function (localProperties, frag) {
	djd43.widget.Textbox.superclass.mixInProperties.apply(this, arguments);
	if (localProperties["class"]) {
		this.className = localProperties["class"];
	}
}});

