/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.browser_debug");
djd43.hostenv.loadedUris.push("../src/bootstrap1.js");
djd43.hostenv.loadedUris.push("../src/loader.js");
djd43.hostenv.loadedUris.push("../src/hostenv_browser.js");
djd43.hostenv._loadedUrisListStart = djd43.hostenv.loadedUris.length;
function removeComments(contents) {
	contents = new String((!contents) ? "" : contents);
	contents = contents.replace(/^(.*?)\/\/(.*)$/mg, "$1");
	contents = contents.replace(/(\n)/mg, "__DOJONEWLINE");
	contents = contents.replace(/\/\*(.*?)\*\//g, "");
	return contents.replace(/__DOJONEWLINE/mg, "\n");
}
djd43.hostenv.getRequiresAndProvides = function (contents) {
	if (!contents) {
		return [];
	}
	var deps = [];
	var tmp;
	RegExp.lastIndex = 0;
	var testExp = /djd43.(hostenv.loadModule|hostenv.require|require|requireIf|kwCompoundRequire|hostenv.conditionalLoadModule|hostenv.startPackage|provide)\([\w\W]*?\)/mg;
	while ((tmp = testExp.exec(contents)) != null) {
		deps.push(tmp[0]);
	}
	return deps;
};
djd43.hostenv.getDelayRequiresAndProvides = function (contents) {
	if (!contents) {
		return [];
	}
	var deps = [];
	var tmp;
	RegExp.lastIndex = 0;
	var testExp = /djd43.(requireAfterIf)\([\w\W]*?\)/mg;
	while ((tmp = testExp.exec(contents)) != null) {
		deps.push(tmp[0]);
	}
	return deps;
};
djd43.clobberLastObject = function (objpath) {
	if (objpath.indexOf(".") == -1) {
		if (!dj_undef(objpath, dj_global)) {
			delete dj_global[objpath];
		}
		return true;
	}
	var syms = objpath.split(/\./);
	var base = djd43.evalObjPath(syms.slice(0, -1).join("."), false);
	var child = syms[syms.length - 1];
	if (!dj_undef(child, base)) {
		delete base[child];
		return true;
	}
	return false;
};
var removals = [];
function zip(arr) {
	var ret = [];
	var seen = {};
	for (var x = 0; x < arr.length; x++) {
		if (!seen[arr[x]]) {
			ret.push(arr[x]);
			seen[arr[x]] = true;
		}
	}
	return ret;
}
var old_dj_eval = dj_eval;
dj_eval = function () {
	return true;
};
djd43.hostenv.oldLoadUri = djd43.hostenv.loadUri;
djd43.hostenv.loadUri = function (uri, cb) {
	if (djd43.hostenv.loadedUris[uri]) {
		return true;
	}
	try {
		var text = this.getText(uri, null, true);
		if (!text) {
			return false;
		}
		if (cb) {
			var expr = old_dj_eval("(" + text + ")");
			cb(expr);
		} else {
			var requires = djd43.hostenv.getRequiresAndProvides(text);
			eval(requires.join(";"));
			djd43.hostenv.loadedUris.push(uri);
			djd43.hostenv.loadedUris[uri] = true;
			var delayRequires = djd43.hostenv.getDelayRequiresAndProvides(text);
			eval(delayRequires.join(";"));
		}
	}
	catch (e) {
		alert(e);
	}
	return true;
};
djd43.hostenv._writtenIncludes = {};
djd43.hostenv.writeIncludes = function (willCallAgain) {
	for (var x = removals.length - 1; x >= 0; x--) {
		djd43.clobberLastObject(removals[x]);
	}
	var depList = [];
	var seen = djd43.hostenv._writtenIncludes;
	for (var x = 0; x < djd43.hostenv.loadedUris.length; x++) {
		var curi = djd43.hostenv.loadedUris[x];
		if (!seen[curi]) {
			seen[curi] = true;
			depList.push(curi);
		}
	}
	djd43.hostenv._global_omit_module_check = true;
	for (var x = djd43.hostenv._loadedUrisListStart; x < depList.length; x++) {
		document.write("<script type='text/javascript' src='" + depList[x] + "'></script>");
	}
	document.write("<script type='text/javascript'>djd43.hostenv._global_omit_module_check = false;</script>");
	djd43.hostenv._loadedUrisListStart = 0;
	if (!willCallAgain) {
		dj_eval = old_dj_eval;
		djd43.hostenv.loadUri = djd43.hostenv.oldLoadUri;
	}
};

