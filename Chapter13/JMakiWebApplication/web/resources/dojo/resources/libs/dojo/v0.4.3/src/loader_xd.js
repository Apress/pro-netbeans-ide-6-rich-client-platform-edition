/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.hostenv.resetXd = function () {
	this.isXDomain = djConfig.useXDomain || false;
	this.xdTimer = 0;
	this.xdInFlight = {};
	this.xdOrderedReqs = [];
	this.xdDepMap = {};
	this.xdContents = [];
	this.xdDefList = [];
};
djd43.hostenv.resetXd();
djd43.hostenv.createXdPackage = function (contents, resourceName, resourcePath) {
	var deps = [];
	var depRegExp = /djd43.(requireLocalization|require|requireIf|requireAll|provide|requireAfterIf|requireAfter|kwCompoundRequire|conditionalRequire|hostenv\.conditionalLoadModule|.hostenv\.loadModule|hostenv\.moduleLoaded)\(([\w\W]*?)\)/mg;
	var match;
	while ((match = depRegExp.exec(contents)) != null) {
		if (match[1] == "requireLocalization") {
			eval(match[0]);
		} else {
			deps.push("\"" + match[1] + "\", " + match[2]);
		}
	}
	var output = [];
	output.push("djd43.hostenv.packageLoaded({\n");
	if (deps.length > 0) {
		output.push("depends: [");
		for (var i = 0; i < deps.length; i++) {
			if (i > 0) {
				output.push(",\n");
			}
			output.push("[" + deps[i] + "]");
		}
		output.push("],");
	}
	output.push("\ndefinePackage: function(dojo){");
	output.push(contents);
	output.push("\n}, resourceName: '" + resourceName + "', resourcePath: '" + resourcePath + "'});");
	return output.join("");
};
djd43.hostenv.loadPath = function (relpath, module, cb) {
	var colonIndex = relpath.indexOf(":");
	var slashIndex = relpath.indexOf("/");
	var uri;
	var currentIsXDomain = false;
	if (colonIndex > 0 && colonIndex < slashIndex) {
		uri = relpath;
		this.isXDomain = currentIsXDomain = true;
	} else {
		uri = this.getBaseScriptUri() + relpath;
		colonIndex = uri.indexOf(":");
		slashIndex = uri.indexOf("/");
		if (colonIndex > 0 && colonIndex < slashIndex && (!location.host || uri.indexOf("http://" + location.host) != 0)) {
			this.isXDomain = currentIsXDomain = true;
		}
	}
	if (djConfig.cacheBust && djd43.render.html.capable) {
		uri += "?" + String(djConfig.cacheBust).replace(/\W+/g, "");
	}
	try {
		return ((!module || this.isXDomain) ? this.loadUri(uri, cb, currentIsXDomain, module) : this.loadUriAndCheck(uri, module, cb));
	}
	catch (e) {
		djd43.debug(e);
		return false;
	}
};
djd43.hostenv.loadUri = function (uri, cb, currentIsXDomain, module) {
	if (this.loadedUris[uri]) {
		return 1;
	}
	if (this.isXDomain && module) {
		if (uri.indexOf("__package__") != -1) {
			module += ".*";
		}
		this.xdOrderedReqs.push(module);
		if (currentIsXDomain || uri.indexOf("/nls/") == -1) {
			this.xdInFlight[module] = true;
			this.inFlightCount++;
		}
		if (!this.xdTimer) {
			this.xdTimer = setInterval("djd43.hostenv.watchInFlightXDomain();", 100);
		}
		this.xdStartTime = (new Date()).getTime();
	}
	if (currentIsXDomain) {
		var lastIndex = uri.lastIndexOf(".");
		if (lastIndex <= 0) {
			lastIndex = uri.length - 1;
		}
		var xdUri = uri.substring(0, lastIndex) + ".xd";
		if (lastIndex != uri.length - 1) {
			xdUri += uri.substring(lastIndex, uri.length);
		}
		var element = document.createElement("script");
		element.type = "text/javascript";
		element.src = xdUri;
		if (!this.headElement) {
			this.headElement = document.getElementsByTagName("head")[0];
			if (!this.headElement) {
				this.headElement = document.getElementsByTagName("html")[0];
			}
		}
		this.headElement.appendChild(element);
	} else {
		var contents = this.getText(uri, null, true);
		if (contents == null) {
			return 0;
		}
		if (this.isXDomain && uri.indexOf("/nls/") == -1) {
			var pkg = this.createXdPackage(contents, module, uri);
			dj_eval(pkg);
		} else {
			if (cb) {
				contents = "(" + contents + ")";
			}
			var value = dj_eval(contents);
			if (cb) {
				cb(value);
			}
		}
	}
	this.loadedUris[uri] = true;
	return 1;
};
djd43.hostenv.packageLoaded = function (pkg) {
	var deps = pkg.depends;
	var requireList = null;
	var requireAfterList = null;
	var provideList = [];
	if (deps && deps.length > 0) {
		var dep = null;
		var insertHint = 0;
		var attachedPackage = false;
		for (var i = 0; i < deps.length; i++) {
			dep = deps[i];
			if (dep[0] == "provide" || dep[0] == "hostenv.moduleLoaded") {
				provideList.push(dep[1]);
			} else {
				if (!requireList) {
					requireList = [];
				}
				if (!requireAfterList) {
					requireAfterList = [];
				}
				var unpackedDeps = this.unpackXdDependency(dep);
				if (unpackedDeps.requires) {
					requireList = requireList.concat(unpackedDeps.requires);
				}
				if (unpackedDeps.requiresAfter) {
					requireAfterList = requireAfterList.concat(unpackedDeps.requiresAfter);
				}
			}
			var depType = dep[0];
			var objPath = depType.split(".");
			if (objPath.length == 2) {
				djd43[objPath[0]][objPath[1]].apply(djd43[objPath[0]], dep.slice(1));
			} else {
				djd43[depType].apply(dojo, dep.slice(1));
			}
		}
		var contentIndex = this.xdContents.push({content:pkg.definePackage, resourceName:pkg["resourceName"], resourcePath:pkg["resourcePath"], isDefined:false}) - 1;
		for (var i = 0; i < provideList.length; i++) {
			this.xdDepMap[provideList[i]] = {requires:requireList, requiresAfter:requireAfterList, contentIndex:contentIndex};
		}
		for (var i = 0; i < provideList.length; i++) {
			this.xdInFlight[provideList[i]] = false;
		}
	}
};
djd43.hostenv.xdLoadFlattenedBundle = function (moduleName, bundleName, locale, bundleData) {
	locale = locale || "root";
	var jsLoc = djd43.hostenv.normalizeLocale(locale).replace("-", "_");
	var bundlePackage = [moduleName, "nls", bundleName].join(".");
	var bundle = djd43.hostenv.startPackage(bundlePackage);
	bundle[jsLoc] = bundleData;
	var mapName = [moduleName, jsLoc, bundleName].join(".");
	var bundleMap = djd43.hostenv.xdBundleMap[mapName];
	if (bundleMap) {
		for (var param in bundleMap) {
			bundle[param] = bundleData;
		}
	}
};
djd43.hostenv.xdBundleMap = {};
djd43.xdRequireLocalization = function (moduleName, bundleName, locale, availableFlatLocales) {
	var locales = availableFlatLocales.split(",");
	var jsLoc = djd43.hostenv.normalizeLocale(locale);
	var bestLocale = "";
	for (var i = 0; i < locales.length; i++) {
		if (jsLoc.indexOf(locales[i]) == 0) {
			if (locales[i].length > bestLocale.length) {
				bestLocale = locales[i];
			}
		}
	}
	var fixedBestLocale = bestLocale.replace("-", "_");
	var bundlePackage = djd43.evalObjPath([moduleName, "nls", bundleName].join("."));
	if (bundlePackage && bundlePackage[fixedBestLocale]) {
		bundle[jsLoc.replace("-", "_")] = bundlePackage[fixedBestLocale];
	} else {
		var mapName = [moduleName, (fixedBestLocale || "root"), bundleName].join(".");
		var bundleMap = djd43.hostenv.xdBundleMap[mapName];
		if (!bundleMap) {
			bundleMap = djd43.hostenv.xdBundleMap[mapName] = {};
		}
		bundleMap[jsLoc.replace("-", "_")] = true;
		djd43.require(moduleName + ".nls" + (bestLocale ? "." + bestLocale : "") + "." + bundleName);
	}
};
(function () {
	var extra = djConfig.extraLocale;
	if (extra) {
		if (!extra instanceof Array) {
			extra = [extra];
		}
		djd43._xdReqLoc = djd43.xdRequireLocalization;
		djd43.xdRequireLocalization = function (m, b, locale, fLocales) {
			djd43._xdReqLoc(m, b, locale, fLocales);
			if (locale) {
				return;
			}
			for (var i = 0; i < extra.length; i++) {
				djd43._xdReqLoc(m, b, extra[i], fLocales);
			}
		};
	}
})();
djd43.hostenv.unpackXdDependency = function (dep) {
	var newDeps = null;
	var newAfterDeps = null;
	switch (dep[0]) {
	  case "requireIf":
	  case "requireAfterIf":
	  case "conditionalRequire":
		if ((dep[1] === true) || (dep[1] == "common") || (dep[1] && djd43.render[dep[1]].capable)) {
			newDeps = [{name:dep[2], content:null}];
		}
		break;
	  case "requireAll":
		dep.shift();
		newDeps = dep;
		djd43.hostenv.flattenRequireArray(newDeps);
		break;
	  case "kwCompoundRequire":
	  case "hostenv.conditionalLoadModule":
		var modMap = dep[1];
		var common = modMap["common"] || [];
		var newDeps = (modMap[djd43.hostenv.name_]) ? common.concat(modMap[djd43.hostenv.name_] || []) : common.concat(modMap["default"] || []);
		djd43.hostenv.flattenRequireArray(newDeps);
		break;
	  case "require":
	  case "requireAfter":
	  case "hostenv.loadModule":
		newDeps = [{name:dep[1], content:null}];
		break;
	}
	if (dep[0] == "requireAfterIf" || dep[0] == "requireIf") {
		newAfterDeps = newDeps;
		newDeps = null;
	}
	return {requires:newDeps, requiresAfter:newAfterDeps};
};
djd43.hostenv.xdWalkReqs = function () {
	var reqChain = null;
	var req;
	for (var i = 0; i < this.xdOrderedReqs.length; i++) {
		req = this.xdOrderedReqs[i];
		if (this.xdDepMap[req]) {
			reqChain = [req];
			reqChain[req] = true;
			this.xdEvalReqs(reqChain);
		}
	}
};
djd43.hostenv.xdEvalReqs = function (reqChain) {
	while (reqChain.length > 0) {
		var req = reqChain[reqChain.length - 1];
		var pkg = this.xdDepMap[req];
		if (pkg) {
			var reqs = pkg.requires;
			if (reqs && reqs.length > 0) {
				var nextReq;
				for (var i = 0; i < reqs.length; i++) {
					nextReq = reqs[i].name;
					if (nextReq && !reqChain[nextReq]) {
						reqChain.push(nextReq);
						reqChain[nextReq] = true;
						this.xdEvalReqs(reqChain);
					}
				}
			}
			var contents = this.xdContents[pkg.contentIndex];
			if (!contents.isDefined) {
				var content = contents.content;
				content["resourceName"] = contents["resourceName"];
				content["resourcePath"] = contents["resourcePath"];
				this.xdDefList.push(content);
				contents.isDefined = true;
			}
			this.xdDepMap[req] = null;
			var reqs = pkg.requiresAfter;
			if (reqs && reqs.length > 0) {
				var nextReq;
				for (var i = 0; i < reqs.length; i++) {
					nextReq = reqs[i].name;
					if (nextReq && !reqChain[nextReq]) {
						reqChain.push(nextReq);
						reqChain[nextReq] = true;
						this.xdEvalReqs(reqChain);
					}
				}
			}
		}
		reqChain.pop();
	}
};
djd43.hostenv.clearXdInterval = function () {
	clearInterval(this.xdTimer);
	this.xdTimer = 0;
};
djd43.hostenv.watchInFlightXDomain = function () {
	var waitInterval = (djConfig.xdWaitSeconds || 15) * 1000;
	if (this.xdStartTime + waitInterval < (new Date()).getTime()) {
		this.clearXdInterval();
		var noLoads = "";
		for (var param in this.xdInFlight) {
			if (this.xdInFlight[param]) {
				noLoads += param + " ";
			}
		}
		djd43.raise("Could not load cross-domain packages: " + noLoads);
	}
	for (var param in this.xdInFlight) {
		if (this.xdInFlight[param]) {
			return;
		}
	}
	this.clearXdInterval();
	this.xdWalkReqs();
	var defLength = this.xdDefList.length;
	for (var i = 0; i < defLength; i++) {
		var content = djd43.hostenv.xdDefList[i];
		if (djConfig["debugAtAllCosts"] && content["resourceName"]) {
			if (!this["xdDebugQueue"]) {
				this.xdDebugQueue = [];
			}
			this.xdDebugQueue.push({resourceName:content.resourceName, resourcePath:content.resourcePath});
		} else {
			content(dojo);
		}
	}
	for (var i = 0; i < this.xdContents.length; i++) {
		var current = this.xdContents[i];
		if (current.content && !current.isDefined) {
			current.content(dojo);
		}
	}
	this.resetXd();
	if (this["xdDebugQueue"] && this.xdDebugQueue.length > 0) {
		this.xdDebugFileLoaded();
	} else {
		this.xdNotifyLoaded();
	}
};
djd43.hostenv.xdNotifyLoaded = function () {
	this.inFlightCount = 0;
	if (this._djInitFired && !this.loadNotifying) {
		this.callLoaded();
	}
};
djd43.hostenv.flattenRequireArray = function (target) {
	if (target) {
		for (var i = 0; i < target.length; i++) {
			if (target[i] instanceof Array) {
				target[i] = {name:target[i][0], content:null};
			} else {
				target[i] = {name:target[i], content:null};
			}
		}
	}
};
djd43.hostenv.xdHasCalledPreload = false;
djd43.hostenv.xdRealCallLoaded = djd43.hostenv.callLoaded;
djd43.hostenv.callLoaded = function () {
	if (this.xdHasCalledPreload || djd43.hostenv.getModulePrefix("djd43") == "src" || !this.localesGenerated) {
		this.xdRealCallLoaded();
	} else {
		if (this.localesGenerated) {
			this.registerNlsPrefix = function () {
				djd43.registerModulePath("nls", djd43.hostenv.getModulePrefix("djd43") + "/../nls");
			};
			this.preloadLocalizations();
		}
	}
	this.xdHasCalledPreload = true;
};

