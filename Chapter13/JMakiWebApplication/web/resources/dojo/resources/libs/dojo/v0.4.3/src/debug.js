/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.debug");
djd43.debug = function () {
	if (!djConfig.isDebug) {
		return;
	}
	var args = arguments;
	if (dj_undef("println", djd43.hostenv)) {
		djd43.raise("djd43.debug not available (yet?)");
	}
	var isJUM = dj_global["jum"] && !dj_global["jum"].isBrowser;
	var s = [(isJUM ? "" : "DEBUG: ")];
	for (var i = 0; i < args.length; ++i) {
		if (!false && args[i] && args[i] instanceof Error) {
			var msg = "[" + args[i].name + ": " + djd43.errorToString(args[i]) + (args[i].fileName ? ", file: " + args[i].fileName : "") + (args[i].lineNumber ? ", line: " + args[i].lineNumber : "") + "]";
		} else {
			try {
				var msg = String(args[i]);
			}
			catch (e) {
				if (djd43.render.html.ie) {
					var msg = "[ActiveXObject]";
				} else {
					var msg = "[unknown]";
				}
			}
		}
		s.push(msg);
	}
	djd43.hostenv.println(s.join(" "));
};
djd43.debugShallow = function (obj) {
	if (!djConfig.isDebug) {
		return;
	}
	djd43.debug("------------------------------------------------------------");
	djd43.debug("Object: " + obj);
	var props = [];
	for (var prop in obj) {
		try {
			props.push(prop + ": " + obj[prop]);
		}
		catch (E) {
			props.push(prop + ": ERROR - " + E.message);
		}
	}
	props.sort();
	for (var i = 0; i < props.length; i++) {
		djd43.debug(props[i]);
	}
	djd43.debug("------------------------------------------------------------");
};
djd43.debugDeep = function (obj) {
	if (!djConfig.isDebug) {
		return;
	}
	if (!djd43.uri || !djd43.uri.dojoUri) {
		return djd43.debug("You'll need to load djd43.uri.* for deep debugging - sorry!");
	}
	if (!window.open) {
		return djd43.debug("Deep debugging is only supported in host environments with window.open");
	}
	var idx = djd43.debugDeep.debugVars.length;
	djd43.debugDeep.debugVars.push(obj);
	var url = (djConfig["dojoDebugDeepHtmlUrl"] || new djd43.uri.Uri(location, djd43.uri.moduleUri("djd43.debug", "deep.html")).toString()) + "?var=" + idx;
	var win = window.open(url, "_blank", "width=600, height=400, resizable=yes, scrollbars=yes, status=yes");
	try {
		win.debugVar = obj;
	}
	catch (e) {
	}
};
djd43.debugDeep.debugVars = [];

