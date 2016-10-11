/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.ValidationTextbox");
djd43.require("djd43.widget.Textbox");
djd43.require("djd43.i18n.common");
djd43.widget.defineWidget("djd43.widget.ValidationTextbox", djd43.widget.Textbox, function () {
	this.flags = {};
}, {required:false, rangeClass:"range", invalidClass:"invalid", missingClass:"missing", classPrefix:"dojoValidate", size:"", maxlength:"", promptMessage:"", invalidMessage:"", missingMessage:"", rangeMessage:"", listenOnKeyPress:true, htmlfloat:"none", lastCheckedValue:null, templateString:"<span style='float:${this.htmlfloat};'>\n\t<input dojoAttachPoint='textbox' type='${this.type}' dojoAttachEvent='onblur;onfocus;onkeyup'\n\t\tid='${this.widgetId}' name='${this.name}' size='${this.size}' maxlength='${this.maxlength}'\n\t\tclass='${this.className}' style=''>\n\t<span dojoAttachPoint='invalidSpan' class='${this.invalidClass}'>${this.messages.invalidMessage}</span>\n\t<span dojoAttachPoint='missingSpan' class='${this.missingClass}'>${this.messages.missingMessage}</span>\n\t<span dojoAttachPoint='rangeSpan' class='${this.rangeClass}'>${this.messages.rangeMessage}</span>\n</span>\n", templateCssString:".dojoValidateEmpty{\n\tbackground-color: #00FFFF;\n}\n.dojoValidateValid{\n\tbackground-color: #cfc;\n}\n.dojoValidateInvalid{\n\tbackground-color: #fcc;\n}\n.dojoValidateRange{\n\tbackground-color: #ccf;\n}\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "templates/Validate.css"), invalidSpan:null, missingSpan:null, rangeSpan:null, getValue:function () {
	return this.textbox.value;
}, setValue:function (value) {
	this.textbox.value = value;
	this.update();
}, isValid:function () {
	return true;
}, isInRange:function () {
	return true;
}, isEmpty:function () {
	return (/^\s*$/.test(this.textbox.value));
}, isMissing:function () {
	return (this.required && this.isEmpty());
}, update:function () {
	this.lastCheckedValue = this.textbox.value;
	this.missingSpan.style.display = "none";
	this.invalidSpan.style.display = "none";
	this.rangeSpan.style.display = "none";
	var empty = this.isEmpty();
	var valid = true;
	if (this.promptMessage != this.textbox.value) {
		valid = this.isValid();
	}
	var missing = this.isMissing();
	if (missing) {
		this.missingSpan.style.display = "";
	} else {
		if (!empty && !valid) {
			this.invalidSpan.style.display = "";
		} else {
			if (!empty && !this.isInRange()) {
				this.rangeSpan.style.display = "";
			}
		}
	}
	this.highlight();
}, updateClass:function (className) {
	var pre = this.classPrefix;
	djd43.html.removeClass(this.textbox, pre + "Empty");
	djd43.html.removeClass(this.textbox, pre + "Valid");
	djd43.html.removeClass(this.textbox, pre + "Invalid");
	djd43.html.addClass(this.textbox, pre + className);
}, highlight:function () {
	if (this.isEmpty()) {
		this.updateClass("Empty");
	} else {
		if (this.isValid() && this.isInRange()) {
			this.updateClass("Valid");
		} else {
			if (this.textbox.value != this.promptMessage) {
				this.updateClass("Invalid");
			} else {
				this.updateClass("Empty");
			}
		}
	}
}, onfocus:function (evt) {
	if (!this.listenOnKeyPress) {
		this.updateClass("Empty");
	}
}, onblur:function (evt) {
	this.filter();
	this.update();
}, onkeyup:function (evt) {
	if (this.listenOnKeyPress) {
		this.update();
	} else {
		if (this.textbox.value != this.lastCheckedValue) {
			this.updateClass("Empty");
		}
	}
}, postMixInProperties:function (localProperties, frag) {
	djd43.widget.ValidationTextbox.superclass.postMixInProperties.apply(this, arguments);
	this.messages = djd43.i18n.getLocalization("djd43.widget", "validate", this.lang);
	djd43.lang.forEach(["invalidMessage", "missingMessage", "rangeMessage"], function (prop) {
		if (this[prop]) {
			this.messages[prop] = this[prop];
		}
	}, this);
}, fillInTemplate:function () {
	djd43.widget.ValidationTextbox.superclass.fillInTemplate.apply(this, arguments);
	this.textbox.isValid = function () {
		this.isValid.call(this);
	};
	this.textbox.isMissing = function () {
		this.isMissing.call(this);
	};
	this.textbox.isInRange = function () {
		this.isInRange.call(this);
	};
	djd43.html.setClass(this.invalidSpan, this.invalidClass);
	this.update();
	this.filter();
	if (djd43.render.html.ie) {
		djd43.html.addClass(this.domNode, "ie");
	}
	if (djd43.render.html.moz) {
		djd43.html.addClass(this.domNode, "moz");
	}
	if (djd43.render.html.opera) {
		djd43.html.addClass(this.domNode, "opera");
	}
	if (djd43.render.html.safari) {
		djd43.html.addClass(this.domNode, "safari");
	}
}});

