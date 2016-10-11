/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.html.common");
djd43.require("djd43.lang.common");
djd43.require("djd43.dom");
djd43.lang.mixin(djd43.html, djd43.dom);
djd43.html.body = function () {
	djd43.deprecated("djd43.html.body() moved to djd43.body()", "0.5");
	return djd43.body();
};
djd43.html.getEventTarget = function (evt) {
	if (!evt) {
		evt = djd43.global().event || {};
	}
	var t = (evt.srcElement ? evt.srcElement : (evt.target ? evt.target : null));
	while ((t) && (t.nodeType != 1)) {
		t = t.parentNode;
	}
	return t;
};
djd43.html.getViewport = function () {
	var _window = djd43.global();
	var _document = djd43.doc();
	var w = 0;
	var h = 0;
	if (djd43.render.html.mozilla) {
		w = _document.documentElement.clientWidth;
		h = _window.innerHeight;
	} else {
		if (!djd43.render.html.opera && _window.innerWidth) {
			w = _window.innerWidth;
			h = _window.innerHeight;
		} else {
			if (!djd43.render.html.opera && djd43.exists(_document, "documentElement.clientWidth")) {
				var w2 = _document.documentElement.clientWidth;
				if (!w || w2 && w2 < w) {
					w = w2;
				}
				h = _document.documentElement.clientHeight;
			} else {
				if (djd43.body().clientWidth) {
					w = djd43.body().clientWidth;
					h = djd43.body().clientHeight;
				}
			}
		}
	}
	return {width:w, height:h};
};
djd43.html.getScroll = function () {
	var _window = djd43.global();
	var _document = djd43.doc();
	var top = _window.pageYOffset || _document.documentElement.scrollTop || djd43.body().scrollTop || 0;
	var left = _window.pageXOffset || _document.documentElement.scrollLeft || djd43.body().scrollLeft || 0;
	return {top:top, left:left, offset:{x:left, y:top}};
};
djd43.html.getParentByType = function (node, type) {
	var _document = djd43.doc();
	var parent = djd43.byId(node);
	type = type.toLowerCase();
	while ((parent) && (parent.nodeName.toLowerCase() != type)) {
		if (parent == (_document["body"] || _document["documentElement"])) {
			return null;
		}
		parent = parent.parentNode;
	}
	return parent;
};
djd43.html.getAttribute = function (node, attr) {
	node = djd43.byId(node);
	if ((!node) || (!node.getAttribute)) {
		return null;
	}
	var ta = typeof attr == "string" ? attr : new String(attr);
	var v = node.getAttribute(ta.toUpperCase());
	if ((v) && (typeof v == "string") && (v != "")) {
		return v;
	}
	if (v && v.value) {
		return v.value;
	}
	if ((node.getAttributeNode) && (node.getAttributeNode(ta))) {
		return (node.getAttributeNode(ta)).value;
	} else {
		if (node.getAttribute(ta)) {
			return node.getAttribute(ta);
		} else {
			if (node.getAttribute(ta.toLowerCase())) {
				return node.getAttribute(ta.toLowerCase());
			}
		}
	}
	return null;
};
djd43.html.hasAttribute = function (node, attr) {
	return djd43.html.getAttribute(djd43.byId(node), attr) ? true : false;
};
djd43.html.getCursorPosition = function (e) {
	e = e || djd43.global().event;
	var cursor = {x:0, y:0};
	if (e.pageX || e.pageY) {
		cursor.x = e.pageX;
		cursor.y = e.pageY;
	} else {
		var de = djd43.doc().documentElement;
		var db = djd43.body();
		cursor.x = e.clientX + ((de || db)["scrollLeft"]) - ((de || db)["clientLeft"]);
		cursor.y = e.clientY + ((de || db)["scrollTop"]) - ((de || db)["clientTop"]);
	}
	return cursor;
};
djd43.html.isTag = function (node) {
	node = djd43.byId(node);
	if (node && node.tagName) {
		for (var i = 1; i < arguments.length; i++) {
			if (node.tagName.toLowerCase() == String(arguments[i]).toLowerCase()) {
				return String(arguments[i]).toLowerCase();
			}
		}
	}
	return "";
};
if (djd43.render.html.ie && !djd43.render.html.ie70) {
	if (window.location.href.substr(0, 6).toLowerCase() != "https:") {
		(function () {
			var xscript = djd43.doc().createElement("script");
			xscript.src = "javascript:'djd43.html.createExternalElement=function(doc, tag){ return doc.createElement(tag); }'";
			djd43.doc().getElementsByTagName("head")[0].appendChild(xscript);
		})();
	}
} else {
	djd43.html.createExternalElement = function (doc, tag) {
		return doc.createElement(tag);
	};
}
djd43.html._callDeprecated = function (inFunc, replFunc, args, argName, retValue) {
	djd43.deprecated("djd43.html." + inFunc, "replaced by djd43.html." + replFunc + "(" + (argName ? "node, {" + argName + ": " + argName + "}" : "") + ")" + (retValue ? "." + retValue : ""), "0.5");
	var newArgs = [];
	if (argName) {
		var argsIn = {};
		argsIn[argName] = args[1];
		newArgs.push(args[0]);
		newArgs.push(argsIn);
	} else {
		newArgs = args;
	}
	var ret = djd43.html[replFunc].apply(djd43.html, args);
	if (retValue) {
		return ret[retValue];
	} else {
		return ret;
	}
};
djd43.html.getViewportWidth = function () {
	return djd43.html._callDeprecated("getViewportWidth", "getViewport", arguments, null, "width");
};
djd43.html.getViewportHeight = function () {
	return djd43.html._callDeprecated("getViewportHeight", "getViewport", arguments, null, "height");
};
djd43.html.getViewportSize = function () {
	return djd43.html._callDeprecated("getViewportSize", "getViewport", arguments);
};
djd43.html.getScrollTop = function () {
	return djd43.html._callDeprecated("getScrollTop", "getScroll", arguments, null, "top");
};
djd43.html.getScrollLeft = function () {
	return djd43.html._callDeprecated("getScrollLeft", "getScroll", arguments, null, "left");
};
djd43.html.getScrollOffset = function () {
	return djd43.html._callDeprecated("getScrollOffset", "getScroll", arguments, null, "offset");
};

