/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.html.style");
djd43.require("djd43.html.common");
djd43.require("djd43.uri.Uri");
djd43.html.getClass = function (node) {
	node = djd43.byId(node);
	if (!node) {
		return "";
	}
	var cs = "";
	if (node.className) {
		cs = node.className;
	} else {
		if (djd43.html.hasAttribute(node, "class")) {
			cs = djd43.html.getAttribute(node, "class");
		}
	}
	return cs.replace(/^\s+|\s+$/g, "");
};
djd43.html.getClasses = function (node) {
	var c = djd43.html.getClass(node);
	return (c == "") ? [] : c.split(/\s+/g);
};
djd43.html.hasClass = function (node, classname) {
	return (new RegExp("(^|\\s+)" + classname + "(\\s+|$)")).test(djd43.html.getClass(node));
};
djd43.html.prependClass = function (node, classStr) {
	classStr += " " + djd43.html.getClass(node);
	return djd43.html.setClass(node, classStr);
};
djd43.html.addClass = function (node, classStr) {
	if (djd43.html.hasClass(node, classStr)) {
		return false;
	}
	classStr = (djd43.html.getClass(node) + " " + classStr).replace(/^\s+|\s+$/g, "");
	return djd43.html.setClass(node, classStr);
};
djd43.html.setClass = function (node, classStr) {
	node = djd43.byId(node);
	var cs = new String(classStr);
	try {
		if (typeof node.className == "string") {
			node.className = cs;
		} else {
			if (node.setAttribute) {
				node.setAttribute("class", classStr);
				node.className = cs;
			} else {
				return false;
			}
		}
	}
	catch (e) {
		djd43.debug("djd43.html.setClass() failed", e);
	}
	return true;
};
djd43.html.removeClass = function (node, classStr, allowPartialMatches) {
	try {
		if (!allowPartialMatches) {
			var newcs = djd43.html.getClass(node).replace(new RegExp("(^|\\s+)" + classStr + "(\\s+|$)"), "$1$2");
		} else {
			var newcs = djd43.html.getClass(node).replace(classStr, "");
		}
		djd43.html.setClass(node, newcs);
	}
	catch (e) {
		djd43.debug("djd43.html.removeClass() failed", e);
	}
	return true;
};
djd43.html.replaceClass = function (node, newClass, oldClass) {
	djd43.html.removeClass(node, oldClass);
	djd43.html.addClass(node, newClass);
};
djd43.html.classMatchType = {ContainsAll:0, ContainsAny:1, IsOnly:2};
djd43.html.getElementsByClass = function (classStr, parent, nodeType, classMatchType, useNonXpath) {
	useNonXpath = false;
	var _document = djd43.doc();
	parent = djd43.byId(parent) || _document;
	var classes = classStr.split(/\s+/g);
	var nodes = [];
	if (classMatchType != 1 && classMatchType != 2) {
		classMatchType = 0;
	}
	var reClass = new RegExp("(\\s|^)((" + classes.join(")|(") + "))(\\s|$)");
	var srtLength = classes.join(" ").length;
	var candidateNodes = [];
	if (!useNonXpath && _document.evaluate) {
		var xpath = ".//" + (nodeType || "*") + "[contains(";
		if (classMatchType != djd43.html.classMatchType.ContainsAny) {
			xpath += "concat(' ',@class,' '), ' " + classes.join(" ') and contains(concat(' ',@class,' '), ' ") + " ')";
			if (classMatchType == 2) {
				xpath += " and string-length(@class)=" + srtLength + "]";
			} else {
				xpath += "]";
			}
		} else {
			xpath += "concat(' ',@class,' '), ' " + classes.join(" ') or contains(concat(' ',@class,' '), ' ") + " ')]";
		}
		var xpathResult = _document.evaluate(xpath, parent, null, XPathResult.ANY_TYPE, null);
		var result = xpathResult.iterateNext();
		while (result) {
			try {
				candidateNodes.push(result);
				result = xpathResult.iterateNext();
			}
			catch (e) {
				break;
			}
		}
		return candidateNodes;
	} else {
		if (!nodeType) {
			nodeType = "*";
		}
		candidateNodes = parent.getElementsByTagName(nodeType);
		var node, i = 0;
	outer:
		while (node = candidateNodes[i++]) {
			var nodeClasses = djd43.html.getClasses(node);
			if (nodeClasses.length == 0) {
				continue outer;
			}
			var matches = 0;
			for (var j = 0; j < nodeClasses.length; j++) {
				if (reClass.test(nodeClasses[j])) {
					if (classMatchType == djd43.html.classMatchType.ContainsAny) {
						nodes.push(node);
						continue outer;
					} else {
						matches++;
					}
				} else {
					if (classMatchType == djd43.html.classMatchType.IsOnly) {
						continue outer;
					}
				}
			}
			if (matches == classes.length) {
				if ((classMatchType == djd43.html.classMatchType.IsOnly) && (matches == nodeClasses.length)) {
					nodes.push(node);
				} else {
					if (classMatchType == djd43.html.classMatchType.ContainsAll) {
						nodes.push(node);
					}
				}
			}
		}
		return nodes;
	}
};
djd43.html.getElementsByClassName = djd43.html.getElementsByClass;
djd43.html.toCamelCase = function (selector) {
	var arr = selector.split("-"), cc = arr[0];
	for (var i = 1; i < arr.length; i++) {
		cc += arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
	}
	return cc;
};
djd43.html.toSelectorCase = function (selector) {
	return selector.replace(/([A-Z])/g, "-$1").toLowerCase();
};
if (djd43.render.html.ie) {
	djd43.html.getComputedStyle = function (node, property, value) {
		node = djd43.byId(node);
		if (!node || !node.currentStyle) {
			return value;
		}
		return node.currentStyle[djd43.html.toCamelCase(property)];
	};
	djd43.html.getComputedStyles = function (node) {
		return node.currentStyle;
	};
} else {
	djd43.html.getComputedStyle = function (node, property, value) {
		node = djd43.byId(node);
		if (!node || !node.style) {
			return value;
		}
		var s = document.defaultView.getComputedStyle(node, null);
		return (s && s[djd43.html.toCamelCase(property)]) || "";
	};
	djd43.html.getComputedStyles = function (node) {
		return document.defaultView.getComputedStyle(node, null);
	};
}
djd43.html.getStyleProperty = function (node, cssSelector) {
	node = djd43.byId(node);
	return (node && node.style ? node.style[djd43.html.toCamelCase(cssSelector)] : undefined);
};
djd43.html.getStyle = function (node, cssSelector) {
	var value = djd43.html.getStyleProperty(node, cssSelector);
	return (value ? value : djd43.html.getComputedStyle(node, cssSelector));
};
djd43.html.setStyle = function (node, cssSelector, value) {
	node = djd43.byId(node);
	if (node && node.style) {
		var camelCased = djd43.html.toCamelCase(cssSelector);
		node.style[camelCased] = value;
	}
};
djd43.html.setStyleText = function (target, text) {
	try {
		target.style.cssText = text;
	}
	catch (e) {
		target.setAttribute("style", text);
	}
};
djd43.html.copyStyle = function (target, source) {
	if (!source.style.cssText) {
		target.setAttribute("style", source.getAttribute("style"));
	} else {
		target.style.cssText = source.style.cssText;
	}
	djd43.html.addClass(target, djd43.html.getClass(source));
};
djd43.html.getUnitValue = function (node, cssSelector, autoIsZero) {
	var s = djd43.html.getComputedStyle(node, cssSelector);
	if ((!s) || ((s == "auto") && (autoIsZero))) {
		return {value:0, units:"px"};
	}
	var match = s.match(/(\-?[\d.]+)([a-z%]*)/i);
	if (!match) {
		return djd43.html.getUnitValue.bad;
	}
	return {value:Number(match[1]), units:match[2].toLowerCase()};
};
djd43.html.getUnitValue.bad = {value:NaN, units:""};
if (djd43.render.html.ie) {
	djd43.html.toPixelValue = function (element, styleValue) {
		if (!styleValue) {
			return 0;
		}
		if (styleValue.slice(-2) == "px") {
			return parseFloat(styleValue);
		}
		var pixelValue = 0;
		with (element) {
			var sLeft = style.left;
			var rsLeft = runtimeStyle.left;
			runtimeStyle.left = currentStyle.left;
			try {
				style.left = styleValue || 0;
				pixelValue = style.pixelLeft;
				style.left = sLeft;
				runtimeStyle.left = rsLeft;
			}
			catch (e) {
			}
		}
		return pixelValue;
	};
} else {
	djd43.html.toPixelValue = function (element, styleValue) {
		return (styleValue && (styleValue.slice(-2) == "px") ? parseFloat(styleValue) : 0);
	};
}
djd43.html.getPixelValue = function (node, styleProperty, autoIsZero) {
	return djd43.html.toPixelValue(node, djd43.html.getComputedStyle(node, styleProperty));
};
djd43.html.setPositivePixelValue = function (node, selector, value) {
	if (isNaN(value)) {
		return false;
	}
	node.style[selector] = Math.max(0, value) + "px";
	return true;
};
djd43.html.styleSheet = null;
djd43.html.insertCssRule = function (selector, declaration, index) {
	if (!djd43.html.styleSheet) {
		if (document.createStyleSheet) {
			djd43.html.styleSheet = document.createStyleSheet();
		} else {
			if (document.styleSheets[0]) {
				djd43.html.styleSheet = document.styleSheets[0];
			} else {
				return null;
			}
		}
	}
	if (arguments.length < 3) {
		if (djd43.html.styleSheet.cssRules) {
			index = djd43.html.styleSheet.cssRules.length;
		} else {
			if (djd43.html.styleSheet.rules) {
				index = djd43.html.styleSheet.rules.length;
			} else {
				return null;
			}
		}
	}
	if (djd43.html.styleSheet.insertRule) {
		var rule = selector + " { " + declaration + " }";
		return djd43.html.styleSheet.insertRule(rule, index);
	} else {
		if (djd43.html.styleSheet.addRule) {
			return djd43.html.styleSheet.addRule(selector, declaration, index);
		} else {
			return null;
		}
	}
};
djd43.html.removeCssRule = function (index) {
	if (!djd43.html.styleSheet) {
		djd43.debug("no stylesheet defined for removing rules");
		return false;
	}
	if (djd43.render.html.ie) {
		if (!index) {
			index = djd43.html.styleSheet.rules.length;
			djd43.html.styleSheet.removeRule(index);
		}
	} else {
		if (document.styleSheets[0]) {
			if (!index) {
				index = djd43.html.styleSheet.cssRules.length;
			}
			djd43.html.styleSheet.deleteRule(index);
		}
	}
	return true;
};
djd43.html._insertedCssFiles = [];
djd43.html.insertCssFile = function (URI, doc, checkDuplicates, fail_ok) {
	if (!URI) {
		return;
	}
	if (!doc) {
		doc = document;
	}
	var cssStr = djd43.hostenv.getText(URI, false, fail_ok);
	if (cssStr === null) {
		return;
	}
	cssStr = djd43.html.fixPathsInCssText(cssStr, URI);
	if (checkDuplicates) {
		var idx = -1, node, ent = djd43.html._insertedCssFiles;
		for (var i = 0; i < ent.length; i++) {
			if ((ent[i].doc == doc) && (ent[i].cssText == cssStr)) {
				idx = i;
				node = ent[i].nodeRef;
				break;
			}
		}
		if (node) {
			var styles = doc.getElementsByTagName("style");
			for (var i = 0; i < styles.length; i++) {
				if (styles[i] == node) {
					return;
				}
			}
			djd43.html._insertedCssFiles.shift(idx, 1);
		}
	}
	var style = djd43.html.insertCssText(cssStr, doc);
	djd43.html._insertedCssFiles.push({"doc":doc, "cssText":cssStr, "nodeRef":style});
	if (style && djConfig.isDebug) {
		style.setAttribute("dbgHref", URI);
	}
	return style;
};
djd43.html.insertCssText = function (cssStr, doc, URI) {
	if (!cssStr) {
		return;
	}
	if (!doc) {
		doc = document;
	}
	if (URI) {
		cssStr = djd43.html.fixPathsInCssText(cssStr, URI);
	}
	var style = doc.createElement("style");
	style.setAttribute("type", "text/css");
	var head = doc.getElementsByTagName("head")[0];
	if (!head) {
		djd43.debug("No head tag in document, aborting styles");
		return;
	} else {
		head.appendChild(style);
	}
	if (style.styleSheet) {
		var setFunc = function () {
			try {
				style.styleSheet.cssText = cssStr;
			}
			catch (e) {
				djd43.debug(e);
			}
		};
		if (style.styleSheet.disabled) {
			setTimeout(setFunc, 10);
		} else {
			setFunc();
		}
	} else {
		var cssText = doc.createTextNode(cssStr);
		style.appendChild(cssText);
	}
	return style;
};
djd43.html.fixPathsInCssText = function (cssStr, URI) {
	if (!cssStr || !URI) {
		return;
	}
	var match, str = "", url = "", urlChrs = "[\\t\\s\\w\\(\\)\\/\\.\\\\'\"-:#=&?~]+";
	var regex = new RegExp("url\\(\\s*(" + urlChrs + ")\\s*\\)");
	var regexProtocol = /(file|https?|ftps?):\/\//;
	regexTrim = new RegExp("^[\\s]*(['\"]?)(" + urlChrs + ")\\1[\\s]*?$");
	if (djd43.render.html.ie55 || djd43.render.html.ie60) {
		var regexIe = new RegExp("AlphaImageLoader\\((.*)src=['\"](" + urlChrs + ")['\"]");
		while (match = regexIe.exec(cssStr)) {
			url = match[2].replace(regexTrim, "$2");
			if (!regexProtocol.exec(url)) {
				url = (new djd43.uri.Uri(URI, url).toString());
			}
			str += cssStr.substring(0, match.index) + "AlphaImageLoader(" + match[1] + "src='" + url + "'";
			cssStr = cssStr.substr(match.index + match[0].length);
		}
		cssStr = str + cssStr;
		str = "";
	}
	while (match = regex.exec(cssStr)) {
		url = match[1].replace(regexTrim, "$2");
		if (!regexProtocol.exec(url)) {
			url = (new djd43.uri.Uri(URI, url).toString());
		}
		str += cssStr.substring(0, match.index) + "url(" + url + ")";
		cssStr = cssStr.substr(match.index + match[0].length);
	}
	return str + cssStr;
};
djd43.html.setActiveStyleSheet = function (title) {
	var i = 0, a, els = djd43.doc().getElementsByTagName("link");
	while (a = els[i++]) {
		if (a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
			a.disabled = true;
			if (a.getAttribute("title") == title) {
				a.disabled = false;
			}
		}
	}
};
djd43.html.getActiveStyleSheet = function () {
	var i = 0, a, els = djd43.doc().getElementsByTagName("link");
	while (a = els[i++]) {
		if (a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled) {
			return a.getAttribute("title");
		}
	}
	return null;
};
djd43.html.getPreferredStyleSheet = function () {
	var i = 0, a, els = djd43.doc().getElementsByTagName("link");
	while (a = els[i++]) {
		if (a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("rel").indexOf("alt") == -1 && a.getAttribute("title")) {
			return a.getAttribute("title");
		}
	}
	return null;
};
djd43.html.applyBrowserClass = function (node) {
	var drh = djd43.render.html;
	var classes = {dj_ie:drh.ie, dj_ie55:drh.ie55, dj_ie6:drh.ie60, dj_ie7:drh.ie70, dj_iequirks:drh.ie && drh.quirks, dj_opera:drh.opera, dj_opera8:drh.opera && (Math.floor(djd43.render.version) == 8), dj_opera9:drh.opera && (Math.floor(djd43.render.version) == 9), dj_khtml:drh.khtml, dj_safari:drh.safari, dj_gecko:drh.mozilla};
	for (var p in classes) {
		if (classes[p]) {
			djd43.html.addClass(node, p);
		}
	}
};

