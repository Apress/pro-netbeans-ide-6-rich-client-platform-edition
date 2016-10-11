/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.svg");
djd43.require("djd43.lang.common");
djd43.require("djd43.dom");
djd43.mixin(djd43.svg, djd43.dom);
djd43.svg.graphics = djd43.svg.g = new function (d) {
	this.suspend = function () {
		try {
			d.documentElement.suspendRedraw(0);
		}
		catch (e) {
		}
	};
	this.resume = function () {
		try {
			d.documentElement.unsuspendRedraw(0);
		}
		catch (e) {
		}
	};
	this.force = function () {
		try {
			d.documentElement.forceRedraw();
		}
		catch (e) {
		}
	};
}(document);
djd43.svg.animations = djd43.svg.anim = new function (d) {
	this.arePaused = function () {
		try {
			return d.documentElement.animationsPaused();
		}
		catch (e) {
			return false;
		}
	};
	this.pause = function () {
		try {
			d.documentElement.pauseAnimations();
		}
		catch (e) {
		}
	};
	this.resume = function () {
		try {
			d.documentElement.unpauseAnimations();
		}
		catch (e) {
		}
	};
}(document);
djd43.svg.toCamelCase = function (selector) {
	var arr = selector.split("-"), cc = arr[0];
	for (var i = 1; i < arr.length; i++) {
		cc += arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
	}
	return cc;
};
djd43.svg.toSelectorCase = function (selector) {
	return selector.replace(/([A-Z])/g, "-$1").toLowerCase();
};
djd43.svg.getStyle = function (node, cssSelector) {
	return document.defaultView.getComputedStyle(node, cssSelector);
};
djd43.svg.getNumericStyle = function (node, cssSelector) {
	return parseFloat(djd43.svg.getStyle(node, cssSelector));
};
djd43.svg.getOpacity = function (node) {
	return Math.min(1, djd43.svg.getNumericStyle(node, "fill-opacity"));
};
djd43.svg.setOpacity = function (node, opacity) {
	node.setAttributeNS(this.xmlns.svg, "fill-opacity", opacity);
	node.setAttributeNS(this.xmlns.svg, "stroke-opacity", opacity);
};
djd43.svg.clearOpacity = function (node) {
	node.setAttributeNS(this.xmlns.svg, "fill-opacity", "1.0");
	node.setAttributeNS(this.xmlns.svg, "stroke-opacity", "1.0");
};
djd43.svg.getCoords = function (node) {
	if (node.getBBox) {
		var box = node.getBBox();
		return {x:box.x, y:box.y};
	}
	return null;
};
djd43.svg.setCoords = function (node, coords) {
	var p = djd43.svg.getCoords();
	if (!p) {
		return;
	}
	var dx = p.x - coords.x;
	var dy = p.y - coords.y;
	djd43.svg.translate(node, dx, dy);
};
djd43.svg.getDimensions = function (node) {
	if (node.getBBox) {
		var box = node.getBBox();
		return {width:box.width, height:box.height};
	}
	return null;
};
djd43.svg.setDimensions = function (node, dim) {
	if (node.width) {
		node.width.baseVal.value = dim.width;
		node.height.baseVal.value = dim.height;
	} else {
		if (node.r) {
			node.r.baseVal.value = Math.min(dim.width, dim.height) / 2;
		} else {
			if (node.rx) {
				node.rx.baseVal.value = dim.width / 2;
				node.ry.baseVal.value = dim.height / 2;
			}
		}
	}
};
djd43.svg.translate = function (node, dx, dy) {
	if (node.transform && node.ownerSVGElement && node.ownerSVGElement.createSVGTransform) {
		var t = node.ownerSVGElement.createSVGTransform();
		t.setTranslate(dx, dy);
		node.transform.baseVal.appendItem(t);
	}
};
djd43.svg.scale = function (node, scaleX, scaleY) {
	if (!scaleY) {
		var scaleY = scaleX;
	}
	if (node.transform && node.ownerSVGElement && node.ownerSVGElement.createSVGTransform) {
		var t = node.ownerSVGElement.createSVGTransform();
		t.setScale(scaleX, scaleY);
		node.transform.baseVal.appendItem(t);
	}
};
djd43.svg.rotate = function (node, ang, cx, cy) {
	if (node.transform && node.ownerSVGElement && node.ownerSVGElement.createSVGTransform) {
		var t = node.ownerSVGElement.createSVGTransform();
		if (cx == null) {
			t.setMatrix(t.matrix.rotate(ang));
		} else {
			t.setRotate(ang, cx, cy);
		}
		node.transform.baseVal.appendItem(t);
	}
};
djd43.svg.skew = function (node, ang, axis) {
	var dir = axis || "x";
	if (node.transform && node.ownerSVGElement && node.ownerSVGElement.createSVGTransform) {
		var t = node.ownerSVGElement.createSVGTransform();
		if (dir != "x") {
			t.setSkewY(ang);
		} else {
			t.setSkewX(ang);
		}
		node.transform.baseVal.appendItem(t);
	}
};
djd43.svg.flip = function (node, axis) {
	var dir = axis || "x";
	if (node.transform && node.ownerSVGElement && node.ownerSVGElement.createSVGTransform) {
		var t = node.ownerSVGElement.createSVGTransform();
		t.setMatrix((dir != "x") ? t.matrix.flipY() : t.matrix.flipX());
		node.transform.baseVal.appendItem(t);
	}
};
djd43.svg.invert = function (node) {
	if (node.transform && node.ownerSVGElement && node.ownerSVGElement.createSVGTransform) {
		var t = node.ownerSVGElement.createSVGTransform();
		t.setMatrix(t.matrix.inverse());
		node.transform.baseVal.appendItem(t);
	}
};
djd43.svg.applyMatrix = function (node, a, b, c, d, e, f) {
	if (node.transform && node.ownerSVGElement && node.ownerSVGElement.createSVGTransform) {
		var m;
		if (b) {
			var m = node.ownerSVGElement.createSVGMatrix();
			m.a = a;
			m.b = b;
			m.c = c;
			m.d = d;
			m.e = e;
			m.f = f;
		} else {
			m = a;
		}
		var t = node.ownerSVGElement.createSVGTransform();
		t.setMatrix(m);
		node.transform.baseVal.appendItem(t);
	}
};
djd43.svg.group = function (nodes) {
	var p = nodes.item(0).parentNode;
	var g = document.createElementNS(this.xmlns.svg, "g");
	for (var i = 0; i < nodes.length; i++) {
		g.appendChild(nodes.item(i));
	}
	p.appendChild(g);
	return g;
};
djd43.svg.ungroup = function (g) {
	var p = g.parentNode;
	while (g.childNodes.length > 0) {
		p.appendChild(g.childNodes.item(0));
	}
	p.removeChild(g);
};
djd43.svg.getGroup = function (node) {
	var a = this.getAncestors(node);
	for (var i = 0; i < a.length; i++) {
		if (a[i].nodeType == this.ELEMENT_NODE && a[i].nodeName.toLowerCase() == "g") {
			return a[i];
		}
	}
	return null;
};
djd43.svg.bringToFront = function (node) {
	var n = this.getGroup(node) || node;
	n.ownerSVGElement.appendChild(n);
};
djd43.svg.sendToBack = function (node) {
	var n = this.getGroup(node) || node;
	n.ownerSVGElement.insertBefore(n, n.ownerSVGElement.firstChild);
};
djd43.svg.bringForward = function (node) {
	var n = this.getGroup(node) || node;
	if (this.getLastChildElement(n.parentNode) != n) {
		this.insertAfter(n, this.getNextSiblingElement(n), true);
	}
};
djd43.svg.sendBackward = function (node) {
	var n = this.getGroup(node) || node;
	if (this.getFirstChildElement(n.parentNode) != n) {
		this.insertBefore(n, this.getPreviousSiblingElement(n), true);
	}
};
djd43.svg.createNodesFromText = function (txt, wrap) {
	var docFrag = (new DOMParser()).parseFromString(txt, "text/xml").normalize();
	if (wrap) {
		return [docFrag.firstChild.cloneNode(true)];
	}
	var nodes = [];
	for (var x = 0; x < docFrag.childNodes.length; x++) {
		nodes.push(docFrag.childNodes.item(x).cloneNode(true));
	}
	return nodes;
};

