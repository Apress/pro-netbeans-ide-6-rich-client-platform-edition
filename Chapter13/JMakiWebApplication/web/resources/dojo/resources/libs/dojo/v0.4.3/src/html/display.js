/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.html.display");
djd43.require("djd43.html.style");
djd43.html._toggle = function (node, tester, setter) {
	node = djd43.byId(node);
	setter(node, !tester(node));
	return tester(node);
};
djd43.html.show = function (node) {
	node = djd43.byId(node);
	if (djd43.html.getStyleProperty(node, "display") == "none") {
		djd43.html.setStyle(node, "display", (node.dojoDisplayCache || ""));
		node.dojoDisplayCache = undefined;
	}
};
djd43.html.hide = function (node) {
	node = djd43.byId(node);
	if (typeof node["dojoDisplayCache"] == "undefined") {
		var d = djd43.html.getStyleProperty(node, "display");
		if (d != "none") {
			node.dojoDisplayCache = d;
		}
	}
	djd43.html.setStyle(node, "display", "none");
};
djd43.html.setShowing = function (node, showing) {
	djd43.html[(showing ? "show" : "hide")](node);
};
djd43.html.isShowing = function (node) {
	return (djd43.html.getStyleProperty(node, "display") != "none");
};
djd43.html.toggleShowing = function (node) {
	return djd43.html._toggle(node, djd43.html.isShowing, djd43.html.setShowing);
};
djd43.html.displayMap = {tr:"", td:"", th:"", img:"inline", span:"inline", input:"inline", button:"inline"};
djd43.html.suggestDisplayByTagName = function (node) {
	node = djd43.byId(node);
	if (node && node.tagName) {
		var tag = node.tagName.toLowerCase();
		return (tag in djd43.html.displayMap ? djd43.html.displayMap[tag] : "block");
	}
};
djd43.html.setDisplay = function (node, display) {
	djd43.html.setStyle(node, "display", ((display instanceof String || typeof display == "string") ? display : (display ? djd43.html.suggestDisplayByTagName(node) : "none")));
};
djd43.html.isDisplayed = function (node) {
	return (djd43.html.getComputedStyle(node, "display") != "none");
};
djd43.html.toggleDisplay = function (node) {
	return djd43.html._toggle(node, djd43.html.isDisplayed, djd43.html.setDisplay);
};
djd43.html.setVisibility = function (node, visibility) {
	djd43.html.setStyle(node, "visibility", ((visibility instanceof String || typeof visibility == "string") ? visibility : (visibility ? "visible" : "hidden")));
};
djd43.html.isVisible = function (node) {
	return (djd43.html.getComputedStyle(node, "visibility") != "hidden");
};
djd43.html.toggleVisibility = function (node) {
	return djd43.html._toggle(node, djd43.html.isVisible, djd43.html.setVisibility);
};
djd43.html.setOpacity = function (node, opacity, dontFixOpacity) {
	node = djd43.byId(node);
	var h = djd43.render.html;
	if (!dontFixOpacity) {
		if (opacity >= 1) {
			if (h.ie) {
				djd43.html.clearOpacity(node);
				return;
			} else {
				opacity = 0.999999;
			}
		} else {
			if (opacity < 0) {
				opacity = 0;
			}
		}
	}
	if (h.ie) {
		if (node.nodeName.toLowerCase() == "tr") {
			var tds = node.getElementsByTagName("td");
			for (var x = 0; x < tds.length; x++) {
				tds[x].style.filter = "Alpha(Opacity=" + opacity * 100 + ")";
			}
		}
		node.style.filter = "Alpha(Opacity=" + opacity * 100 + ")";
	} else {
		if (h.moz) {
			node.style.opacity = opacity;
			node.style.MozOpacity = opacity;
		} else {
			if (h.safari) {
				node.style.opacity = opacity;
				node.style.KhtmlOpacity = opacity;
			} else {
				node.style.opacity = opacity;
			}
		}
	}
};
djd43.html.clearOpacity = function (node) {
	node = djd43.byId(node);
	var ns = node.style;
	var h = djd43.render.html;
	if (h.ie) {
		try {
			if (node.filters && node.filters.alpha) {
				ns.filter = "";
			}
		}
		catch (e) {
		}
	} else {
		if (h.moz) {
			ns.opacity = 1;
			ns.MozOpacity = 1;
		} else {
			if (h.safari) {
				ns.opacity = 1;
				ns.KhtmlOpacity = 1;
			} else {
				ns.opacity = 1;
			}
		}
	}
};
djd43.html.getOpacity = function (node) {
	node = djd43.byId(node);
	var h = djd43.render.html;
	if (h.ie) {
		var opac = (node.filters && node.filters.alpha && typeof node.filters.alpha.opacity == "number" ? node.filters.alpha.opacity : 100) / 100;
	} else {
		var opac = node.style.opacity || node.style.MozOpacity || node.style.KhtmlOpacity || 1;
	}
	return opac >= 0.999999 ? 1 : Number(opac);
};

