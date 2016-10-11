/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.lang.extras");
djd43.require("djd43.lang.common");
djd43.lang.setTimeout = function (func, delay) {
	var context = window, argsStart = 2;
	if (!djd43.lang.isFunction(func)) {
		context = func;
		func = delay;
		delay = arguments[2];
		argsStart++;
	}
	if (djd43.lang.isString(func)) {
		func = context[func];
	}
	var args = [];
	for (var i = argsStart; i < arguments.length; i++) {
		args.push(arguments[i]);
	}
	return djd43.global().setTimeout(function () {
		func.apply(context, args);
	}, delay);
};
djd43.lang.clearTimeout = function (timer) {
	djd43.global().clearTimeout(timer);
};
djd43.lang.getNameInObj = function (ns, item) {
	if (!ns) {
		ns = dj_global;
	}
	for (var x in ns) {
		if (ns[x] === item) {
			return new String(x);
		}
	}
	return null;
};
djd43.lang.shallowCopy = function (obj, deep) {
	var i, ret;
	if (obj === null) {
		return null;
	}
	if (djd43.lang.isObject(obj)) {
		ret = new obj.constructor();
		for (i in obj) {
			if (djd43.lang.isUndefined(ret[i])) {
				ret[i] = deep ? djd43.lang.shallowCopy(obj[i], deep) : obj[i];
			}
		}
	} else {
		if (djd43.lang.isArray(obj)) {
			ret = [];
			for (i = 0; i < obj.length; i++) {
				ret[i] = deep ? djd43.lang.shallowCopy(obj[i], deep) : obj[i];
			}
		} else {
			ret = obj;
		}
	}
	return ret;
};
djd43.lang.firstValued = function () {
	for (var i = 0; i < arguments.length; i++) {
		if (typeof arguments[i] != "undefined") {
			return arguments[i];
		}
	}
	return undefined;
};
djd43.lang.getObjPathValue = function (objpath, context, create) {
	with (djd43.parseObjPath(objpath, context, create)) {
		return djd43.evalProp(prop, obj, create);
	}
};
djd43.lang.setObjPathValue = function (objpath, value, context, create) {
	djd43.deprecated("djd43.lang.setObjPathValue", "use djd43.parseObjPath and the '=' operator", "0.6");
	if (arguments.length < 4) {
		create = true;
	}
	with (djd43.parseObjPath(objpath, context, create)) {
		if (obj && (create || (prop in obj))) {
			obj[prop] = value;
		}
	}
};

