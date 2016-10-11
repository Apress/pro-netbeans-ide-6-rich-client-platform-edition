/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.lang.type");
djd43.require("djd43.lang.common");
djd43.lang.whatAmI = function (value) {
	djd43.deprecated("djd43.lang.whatAmI", "use djd43.lang.getType instead", "0.5");
	return djd43.lang.getType(value);
};
djd43.lang.whatAmI.custom = {};
djd43.lang.getType = function (value) {
	try {
		if (djd43.lang.isArray(value)) {
			return "array";
		}
		if (djd43.lang.isFunction(value)) {
			return "function";
		}
		if (djd43.lang.isString(value)) {
			return "string";
		}
		if (djd43.lang.isNumber(value)) {
			return "number";
		}
		if (djd43.lang.isBoolean(value)) {
			return "boolean";
		}
		if (djd43.lang.isAlien(value)) {
			return "alien";
		}
		if (djd43.lang.isUndefined(value)) {
			return "undefined";
		}
		for (var name in djd43.lang.whatAmI.custom) {
			if (djd43.lang.whatAmI.custom[name](value)) {
				return name;
			}
		}
		if (djd43.lang.isObject(value)) {
			return "object";
		}
	}
	catch (e) {
	}
	return "unknown";
};
djd43.lang.isNumeric = function (value) {
	return (!isNaN(value) && isFinite(value) && (value != null) && !djd43.lang.isBoolean(value) && !djd43.lang.isArray(value) && !/^\s*$/.test(value));
};
djd43.lang.isBuiltIn = function (value) {
	return (djd43.lang.isArray(value) || djd43.lang.isFunction(value) || djd43.lang.isString(value) || djd43.lang.isNumber(value) || djd43.lang.isBoolean(value) || (value == null) || (value instanceof Error) || (typeof value == "error"));
};
djd43.lang.isPureObject = function (value) {
	return ((value != null) && djd43.lang.isObject(value) && value.constructor == Object);
};
djd43.lang.isOfType = function (value, type, keywordParameters) {
	var optional = false;
	if (keywordParameters) {
		optional = keywordParameters["optional"];
	}
	if (optional && ((value === null) || djd43.lang.isUndefined(value))) {
		return true;
	}
	if (djd43.lang.isArray(type)) {
		var arrayOfTypes = type;
		for (var i in arrayOfTypes) {
			var aType = arrayOfTypes[i];
			if (djd43.lang.isOfType(value, aType)) {
				return true;
			}
		}
		return false;
	} else {
		if (djd43.lang.isString(type)) {
			type = type.toLowerCase();
		}
		switch (type) {
		  case Array:
		  case "array":
			return djd43.lang.isArray(value);
		  case Function:
		  case "function":
			return djd43.lang.isFunction(value);
		  case String:
		  case "string":
			return djd43.lang.isString(value);
		  case Number:
		  case "number":
			return djd43.lang.isNumber(value);
		  case "numeric":
			return djd43.lang.isNumeric(value);
		  case Boolean:
		  case "boolean":
			return djd43.lang.isBoolean(value);
		  case Object:
		  case "object":
			return djd43.lang.isObject(value);
		  case "pureobject":
			return djd43.lang.isPureObject(value);
		  case "builtin":
			return djd43.lang.isBuiltIn(value);
		  case "alien":
			return djd43.lang.isAlien(value);
		  case "undefined":
			return djd43.lang.isUndefined(value);
		  case null:
		  case "null":
			return (value === null);
		  case "optional":
			djd43.deprecated("djd43.lang.isOfType(value, [type, \"optional\"])", "use djd43.lang.isOfType(value, type, {optional: true} ) instead", "0.5");
			return ((value === null) || djd43.lang.isUndefined(value));
		  default:
			if (djd43.lang.isFunction(type)) {
				return (value instanceof type);
			} else {
				djd43.raise("djd43.lang.isOfType() was passed an invalid type");
			}
		}
	}
	djd43.raise("If we get here, it means a bug was introduced above.");
};
djd43.lang.getObject = function (str) {
	var parts = str.split("."), i = 0, obj = dj_global;
	do {
		obj = obj[parts[i++]];
	} while (i < parts.length && obj);
	return (obj != dj_global) ? obj : null;
};
djd43.lang.doesObjectExist = function (str) {
	var parts = str.split("."), i = 0, obj = dj_global;
	do {
		obj = obj[parts[i++]];
	} while (i < parts.length && obj);
	return (obj && obj != dj_global);
};

