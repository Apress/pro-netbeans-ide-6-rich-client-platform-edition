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
djd43.debug = function () {
	if (!djConfig.isDebug) {
		return;
	}
	var args = arguments;
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
djd43.render.name = navigator.appName;
djd43.render.ver = parseFloat(navigator.appVersion, 10);
switch (navigator.platform) {
  case "MacOS":
	djd43.render.os.osx = true;
	break;
  case "Linux":
	djd43.render.os.linux = true;
	break;
  case "Windows":
	djd43.render.os.win = true;
	break;
  default:
	djd43.render.os.linux = true;
	break;
}
djd43.render.svg.capable = true;
djd43.render.svg.support.builtin = true;
djd43.render.svg.moz = ((navigator.userAgent.indexOf("Gecko") >= 0) && (!((navigator.appVersion.indexOf("Konqueror") >= 0) || (navigator.appVersion.indexOf("Safari") >= 0))));
djd43.render.svg.adobe = (window.parseXML != null);
djd43.hostenv.startPackage("djd43.hostenv");
djd43.hostenv.println = function (s) {
	try {
		var ti = document.createElement("text");
		ti.setAttribute("x", "50");
		ti.setAttribute("y", (25 + 15 * document.getElementsByTagName("text").length));
		ti.appendChild(document.createTextNode(s));
		document.documentElement.appendChild(ti);
	}
	catch (e) {
	}
};
djd43.hostenv.name_ = "svg";
djd43.hostenv.setModulePrefix = function (module, prefix) {
};
djd43.hostenv.getModulePrefix = function (module) {
};
djd43.hostenv.getTextStack = [];
djd43.hostenv.loadUriStack = [];
djd43.hostenv.loadedUris = [];
djd43.hostenv.modules_ = {};
djd43.hostenv.modulesLoadedFired = false;
djd43.hostenv.modulesLoadedListeners = [];
djd43.hostenv.getText = function (uri, cb, data) {
	if (!cb) {
		var cb = function (result) {
			window.alert(result);
		};
	}
	if (!data) {
		window.getUrl(uri, cb);
	} else {
		window.postUrl(uri, data, cb);
	}
};
djd43.hostenv.getLibaryScriptUri = function () {
};
djd43.hostenv.loadUri = function (uri) {
};
djd43.hostenv.loadUriAndCheck = function (uri, module) {
};
djd43.hostenv.loadModule = function (moduleName) {
	var a = moduleName.split(".");
	var currentObj = window;
	var s = [];
	for (var i = 0; i < a.length; i++) {
		if (a[i] == "*") {
			continue;
		}
		s.push(a[i]);
		if (!currentObj[a[i]]) {
			djd43.raise("djd43.require('" + moduleName + "'): module does not exist.");
		} else {
			currentObj = currentObj[a[i]];
		}
	}
	return;
};
djd43.hostenv.startPackage = function (moduleName) {
	var a = moduleName.split(".");
	var currentObj = window;
	var s = [];
	for (var i = 0; i < a.length; i++) {
		if (a[i] == "*") {
			continue;
		}
		s.push(a[i]);
		if (!currentObj[a[i]]) {
			currentObj[a[i]] = {};
		}
		currentObj = currentObj[a[i]];
	}
	return;
};
if (window.parseXML) {
	window.XMLSerialzer = function () {
		function nodeToString(n, a) {
			function fixText(s) {
				return String(s).replace(/\&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
			}
			function fixAttribute(s) {
				return fixText(s).replace(/\"/g, "&quot;");
			}
			switch (n.nodeType) {
			  case 1:
				var name = n.nodeName;
				a.push("<" + name);
				for (var i = 0; i < n.attributes.length; i++) {
					if (n.attributes.item(i).specified) {
						a.push(" " + n.attributes.item(i).nodeName.toLowerCase() + "=\"" + fixAttribute(n.attributes.item(i).nodeValue) + "\"");
					}
				}
				if (n.canHaveChildren || n.hasChildNodes()) {
					a.push(">");
					for (var i = 0; i < n.childNodes.length; i++) {
						nodeToString(n.childNodes.item(i), a);
					}
					a.push("</" + name + ">\n");
				} else {
					a.push(" />\n");
				}
				break;
			  case 3:
				a.push(fixText(n.nodeValue));
				break;
			  case 4:
				a.push("<![CDA" + "TA[\n" + n.nodeValue + "\n]" + "]>");
				break;
			  case 7:
				a.push(n.nodeValue);
				if (/(^<\?xml)|(^<\!DOCTYPE)/.test(n.nodeValue)) {
					a.push("\n");
				}
				break;
			  case 8:
				a.push("<!-- " + n.nodeValue + " -->\n");
				break;
			  case 9:
			  case 11:
				for (var i = 0; i < n.childNodes.length; i++) {
					nodeToString(n.childNodes.item(i), a);
				}
				break;
			  default:
				a.push("<!--\nNot Supported:\n\n" + "nodeType: " + n.nodeType + "\nnodeName: " + n.nodeName + "\n-->");
			}
		}
		this.serializeToString = function (node) {
			var a = [];
			nodeToString(node, a);
			return a.join("");
		};
	};
	window.DOMParser = function () {
		this.parseFromString = function (s) {
			return parseXML(s, window.document);
		};
	};
	window.XMLHttpRequest = function () {
		var uri = null;
		var method = "POST";
		var isAsync = true;
		var cb = function (d) {
			this.responseText = d.content;
			try {
				this.responseXML = parseXML(this.responseText, window.document);
			}
			catch (e) {
			}
			this.status = "200";
			this.statusText = "OK";
			if (!d.success) {
				this.status = "500";
				this.statusText = "Internal Server Error";
			}
			this.onload();
			this.onreadystatechange();
		};
		this.onload = function () {
		};
		this.readyState = 4;
		this.onreadystatechange = function () {
		};
		this.status = 0;
		this.statusText = "";
		this.responseBody = null;
		this.responseStream = null;
		this.responseXML = null;
		this.responseText = null;
		this.abort = function () {
			return;
		};
		this.getAllResponseHeaders = function () {
			return [];
		};
		this.getResponseHeader = function (n) {
			return null;
		};
		this.setRequestHeader = function (nm, val) {
		};
		this.open = function (meth, url, async) {
			method = meth;
			uri = url;
		};
		this.send = function (data) {
			var d = data || null;
			if (method == "GET") {
				getURL(uri, cb);
			} else {
				postURL(uri, data, cb);
			}
		};
	};
}
djd43.requireIf((djConfig["isDebug"] || djConfig["debugAtAllCosts"]), "djd43.debug");

