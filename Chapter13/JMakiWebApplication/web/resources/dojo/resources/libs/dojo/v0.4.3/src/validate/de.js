/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.validate.de");
djd43.require("djd43.validate.common");
djd43.validate.isGermanCurrency = function (value) {
	var flags = {symbol:"\u20ac", placement:"after", signPlacement:"begin", decimal:",", separator:"."};
	return djd43.validate.isCurrency(value, flags);
};

