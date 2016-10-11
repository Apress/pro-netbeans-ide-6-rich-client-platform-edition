/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.validate.web");
djd43.require("djd43.validate.common");
djd43.validate.isIpAddress = function (value, flags) {
	var re = new RegExp("^" + djd43.regexp.ipAddress(flags) + "$", "i");
	return re.test(value);
};
djd43.validate.isUrl = function (value, flags) {
	var re = new RegExp("^" + djd43.regexp.url(flags) + "$", "i");
	return re.test(value);
};
djd43.validate.isEmailAddress = function (value, flags) {
	var re = new RegExp("^" + djd43.regexp.emailAddress(flags) + "$", "i");
	return re.test(value);
};
djd43.validate.isEmailAddressList = function (value, flags) {
	var re = new RegExp("^" + djd43.regexp.emailAddressList(flags) + "$", "i");
	return re.test(value);
};
djd43.validate.getEmailAddressList = function (value, flags) {
	if (!flags) {
		flags = {};
	}
	if (!flags.listSeparator) {
		flags.listSeparator = "\\s;,";
	}
	if (djd43.validate.isEmailAddressList(value, flags)) {
		return value.split(new RegExp("\\s*[" + flags.listSeparator + "]\\s*"));
	}
	return [];
};

