/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.validate.jp");
djd43.require("djd43.validate.common");
djd43.validate.isJapaneseCurrency = function (value) {
	var flags = {symbol:"\xa5", fractional:false};
	return djd43.validate.isCurrency(value, flags);
};

