/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.string.common");
djd43.string.trim = function (str, wh) {
	if (!str.replace) {
		return str;
	}
	if (!str.length) {
		return str;
	}
	var re = (wh > 0) ? (/^\s+/) : (wh < 0) ? (/\s+$/) : (/^\s+|\s+$/g);
	return str.replace(re, "");
};
djd43.string.trimStart = function (str) {
	return djd43.string.trim(str, 1);
};
djd43.string.trimEnd = function (str) {
	return djd43.string.trim(str, -1);
};
djd43.string.repeat = function (str, count, separator) {
	var out = "";
	for (var i = 0; i < count; i++) {
		out += str;
		if (separator && i < count - 1) {
			out += separator;
		}
	}
	return out;
};
djd43.string.pad = function (str, len, c, dir) {
	var out = String(str);
	if (!c) {
		c = "0";
	}
	if (!dir) {
		dir = 1;
	}
	while (out.length < len) {
		if (dir > 0) {
			out = c + out;
		} else {
			out += c;
		}
	}
	return out;
};
djd43.string.padLeft = function (str, len, c) {
	return djd43.string.pad(str, len, c, 1);
};
djd43.string.padRight = function (str, len, c) {
	return djd43.string.pad(str, len, c, -1);
};

