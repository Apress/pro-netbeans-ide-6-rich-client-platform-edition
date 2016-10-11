/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.RegexpTextbox");
djd43.require("djd43.widget.ValidationTextbox");
djd43.widget.defineWidget("djd43.widget.RegexpTextbox", djd43.widget.ValidationTextbox, {mixInProperties:function (localProperties, frag) {
	djd43.widget.RegexpTextbox.superclass.mixInProperties.apply(this, arguments);
	if (localProperties.regexp) {
		this.flags.regexp = localProperties.regexp;
	}
	if (localProperties.flags) {
		this.flags.flags = localProperties.flags;
	}
}, isValid:function () {
	var regexp = new RegExp(this.flags.regexp, this.flags.flags);
	return regexp.test(this.textbox.value);
}});

