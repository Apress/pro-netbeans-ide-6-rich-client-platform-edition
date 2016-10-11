/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.html.util");
djd43.require("djd43.html.layout");
djd43.html.getElementWindow = function (element) {
	return djd43.html.getDocumentWindow(element.ownerDocument);
};
djd43.html.getDocumentWindow = function (doc) {
	if (djd43.render.html.safari && !doc._parentWindow) {
		var fix = function (win) {
			win.document._parentWindow = win;
			for (var i = 0; i < win.frames.length; i++) {
				fix(win.frames[i]);
			}
		};
		fix(window.top);
	}
	if (djd43.render.html.ie && window !== document.parentWindow && !doc._parentWindow) {
		doc.parentWindow.execScript("document._parentWindow = window;", "Javascript");
		var win = doc._parentWindow;
		doc._parentWindow = null;
		return win;
	}
	return doc._parentWindow || doc.parentWindow || doc.defaultView;
};
djd43.html.gravity = function (node, e) {
	node = djd43.byId(node);
	var mouse = djd43.html.getCursorPosition(e);
	with (djd43.html) {
		var absolute = getAbsolutePosition(node, true);
		var bb = getBorderBox(node);
		var nodecenterx = absolute.x + (bb.width / 2);
		var nodecentery = absolute.y + (bb.height / 2);
	}
	with (djd43.html.gravity) {
		return ((mouse.x < nodecenterx ? WEST : EAST) | (mouse.y < nodecentery ? NORTH : SOUTH));
	}
};
djd43.html.gravity.NORTH = 1;
djd43.html.gravity.SOUTH = 1 << 1;
djd43.html.gravity.EAST = 1 << 2;
djd43.html.gravity.WEST = 1 << 3;
djd43.html.overElement = function (element, e) {
	element = djd43.byId(element);
	var mouse = djd43.html.getCursorPosition(e);
	var bb = djd43.html.getBorderBox(element);
	var absolute = djd43.html.getAbsolutePosition(element, true, djd43.html.boxSizing.BORDER_BOX);
	var top = absolute.y;
	var bottom = top + bb.height;
	var left = absolute.x;
	var right = left + bb.width;
	return (mouse.x >= left && mouse.x <= right && mouse.y >= top && mouse.y <= bottom);
};
djd43.html.renderedTextContent = function (node) {
	node = djd43.byId(node);
	var result = "";
	if (node == null) {
		return result;
	}
	for (var i = 0; i < node.childNodes.length; i++) {
		switch (node.childNodes[i].nodeType) {
		  case 1:
		  case 5:
			var display = "unknown";
			try {
				display = djd43.html.getStyle(node.childNodes[i], "display");
			}
			catch (E) {
			}
			switch (display) {
			  case "block":
			  case "list-item":
			  case "run-in":
			  case "table":
			  case "table-row-group":
			  case "table-header-group":
			  case "table-footer-group":
			  case "table-row":
			  case "table-column-group":
			  case "table-column":
			  case "table-cell":
			  case "table-caption":
				result += "\n";
				result += djd43.html.renderedTextContent(node.childNodes[i]);
				result += "\n";
				break;
			  case "none":
				break;
			  default:
				if (node.childNodes[i].tagName && node.childNodes[i].tagName.toLowerCase() == "br") {
					result += "\n";
				} else {
					result += djd43.html.renderedTextContent(node.childNodes[i]);
				}
				break;
			}
			break;
		  case 3:
		  case 2:
		  case 4:
			var text = node.childNodes[i].nodeValue;
			var textTransform = "unknown";
			try {
				textTransform = djd43.html.getStyle(node, "text-transform");
			}
			catch (E) {
			}
			switch (textTransform) {
			  case "capitalize":
				var words = text.split(" ");
				for (var i = 0; i < words.length; i++) {
					words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
				}
				text = words.join(" ");
				break;
			  case "uppercase":
				text = text.toUpperCase();
				break;
			  case "lowercase":
				text = text.toLowerCase();
				break;
			  default:
				break;
			}
			switch (textTransform) {
			  case "nowrap":
				break;
			  case "pre-wrap":
				break;
			  case "pre-line":
				break;
			  case "pre":
				break;
			  default:
				text = text.replace(/\s+/, " ");
				if (/\s$/.test(result)) {
					text.replace(/^\s/, "");
				}
				break;
			}
			result += text;
			break;
		  default:
			break;
		}
	}
	return result;
};
djd43.html.createNodesFromText = function (txt, trim) {
	if (trim) {
		txt = txt.replace(/^\s+|\s+$/g, "");
	}
	var tn = djd43.doc().createElement("div");
	tn.style.visibility = "hidden";
	djd43.body().appendChild(tn);
	var tableType = "none";
	if ((/^<t[dh][\s\r\n>]/i).test(txt.replace(/^\s+/))) {
		txt = "<table><tbody><tr>" + txt + "</tr></tbody></table>";
		tableType = "cell";
	} else {
		if ((/^<tr[\s\r\n>]/i).test(txt.replace(/^\s+/))) {
			txt = "<table><tbody>" + txt + "</tbody></table>";
			tableType = "row";
		} else {
			if ((/^<(thead|tbody|tfoot)[\s\r\n>]/i).test(txt.replace(/^\s+/))) {
				txt = "<table>" + txt + "</table>";
				tableType = "section";
			}
		}
	}
	tn.innerHTML = txt;
	if (tn["normalize"]) {
		tn.normalize();
	}
	var parent = null;
	switch (tableType) {
	  case "cell":
		parent = tn.getElementsByTagName("tr")[0];
		break;
	  case "row":
		parent = tn.getElementsByTagName("tbody")[0];
		break;
	  case "section":
		parent = tn.getElementsByTagName("table")[0];
		break;
	  default:
		parent = tn;
		break;
	}
	var nodes = [];
	for (var x = 0; x < parent.childNodes.length; x++) {
		nodes.push(parent.childNodes[x].cloneNode(true));
	}
	tn.style.display = "none";
	djd43.html.destroyNode(tn);
	return nodes;
};
djd43.html.placeOnScreen = function (node, desiredX, desiredY, padding, hasScroll, corners, tryOnly) {
	if (desiredX instanceof Array || typeof desiredX == "array") {
		tryOnly = corners;
		corners = hasScroll;
		hasScroll = padding;
		padding = desiredY;
		desiredY = desiredX[1];
		desiredX = desiredX[0];
	}
	if (corners instanceof String || typeof corners == "string") {
		corners = corners.split(",");
	}
	if (!isNaN(padding)) {
		padding = [Number(padding), Number(padding)];
	} else {
		if (!(padding instanceof Array || typeof padding == "array")) {
			padding = [0, 0];
		}
	}
	var scroll = djd43.html.getScroll().offset;
	var view = djd43.html.getViewport();
	node = djd43.byId(node);
	var oldDisplay = node.style.display;
	node.style.display = "";
	var bb = djd43.html.getBorderBox(node);
	var w = bb.width;
	var h = bb.height;
	node.style.display = oldDisplay;
	if (!(corners instanceof Array || typeof corners == "array")) {
		corners = ["TL"];
	}
	var bestx, besty, bestDistance = Infinity, bestCorner;
	for (var cidex = 0; cidex < corners.length; ++cidex) {
		var corner = corners[cidex];
		var match = true;
		var tryX = desiredX - (corner.charAt(1) == "L" ? 0 : w) + padding[0] * (corner.charAt(1) == "L" ? 1 : -1);
		var tryY = desiredY - (corner.charAt(0) == "T" ? 0 : h) + padding[1] * (corner.charAt(0) == "T" ? 1 : -1);
		if (hasScroll) {
			tryX -= scroll.x;
			tryY -= scroll.y;
		}
		if (tryX < 0) {
			tryX = 0;
			match = false;
		}
		if (tryY < 0) {
			tryY = 0;
			match = false;
		}
		var x = tryX + w;
		if (x > view.width) {
			x = view.width - w;
			match = false;
		} else {
			x = tryX;
		}
		x = Math.max(padding[0], x) + scroll.x;
		var y = tryY + h;
		if (y > view.height) {
			y = view.height - h;
			match = false;
		} else {
			y = tryY;
		}
		y = Math.max(padding[1], y) + scroll.y;
		if (match) {
			bestx = x;
			besty = y;
			bestDistance = 0;
			bestCorner = corner;
			break;
		} else {
			var dist = Math.pow(x - tryX - scroll.x, 2) + Math.pow(y - tryY - scroll.y, 2);
			if (bestDistance > dist) {
				bestDistance = dist;
				bestx = x;
				besty = y;
				bestCorner = corner;
			}
		}
	}
	if (!tryOnly) {
		node.style.left = bestx + "px";
		node.style.top = besty + "px";
	}
	return {left:bestx, top:besty, x:bestx, y:besty, dist:bestDistance, corner:bestCorner};
};
djd43.html.placeOnScreenPoint = function (node, desiredX, desiredY, padding, hasScroll) {
	djd43.deprecated("djd43.html.placeOnScreenPoint", "use djd43.html.placeOnScreen() instead", "0.5");
	return djd43.html.placeOnScreen(node, desiredX, desiredY, padding, hasScroll, ["TL", "TR", "BL", "BR"]);
};
djd43.html.placeOnScreenAroundElement = function (node, aroundNode, padding, aroundType, aroundCorners, tryOnly) {
	var best, bestDistance = Infinity;
	aroundNode = djd43.byId(aroundNode);
	var oldDisplay = aroundNode.style.display;
	aroundNode.style.display = "";
	var mb = djd43.html.getElementBox(aroundNode, aroundType);
	var aroundNodeW = mb.width;
	var aroundNodeH = mb.height;
	var aroundNodePos = djd43.html.getAbsolutePosition(aroundNode, true, aroundType);
	aroundNode.style.display = oldDisplay;
	for (var nodeCorner in aroundCorners) {
		var pos, desiredX, desiredY;
		var corners = aroundCorners[nodeCorner];
		desiredX = aroundNodePos.x + (nodeCorner.charAt(1) == "L" ? 0 : aroundNodeW);
		desiredY = aroundNodePos.y + (nodeCorner.charAt(0) == "T" ? 0 : aroundNodeH);
		pos = djd43.html.placeOnScreen(node, desiredX, desiredY, padding, true, corners, true);
		if (pos.dist == 0) {
			best = pos;
			break;
		} else {
			if (bestDistance > pos.dist) {
				bestDistance = pos.dist;
				best = pos;
			}
		}
	}
	if (!tryOnly) {
		node.style.left = best.left + "px";
		node.style.top = best.top + "px";
	}
	return best;
};
djd43.html.scrollIntoView = function (node) {
	if (!node) {
		return;
	}
	if (djd43.render.html.ie) {
		if (djd43.html.getBorderBox(node.parentNode).height <= node.parentNode.scrollHeight) {
			node.scrollIntoView(false);
		}
	} else {
		if (djd43.render.html.mozilla) {
			node.scrollIntoView(false);
		} else {
			var parent = node.parentNode;
			var parentBottom = parent.scrollTop + djd43.html.getBorderBox(parent).height;
			var nodeBottom = node.offsetTop + djd43.html.getMarginBox(node).height;
			if (parentBottom < nodeBottom) {
				parent.scrollTop += (nodeBottom - parentBottom);
			} else {
				if (parent.scrollTop > node.offsetTop) {
					parent.scrollTop -= (parent.scrollTop - node.offsetTop);
				}
			}
		}
	}
};

