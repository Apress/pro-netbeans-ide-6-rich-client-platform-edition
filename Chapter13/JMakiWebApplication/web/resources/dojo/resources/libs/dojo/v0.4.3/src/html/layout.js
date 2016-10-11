/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.html.layout");
djd43.require("djd43.html.common");
djd43.require("djd43.html.style");
djd43.require("djd43.html.display");
djd43.html.sumAncestorProperties = function (node, prop) {
	node = djd43.byId(node);
	if (!node) {
		return 0;
	}
	var retVal = 0;
	while (node) {
		if (djd43.html.getComputedStyle(node, "position") == "fixed") {
			return 0;
		}
		var val = node[prop];
		if (val) {
			retVal += val - 0;
			if (node == djd43.body()) {
				break;
			}
		}
		node = node.parentNode;
	}
	return retVal;
};
djd43.html.setStyleAttributes = function (node, attributes) {
	node = djd43.byId(node);
	var splittedAttribs = attributes.replace(/(;)?\s*$/, "").split(";");
	for (var i = 0; i < splittedAttribs.length; i++) {
		var nameValue = splittedAttribs[i].split(":");
		var name = nameValue[0].replace(/\s*$/, "").replace(/^\s*/, "").toLowerCase();
		var value = nameValue[1].replace(/\s*$/, "").replace(/^\s*/, "");
		switch (name) {
		  case "opacity":
			djd43.html.setOpacity(node, value);
			break;
		  case "content-height":
			djd43.html.setContentBox(node, {height:value});
			break;
		  case "content-width":
			djd43.html.setContentBox(node, {width:value});
			break;
		  case "outer-height":
			djd43.html.setMarginBox(node, {height:value});
			break;
		  case "outer-width":
			djd43.html.setMarginBox(node, {width:value});
			break;
		  default:
			node.style[djd43.html.toCamelCase(name)] = value;
		}
	}
};
djd43.html.boxSizing = {MARGIN_BOX:"margin-box", BORDER_BOX:"border-box", PADDING_BOX:"padding-box", CONTENT_BOX:"content-box"};
djd43.html.getAbsolutePosition = djd43.html.abs = function (node, includeScroll, boxType) {
	node = djd43.byId(node, node.ownerDocument);
	var ret = {x:0, y:0};
	var bs = djd43.html.boxSizing;
	if (!boxType) {
		boxType = bs.CONTENT_BOX;
	}
	var nativeBoxType = 2;
	var targetBoxType;
	switch (boxType) {
	  case bs.MARGIN_BOX:
		targetBoxType = 3;
		break;
	  case bs.BORDER_BOX:
		targetBoxType = 2;
		break;
	  case bs.PADDING_BOX:
	  default:
		targetBoxType = 1;
		break;
	  case bs.CONTENT_BOX:
		targetBoxType = 0;
		break;
	}
	var h = djd43.render.html;
	var db = document["body"] || document["documentElement"];
	if (h.ie) {
		with (node.getBoundingClientRect()) {
			ret.x = left - 2;
			ret.y = top - 2;
		}
	} else {
		if (document.getBoxObjectFor) {
			nativeBoxType = 1;
			try {
				var bo = document.getBoxObjectFor(node);
				ret.x = bo.x - djd43.html.sumAncestorProperties(node, "scrollLeft");
				ret.y = bo.y - djd43.html.sumAncestorProperties(node, "scrollTop");
			}
			catch (e) {
			}
		} else {
			if (node["offsetParent"]) {
				var endNode;
				if ((h.safari) && (node.style.getPropertyValue("position") == "absolute") && (node.parentNode == db)) {
					endNode = db;
				} else {
					endNode = db.parentNode;
				}
				if (node.parentNode != db) {
					var nd = node;
					if (djd43.render.html.opera) {
						nd = db;
					}
					ret.x -= djd43.html.sumAncestorProperties(nd, "scrollLeft");
					ret.y -= djd43.html.sumAncestorProperties(nd, "scrollTop");
				}
				var curnode = node;
				do {
					var n = curnode["offsetLeft"];
					if (!h.opera || n > 0) {
						ret.x += isNaN(n) ? 0 : n;
					}
					var m = curnode["offsetTop"];
					ret.y += isNaN(m) ? 0 : m;
					curnode = curnode.offsetParent;
				} while ((curnode != endNode) && (curnode != null));
			} else {
				if (node["x"] && node["y"]) {
					ret.x += isNaN(node.x) ? 0 : node.x;
					ret.y += isNaN(node.y) ? 0 : node.y;
				}
			}
		}
	}
	if (includeScroll) {
		var scroll = djd43.html.getScroll();
		ret.y += scroll.top;
		ret.x += scroll.left;
	}
	var extentFuncArray = [djd43.html.getPaddingExtent, djd43.html.getBorderExtent, djd43.html.getMarginExtent];
	if (nativeBoxType > targetBoxType) {
		for (var i = targetBoxType; i < nativeBoxType; ++i) {
			ret.y += extentFuncArray[i](node, "top");
			ret.x += extentFuncArray[i](node, "left");
		}
	} else {
		if (nativeBoxType < targetBoxType) {
			for (var i = targetBoxType; i > nativeBoxType; --i) {
				ret.y -= extentFuncArray[i - 1](node, "top");
				ret.x -= extentFuncArray[i - 1](node, "left");
			}
		}
	}
	ret.top = ret.y;
	ret.left = ret.x;
	return ret;
};
djd43.html.isPositionAbsolute = function (node) {
	return (djd43.html.getComputedStyle(node, "position") == "absolute");
};
djd43.html._sumPixelValues = function (node, selectors, autoIsZero) {
	var total = 0;
	for (var x = 0; x < selectors.length; x++) {
		total += djd43.html.getPixelValue(node, selectors[x], autoIsZero);
	}
	return total;
};
djd43.html.getMargin = function (node) {
	return {width:djd43.html._sumPixelValues(node, ["margin-left", "margin-right"], (djd43.html.getComputedStyle(node, "position") == "absolute")), height:djd43.html._sumPixelValues(node, ["margin-top", "margin-bottom"], (djd43.html.getComputedStyle(node, "position") == "absolute"))};
};
djd43.html.getBorder = function (node) {
	return {width:djd43.html.getBorderExtent(node, "left") + djd43.html.getBorderExtent(node, "right"), height:djd43.html.getBorderExtent(node, "top") + djd43.html.getBorderExtent(node, "bottom")};
};
djd43.html.getBorderExtent = function (node, side) {
	return (djd43.html.getStyle(node, "border-" + side + "-style") == "none" ? 0 : djd43.html.getPixelValue(node, "border-" + side + "-width"));
};
djd43.html.getMarginExtent = function (node, side) {
	return djd43.html._sumPixelValues(node, ["margin-" + side], djd43.html.isPositionAbsolute(node));
};
djd43.html.getPaddingExtent = function (node, side) {
	return djd43.html._sumPixelValues(node, ["padding-" + side], true);
};
djd43.html.getPadding = function (node) {
	return {width:djd43.html._sumPixelValues(node, ["padding-left", "padding-right"], true), height:djd43.html._sumPixelValues(node, ["padding-top", "padding-bottom"], true)};
};
djd43.html.getPadBorder = function (node) {
	var pad = djd43.html.getPadding(node);
	var border = djd43.html.getBorder(node);
	return {width:pad.width + border.width, height:pad.height + border.height};
};
djd43.html.getBoxSizing = function (node) {
	var h = djd43.render.html;
	var bs = djd43.html.boxSizing;
	if (((h.ie) || (h.opera)) && node.nodeName.toLowerCase() != "img") {
		var cm = document["compatMode"];
		if ((cm == "BackCompat") || (cm == "QuirksMode")) {
			return bs.BORDER_BOX;
		} else {
			return bs.CONTENT_BOX;
		}
	} else {
		if (arguments.length == 0) {
			node = document.documentElement;
		}
		var sizing;
		if (!h.ie) {
			sizing = djd43.html.getStyle(node, "-moz-box-sizing");
			if (!sizing) {
				sizing = djd43.html.getStyle(node, "box-sizing");
			}
		}
		return (sizing ? sizing : bs.CONTENT_BOX);
	}
};
djd43.html.isBorderBox = function (node) {
	return (djd43.html.getBoxSizing(node) == djd43.html.boxSizing.BORDER_BOX);
};
djd43.html.getBorderBox = function (node) {
	node = djd43.byId(node);
	return {width:node.offsetWidth, height:node.offsetHeight};
};
djd43.html.getPaddingBox = function (node) {
	var box = djd43.html.getBorderBox(node);
	var border = djd43.html.getBorder(node);
	return {width:box.width - border.width, height:box.height - border.height};
};
djd43.html.getContentBox = function (node) {
	node = djd43.byId(node);
	var padborder = djd43.html.getPadBorder(node);
	return {width:node.offsetWidth - padborder.width, height:node.offsetHeight - padborder.height};
};
djd43.html.setContentBox = function (node, args) {
	node = djd43.byId(node);
	var width = 0;
	var height = 0;
	var isbb = djd43.html.isBorderBox(node);
	var padborder = (isbb ? djd43.html.getPadBorder(node) : {width:0, height:0});
	var ret = {};
	if (typeof args.width != "undefined") {
		width = args.width + padborder.width;
		ret.width = djd43.html.setPositivePixelValue(node, "width", width);
	}
	if (typeof args.height != "undefined") {
		height = args.height + padborder.height;
		ret.height = djd43.html.setPositivePixelValue(node, "height", height);
	}
	return ret;
};
djd43.html.getMarginBox = function (node) {
	var borderbox = djd43.html.getBorderBox(node);
	var margin = djd43.html.getMargin(node);
	return {width:borderbox.width + margin.width, height:borderbox.height + margin.height};
};
djd43.html.setMarginBox = function (node, args) {
	node = djd43.byId(node);
	var width = 0;
	var height = 0;
	var isbb = djd43.html.isBorderBox(node);
	var padborder = (!isbb ? djd43.html.getPadBorder(node) : {width:0, height:0});
	var margin = djd43.html.getMargin(node);
	var ret = {};
	if (typeof args.width != "undefined") {
		width = args.width - padborder.width;
		width -= margin.width;
		ret.width = djd43.html.setPositivePixelValue(node, "width", width);
	}
	if (typeof args.height != "undefined") {
		height = args.height - padborder.height;
		height -= margin.height;
		ret.height = djd43.html.setPositivePixelValue(node, "height", height);
	}
	return ret;
};
djd43.html.getElementBox = function (node, type) {
	var bs = djd43.html.boxSizing;
	switch (type) {
	  case bs.MARGIN_BOX:
		return djd43.html.getMarginBox(node);
	  case bs.BORDER_BOX:
		return djd43.html.getBorderBox(node);
	  case bs.PADDING_BOX:
		return djd43.html.getPaddingBox(node);
	  case bs.CONTENT_BOX:
	  default:
		return djd43.html.getContentBox(node);
	}
};
djd43.html.toCoordinateObject = djd43.html.toCoordinateArray = function (coords, includeScroll, boxtype) {
	if (coords instanceof Array || typeof coords == "array") {
		djd43.deprecated("djd43.html.toCoordinateArray", "use djd43.html.toCoordinateObject({left: , top: , width: , height: }) instead", "0.5");
		while (coords.length < 4) {
			coords.push(0);
		}
		while (coords.length > 4) {
			coords.pop();
		}
		var ret = {left:coords[0], top:coords[1], width:coords[2], height:coords[3]};
	} else {
		if (!coords.nodeType && !(coords instanceof String || typeof coords == "string") && ("width" in coords || "height" in coords || "left" in coords || "x" in coords || "top" in coords || "y" in coords)) {
			var ret = {left:coords.left || coords.x || 0, top:coords.top || coords.y || 0, width:coords.width || 0, height:coords.height || 0};
		} else {
			var node = djd43.byId(coords);
			var pos = djd43.html.abs(node, includeScroll, boxtype);
			var marginbox = djd43.html.getMarginBox(node);
			var ret = {left:pos.left, top:pos.top, width:marginbox.width, height:marginbox.height};
		}
	}
	ret.x = ret.left;
	ret.y = ret.top;
	return ret;
};
djd43.html.setMarginBoxWidth = djd43.html.setOuterWidth = function (node, width) {
	return djd43.html._callDeprecated("setMarginBoxWidth", "setMarginBox", arguments, "width");
};
djd43.html.setMarginBoxHeight = djd43.html.setOuterHeight = function () {
	return djd43.html._callDeprecated("setMarginBoxHeight", "setMarginBox", arguments, "height");
};
djd43.html.getMarginBoxWidth = djd43.html.getOuterWidth = function () {
	return djd43.html._callDeprecated("getMarginBoxWidth", "getMarginBox", arguments, null, "width");
};
djd43.html.getMarginBoxHeight = djd43.html.getOuterHeight = function () {
	return djd43.html._callDeprecated("getMarginBoxHeight", "getMarginBox", arguments, null, "height");
};
djd43.html.getTotalOffset = function (node, type, includeScroll) {
	return djd43.html._callDeprecated("getTotalOffset", "getAbsolutePosition", arguments, null, type);
};
djd43.html.getAbsoluteX = function (node, includeScroll) {
	return djd43.html._callDeprecated("getAbsoluteX", "getAbsolutePosition", arguments, null, "x");
};
djd43.html.getAbsoluteY = function (node, includeScroll) {
	return djd43.html._callDeprecated("getAbsoluteY", "getAbsolutePosition", arguments, null, "y");
};
djd43.html.totalOffsetLeft = function (node, includeScroll) {
	return djd43.html._callDeprecated("totalOffsetLeft", "getAbsolutePosition", arguments, null, "left");
};
djd43.html.totalOffsetTop = function (node, includeScroll) {
	return djd43.html._callDeprecated("totalOffsetTop", "getAbsolutePosition", arguments, null, "top");
};
djd43.html.getMarginWidth = function (node) {
	return djd43.html._callDeprecated("getMarginWidth", "getMargin", arguments, null, "width");
};
djd43.html.getMarginHeight = function (node) {
	return djd43.html._callDeprecated("getMarginHeight", "getMargin", arguments, null, "height");
};
djd43.html.getBorderWidth = function (node) {
	return djd43.html._callDeprecated("getBorderWidth", "getBorder", arguments, null, "width");
};
djd43.html.getBorderHeight = function (node) {
	return djd43.html._callDeprecated("getBorderHeight", "getBorder", arguments, null, "height");
};
djd43.html.getPaddingWidth = function (node) {
	return djd43.html._callDeprecated("getPaddingWidth", "getPadding", arguments, null, "width");
};
djd43.html.getPaddingHeight = function (node) {
	return djd43.html._callDeprecated("getPaddingHeight", "getPadding", arguments, null, "height");
};
djd43.html.getPadBorderWidth = function (node) {
	return djd43.html._callDeprecated("getPadBorderWidth", "getPadBorder", arguments, null, "width");
};
djd43.html.getPadBorderHeight = function (node) {
	return djd43.html._callDeprecated("getPadBorderHeight", "getPadBorder", arguments, null, "height");
};
djd43.html.getBorderBoxWidth = djd43.html.getInnerWidth = function () {
	return djd43.html._callDeprecated("getBorderBoxWidth", "getBorderBox", arguments, null, "width");
};
djd43.html.getBorderBoxHeight = djd43.html.getInnerHeight = function () {
	return djd43.html._callDeprecated("getBorderBoxHeight", "getBorderBox", arguments, null, "height");
};
djd43.html.getContentBoxWidth = djd43.html.getContentWidth = function () {
	return djd43.html._callDeprecated("getContentBoxWidth", "getContentBox", arguments, null, "width");
};
djd43.html.getContentBoxHeight = djd43.html.getContentHeight = function () {
	return djd43.html._callDeprecated("getContentBoxHeight", "getContentBox", arguments, null, "height");
};
djd43.html.setContentBoxWidth = djd43.html.setContentWidth = function (node, width) {
	return djd43.html._callDeprecated("setContentBoxWidth", "setContentBox", arguments, "width");
};
djd43.html.setContentBoxHeight = djd43.html.setContentHeight = function (node, height) {
	return djd43.html._callDeprecated("setContentBoxHeight", "setContentBox", arguments, "height");
};

