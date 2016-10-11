/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.RealNumberTextbox");
djd43.require("djd43.widget.IntegerTextbox");
djd43.require("djd43.validate.common");
djd43.widget.defineWidget("djd43.widget.RealNumberTextbox", djd43.widget.IntegerTextbox, {mixInProperties:function (localProperties, frag) {
	djd43.widget.RealNumberTextbox.superclass.mixInProperties.apply(this, arguments);
	if (localProperties.places) {
		this.flags.places = Number(localProperties.places);
	}
	if ((localProperties.exponent == "true") || (localProperties.exponent == "always")) {
		this.flags.exponent = true;
	} else {
		if ((localProperties.exponent == "false") || (localProperties.exponent == "never")) {
			this.flags.exponent = false;
		} else {
			this.flags.exponent = [true, false];
		}
	}
	if ((localProperties.esigned == "true") || (localProperties.esigned == "always")) {
		this.flags.eSigned = true;
	} else {
		if ((localProperties.esigned == "false") || (localProperties.esigned == "never")) {
			this.flags.eSigned = false;
		} else {
			this.flags.eSigned = [true, false];
		}
	}
	if (localProperties.min) {
		this.flags.min = parseFloat(localProperties.min);
	}
	if (localProperties.max) {
		this.flags.max = parseFloat(localProperties.max);
	}
}, isValid:function () {
	return djd43.validate.isRealNumber(this.textbox.value, this.flags);
}, isInRange:function () {
	return djd43.validate.isInRange(this.textbox.value, this.flags);
}});

