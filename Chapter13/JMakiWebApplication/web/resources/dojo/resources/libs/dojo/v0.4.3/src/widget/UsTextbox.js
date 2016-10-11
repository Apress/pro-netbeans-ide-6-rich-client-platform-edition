/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.UsTextbox");
djd43.require("djd43.widget.ValidationTextbox");
djd43.require("djd43.validate.us");
djd43.widget.defineWidget("djd43.widget.UsStateTextbox", djd43.widget.ValidationTextbox, {mixInProperties:function (localProperties) {
	djd43.widget.UsStateTextbox.superclass.mixInProperties.apply(this, arguments);
	if (localProperties.allowterritories) {
		this.flags.allowTerritories = (localProperties.allowterritories == "true");
	}
	if (localProperties.allowmilitary) {
		this.flags.allowMilitary = (localProperties.allowmilitary == "true");
	}
}, isValid:function () {
	return djd43.validate.us.isState(this.textbox.value, this.flags);
}});
djd43.widget.defineWidget("djd43.widget.UsZipTextbox", djd43.widget.ValidationTextbox, {isValid:function () {
	return djd43.validate.us.isZipCode(this.textbox.value);
}});
djd43.widget.defineWidget("djd43.widget.UsSocialSecurityNumberTextbox", djd43.widget.ValidationTextbox, {isValid:function () {
	return djd43.validate.us.isSocialSecurityNumber(this.textbox.value);
}});
djd43.widget.defineWidget("djd43.widget.UsPhoneNumberTextbox", djd43.widget.ValidationTextbox, {isValid:function () {
	return djd43.validate.us.isPhoneNumber(this.textbox.value);
}});

