/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.lang.assert");
djd43.require("djd43.lang.common");
djd43.require("djd43.lang.array");
djd43.require("djd43.lang.type");
djd43.lang.assert = function (booleanValue, message) {
	if (!booleanValue) {
		var errorMessage = "An assert statement failed.\n" + "The method djd43.lang.assert() was called with a 'false' value.\n";
		if (message) {
			errorMessage += "Here's the assert message:\n" + message + "\n";
		}
		throw new Error(errorMessage);
	}
};
djd43.lang.assertType = function (value, type, keywordParameters) {
	if (djd43.lang.isString(keywordParameters)) {
		djd43.deprecated("djd43.lang.assertType(value, type, \"message\")", "use djd43.lang.assertType(value, type) instead", "0.5");
	}
	if (!djd43.lang.isOfType(value, type, keywordParameters)) {
		if (!djd43.lang.assertType._errorMessage) {
			djd43.lang.assertType._errorMessage = "Type mismatch: djd43.lang.assertType() failed.";
		}
		djd43.lang.assert(false, djd43.lang.assertType._errorMessage);
	}
};
djd43.lang.assertValidKeywords = function (object, expectedProperties, message) {
	var key;
	if (!message) {
		if (!djd43.lang.assertValidKeywords._errorMessage) {
			djd43.lang.assertValidKeywords._errorMessage = "In djd43.lang.assertValidKeywords(), found invalid keyword:";
		}
		message = djd43.lang.assertValidKeywords._errorMessage;
	}
	if (djd43.lang.isArray(expectedProperties)) {
		for (key in object) {
			if (!djd43.lang.inArray(expectedProperties, key)) {
				djd43.lang.assert(false, message + " " + key);
			}
		}
	} else {
		for (key in object) {
			if (!(key in expectedProperties)) {
				djd43.lang.assert(false, message + " " + key);
			}
		}
	}
};

