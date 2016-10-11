/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.string.extras");
djd43.require("djd43.string.common");
djd43.require("djd43.lang.common");
djd43.require("djd43.lang.array");
djd43.string.substituteParams = function (template, hash) {
	var map = (typeof hash == "object") ? hash : djd43.lang.toArray(arguments, 1);
	return template.replace(/\%\{(\w+)\}/g, function (match, key) {
		if (typeof (map[key]) != "undefined" && map[key] != null) {
			return map[key];
		}
		djd43.raise("Substitution not found: " + key);
	});
};
djd43.string.capitalize = function (str) {
	if (!djd43.lang.isString(str)) {
		return "";
	}
	if (arguments.length == 0) {
		str = this;
	}
	var words = str.split(" ");
	for (var i = 0; i < words.length; i++) {
		words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
	}
	return words.join(" ");
};
djd43.string.isBlank = function (str) {
	if (!djd43.lang.isString(str)) {
		return true;
	}
	return (djd43.string.trim(str).length == 0);
};
djd43.string.encodeAscii = function (str) {
	if (!djd43.lang.isString(str)) {
		return str;
	}
	var ret = "";
	var value = escape(str);
	var match, re = /%u([0-9A-F]{4})/i;
	while ((match = value.match(re))) {
		var num = Number("0x" + match[1]);
		var newVal = escape("&#" + num + ";");
		ret += value.substring(0, match.index) + newVal;
		value = value.substring(match.index + match[0].length);
	}
	ret += value.replace(/\+/g, "%2B");
	return ret;
};
djd43.string.escape = function (type, str) {
	var args = djd43.lang.toArray(arguments, 1);
	switch (type.toLowerCase()) {
	  case "xml":
	  case "html":
	  case "xhtml":
		return djd43.string.escapeXml.apply(this, args);
	  case "sql":
		return djd43.string.escapeSql.apply(this, args);
	  case "regexp":
	  case "regex":
		return djd43.string.escapeRegExp.apply(this, args);
	  case "javascript":
	  case "jscript":
	  case "js":
		return djd43.string.escapeJavaScript.apply(this, args);
	  case "ascii":
		return djd43.string.encodeAscii.apply(this, args);
	  default:
		return str;
	}
};
djd43.string.escapeXml = function (str, noSingleQuotes) {
	str = str.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;").replace(/"/gm, "&quot;");
	if (!noSingleQuotes) {
		str = str.replace(/'/gm, "&#39;");
	}
	return str;
};
djd43.string.escapeSql = function (str) {
	return str.replace(/'/gm, "''");
};
djd43.string.escapeRegExp = function (str) {
	return str.replace(/\\/gm, "\\\\").replace(/([\f\b\n\t\r[\^$|?*+(){}])/gm, "\\$1");
};
djd43.string.escapeJavaScript = function (str) {
	return str.replace(/(["'\f\b\n\t\r])/gm, "\\$1");
};
djd43.string.escapeString = function (str) {
	return ("\"" + str.replace(/(["\\])/g, "\\$1") + "\"").replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r");
};
djd43.string.summary = function (str, len) {
	if (!len || str.length <= len) {
		return str;
	}
	return str.substring(0, len).replace(/\.+$/, "") + "...";
};
djd43.string.endsWith = function (str, end, ignoreCase) {
	if (ignoreCase) {
		str = str.toLowerCase();
		end = end.toLowerCase();
	}
	if ((str.length - end.length) < 0) {
		return false;
	}
	return str.lastIndexOf(end) == str.length - end.length;
};
djd43.string.endsWithAny = function (str) {
	for (var i = 1; i < arguments.length; i++) {
		if (djd43.string.endsWith(str, arguments[i])) {
			return true;
		}
	}
	return false;
};
djd43.string.startsWith = function (str, start, ignoreCase) {
	if (ignoreCase) {
		str = str.toLowerCase();
		start = start.toLowerCase();
	}
	return str.indexOf(start) == 0;
};
djd43.string.startsWithAny = function (str) {
	for (var i = 1; i < arguments.length; i++) {
		if (djd43.string.startsWith(str, arguments[i])) {
			return true;
		}
	}
	return false;
};
djd43.string.has = function (str) {
	for (var i = 1; i < arguments.length; i++) {
		if (str.indexOf(arguments[i]) > -1) {
			return true;
		}
	}
	return false;
};
djd43.string.normalizeNewlines = function (text, newlineChar) {
	if (newlineChar == "\n") {
		text = text.replace(/\r\n/g, "\n");
		text = text.replace(/\r/g, "\n");
	} else {
		if (newlineChar == "\r") {
			text = text.replace(/\r\n/g, "\r");
			text = text.replace(/\n/g, "\r");
		} else {
			text = text.replace(/([^\r])\n/g, "$1\r\n").replace(/\r([^\n])/g, "\r\n$1");
		}
	}
	return text;
};
djd43.string.splitEscaped = function (str, charac) {
	var components = [];
	for (var i = 0, prevcomma = 0; i < str.length; i++) {
		if (str.charAt(i) == "\\") {
			i++;
			continue;
		}
		if (str.charAt(i) == charac) {
			components.push(str.substring(prevcomma, i));
			prevcomma = i + 1;
		}
	}
	components.push(str.substr(prevcomma));
	return components;
};

