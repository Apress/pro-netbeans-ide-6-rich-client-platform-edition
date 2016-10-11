/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.debug.Firebug");
djd43.deprecated("djd43.debug.Firebug is slated for removal in 0.5; use djd43.debug.console instead.", "0.5");
if (djd43.render.html.moz) {
	if (console && console.log) {
		var consoleLog = function () {
			if (!djConfig.isDebug) {
				return;
			}
			var args = djd43.lang.toArray(arguments);
			args.splice(0, 0, "DEBUG: ");
			console.log.apply(console, args);
		};
		djd43.debug = consoleLog;
		djd43.debugDeep = consoleLog;
		djd43.debugShallow = function (obj) {
			if (!djConfig.isDebug) {
				return;
			}
			if (djd43.lang.isArray(obj)) {
				console.log("Array: ", obj);
				for (var i = 0; x < obj.length; i++) {
					console.log("	", "[" + i + "]", obj[i]);
				}
			} else {
				console.log("Object: ", obj);
				var propNames = [];
				for (var prop in obj) {
					propNames.push(prop);
				}
				propNames.sort();
				djd43.lang.forEach(propNames, function (prop) {
					try {
						console.log("	", prop, obj[prop]);
					}
					catch (e) {
						console.log("	", prop, "ERROR", e.message, e);
					}
				});
			}
		};
	} else {
		djd43.debug("djd43.debug.Firebug requires Firebug > 0.4");
	}
}

