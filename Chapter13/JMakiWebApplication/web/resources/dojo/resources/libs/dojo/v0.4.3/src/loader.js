/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



(function () {
	var _addHostEnv = {pkgFileName:"__package__", loading_modules_:{}, loaded_modules_:{}, addedToLoadingCount:[], removedFromLoadingCount:[], inFlightCount:0, modulePrefixes_:{dojo:{name:"djd43", value:"src"}}, setModulePrefix:function (module, prefix) {
		this.modulePrefixes_[module] = {name:module, value:prefix};
	}, moduleHasPrefix:function (module) {
		var mp = this.modulePrefixes_;
		return Boolean(mp[module] && mp[module].value);
	}, getModulePrefix:function (module) {
		if (this.moduleHasPrefix(module)) {
			return this.modulePrefixes_[module].value;
		}
		return module;
	}, getTextStack:[], loadUriStack:[], loadedUris:[], post_load_:false, modulesLoadedListeners:[], unloadListeners:[], loadNotifying:false};
	for (var param in _addHostEnv) {
		djd43.hostenv[param] = _addHostEnv[param];
	}
})();
djd43.hostenv.loadPath = function (relpath, module, cb) {
	var uri;
	if (relpath.charAt(0) == "/" || relpath.match(/^\w+:/)) {
		uri = relpath;
	} else {
		uri = this.getBaseScriptUri() + relpath;
	}
	if (djConfig.cacheBust && djd43.render.html.capable) {
		uri += "?" + String(djConfig.cacheBust).replace(/\W+/g, "");
	}
	try {
		return !module ? this.loadUri(uri, cb) : this.loadUriAndCheck(uri, module, cb);
	}
	catch (e) {
		djd43.debug(e);
		return false;
	}
};
djd43.hostenv.loadUri = function (uri, cb) {
	if (this.loadedUris[uri]) {
		return true;
	}
	var contents = this.getText(uri, null, true);
	if (!contents) {
		return false;
	}
	this.loadedUris[uri] = true;
	if (cb) {
		contents = "(" + contents + ")";
	}
	var value = dj_eval(contents);
	if (cb) {
		cb(value);
	}
	return true;
};
djd43.hostenv.loadUriAndCheck = function (uri, moduleName, cb) {
	var ok = true;
	try {
		ok = this.loadUri(uri, cb);
	}
	catch (e) {
		djd43.debug("failed loading ", uri, " with error: ", e);
	}
	return Boolean(ok && this.findModule(moduleName, false));
};
djd43.loaded = function () {
};
djd43.unloaded = function () {
};
djd43.hostenv.loaded = function () {
	this.loadNotifying = true;
	this.post_load_ = true;
	var mll = this.modulesLoadedListeners;
	for (var x = 0; x < mll.length; x++) {
		mll[x]();
	}
	this.modulesLoadedListeners = [];
	this.loadNotifying = false;
	djd43.loaded();
};
djd43.hostenv.unloaded = function () {
	var mll = this.unloadListeners;
	while (mll.length) {
		(mll.pop())();
	}
	djd43.unloaded();
};
djd43.addOnLoad = function (obj, functionName) {
	var dh = djd43.hostenv;
	if (arguments.length == 1) {
		dh.modulesLoadedListeners.push(obj);
	} else {
		if (arguments.length > 1) {
			dh.modulesLoadedListeners.push(function () {
				obj[functionName]();
			});
		}
	}
	if (dh.post_load_ && dh.inFlightCount == 0 && !dh.loadNotifying) {
		dh.callLoaded();
	}
};
djd43.addOnUnload = function (obj, functionName) {
	var dh = djd43.hostenv;
	if (arguments.length == 1) {
		dh.unloadListeners.push(obj);
	} else {
		if (arguments.length > 1) {
			dh.unloadListeners.push(function () {
				obj[functionName]();
			});
		}
	}
};
djd43.hostenv.modulesLoaded = function () {
	if (this.post_load_) {
		return;
	}
	if (this.loadUriStack.length == 0 && this.getTextStack.length == 0) {
		if (this.inFlightCount > 0) {
			djd43.debug("files still in flight!");
			return;
		}
		djd43.hostenv.callLoaded();
	}
};
djd43.hostenv.callLoaded = function () {
	if (typeof setTimeout == "object" || (djConfig["useXDomain"] && djd43.render.html.opera)) {
		setTimeout("djd43.hostenv.loaded();", 0);
	} else {
		djd43.hostenv.loaded();
	}
};
djd43.hostenv.getModuleSymbols = function (modulename) {
	var syms = modulename.split(".");
	for (var i = syms.length; i > 0; i--) {
		var parentModule = syms.slice(0, i).join(".");
		if ((i == 1) && !this.moduleHasPrefix(parentModule)) {
			syms[0] = "../" + syms[0];
		} else {
			var parentModulePath = this.getModulePrefix(parentModule);
			if (parentModulePath != parentModule) {
				syms.splice(0, i, parentModulePath);
				break;
			}
		}
	}
	return syms;
};
djd43.hostenv._global_omit_module_check = false;
djd43.hostenv.loadModule = function (moduleName, exactOnly, omitModuleCheck) {
	if (!moduleName) {
		return;
	}
	omitModuleCheck = this._global_omit_module_check || omitModuleCheck;
	var module = this.findModule(moduleName, false);
	if (module) {
		return module;
	}
	if (dj_undef(moduleName, this.loading_modules_)) {
		this.addedToLoadingCount.push(moduleName);
	}
	this.loading_modules_[moduleName] = 1;
	var relpath = moduleName.replace(/\./g, "/") + ".js";
	var nsyms = moduleName.split(".");
	var syms = this.getModuleSymbols(moduleName);
	var startedRelative = ((syms[0].charAt(0) != "/") && !syms[0].match(/^\w+:/));
	var last = syms[syms.length - 1];
	var ok;
	if (last == "*") {
		moduleName = nsyms.slice(0, -1).join(".");
		while (syms.length) {
			syms.pop();
			syms.push(this.pkgFileName);
			relpath = syms.join("/") + ".js";
			if (startedRelative && relpath.charAt(0) == "/") {
				relpath = relpath.slice(1);
			}
			ok = this.loadPath(relpath, !omitModuleCheck ? moduleName : null);
			if (ok) {
				break;
			}
			syms.pop();
		}
	} else {
		relpath = syms.join("/") + ".js";
		moduleName = nsyms.join(".");
		var modArg = !omitModuleCheck ? moduleName : null;
		ok = this.loadPath(relpath, modArg);
		if (!ok && !exactOnly) {
			syms.pop();
			while (syms.length) {
				relpath = syms.join("/") + ".js";
				ok = this.loadPath(relpath, modArg);
				if (ok) {
					break;
				}
				syms.pop();
				relpath = syms.join("/") + "/" + this.pkgFileName + ".js";
				if (startedRelative && relpath.charAt(0) == "/") {
					relpath = relpath.slice(1);
				}
				ok = this.loadPath(relpath, modArg);
				if (ok) {
					break;
				}
			}
		}
		if (!ok && !omitModuleCheck) {
			djd43.raise("Could not load '" + moduleName + "'; last tried '" + relpath + "'");
		}
	}
	if (!omitModuleCheck && !this["isXDomain"]) {
		module = this.findModule(moduleName, false);
		if (!module) {
			djd43.raise("symbol '" + moduleName + "' is not defined after loading '" + relpath + "'");
		}
	}
	return module;
};
djd43.hostenv.startPackage = function (packageName) {
	var fullPkgName = String(packageName);
	var strippedPkgName = fullPkgName;
	var syms = packageName.split(/\./);
	if (syms[syms.length - 1] == "*") {
		syms.pop();
		strippedPkgName = syms.join(".");
	}
	var evaledPkg = djd43.evalObjPath(strippedPkgName, true);
	this.loaded_modules_[fullPkgName] = evaledPkg;
	this.loaded_modules_[strippedPkgName] = evaledPkg;
	return evaledPkg;
};
djd43.hostenv.findModule = function (moduleName, mustExist) {
	var lmn = String(moduleName);
	if (this.loaded_modules_[lmn]) {
		return this.loaded_modules_[lmn];
	}
	if (mustExist) {
		djd43.raise("no loaded module named '" + moduleName + "'");
	}
	return null;
};
djd43.kwCompoundRequire = function (modMap) {
	var common = modMap["common"] || [];
	var result = modMap[djd43.hostenv.name_] ? common.concat(modMap[djd43.hostenv.name_] || []) : common.concat(modMap["default"] || []);
	for (var x = 0; x < result.length; x++) {
		var curr = result[x];
		if (curr.constructor == Array) {
			djd43.hostenv.loadModule.apply(djd43.hostenv, curr);
		} else {
			djd43.hostenv.loadModule(curr);
		}
	}
};
djd43.require = function (resourceName) {
	djd43.hostenv.loadModule.apply(djd43.hostenv, arguments);
};
djd43.requireIf = function (condition, resourceName) {
	var arg0 = arguments[0];
	if ((arg0 === true) || (arg0 == "common") || (arg0 && djd43.render[arg0].capable)) {
		var args = [];
		for (var i = 1; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		djd43.require.apply(dojo, args);
	}
};
djd43.requireAfterIf = djd43.requireIf;
djd43.provide = function (resourceName) {
	return djd43.hostenv.startPackage.apply(djd43.hostenv, arguments);
};
djd43.registerModulePath = function (module, prefix) {
	return djd43.hostenv.setModulePrefix(module, prefix);
};
if (djConfig["modulePaths"]) {
	for (var param in djConfig["modulePaths"]) {
		djd43.registerModulePath(param, djConfig["modulePaths"][param]);
	}
}
djd43.setModulePrefix = function (module, prefix) {
	djd43.deprecated("djd43.setModulePrefix(\"" + module + "\", \"" + prefix + "\")", "replaced by djd43.registerModulePath", "0.5");
	return djd43.registerModulePath(module, prefix);
};
djd43.exists = function (obj, name) {
	var p = name.split(".");
	for (var i = 0; i < p.length; i++) {
		if (!obj[p[i]]) {
			return false;
		}
		obj = obj[p[i]];
	}
	return true;
};
djd43.hostenv.normalizeLocale = function (locale) {
	var result = locale ? locale.toLowerCase() : djd43.locale;
	if (result == "root") {
		result = "ROOT";
	}
	return result;
};
djd43.hostenv.searchLocalePath = function (locale, down, searchFunc) {
	locale = djd43.hostenv.normalizeLocale(locale);
	var elements = locale.split("-");
	var searchlist = [];
	for (var i = elements.length; i > 0; i--) {
		searchlist.push(elements.slice(0, i).join("-"));
	}
	searchlist.push(false);
	if (down) {
		searchlist.reverse();
	}
	for (var j = searchlist.length - 1; j >= 0; j--) {
		var loc = searchlist[j] || "ROOT";
		var stop = searchFunc(loc);
		if (stop) {
			break;
		}
	}
};
djd43.hostenv.localesGenerated;
djd43.hostenv.registerNlsPrefix = function () {
	djd43.registerModulePath("nls", "nls");
};
djd43.hostenv.preloadLocalizations = function () {
	if (djd43.hostenv.localesGenerated) {
		djd43.hostenv.registerNlsPrefix();
		function preload(locale) {
			locale = djd43.hostenv.normalizeLocale(locale);
			djd43.hostenv.searchLocalePath(locale, true, function (loc) {
				for (var i = 0; i < djd43.hostenv.localesGenerated.length; i++) {
					if (djd43.hostenv.localesGenerated[i] == loc) {
						djd43["require"]("nls.dojo_" + loc);
						return true;
					}
				}
				return false;
			});
		}
		preload();
		var extra = djConfig.extraLocale || [];
		for (var i = 0; i < extra.length; i++) {
			preload(extra[i]);
		}
	}
	djd43.hostenv.preloadLocalizations = function () {
	};
};
djd43.requireLocalization = function (moduleName, bundleName, locale, availableFlatLocales) {
	djd43.hostenv.preloadLocalizations();
	var targetLocale = djd43.hostenv.normalizeLocale(locale);
	var bundlePackage = [moduleName, "nls", bundleName].join(".");
	var bestLocale = "";
	if (availableFlatLocales) {
		var flatLocales = availableFlatLocales.split(",");
		for (var i = 0; i < flatLocales.length; i++) {
			if (targetLocale.indexOf(flatLocales[i]) == 0) {
				if (flatLocales[i].length > bestLocale.length) {
					bestLocale = flatLocales[i];
				}
			}
		}
		if (!bestLocale) {
			bestLocale = "ROOT";
		}
	}
	var tempLocale = availableFlatLocales ? bestLocale : targetLocale;
	var bundle = djd43.hostenv.findModule(bundlePackage);
	var localizedBundle = null;
	if (bundle) {
		if (djConfig.localizationComplete && bundle._built) {
			return;
		}
		var jsLoc = tempLocale.replace("-", "_");
		var translationPackage = bundlePackage + "." + jsLoc;
		localizedBundle = djd43.hostenv.findModule(translationPackage);
	}
	if (!localizedBundle) {
		bundle = djd43.hostenv.startPackage(bundlePackage);
		var syms = djd43.hostenv.getModuleSymbols(moduleName);
		var modpath = syms.concat("nls").join("/");
		var parent;
		djd43.hostenv.searchLocalePath(tempLocale, availableFlatLocales, function (loc) {
			var jsLoc = loc.replace("-", "_");
			var translationPackage = bundlePackage + "." + jsLoc;
			var loaded = false;
			if (!djd43.hostenv.findModule(translationPackage)) {
				djd43.hostenv.startPackage(translationPackage);
				var module = [modpath];
				if (loc != "ROOT") {
					module.push(loc);
				}
				module.push(bundleName);
				var filespec = module.join("/") + ".js";
				loaded = djd43.hostenv.loadPath(filespec, null, function (hash) {
					var clazz = function () {
					};
					clazz.prototype = parent;
					bundle[jsLoc] = new clazz();
					for (var j in hash) {
						bundle[jsLoc][j] = hash[j];
					}
				});
			} else {
				loaded = true;
			}
			if (loaded && bundle[jsLoc]) {
				parent = bundle[jsLoc];
			} else {
				bundle[jsLoc] = parent;
			}
			if (availableFlatLocales) {
				return true;
			}
		});
	}
	if (availableFlatLocales && targetLocale != bestLocale) {
		bundle[targetLocale.replace("-", "_")] = bundle[bestLocale.replace("-", "_")];
	}
};
(function () {
	var extra = djConfig.extraLocale;
	if (extra) {
		if (!extra instanceof Array) {
			extra = [extra];
		}
		var req = djd43.requireLocalization;
		djd43.requireLocalization = function (m, b, locale, availableFlatLocales) {
			req(m, b, locale, availableFlatLocales);
			if (locale) {
				return;
			}
			for (var i = 0; i < extra.length; i++) {
				req(m, b, extra[i], availableFlatLocales);
			}
		};
	}
})();

