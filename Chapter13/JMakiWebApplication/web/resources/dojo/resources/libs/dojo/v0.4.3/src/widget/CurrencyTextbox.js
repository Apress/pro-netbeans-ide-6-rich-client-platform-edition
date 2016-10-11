/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.CurrencyTextbox");
djd43.require("djd43.widget.IntegerTextbox");
djd43.require("djd43.validate.common");
djd43.widget.defineWidget("djd43.widget.CurrencyTextbox", djd43.widget.IntegerTextbox, {mixInProperties:function (localProperties, frag) {
	djd43.widget.CurrencyTextbox.superclass.mixInProperties.apply(this, arguments);
	if (localProperties.fractional) {
		this.flags.fractional = (localProperties.fractional == "true");
	} else {
		if (localProperties.cents) {
			djd43.deprecated("djd43.widget.IntegerTextbox", "use fractional attr instead of cents", "0.5");
			this.flags.fractional = (localProperties.cents == "true");
		}
	}
	if (localProperties.symbol) {
		this.flags.symbol = localProperties.symbol;
	}
	if (localProperties.min) {
		this.flags.min = parseFloat(localProperties.min);
	}
	if (localProperties.max) {
		this.flags.max = parseFloat(localProperties.max);
	}
}, isValid:function () {
	return djd43.validate.isCurrency(this.textbox.value, this.flags);
}, isInRange:function () {
	return djd43.validate.isInRange(this.textbox.value, this.flags);
}});

