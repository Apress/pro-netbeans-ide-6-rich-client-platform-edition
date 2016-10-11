/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.validate.us");
djd43.require("djd43.validate.common");
djd43.validate.us.isCurrency = function (value, flags) {
	return djd43.validate.isCurrency(value, flags);
};
djd43.validate.us.isState = function (value, flags) {
	var re = new RegExp("^" + djd43.regexp.us.state(flags) + "$", "i");
	return re.test(value);
};
djd43.validate.us.isPhoneNumber = function (value) {
	var flags = {format:["###-###-####", "(###) ###-####", "(###) ### ####", "###.###.####", "###/###-####", "### ### ####", "###-###-#### x#???", "(###) ###-#### x#???", "(###) ### #### x#???", "###.###.#### x#???", "###/###-#### x#???", "### ### #### x#???", "##########"]};
	return djd43.validate.isNumberFormat(value, flags);
};
djd43.validate.us.isSocialSecurityNumber = function (value) {
	var flags = {format:["###-##-####", "### ## ####", "#########"]};
	return djd43.validate.isNumberFormat(value, flags);
};
djd43.validate.us.isZipCode = function (value) {
	var flags = {format:["#####-####", "##### ####", "#########", "#####"]};
	return djd43.validate.isNumberFormat(value, flags);
};

