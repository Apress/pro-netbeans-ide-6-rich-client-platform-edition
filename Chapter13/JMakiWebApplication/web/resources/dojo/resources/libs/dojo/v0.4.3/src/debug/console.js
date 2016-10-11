/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.debug.console");
djd43.require("djd43.logging.ConsoleLogger");
if (window.console) {
	if (console.info != null) {
		djd43.hostenv.println = function () {
			if (!djConfig.isDebug) {
				return;
			}
			console.info.apply(console, arguments);
		};
		djd43.debug = djd43.hostenv.println;
		djd43.debugDeep = djd43.debug;
		djd43.debugShallow = function (obj, showMethods, sort) {
			if (!djConfig.isDebug) {
				return;
			}
			showMethods = (showMethods != false);
			sort = (sort != false);
			if (obj == null || obj.constructor == null) {
				return djd43.debug(obj);
			}
			var type = obj.declaredClass;
			if (type == null) {
				type = obj.constructor.toString().match(/function\s*(.*)\(/);
				if (type) {
					type = type[1];
				}
			}
			if (type) {
				if (type == "String" || type == "Number") {
					return djd43.debug(type + ": ", obj);
				}
				if (showMethods && !sort) {
					var sortedObj = obj;
				} else {
					var propNames = [];
					if (showMethods) {
						for (var prop in obj) {
							propNames.push(prop);
						}
					} else {
						for (var prop in obj) {
							if (typeof obj[prop] != "function") {
								propNames.push(prop);
							} else {
								djd43.debug(prop);
							}
						}
					}
					if (sort) {
						propNames.sort();
					}
					var sortedObj = {};
					djd43.lang.forEach(propNames, function (prop) {
						sortedObj[prop] = obj[prop];
					});
				}
				return djd43.debug(type + ": %o\n%2.o", obj, sortedObj);
			}
			return djd43.debug(obj.constructor + ": ", obj);
		};
	} else {
		if (console.log != null) {
			djd43.hostenv.println = function () {
				if (!djConfig.isDebug) {
					return;
				}
				var args = djd43.lang.toArray(arguments);
				console.log("DEBUG: " + args.join(" "));
			};
			djd43.debug = djd43.hostenv.println;
		} else {
			djd43.debug("djd43.debug.console requires Firebug > 0.4");
		}
	}
} else {
	if (djd43.render.html.opera) {
		if (opera && opera.postError) {
			djd43.hostenv.println = opera.postError;
		} else {
			djd43.debug("djd43.debug.Opera requires Opera > 8.0");
		}
	}
}

