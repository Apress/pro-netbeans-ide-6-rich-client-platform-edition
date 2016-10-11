/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



if (typeof window == "undefined") {
	djd43.raise("attempt to use adobe svg hostenv when no window object");
}
with (djd43.render) {
	name = navigator.appName;
	ver = parseFloat(navigator.appVersion, 10);
	switch (navigator.platform) {
	  case "MacOS":
		os.osx = true;
		break;
	  case "Linux":
		os.linux = true;
		break;
	  case "Windows":
		os.win = true;
		break;
	  default:
		os.linux = true;
		break;
	}
	svg.capable = true;
	svg.support.builtin = true;
	svg.adobe = true;
}
djd43.hostenv.println = function (s) {
	try {
		var ti = document.createElement("text");
		ti.setAttribute("x", "50");
		var yPos = 25 + 15 * document.getElementsByTagName("text").length;
		ti.setAttribute("y", yPos);
		var tn = document.createTextNode(s);
		ti.appendChild(tn);
		document.documentElement.appendChild(ti);
	}
	catch (e) {
	}
};
djd43.debug = function () {
	if (!djConfig.isDebug) {
		return;
	}
	var args = arguments;
	if (typeof djd43.hostenv.println != "function") {
		djd43.raise("attempt to call djd43.debug when there is no djd43.hostenv println implementation (yet?)");
	}
	var isJUM = dj_global["jum"];
	var s = isJUM ? "" : "DEBUG: ";
	for (var i = 0; i < args.length; ++i) {
		s += args[i];
	}
	if (isJUM) {
		jum.debug(s);
	} else {
		djd43.hostenv.println(s);
	}
};
djd43.hostenv.startPackage("djd43.hostenv");
djd43.hostenv.name_ = "adobesvg";
djd43.hostenv.anonCtr = 0;
djd43.hostenv.anon = {};
djd43.hostenv.nameAnonFunc = function (anonFuncPtr, namespaceObj) {
	var ret = "_" + this.anonCtr++;
	var nso = (namespaceObj || this.anon);
	while (typeof nso[ret] != "undefined") {
		ret = "_" + this.anonCtr++;
	}
	nso[ret] = anonFuncPtr;
	return ret;
};
djd43.hostenv.modulesLoadedFired = false;
djd43.hostenv.modulesLoadedListeners = [];
djd43.hostenv.getTextStack = [];
djd43.hostenv.loadUriStack = [];
djd43.hostenv.loadedUris = [];
djd43.hostenv.modulesLoaded = function () {
	if (this.modulesLoadedFired) {
		return;
	}
	if ((this.loadUriStack.length == 0) && (this.getTextStack.length == 0)) {
		if (this.inFlightCount > 0) {
			djd43.debug("couldn't initialize, there are files still in flight");
			return;
		}
		this.modulesLoadedFired = true;
		var mll = this.modulesLoadedListeners;
		for (var x = 0; x < mll.length; x++) {
			mll[x]();
		}
	}
};
djd43.hostenv.getNewAnonFunc = function () {
	var ret = "_" + this.anonCtr++;
	while (typeof this.anon[ret] != "undefined") {
		ret = "_" + this.anonCtr++;
	}
	eval("djd43.nostenv.anon." + ret + " = function(){};");
	return [ret, this.anon[ret]];
};
djd43.hostenv.displayStack = function () {
	var oa = [];
	var stack = this.loadUriStack;
	for (var x = 0; x < stack.length; x++) {
		oa.unshift([stack[x][0], (typeof stack[x][2])]);
	}
	djd43.debug("<pre>" + oa.join("\n") + "</pre>");
};
djd43.hostenv.unwindUriStack = function () {
	var stack = this.loadUriStack;
	for (var x in djd43.hostenv.loadedUris) {
		for (var y = stack.length - 1; y >= 0; y--) {
			if (stack[y][0] == x) {
				stack.splice(y, 1);
			}
		}
	}
	var next = stack.pop();
	if ((!next) && (stack.length == 0)) {
		return;
	}
	for (var x = 0; x < stack.length; x++) {
		if ((stack[x][0] == next[0]) && (stack[x][2])) {
			next[2] == stack[x][2];
		}
	}
	var last = next;
	while (djd43.hostenv.loadedUris[next[0]]) {
		last = next;
		next = stack.pop();
	}
	while (typeof next[2] == "string") {
		try {
			dj_eval(next[2]);
			next[1](true);
		}
		catch (e) {
			djd43.debug("we got an error when loading " + next[0]);
			djd43.debug("error: " + e);
		}
		djd43.hostenv.loadedUris[next[0]] = true;
		djd43.hostenv.loadedUris.push(next[0]);
		last = next;
		next = stack.pop();
		if ((!next) && (stack.length == 0)) {
			break;
		}
		while (djd43.hostenv.loadedUris[next[0]]) {
			last = next;
			next = stack.pop();
		}
	}
	if (next) {
		stack.push(next);
		djd43.debug("### CHOKED ON: " + next[0]);
	}
};
djd43.hostenv.loadUri = function (uri, cb) {
	if (djd43.hostenv.loadedUris[uri]) {
		return;
	}
	var stack = this.loadUriStack;
	stack.push([uri, cb, null]);
	var tcb = function (contents) {
		if (contents.content) {
			contents = contents.content;
		}
		var next = stack.pop();
		if ((!next) && (stack.length == 0)) {
			djd43.hostenv.modulesLoaded();
			return;
		}
		if (typeof contents == "string") {
			stack.push(next);
			for (var x = 0; x < stack.length; x++) {
				if (stack[x][0] == uri) {
					stack[x][2] = contents;
				}
			}
			next = stack.pop();
		}
		if (djd43.hostenv.loadedUris[next[0]]) {
			djd43.hostenv.unwindUriStack();
			return;
		}
		stack.push(next);
		if (next[0] != uri) {
			if (typeof next[2] == "string") {
				djd43.hostenv.unwindUriStack();
			}
		} else {
			if (!contents) {
				next[1](false);
			} else {
				var deps = djd43.hostenv.getDepsForEval(next[2]);
				if (deps.length > 0) {
					eval(deps.join(";"));
				} else {
					djd43.hostenv.unwindUriStack();
				}
			}
		}
	};
	this.getText(uri, tcb, true);
};
djd43.hostenv.loadModule = function (modulename, exact_only, omit_module_check) {
	var module = this.findModule(modulename, 0);
	if (module) {
		return module;
	}
	if (typeof this.loading_modules_[modulename] !== "undefined") {
		djd43.debug("recursive attempt to load module '" + modulename + "'");
	} else {
		this.addedToLoadingCount.push(modulename);
	}
	this.loading_modules_[modulename] = 1;
	var relpath = modulename.replace(/\./g, "/") + ".js";
	var syms = modulename.split(".");
	var nsyms = modulename.split(".");
	if (syms[0] == "djd43") {
		syms[0] = "src";
	}
	var last = syms.pop();
	syms.push(last);
	var _this = this;
	var pfn = this.pkgFileName;
	if (last == "*") {
		modulename = (nsyms.slice(0, -1)).join(".");
		var module = this.findModule(modulename, 0);
		if (module) {
			_this.removedFromLoadingCount.push(modulename);
			return module;
		}
		var nextTry = function (lastStatus) {
			if (lastStatus) {
				module = _this.findModule(modulename, false);
				if ((!module) && (syms[syms.length - 1] != pfn)) {
					djd43.raise("Module symbol '" + modulename + "' is not defined after loading '" + relpath + "'");
				}
				if (module) {
					_this.removedFromLoadingCount.push(modulename);
					djd43.hostenv.modulesLoaded();
					return;
				}
			}
			syms.pop();
			syms.push(pfn);
			relpath = syms.join("/") + ".js";
			if (relpath.charAt(0) == "/") {
				relpath = relpath.slice(1);
			}
			_this.loadPath(relpath, ((!omit_module_check) ? modulename : null), nextTry);
		};
		nextTry();
	} else {
		relpath = syms.join("/") + ".js";
		modulename = nsyms.join(".");
		var nextTry = function (lastStatus) {
			if (lastStatus) {
				module = _this.findModule(modulename, false);
				if ((!module) && (syms[syms.length - 1] != pfn)) {
					djd43.raise("Module symbol '" + modulename + "' is not defined after loading '" + relpath + "'");
				}
				if (module) {
					_this.removedFromLoadingCount.push(modulename);
					djd43.hostenv.modulesLoaded();
					return;
				}
			}
			var setPKG = (syms[syms.length - 1] == pfn) ? false : true;
			syms.pop();
			if (setPKG) {
				syms.push(pfn);
			}
			relpath = syms.join("/") + ".js";
			if (relpath.charAt(0) == "/") {
				relpath = relpath.slice(1);
			}
			_this.loadPath(relpath, ((!omit_module_check) ? modulename : null), nextTry);
		};
		this.loadPath(relpath, ((!omit_module_check) ? modulename : null), nextTry);
	}
	return;
};
djd43.hostenv.async_cb = null;
djd43.hostenv.unWindGetTextStack = function () {
	if (djd43.hostenv.inFlightCount > 0) {
		setTimeout("djd43.hostenv.unWindGetTextStack()", 100);
		return;
	}
	djd43.hostenv.inFlightCount++;
	var next = djd43.hostenv.getTextStack.pop();
	if ((!next) && (djd43.hostenv.getTextStack.length == 0)) {
		djd43.hostenv.inFlightCount--;
		djd43.hostenv.async_cb = function () {
		};
		return;
	}
	djd43.hostenv.async_cb = next[1];
	window.getURL(next[0], function (result) {
		djd43.hostenv.inFlightCount--;
		djd43.hostenv.async_cb(result.content);
		djd43.hostenv.unWindGetTextStack();
	});
};
djd43.hostenv.getText = function (uri, async_cb, fail_ok) {
	try {
		if (async_cb) {
			djd43.hostenv.getTextStack.push([uri, async_cb, fail_ok]);
			djd43.hostenv.unWindGetTextStack();
		} else {
			return djd43.raise("No synchronous XMLHTTP implementation available, for uri " + uri);
		}
	}
	catch (e) {
		return djd43.raise("No XMLHTTP implementation available, for uri " + uri);
	}
};
djd43.hostenv.postText = function (uri, async_cb, text, fail_ok, mime_type, encoding) {
	var http = null;
	var async_callback = function (httpResponse) {
		if (!httpResponse.success) {
			djd43.raise("Request for uri '" + uri + "' resulted in " + httpResponse.status);
		}
		if (!httpResponse.content) {
			if (!fail_ok) {
				djd43.raise("Request for uri '" + uri + "' resulted in no content");
			}
			return null;
		}
		async_cb(httpResponse.content);
	};
	try {
		if (async_cb) {
			http = window.postURL(uri, text, async_callback, mimeType, encoding);
		} else {
			return djd43.raise("No synchronous XMLHTTP post implementation available, for uri " + uri);
		}
	}
	catch (e) {
		return djd43.raise("No XMLHTTP post implementation available, for uri " + uri);
	}
};
function dj_last_script_src() {
	var scripts = window.document.getElementsByTagName("script");
	if (scripts.length < 1) {
		djd43.raise("No script elements in window.document, so can't figure out my script src");
	}
	var li = scripts.length - 1;
	var xlinkNS = "http://www.w3.org/1999/xlink";
	var src = null;
	var script = null;
	while (!src) {
		script = scripts.item(li);
		src = script.getAttributeNS(xlinkNS, "href");
		li--;
		if (li < 0) {
			break;
		}
	}
	if (!src) {
		djd43.raise("Last script element (out of " + scripts.length + ") has no src");
	}
	return src;
}
if (!djd43.hostenv["library_script_uri_"]) {
	djd43.hostenv.library_script_uri_ = dj_last_script_src();
}
djd43.requireIf((djConfig["isDebug"] || djConfig["debugAtAllCosts"]), "djd43.debug");

