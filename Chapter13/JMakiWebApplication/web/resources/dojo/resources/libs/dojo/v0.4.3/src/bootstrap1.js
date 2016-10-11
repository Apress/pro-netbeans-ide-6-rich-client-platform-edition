/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



var dj_global = this;
var dj_currentContext = this;
function dj_undef(name, object) {
	return (typeof (object || dj_currentContext)[name] == "undefined");
}
if (dj_undef("djConfig", this)) {
	var djConfig = {};
}
if (dj_undef("djd43", this)) {
	var dojo = {};
}
djd43.global = function () {
	return dj_currentContext;
};
djd43.locale = djConfig.locale;
djd43.version = {major:0, minor:4, patch:3, flag:"", revision:Number("$Rev: 8617 $".match(/[0-9]+/)[0]), toString:function () {
	with (djd43.version) {
		return major + "." + minor + "." + patch + flag + " (" + revision + ")";
	}
}};
djd43.evalProp = function (name, object, create) {
	if ((!object) || (!name)) {
		return undefined;
	}
	if (!dj_undef(name, object)) {
		return object[name];
	}
	return (create ? (object[name] = {}) : undefined);
};
djd43.parseObjPath = function (path, context, create) {
	var object = (context || djd43.global());
	var names = path.split(".");
	var prop = names.pop();
	for (var i = 0, l = names.length; i < l && object; i++) {
		object = djd43.evalProp(names[i], object, create);
	}
	return {obj:object, prop:prop};
};
djd43.evalObjPath = function (path, create) {
	if (typeof path != "string") {
		return djd43.global();
	}
	if (path.indexOf(".") == -1) {
		return djd43.evalProp(path, djd43.global(), create);
	}
	var ref = djd43.parseObjPath(path, djd43.global(), create);
	if (ref) {
		return djd43.evalProp(ref.prop, ref.obj, create);
	}
	return null;
};
djd43.errorToString = function (exception) {
	if (!dj_undef("message", exception)) {
		return exception.message;
	} else {
		if (!dj_undef("description", exception)) {
			return exception.description;
		} else {
			return exception;
		}
	}
};
djd43.raise = function (message, exception) {
	if (exception) {
		message = message + ": " + djd43.errorToString(exception);
	} else {
		message = djd43.errorToString(message);
	}
	try {
		if (djConfig.isDebug) {
			djd43.hostenv.println("FATAL exception raised: " + message);
		}
	}
	catch (e) {
	}
	throw exception || Error(message);
};
djd43.debug = function () {
};
djd43.debugShallow = function (obj) {
};
djd43.profile = {start:function () {
}, end:function () {
}, stop:function () {
}, dump:function () {
}};
function dj_eval(scriptFragment) {
	return dj_global.eval ? dj_global.eval(scriptFragment) : eval(scriptFragment);
}
djd43.unimplemented = function (funcname, extra) {
	var message = "'" + funcname + "' not implemented";
	if (extra != null) {
		message += " " + extra;
	}
	djd43.raise(message);
};
djd43.deprecated = function (behaviour, extra, removal) {
	var message = "DEPRECATED: " + behaviour;
	if (extra) {
		message += " " + extra;
	}
	if (removal) {
		message += " -- will be removed in version: " + removal;
	}
	djd43.debug(message);
};
djd43.render = (function () {
	function vscaffold(prefs, names) {
		var tmp = {capable:false, support:{builtin:false, plugin:false}, prefixes:prefs};
		for (var i = 0; i < names.length; i++) {
			tmp[names[i]] = false;
		}
		return tmp;
	}
	return {name:"", ver:djd43.version, os:{win:false, linux:false, osx:false}, html:vscaffold(["html"], ["ie", "opera", "khtml", "safari", "moz"]), svg:vscaffold(["svg"], ["corel", "adobe", "batik"]), vml:vscaffold(["vml"], ["ie"]), swf:vscaffold(["Swf", "Flash", "Mm"], ["mm"]), swt:vscaffold(["Swt"], ["ibm"])};
})();
djd43.hostenv = (function () {
	var config = {isDebug:false, allowQueryConfig:false, baseScriptUri:"", baseRelativePath:"", libraryScriptUri:"", iePreventClobber:false, ieClobberMinimal:true, preventBackButtonFix:true, delayMozLoadingFix:false, searchIds:[], parseWidgets:true};
	if (typeof djConfig == "undefined") {
		djConfig = config;
	} else {
		for (var option in config) {
			if (typeof djConfig[option] == "undefined") {
				djConfig[option] = config[option];
			}
		}
	}
	return {name_:"(unset)", version_:"(unset)", getName:function () {
		return this.name_;
	}, getVersion:function () {
		return this.version_;
	}, getText:function (uri) {
		djd43.unimplemented("getText", "uri=" + uri);
	}};
})();
djd43.hostenv.getBaseScriptUri = function () {
	if (djConfig.baseScriptUri.length) {
		return djConfig.baseScriptUri;
	}
	var uri = new String(djConfig.libraryScriptUri || djConfig.baseRelativePath);
	if (!uri) {
		djd43.raise("Nothing returned by getLibraryScriptUri(): " + uri);
	}
	var lastslash = uri.lastIndexOf("/");
	djConfig.baseScriptUri = djConfig.baseRelativePath;
	return djConfig.baseScriptUri;
};

