/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.html.loader");
djd43.require("djd43.widget.HtmlWidget");
djd43.require("djd43.io.*");
djd43.require("djd43.lang.common");
djd43.require("djd43.lang.extras");
djd43.require("djd43.experimental");
djd43.experimental("djd43.widget.html.loader");
djd43.widget.html.loader = new (function () {
	this.toString = function () {
		return "djd43.widget.html.loader";
	};
	var _loader = this;
	djd43.addOnLoad(function () {
		djd43.experimental(_loader.toString());
		var undo = djd43.evalObjPath("djd43.undo.browser");
		if (djConfig["preventBackButtonFix"] && undo && !undo.initialState) {
			undo.setInitialState(new trackerObj);
		}
	});
	var logger = {};
	var trackerObj = function (id, data) {
		this.id = id;
		this.data = data;
	};
	trackerObj.prototype.handle = function (type) {
		if (typeof dojo == "undefined") {
			return;
		}
		var wg = djd43.widget.byId(this.id);
		if (wg) {
			wg.setContent(this.data, true);
		}
	};
	this._log = function (widget, data) {
		if (widget.trackHistory) {
			if (!logger[widget.widgetId]) {
				logger[widget.widgetId] = {childrenIds:[], stack:[data]};
			}
			var children = logger[widget.widgetId].childrenIds;
			while (children && children.length) {
				delete logger[children.pop()];
			}
			for (var child in widget.children) {
				logger[widget.widgetId].childrenIds = child.widgetId;
			}
			djd43.undo.browser.addToHistory(new trackerObj(widget.widgetId, djd43.lang.shallowCopy(data, true)));
		}
	};
	var undef = djd43.lang.isUndefined;
	var isFunc = djd43.lang.isFunction;
	function handleDefaults(e, handler, useAlert) {
		if (!handler) {
			handler = "onContentError";
		}
		if (djd43.lang.isString(e)) {
			e = {_text:e};
		}
		if (!e._text) {
			e._text = e.toString();
		}
		e.toString = function () {
			return this._text;
		};
		if (typeof e.returnValue != "boolean") {
			e.returnValue = true;
		}
		if (typeof e.preventDefault != "function") {
			e.preventDefault = function () {
				this.returnValue = false;
			};
		}
		this[handler](e);
		if (e.returnValue) {
			if (useAlert) {
				alert(e.toString());
			} else {
				this.loader.callOnUnLoad.call(this, false);
				this.onSetContent(e.toString());
			}
		}
	}
	function downloader(bindArgs) {
		for (var x in this.bindArgs) {
			bindArgs[x] = (undef(bindArgs[x]) ? this.bindArgs[x] : undefined);
		}
		var cache = this.cacheContent;
		if (undef(bindArgs.useCache)) {
			bindArgs.useCache = cache;
		}
		if (undef(bindArgs.preventCache)) {
			bindArgs.preventCache = !cache;
		}
		if (undef(bindArgs.mimetype)) {
			bindArgs.mimetype = "text/html";
		}
		this.loader.bindObj = djd43.io.bind(bindArgs);
	}
	function stackRunner(st) {
		var err = "", func = null;
		var scope = this.scriptScope || djd43.global();
		while (st.length) {
			func = st.shift();
			try {
				func.call(scope);
			}
			catch (e) {
				err += "\n" + func + " failed: " + e;
			}
		}
		if (err.length) {
			var name = (st == this.loader.addOnLoads) ? "addOnLoad" : "addOnUnLoad";
			handleDefaults.call(this, name + " failure\n " + err, "onExecError", true);
		}
	}
	function stackPusher(st, obj, func) {
		if (typeof func == "undefined") {
			st.push(obj);
		} else {
			st.push(function () {
				obj[func]();
			});
		}
	}
	function refreshed() {
		this.onResized();
		this.onLoad();
		this.isLoaded = true;
	}
	function asyncParse(data) {
		if (this.executeScripts) {
			this.onExecScript.call(this, data.scripts);
		}
		if (this.parseContent) {
			this.onContentParse.call(this);
		}
		refreshed.call(this);
	}
	function runHandler() {
		if (djd43.lang.isFunction(this.handler)) {
			this.handler(this, this.containerNode || this.domNode);
			refreshed.call(this);
			return false;
		}
		return true;
	}
	this.htmlContentBasicFix = function (s, url) {
		var titles = [], styles = [];
		var regex = /<title[^>]*>([\s\S]*?)<\/title>/i;
		var match, attr;
		while (match = regex.exec(s)) {
			titles.push(match[1]);
			s = s.substring(0, match.index) + s.substr(match.index + match[0].length);
		}
		regex = /(?:<(style)[^>]*>([\s\S]*?)<\/style>|<link ([^>]*rel=['"]?stylesheet['"]?[^>]*)>)/i;
		while (match = regex.exec(s)) {
			if (match[1] && match[1].toLowerCase() == "style") {
				styles.push(djd43.html.fixPathsInCssText(match[2], url));
			} else {
				if (attr = match[3].match(/href=(['"]?)([^'">]*)\1/i)) {
					styles.push({path:attr[2]});
				}
			}
			s = s.substring(0, match.index) + s.substr(match.index + match[0].length);
		}
		return {"s":s, "titles":titles, "styles":styles};
	};
	this.htmlContentAdjustPaths = function (s, url) {
		var tag = "", str = "", tagFix = "", path = "";
		var attr = [], origPath = "", fix = "";
		var regexFindTag = /<[a-z][a-z0-9]*[^>]*\s(?:(?:src|href|style)=[^>])+[^>]*>/i;
		var regexFindAttr = /\s(src|href|style)=(['"]?)([\w()\[\]\/.,\\'"-:;#=&?\s@]+?)\2/i;
		var regexProtocols = /^(?:[#]|(?:(?:https?|ftps?|file|javascript|mailto|news):))/;
		while (tag = regexFindTag.exec(s)) {
			str += s.substring(0, tag.index);
			s = s.substring((tag.index + tag[0].length), s.length);
			tag = tag[0];
			tagFix = "";
			while (attr = regexFindAttr.exec(tag)) {
				path = "";
				origPath = attr[3];
				switch (attr[1].toLowerCase()) {
				  case "src":
				  case "href":
					if (regexProtocols.exec(origPath)) {
						path = origPath;
					} else {
						path = (new djd43.uri.Uri(url, origPath).toString());
					}
					break;
				  case "style":
					path = djd43.html.fixPathsInCssText(origPath, url);
					break;
				  default:
					path = origPath;
				}
				fix = " " + attr[1] + "=" + attr[2] + path + attr[2];
				tagFix += tag.substring(0, attr.index) + fix;
				tag = tag.substring((attr.index + attr[0].length), tag.length);
			}
			str += tagFix + tag;
		}
		return str + s;
	};
	this.htmlContentScripts = function (s, collectScripts) {
		var scripts = [], requires = [], match = [];
		var attr = "", tmp = null, tag = "", sc = "", str = "";
		var regex = /<script([^>]*)>([\s\S]*?)<\/script>/i;
		var regexSrc = /src=(['"]?)([^"']*)\1/i;
		var regexDojoJs = /.*(\bdojo\b\.js(?:\.uncompressed\.js)?)$/;
		var regexInvalid = /(?:var )?\bdjConfig\b(?:[\s]*=[\s]*\{[^}]+\}|\.[\w]*[\s]*=[\s]*[^;\n]*)?;?|dojo\.hostenv\.writeIncludes\(\s*\);?/g;
		var regexRequires = /dojo\.(?:(?:require(?:After)?(?:If)?)|(?:widget\.(?:manager\.)?registerWidgetPackage)|(?:(?:hostenv\.)?setModulePrefix)|defineNamespace)\((['"]).*?\1\)\s*;?/;
		while (match = regex.exec(s)) {
			if (this.executeScripts && match[1]) {
				if (attr = regexSrc.exec(match[1])) {
					if (regexDojoJs.exec(attr[2])) {
						djd43.debug("Security note! inhibit:" + attr[2] + " from  beeing loaded again.");
					} else {
						scripts.push({path:attr[2]});
					}
				}
			}
			if (match[2]) {
				sc = match[2].replace(regexInvalid, "");
				if (!sc) {
					continue;
				}
				while (tmp = regexRequires.exec(sc)) {
					requires.push(tmp[0]);
					sc = sc.substring(0, tmp.index) + sc.substr(tmp.index + tmp[0].length);
				}
				if (collectScripts) {
					scripts.push(sc);
				}
			}
			s = s.substr(0, match.index) + s.substr(match.index + match[0].length);
		}
		if (collectScripts) {
			var regex = /(<[a-zA-Z][a-zA-Z0-9]*\s[^>]*\S=(['"])[^>]*[^\.\]])scriptScope([^>]*>)/;
			str = "";
			while (tag = regex.exec(s)) {
				tmp = ((tag[2] == "'") ? "\"" : "'");
				str += s.substring(0, tag.index);
				s = s.substr(tag.index).replace(regex, "$1djd43.widget.byId(" + tmp + this.widgetId + tmp + ").scriptScope$3");
			}
			s = str + s;
		}
		return {"s":s, "requires":requires, "scripts":scripts};
	};
	this.splitAndFixPaths = function (args) {
		if (!args.url) {
			args.url = "./";
		}
		url = new djd43.uri.Uri(location, args.url).toString();
		var ret = {"xml":"", "styles":[], "titles":[], "requires":[], "scripts":[], "url":url};
		if (args.content) {
			var tmp = null, content = args.content;
			if (args.adjustPaths) {
				content = _loader.htmlContentAdjustPaths.call(this, content, url);
			}
			tmp = _loader.htmlContentBasicFix.call(this, content, url);
			content = tmp.s;
			ret.styles = tmp.styles;
			ret.titles = tmp.titles;
			if (args.collectRequires || args.collectScripts) {
				tmp = _loader.htmlContentScripts.call(this, content, args.collectScripts);
				content = tmp.s;
				ret.requires = tmp.requires;
				ret.scripts = tmp.scripts;
			}
			var match = [];
			if (args.bodyExtract) {
				match = content.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
				if (match) {
					content = match[1];
				}
			}
			ret.xml = content;
		}
		return ret;
	};
	this.hookUp = function (args) {
		var widget = args.widget;
		if (djd43.lang.isString(widget)) {
			if (args.mixin) {
				djd43.raise(this.toString() + ", cant use mixin when widget is a string");
			}
			widget = djd43.evalObjPath(widget);
		}
		if (!widget || !(widget instanceof djd43.widget.HtmlWidget)) {
			djd43.raise(this.toString() + " Widget isn't defined or isn't a HtmlWidget instance");
		}
		if (widget.loader && widget.setUrl) {
			return;
		}
		var widgetProto = (args.mixin) ? widget : widget.constructor.prototype;
		widget.loader = {isLoaded:false, styleNodes:[], addOnLoads:[], addOnUnLoads:[], callOnUnLoad:(function (canCall) {
			return function (after) {
				this.abort();
				if (canCall) {
					this.onUnLoad();
				}
				canCall = after;
			};
		})(false), bindObj:null, unHook:(function (w, wg) {
			var oldProps = {isContainer:w.isContainer, adjustPats:w.adjustPaths, href:w.href, extractContent:w.extractContent, parseContent:w.parseContent, cacheContent:w.cacheContent, bindArgs:w.bindArgs, preload:w.preload, refreshOnShow:w.refreshOnShow, handler:w.handler, trackHistory:w.trackHistory, executeScripts:w.executeScripts, scriptScope:w.scriptScope, postCreate:w.postCreate, show:w.show, refresh:w.refresh, loadContents:w.loadContents, abort:w.abort, destroy:w.destroy, onLoad:w.onLoad, onUnLoad:w.onUnLoad, addOnLoad:w.addOnLoad, addOnUnLoad:w.addOnUnLoad, onDownloadStart:w.onDownloadStart, onDownloadEnd:w.onDownloadEnd, onDownloadError:w.onDownloadError, onContentError:w.onContentError, onExecError:w.onExecError, onSetContent:w.onSetContent, setUrl:w.setUrl, setContent:w.setContent, onContentParse:w.onContentParse, onExecScript:w.onExecScript, setHandler:w.setHandler};
			return function () {
				if (wg.abort) {
					wg.abort();
				}
				if ((w != wg) && (djd43.widget.byType(wg.widgetType).length > 1)) {
					return;
				}
				for (var x in oldProps) {
					if (oldProps[x] === undefined) {
						delete w[x];
						continue;
					}
					w[x] = oldProps[x];
				}
				delete wg._loader_defined;
				delete wg.loader;
			};
		})(widgetProto, widget)};
		if (widgetProto._loader_defined || widget._loader_defined) {
			return;
		}
		djd43.mixin(widgetProto, {isContainer:true, adjustPaths:undef(widgetProto.adjustPaths) ? true : widgetProto.adjustPaths, href:undef(widgetProto.href) ? "" : widgetProto.href, extractContent:undef(widgetProto.extractContent) ? true : widgetProto.extractContent, parseContent:undef(widgetProto.parseContent) ? true : widgetProto.parseContent, cacheContent:undef(widgetProto.cacheContent) ? true : widgetProto.cacheContent, bindArgs:undef(widgetProto.bindArgs) ? {} : widgetProto.bindArgs, preload:undef(widgetProto.preload) ? false : widgetProto.preload, refreshOnShow:undef(widgetProto.refreshOnShow) ? false : widgetProto.refreshOnShow, handler:undef(widgetProto.handler) ? "" : widgetProto.handler, executeScripts:undef(widgetProto.executeScripts) ? false : widgetProto.executeScripts, trackHistory:undef(widgetProto.tracHistory) ? false : widgetProto.trackHistory, scriptScope:null});
		widgetProto.postCreate = (function (postCreate) {
			return function () {
				if (widgetProto.constructor.superclass.postCreate != postCreate) {
					postCreate.apply(this, arguments);
				} else {
					widgetProto.constructor.superclass.postCreate.apply(this, arguments);
				}
				if (this.handler !== "") {
					this.setHandler(this.handler);
				}
				if (this.isShowing() || this.preload) {
					this.loadContents();
					if (!this.href) {
						_loader._log(this, (this.domNode || this.containerNode).innerHTML);
					}
				}
			};
		})(widgetProto.postCreate);
		widgetProto.show = (function (show) {
			return function () {
				if (this.refreshOnShow) {
					this.refresh();
				} else {
					this.loadContents();
				}
				if ((widgetProto.constructor.superclass.show == show) || !isFunc(show)) {
					widgetProto.constructor.superclass.show.apply(this, arguments);
				} else {
					show.apply(this, arguments);
				}
			};
		})(widgetProto.show);
		widgetProto.destroy = (function (destroy) {
			return function (destroy) {
				this.onUnLoad();
				this.abort();
				this.loader.unHook();
				if ((widgetProto.constructor.superclass.destroy != destroy) && isFunc(destroy)) {
					destroy.apply(this, arguments);
				} else {
					widgetProto.constructor.superclass.destroy.apply(this, arguments);
				}
			};
		})(widgetProto.destroy);
		if (!widgetProto.refresh) {
			widgetProto.refresh = function () {
				this.loader.isLoaded = false;
				this.loadContents();
			};
		}
		if (!widgetProto.loadContents) {
			widgetProto.loadContents = function () {
				if (this.loader.isLoaded) {
					return;
				}
				if (isFunc(this.handler)) {
					runHandler.call(this);
				} else {
					if (this.href !== "") {
						handleDefaults.call(this, "Loading...", "onDownloadStart");
						var self = this, url = this.href;
						downloader.call(this, {url:url, load:function (type, data, xhr) {
							self.onDownloadEnd.call(self, url, data);
						}, error:function (type, err, xhr) {
							var e = {responseText:xhr.responseText, status:xhr.status, statusText:xhr.statusText, responseHeaders:(xhr.getAllResponseHeaders) ? xhr.getAllResponseHeaders() : [], _text:"Error loading '" + url + "' (" + xhr.status + " " + xhr.statusText + ")"};
							handleDefaults.call(self, e, "onDownloadError");
							self.onLoad();
						}});
					}
				}
			};
		}
		if (!widgetProto.abort) {
			widgetProto.abort = function () {
				if (!this.loader || !this.loader.bindObj || !this.loader.bindObj.abort) {
					return;
				}
				this.loader.bindObj.abort();
				this.loader.bindObj = null;
			};
		}
		if (!widgetProto.onLoad) {
			widgetProto.onLoad = function () {
				stackRunner.call(this, this.loader.addOnLoads);
				this.loader.isLoaded = true;
			};
		}
		if (!widgetProto.onUnLoad) {
			widgetProto.onUnLoad = function () {
				stackRunner.call(this, this.loader.addOnUnLoads);
				delete this.scriptScope;
			};
		}
		if (!widgetProto.addOnLoad) {
			widgetProto.addOnLoad = function (obj, func) {
				stackPusher.call(this, this.loader.addOnLoads, obj, func);
			};
		}
		if (!widgetProto.addOnUnLoad) {
			widgetProto.addOnUnLoad = function (obj, func) {
				stackPusher.call(this, this.loader.addOnUnLoads, obj, func);
			};
		}
		if (!widgetProto.onExecError) {
			widgetProto.onExecError = function () {
			};
		}
		if (!widgetProto.onContentError) {
			widgetProto.onContentError = function () {
			};
		}
		if (!widgetProto.onDownloadError) {
			widgetProto.onDownloadError = function () {
			};
		}
		if (!widgetProto.onDownloadStart) {
			widgetProto.onDownloadStart = function (onDownloadStart) {
			};
		}
		if (!widgetProto.onDownloadEnd) {
			widgetProto.onDownloadEnd = function (url, data) {
				var args = {content:data, url:url, adjustPaths:this.adjustPaths, collectScripts:this.executeScripts, collectRequires:this.parseContent, bodyExtract:this.extractContent};
				data = _loader.splitAndFixPaths.call(this, args);
				this.setContent(data);
			};
		}
		if (!widgetProto.onSetContent) {
			widgetProto.onSetContent = function (cont) {
				this.destroyChildren();
				var styleNodes = this.loader.styleNodes;
				while (styleNodes.length) {
					var st = styleNodes.pop();
					if (st && st.parentNode) {
						st.parentNode.removeChild(st);
					}
				}
				var node = this.containerNode || this.domNode;
				while (node.firstChild) {
					try {
						djd43.event.browser.clean(node.firstChild);
					}
					catch (e) {
					}
					node.removeChild(node.firstChild);
				}
				try {
					if (typeof cont != "string") {
						node.appendChild(cont);
					} else {
						try {
							node.innerHTML = cont;
						}
						catch (e) {
							var tmp;
							(tmp = djd43.doc().createElement("div")).innerHTML = cont;
							while (tmp.firstChild) {
								node.appendChild(tmp.removeChild(tmp.firstChild));
							}
						}
					}
				}
				catch (e) {
					e._text = "Could'nt load content: " + e;
					var useAlert = (this.loader._onSetContent_err == e._text);
					this.loader._onSetContent_err = e._text;
					handleDefaults.call(this, e, "onContentError", useAlert);
				}
			};
		}
		if (!widgetProto.setUrl) {
			widgetProto.setUrl = function (url) {
				this.href = url;
				this.loader.isLoaded = false;
				if (this.preload || this.isShowing()) {
					this.loadContents();
				}
			};
		}
		if (!widgetProto.setContent) {
			widgetProto.setContent = function (data, dontLog) {
				this.loader.callOnUnLoad.call(this, true);
				if (!data || djd43.html.isNode(data)) {
					this.onSetContent(data);
					refreshed.call(this);
				} else {
					if (typeof data.xml != "string") {
						this.href = "";
						var args = {content:data, url:this.href, adjustPaths:this.adjustPaths, collectScripts:this.executeScripts, collectRequires:this.parseContent, bodyExtract:this.extractContent};
						data = _loader.splitAndFixPaths.call(this, args);
					} else {
						if (data.url != "./") {
							this.url = data.url;
						}
					}
					this.onSetContent(data.xml);
					for (var i = 0, styles = data.styles; i < styles.length; i++) {
						if (styles[i].path) {
							this.loader.styleNodes.push(djd43.html.insertCssFile(styles[i].path));
						} else {
							this.loader.styleNodes.push(djd43.html.insertCssText(styles[i]));
						}
					}
					if (this.parseContent) {
						for (var i = 0, requires = data.requires; i < requires.length; i++) {
							try {
								eval(requires[i]);
							}
							catch (e) {
								e._text = "djd43.widget.html.loader.hookUp: error in package loading calls, " + (e.description || e);
								handleDefaults.call(this, e, "onContentError", true);
							}
						}
					}
					if (djd43.hostenv.isXDomain && data.requires.length) {
						djd43.addOnLoad(function () {
							asyncParse.call(this, data);
							if (!dontLog) {
								_loader._log(this, data);
							}
						});
						dontLog = true;
					} else {
						asyncParse.call(this, data);
					}
				}
				if (!dontLog) {
				}
			};
		}
		if (!widgetProto.onContentParse) {
			widgetProto.onContentParse = function () {
				var node = this.containerNode || this.domNode;
				var parser = new djd43.xml.Parse();
				var frag = parser.parseElement(node, null, true);
				djd43.widget.getParser().createSubComponents(frag, this);
			};
		}
		if (!widgetProto.onExecScript) {
			widgetProto.onExecScript = function (scripts) {
				var self = this, tmp = "", code = "";
				for (var i = 0; i < scripts.length; i++) {
					if (scripts[i].path) {
						var url = scripts[i].path;
						downloader.call(this, {"url":url, "load":function (type, scriptStr) {
							(function () {
								tmp = scriptStr;
								scripts[i] = scriptStr;
							}).call(self);
						}, "error":function (type, error) {
							error._text = type + " downloading remote script";
							handleDefaults.call(self, error, "onExecError", true);
						}, "mimetype":"text/plain", "sync":true});
						code += tmp;
					} else {
						code += scripts[i];
					}
				}
				try {
					delete this.scriptScope;
					this.scriptScope = new (new Function("_container_", code + "; return this;"))(self);
				}
				catch (e) {
					e._text = "Error running scripts from content:\n" + (e.description || e.toString());
					handleDefaults.call(this, e, "onExecError", true);
				}
			};
		}
		if (!widgetProto.setHandler) {
			widgetProto.setHandler = function (handler) {
				var fcn = djd43.lang.isFunction(handler) ? handler : window[handler];
				if (!isFunc(fcn)) {
					handleDefaults.call(this, "Unable to set handler, '" + handler + "' not a function.", "onExecError", true);
					return;
				}
				this.handler = function () {
					return fcn.apply(this, arguments);
				};
			};
		}
		widgetProto._loader_defined = true;
	};
})();

