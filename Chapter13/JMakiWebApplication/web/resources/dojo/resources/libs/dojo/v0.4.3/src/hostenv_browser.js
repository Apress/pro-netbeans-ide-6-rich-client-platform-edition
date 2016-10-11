/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



if (typeof window != "undefined") {
	(function () {
		if (djConfig.allowQueryConfig) {
			var baseUrl = document.location.toString();
			var params = baseUrl.split("?", 2);
			if (params.length > 1) {
				var paramStr = params[1];
				var pairs = paramStr.split("&");
				for (var x in pairs) {
					var sp = pairs[x].split("=");
					if ((sp[0].length > 9) && (sp[0].substr(0, 9) == "djConfig.")) {
						var opt = sp[0].substr(9);
						try {
							djConfig[opt] = eval(sp[1]);
						}
						catch (e) {
							djConfig[opt] = sp[1];
						}
					}
				}
			}
		}
		if (((djConfig["baseScriptUri"] == "") || (djConfig["baseRelativePath"] == "")) && (document && document.getElementsByTagName)) {
			var scripts = document.getElementsByTagName("script");
			var rePkg = /(__package__|dojo|bootstrap1)\.js([\?\.]|$)/i;
			for (var i = 0; i < scripts.length; i++) {
				var src = scripts[i].getAttribute("src");
				if (!src) {
					continue;
				}
				var m = src.match(rePkg);
				if (m) {
					var root = src.substring(0, m.index);
					if (src.indexOf("bootstrap1") > -1) {
						root += "../";
					}
					if (!this["djConfig"]) {
						djConfig = {};
					}
					if (djConfig["baseScriptUri"] == "") {
						djConfig["baseScriptUri"] = root;
					}
					if (djConfig["baseRelativePath"] == "") {
						djConfig["baseRelativePath"] = root;
					}
					break;
				}
			}
		}
		var dr = djd43.render;
		var drh = djd43.render.html;
		var drs = djd43.render.svg;
		var dua = (drh.UA = navigator.userAgent);
		var dav = (drh.AV = navigator.appVersion);
		var t = true;
		var f = false;
		drh.capable = t;
		drh.support.builtin = t;
		dr.ver = parseFloat(drh.AV);
		dr.os.mac = dav.indexOf("Macintosh") >= 0;
		dr.os.win = dav.indexOf("Windows") >= 0;
		dr.os.linux = dav.indexOf("X11") >= 0;
		drh.opera = dua.indexOf("Opera") >= 0;
		drh.khtml = (dav.indexOf("Konqueror") >= 0) || (dav.indexOf("Safari") >= 0);
		drh.safari = dav.indexOf("Safari") >= 0;
		var geckoPos = dua.indexOf("Gecko");
		drh.mozilla = drh.moz = (geckoPos >= 0) && (!drh.khtml);
		if (drh.mozilla) {
			drh.geckoVersion = dua.substring(geckoPos + 6, geckoPos + 14);
		}
		drh.ie = (document.all) && (!drh.opera);
		drh.ie50 = drh.ie && dav.indexOf("MSIE 5.0") >= 0;
		drh.ie55 = drh.ie && dav.indexOf("MSIE 5.5") >= 0;
		drh.ie60 = drh.ie && dav.indexOf("MSIE 6.0") >= 0;
		drh.ie70 = drh.ie && dav.indexOf("MSIE 7.0") >= 0;
		var cm = document["compatMode"];
		drh.quirks = (cm == "BackCompat") || (cm == "QuirksMode") || drh.ie55 || drh.ie50;
		djd43.locale = djd43.locale || (drh.ie ? navigator.userLanguage : navigator.language).toLowerCase();
		dr.vml.capable = drh.ie;
		drs.capable = f;
		drs.support.plugin = f;
		drs.support.builtin = f;
		var tdoc = window["document"];
		var tdi = tdoc["implementation"];
		if ((tdi) && (tdi["hasFeature"]) && (tdi.hasFeature("org.w3c.dom.svg", "1.0"))) {
			drs.capable = t;
			drs.support.builtin = t;
			drs.support.plugin = f;
		}
		if (drh.safari) {
			var tmp = dua.split("AppleWebKit/")[1];
			var ver = parseFloat(tmp.split(" ")[0]);
			if (ver >= 420) {
				drs.capable = t;
				drs.support.builtin = t;
				drs.support.plugin = f;
			}
		} else {
		}
	})();
	djd43.hostenv.startPackage("djd43.hostenv");
	djd43.render.name = djd43.hostenv.name_ = "browser";
	djd43.hostenv.searchIds = [];
	djd43.hostenv._XMLHTTP_PROGIDS = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"];
	djd43.hostenv.getXmlhttpObject = function () {
		var http = null;
		var last_e = null;
		try {
			http = new XMLHttpRequest();
		}
		catch (e) {
		}
		if (!http) {
			for (var i = 0; i < 3; ++i) {
				var progid = djd43.hostenv._XMLHTTP_PROGIDS[i];
				try {
					http = new ActiveXObject(progid);
				}
				catch (e) {
					last_e = e;
				}
				if (http) {
					djd43.hostenv._XMLHTTP_PROGIDS = [progid];
					break;
				}
			}
		}
		if (!http) {
			return djd43.raise("XMLHTTP not available", last_e);
		}
		return http;
	};
	djd43.hostenv._blockAsync = false;
	djd43.hostenv.getText = function (uri, async_cb, fail_ok) {
		if (!async_cb) {
			this._blockAsync = true;
		}
		var http = this.getXmlhttpObject();
		function isDocumentOk(http) {
			var stat = http["status"];
			return Boolean((!stat) || ((200 <= stat) && (300 > stat)) || (stat == 304));
		}
		if (async_cb) {
			var _this = this, timer = null, gbl = djd43.global();
			var xhr = djd43.evalObjPath("djd43.io.XMLHTTPTransport");
			http.onreadystatechange = function () {
				if (timer) {
					gbl.clearTimeout(timer);
					timer = null;
				}
				if (_this._blockAsync || (xhr && xhr._blockAsync)) {
					timer = gbl.setTimeout(function () {
						http.onreadystatechange.apply(this);
					}, 10);
				} else {
					if (4 == http.readyState) {
						if (isDocumentOk(http)) {
							async_cb(http.responseText);
						}
					}
				}
			};
		}
		http.open("GET", uri, async_cb ? true : false);
		try {
			http.send(null);
			if (async_cb) {
				return null;
			}
			if (!isDocumentOk(http)) {
				var err = Error("Unable to load " + uri + " status:" + http.status);
				err.status = http.status;
				err.responseText = http.responseText;
				throw err;
			}
		}
		catch (e) {
			this._blockAsync = false;
			if ((fail_ok) && (!async_cb)) {
				return null;
			} else {
				throw e;
			}
		}
		this._blockAsync = false;
		return http.responseText;
	};
	djd43.hostenv.defaultDebugContainerId = "dojoDebug";
	djd43.hostenv._println_buffer = [];
	djd43.hostenv._println_safe = false;
	djd43.hostenv.println = function (line) {
		if (!djd43.hostenv._println_safe) {
			djd43.hostenv._println_buffer.push(line);
		} else {
			try {
				var console = document.getElementById(djConfig.debugContainerId ? djConfig.debugContainerId : djd43.hostenv.defaultDebugContainerId);
				if (!console) {
					console = djd43.body();
				}
				var div = document.createElement("div");
				div.appendChild(document.createTextNode(line));
				console.appendChild(div);
			}
			catch (e) {
				try {
					document.write("<div>" + line + "</div>");
				}
				catch (e2) {
					window.status = line;
				}
			}
		}
	};
	djd43.addOnLoad(function () {
		djd43.hostenv._println_safe = true;
		while (djd43.hostenv._println_buffer.length > 0) {
			djd43.hostenv.println(djd43.hostenv._println_buffer.shift());
		}
	});
	function dj_addNodeEvtHdlr(node, evtName, fp) {
		var oldHandler = node["on" + evtName] || function () {
		};
		node["on" + evtName] = function () {
			fp.apply(node, arguments);
			oldHandler.apply(node, arguments);
		};
		return true;
	}
	djd43.hostenv._djInitFired = false;
	function dj_load_init(e) {
		djd43.hostenv._djInitFired = true;
		var type = (e && e.type) ? e.type.toLowerCase() : "load";
		if (arguments.callee.initialized || (type != "domcontentloaded" && type != "load")) {
			return;
		}
		arguments.callee.initialized = true;
		if (typeof (_timer) != "undefined") {
			clearInterval(_timer);
			delete _timer;
		}
		var initFunc = function () {
			if (djd43.render.html.ie) {
				djd43.hostenv.makeWidgets();
			}
		};
		if (djd43.hostenv.inFlightCount == 0) {
			initFunc();
			djd43.hostenv.modulesLoaded();
		} else {
			djd43.hostenv.modulesLoadedListeners.unshift(initFunc);
		}
	}
	if (document.addEventListener) {
		if (djd43.render.html.opera || (djd43.render.html.moz && (djConfig["enableMozDomContentLoaded"] === true))) {
			document.addEventListener("DOMContentLoaded", dj_load_init, null);
		}
		window.addEventListener("load", dj_load_init, null);
	}
	if (djd43.render.html.ie && djd43.render.os.win) {
		document.attachEvent("onreadystatechange", function (e) {
			if (document.readyState == "complete") {
				dj_load_init();
			}
		});
	}
	if (/(WebKit|khtml)/i.test(navigator.userAgent)) {
		var _timer = setInterval(function () {
			if (/loaded|complete/.test(document.readyState)) {
				dj_load_init();
			}
		}, 10);
	}
	if (djd43.render.html.ie) {
		dj_addNodeEvtHdlr(window, "beforeunload", function () {
			djd43.hostenv._unloading = true;
			window.setTimeout(function () {
				djd43.hostenv._unloading = false;
			}, 0);
		});
	}
	dj_addNodeEvtHdlr(window, "unload", function () {
		djd43.hostenv.unloaded();
		if ((!djd43.render.html.ie) || (djd43.render.html.ie && djd43.hostenv._unloading)) {
			djd43.hostenv.unloaded();
		}
	});
	djd43.hostenv.makeWidgets = function () {
		var sids = [];
		if (djConfig.searchIds && djConfig.searchIds.length > 0) {
			sids = sids.concat(djConfig.searchIds);
		}
		if (djd43.hostenv.searchIds && djd43.hostenv.searchIds.length > 0) {
			sids = sids.concat(djd43.hostenv.searchIds);
		}
		if ((djConfig.parseWidgets) || (sids.length > 0)) {
			if (djd43.evalObjPath("djd43.widget.Parse")) {
				var parser = new djd43.xml.Parse();
				if (sids.length > 0) {
					for (var x = 0; x < sids.length; x++) {
						var tmpNode = document.getElementById(sids[x]);
						if (!tmpNode) {
							continue;
						}
						var frag = parser.parseElement(tmpNode, null, true);
						djd43.widget.getParser().createComponents(frag);
					}
				} else {
					if (djConfig.parseWidgets) {
						var frag = parser.parseElement(djd43.body(), null, true);
						djd43.widget.getParser().createComponents(frag);
					}
				}
			}
		}
	};
	djd43.addOnLoad(function () {
		if (!djd43.render.html.ie) {
			djd43.hostenv.makeWidgets();
		}
	});
	try {
		if (djd43.render.html.ie) {
			document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
			document.createStyleSheet().addRule("v\\:*", "behavior:url(#default#VML)");
		}
	}
	catch (e) {
	}
	djd43.hostenv.writeIncludes = function () {
	};
	if (!dj_undef("document", this)) {
		dj_currentDocument = this.document;
	}
	djd43.doc = function () {
		return dj_currentDocument;
	};
	djd43.body = function () {
		return djd43.doc().body || djd43.doc().getElementsByTagName("body")[0];
	};
	djd43.byId = function (id, doc) {
		if ((id) && ((typeof id == "string") || (id instanceof String))) {
			if (!doc) {
				doc = dj_currentDocument;
			}
			var ele = doc.getElementById(id);
			if (ele && (ele.id != id) && doc.all) {
				ele = null;
				eles = doc.all[id];
				if (eles) {
					if (eles.length) {
						for (var i = 0; i < eles.length; i++) {
							if (eles[i].id == id) {
								ele = eles[i];
								break;
							}
						}
					} else {
						ele = eles;
					}
				}
			}
			return ele;
		}
		return id;
	};
	djd43.setContext = function (globalObject, globalDocument) {
		dj_currentContext = globalObject;
		dj_currentDocument = globalDocument;
	};
	djd43._fireCallback = function (callback, context, cbArguments) {
		if ((context) && ((typeof callback == "string") || (callback instanceof String))) {
			callback = context[callback];
		}
		return (context ? callback.apply(context, cbArguments || []) : callback());
	};
	djd43.withGlobal = function (globalObject, callback, thisObject, cbArguments) {
		var rval;
		var oldGlob = dj_currentContext;
		var oldDoc = dj_currentDocument;
		try {
			djd43.setContext(globalObject, globalObject.document);
			rval = djd43._fireCallback(callback, thisObject, cbArguments);
		}
		finally {
			djd43.setContext(oldGlob, oldDoc);
		}
		return rval;
	};
	djd43.withDoc = function (documentObject, callback, thisObject, cbArguments) {
		var rval;
		var oldDoc = dj_currentDocument;
		try {
			dj_currentDocument = documentObject;
			rval = djd43._fireCallback(callback, thisObject, cbArguments);
		}
		finally {
			dj_currentDocument = oldDoc;
		}
		return rval;
	};
}
djd43.requireIf((djConfig["isDebug"] || djConfig["debugAtAllCosts"]), "djd43.debug");
djd43.requireIf(djConfig["debugAtAllCosts"] && !window.widget && !djConfig["useXDomain"], "djd43.browser_debug");
djd43.requireIf(djConfig["debugAtAllCosts"] && !window.widget && djConfig["useXDomain"], "djd43.browser_debug_xd");

