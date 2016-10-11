/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.DateTextbox");
djd43.require("djd43.widget.ValidationTextbox");
djd43.require("djd43.date.format");
djd43.require("djd43.validate.datetime");
djd43.widget.defineWidget("djd43.widget.DateTextbox", djd43.widget.ValidationTextbox, {displayFormat:"", formatLength:"short", mixInProperties:function (localProperties) {
	djd43.widget.DateTextbox.superclass.mixInProperties.apply(this, arguments);
	if (localProperties.format) {
		this.flags.format = localProperties.format;
	}
}, isValid:function () {
	if (this.flags.format) {
		djd43.deprecated("djd43.widget.DateTextbox", "format attribute is deprecated; use displayFormat or formatLength instead", "0.5");
		return djd43.validate.isValidDate(this.textbox.value, this.flags.format);
	}
	return djd43.date.parse(this.textbox.value, {formatLength:this.formatLength, selector:"dateOnly", locale:this.lang, datePattern:this.displayFormat});
}});
djd43.widget.defineWidget("djd43.widget.TimeTextbox", djd43.widget.ValidationTextbox, {displayFormat:"", formatLength:"short", mixInProperties:function (localProperties) {
	djd43.widget.TimeTextbox.superclass.mixInProperties.apply(this, arguments);
	if (localProperties.format) {
		this.flags.format = localProperties.format;
	}
	if (localProperties.amsymbol) {
		this.flags.amSymbol = localProperties.amsymbol;
	}
	if (localProperties.pmsymbol) {
		this.flags.pmSymbol = localProperties.pmsymbol;
	}
}, isValid:function () {
	if (this.flags.format) {
		djd43.deprecated("djd43.widget.TimeTextbox", "format attribute is deprecated; use displayFormat or formatLength instead", "0.5");
		return djd43.validate.isValidTime(this.textbox.value, this.flags);
	}
	return djd43.date.parse(this.textbox.value, {formatLength:this.formatLength, selector:"timeOnly", locale:this.lang, timePattern:this.displayFormat});
}});

