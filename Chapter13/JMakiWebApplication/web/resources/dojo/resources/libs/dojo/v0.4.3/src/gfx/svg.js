/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.gfx.svg");
djd43.require("djd43.lang.declare");
djd43.require("djd43.svg");
djd43.require("djd43.gfx.color");
djd43.require("djd43.gfx.common");
djd43.require("djd43.gfx.shape");
djd43.require("djd43.gfx.path");
djd43.require("djd43.experimental");
djd43.experimental("djd43.gfx.svg");
djd43.gfx.svg.getRef = function (fill) {
	if (!fill || fill == "none") {
		return null;
	}
	if (fill.match(/^url\(#.+\)$/)) {
		return djd43.byId(fill.slice(5, -1));
	}
	if (djd43.render.html.opera && fill.match(/^#dj_unique_.+$/)) {
		return djd43.byId(fill.slice(1));
	}
	return null;
};
djd43.lang.extend(djd43.gfx.Shape, {setFill:function (fill) {
	if (!fill) {
		this.fillStyle = null;
		this.rawNode.setAttribute("fill", "none");
		this.rawNode.setAttribute("fill-opacity", 0);
		return this;
	}
	if (typeof (fill) == "object" && "type" in fill) {
		switch (fill.type) {
		  case "linear":
			var f = djd43.gfx.makeParameters(djd43.gfx.defaultLinearGradient, fill);
			var gradient = this._setFillObject(f, "linearGradient");
			djd43.lang.forEach(["x1", "y1", "x2", "y2"], function (x) {
				gradient.setAttribute(x, f[x].toFixed(8));
			});
			break;
		  case "radial":
			var f = djd43.gfx.makeParameters(djd43.gfx.defaultRadialGradient, fill);
			var gradient = this._setFillObject(f, "radialGradient");
			djd43.lang.forEach(["cx", "cy", "r"], function (x) {
				gradient.setAttribute(x, f[x].toFixed(8));
			});
			break;
		  case "pattern":
			var f = djd43.gfx.makeParameters(djd43.gfx.defaultPattern, fill);
			var pattern = this._setFillObject(f, "pattern");
			djd43.lang.forEach(["x", "y", "width", "height"], function (x) {
				pattern.setAttribute(x, f[x].toFixed(8));
			});
			break;
		}
		return this;
	}
	var f = djd43.gfx.normalizeColor(fill);
	this.fillStyle = f;
	this.rawNode.setAttribute("fill", f.toCss());
	this.rawNode.setAttribute("fill-opacity", f.a);
	return this;
}, setStroke:function (stroke) {
	if (!stroke) {
		this.strokeStyle = null;
		this.rawNode.setAttribute("stroke", "none");
		this.rawNode.setAttribute("stroke-opacity", 0);
		return this;
	}
	this.strokeStyle = djd43.gfx.makeParameters(djd43.gfx.defaultStroke, stroke);
	this.strokeStyle.color = djd43.gfx.normalizeColor(this.strokeStyle.color);
	var s = this.strokeStyle;
	var rn = this.rawNode;
	if (s) {
		rn.setAttribute("stroke", s.color.toCss());
		rn.setAttribute("stroke-opacity", s.color.a);
		rn.setAttribute("stroke-width", s.width);
		rn.setAttribute("stroke-linecap", s.cap);
		if (typeof (s.join) == "number") {
			rn.setAttribute("stroke-linejoin", "miter");
			rn.setAttribute("stroke-miterlimit", s.join);
		} else {
			rn.setAttribute("stroke-linejoin", s.join);
		}
	}
	return this;
}, _setFillObject:function (f, nodeType) {
	var def_elems = this.rawNode.parentNode.getElementsByTagName("defs");
	if (def_elems.length == 0) {
		return this;
	}
	this.fillStyle = f;
	var defs = def_elems[0];
	var fill = this.rawNode.getAttribute("fill");
	var ref = djd43.gfx.svg.getRef(fill);
	if (ref) {
		fill = ref;
		if (fill.tagName.toLowerCase() != nodeType.toLowerCase()) {
			var id = fill.id;
			fill.parentNode.removeChild(fill);
			fill = document.createElementNS(djd43.svg.xmlns.svg, nodeType);
			fill.setAttribute("id", id);
			defs.appendChild(fill);
		} else {
			while (fill.childNodes.length) {
				fill.removeChild(fill.lastChild);
			}
		}
	} else {
		fill = document.createElementNS(djd43.svg.xmlns.svg, nodeType);
		fill.setAttribute("id", djd43.dom.getUniqueId());
		defs.appendChild(fill);
	}
	if (nodeType == "pattern") {
		fill.setAttribute("patternUnits", "userSpaceOnUse");
		var img = document.createElementNS(djd43.svg.xmlns.svg, "image");
		img.setAttribute("x", 0);
		img.setAttribute("y", 0);
		img.setAttribute("width", f.width.toFixed(8));
		img.setAttribute("height", f.height.toFixed(8));
		img.setAttributeNS(djd43.svg.xmlns.xlink, "href", f.src);
		fill.appendChild(img);
	} else {
		fill.setAttribute("gradientUnits", "userSpaceOnUse");
		for (var i = 0; i < f.colors.length; ++i) {
			f.colors[i].color = djd43.gfx.normalizeColor(f.colors[i].color);
			var t = document.createElementNS(djd43.svg.xmlns.svg, "stop");
			t.setAttribute("offset", f.colors[i].offset.toFixed(8));
			t.setAttribute("stop-color", f.colors[i].color.toCss());
			fill.appendChild(t);
		}
	}
	this.rawNode.setAttribute("fill", "url(#" + fill.getAttribute("id") + ")");
	this.rawNode.removeAttribute("fill-opacity");
	return fill;
}, _applyTransform:function () {
	var matrix = this._getRealMatrix();
	if (matrix) {
		var tm = this.matrix;
		this.rawNode.setAttribute("transform", "matrix(" + tm.xx.toFixed(8) + "," + tm.yx.toFixed(8) + "," + tm.xy.toFixed(8) + "," + tm.yy.toFixed(8) + "," + tm.dx.toFixed(8) + "," + tm.dy.toFixed(8) + ")");
	} else {
		this.rawNode.removeAttribute("transform");
	}
	return this;
}, setRawNode:function (rawNode) {
	with (rawNode) {
		setAttribute("fill", "none");
		setAttribute("fill-opacity", 0);
		setAttribute("stroke", "none");
		setAttribute("stroke-opacity", 0);
		setAttribute("stroke-width", 1);
		setAttribute("stroke-linecap", "butt");
		setAttribute("stroke-linejoin", "miter");
		setAttribute("stroke-miterlimit", 4);
	}
	this.rawNode = rawNode;
}, moveToFront:function () {
	this.rawNode.parentNode.appendChild(this.rawNode);
	return this;
}, moveToBack:function () {
	this.rawNode.parentNode.insertBefore(this.rawNode, this.rawNode.parentNode.firstChild);
	return this;
}, setShape:function (newShape) {
	this.shape = djd43.gfx.makeParameters(this.shape, newShape);
	for (var i in this.shape) {
		if (i != "type") {
			this.rawNode.setAttribute(i, this.shape[i]);
		}
	}
	return this;
}, attachFill:function (rawNode) {
	var fillStyle = null;
	if (rawNode) {
		var fill = rawNode.getAttribute("fill");
		if (fill == "none") {
			return;
		}
		var ref = djd43.gfx.svg.getRef(fill);
		if (ref) {
			var gradient = ref;
			switch (gradient.tagName.toLowerCase()) {
			  case "lineargradient":
				fillStyle = this._getGradient(djd43.gfx.defaultLinearGradient, gradient);
				djd43.lang.forEach(["x1", "y1", "x2", "y2"], function (x) {
					fillStyle[x] = gradient.getAttribute(x);
				});
				break;
			  case "radialgradient":
				fillStyle = this._getGradient(djd43.gfx.defaultRadialGradient, gradient);
				djd43.lang.forEach(["cx", "cy", "r"], function (x) {
					fillStyle[x] = gradient.getAttribute(x);
				});
				fillStyle.cx = gradient.getAttribute("cx");
				fillStyle.cy = gradient.getAttribute("cy");
				fillStyle.r = gradient.getAttribute("r");
				break;
			  case "pattern":
				fillStyle = djd43.lang.shallowCopy(djd43.gfx.defaultPattern, true);
				djd43.lang.forEach(["x", "y", "width", "height"], function (x) {
					fillStyle[x] = gradient.getAttribute(x);
				});
				fillStyle.src = gradient.firstChild.getAttributeNS(djd43.svg.xmlns.xlink, "href");
				break;
			}
		} else {
			fillStyle = new djd43.gfx.color.Color(fill);
			var opacity = rawNode.getAttribute("fill-opacity");
			if (opacity != null) {
				fillStyle.a = opacity;
			}
		}
	}
	return fillStyle;
}, _getGradient:function (defaultGradient, gradient) {
	var fillStyle = djd43.lang.shallowCopy(defaultGradient, true);
	fillStyle.colors = [];
	for (var i = 0; i < gradient.childNodes.length; ++i) {
		fillStyle.colors.push({offset:gradient.childNodes[i].getAttribute("offset"), color:new djd43.gfx.color.Color(gradient.childNodes[i].getAttribute("stop-color"))});
	}
	return fillStyle;
}, attachStroke:function (rawNode) {
	if (!rawNode) {
		return;
	}
	var stroke = rawNode.getAttribute("stroke");
	if (stroke == null || stroke == "none") {
		return null;
	}
	var strokeStyle = djd43.lang.shallowCopy(djd43.gfx.defaultStroke, true);
	var color = new djd43.gfx.color.Color(stroke);
	if (color) {
		strokeStyle.color = color;
		strokeStyle.color.a = rawNode.getAttribute("stroke-opacity");
		strokeStyle.width = rawNode.getAttribute("stroke-width");
		strokeStyle.cap = rawNode.getAttribute("stroke-linecap");
		strokeStyle.join = rawNode.getAttribute("stroke-linejoin");
		if (strokeStyle.join == "miter") {
			strokeStyle.join = rawNode.getAttribute("stroke-miterlimit");
		}
	}
	return strokeStyle;
}, attachTransform:function (rawNode) {
	var matrix = null;
	if (rawNode) {
		matrix = rawNode.getAttribute("transform");
		if (matrix.match(/^matrix\(.+\)$/)) {
			var t = matrix.slice(7, -1).split(",");
			matrix = djd43.gfx.matrix.normalize({xx:parseFloat(t[0]), xy:parseFloat(t[2]), yx:parseFloat(t[1]), yy:parseFloat(t[3]), dx:parseFloat(t[4]), dy:parseFloat(t[5])});
		}
	}
	return matrix;
}, attachShape:function (rawNode) {
	var shape = null;
	if (rawNode) {
		shape = djd43.lang.shallowCopy(this.shape, true);
		for (var i in shape) {
			shape[i] = rawNode.getAttribute(i);
		}
	}
	return shape;
}, attach:function (rawNode) {
	if (rawNode) {
		this.rawNode = rawNode;
		this.fillStyle = this.attachFill(rawNode);
		this.strokeStyle = this.attachStroke(rawNode);
		this.matrix = this.attachTransform(rawNode);
		this.shape = this.attachShape(rawNode);
	}
}});
djd43.declare("djd43.gfx.Group", djd43.gfx.Shape, {setRawNode:function (rawNode) {
	this.rawNode = rawNode;
}});
djd43.gfx.Group.nodeType = "g";
djd43.declare("djd43.gfx.Rect", djd43.gfx.shape.Rect, {attachShape:function (rawNode) {
	var shape = null;
	if (rawNode) {
		shape = djd43.gfx.Rect.superclass.attachShape.apply(this, arguments);
		shape.r = Math.min(rawNode.getAttribute("rx"), rawNode.getAttribute("ry"));
	}
	return shape;
}, setShape:function (newShape) {
	this.shape = djd43.gfx.makeParameters(this.shape, newShape);
	this.bbox = null;
	for (var i in this.shape) {
		if (i != "type" && i != "r") {
			this.rawNode.setAttribute(i, this.shape[i]);
		}
	}
	this.rawNode.setAttribute("rx", this.shape.r);
	this.rawNode.setAttribute("ry", this.shape.r);
	return this;
}});
djd43.gfx.Rect.nodeType = "rect";
djd43.gfx.Ellipse = djd43.gfx.shape.Ellipse;
djd43.gfx.Ellipse.nodeType = "ellipse";
djd43.gfx.Circle = djd43.gfx.shape.Circle;
djd43.gfx.Circle.nodeType = "circle";
djd43.gfx.Line = djd43.gfx.shape.Line;
djd43.gfx.Line.nodeType = "line";
djd43.declare("djd43.gfx.Polyline", djd43.gfx.shape.Polyline, {setShape:function (points) {
	if (points && points instanceof Array) {
		this.shape = djd43.gfx.makeParameters(this.shape, {points:points});
		if (closed && this.shape.points.length) {
			this.shape.points.push(this.shape.points[0]);
		}
	} else {
		this.shape = djd43.gfx.makeParameters(this.shape, points);
	}
	this.box = null;
	var attr = [];
	var p = this.shape.points;
	for (var i = 0; i < p.length; ++i) {
		attr.push(p[i].x.toFixed(8));
		attr.push(p[i].y.toFixed(8));
	}
	this.rawNode.setAttribute("points", attr.join(" "));
	return this;
}});
djd43.gfx.Polyline.nodeType = "polyline";
djd43.declare("djd43.gfx.Image", djd43.gfx.shape.Image, {setShape:function (newShape) {
	this.shape = djd43.gfx.makeParameters(this.shape, newShape);
	this.bbox = null;
	var rawNode = this.rawNode;
	for (var i in this.shape) {
		if (i != "type" && i != "src") {
			rawNode.setAttribute(i, this.shape[i]);
		}
	}
	rawNode.setAttributeNS(djd43.svg.xmlns.xlink, "href", this.shape.src);
	return this;
}, setStroke:function () {
	return this;
}, setFill:function () {
	return this;
}, attachStroke:function (rawNode) {
	return null;
}, attachFill:function (rawNode) {
	return null;
}});
djd43.gfx.Image.nodeType = "image";
djd43.declare("djd43.gfx.Path", djd43.gfx.path.Path, {_updateWithSegment:function (segment) {
	djd43.gfx.Path.superclass._updateWithSegment.apply(this, arguments);
	if (typeof (this.shape.path) == "string") {
		this.rawNode.setAttribute("d", this.shape.path);
	}
}, setShape:function (newShape) {
	djd43.gfx.Path.superclass.setShape.apply(this, arguments);
	this.rawNode.setAttribute("d", this.shape.path);
	return this;
}});
djd43.gfx.Path.nodeType = "path";
djd43.gfx._creators = {createPath:function (path) {
	return this.createObject(djd43.gfx.Path, path);
}, createRect:function (rect) {
	return this.createObject(djd43.gfx.Rect, rect);
}, createCircle:function (circle) {
	return this.createObject(djd43.gfx.Circle, circle);
}, createEllipse:function (ellipse) {
	return this.createObject(djd43.gfx.Ellipse, ellipse);
}, createLine:function (line) {
	return this.createObject(djd43.gfx.Line, line);
}, createPolyline:function (points) {
	return this.createObject(djd43.gfx.Polyline, points);
}, createImage:function (image) {
	return this.createObject(djd43.gfx.Image, image);
}, createGroup:function () {
	return this.createObject(djd43.gfx.Group);
}, createObject:function (shapeType, rawShape) {
	if (!this.rawNode) {
		return null;
	}
	var shape = new shapeType();
	var node = document.createElementNS(djd43.svg.xmlns.svg, shapeType.nodeType);
	shape.setRawNode(node);
	this.rawNode.appendChild(node);
	shape.setShape(rawShape);
	this.add(shape);
	return shape;
}, add:function (shape) {
	var oldParent = shape.getParent();
	if (oldParent) {
		oldParent.remove(shape, true);
	}
	shape._setParent(this, null);
	this.rawNode.appendChild(shape.rawNode);
	return this;
}, remove:function (shape, silently) {
	if (this.rawNode == shape.rawNode.parentNode) {
		this.rawNode.removeChild(shape.rawNode);
	}
	shape._setParent(null, null);
	return this;
}};
djd43.gfx.attachNode = function (node) {
	if (!node) {
		return null;
	}
	var s = null;
	switch (node.tagName.toLowerCase()) {
	  case djd43.gfx.Rect.nodeType:
		s = new djd43.gfx.Rect();
		break;
	  case djd43.gfx.Ellipse.nodeType:
		s = new djd43.gfx.Ellipse();
		break;
	  case djd43.gfx.Polyline.nodeType:
		s = new djd43.gfx.Polyline();
		break;
	  case djd43.gfx.Path.nodeType:
		s = new djd43.gfx.Path();
		break;
	  case djd43.gfx.Circle.nodeType:
		s = new djd43.gfx.Circle();
		break;
	  case djd43.gfx.Line.nodeType:
		s = new djd43.gfx.Line();
		break;
	  case djd43.gfx.Image.nodeType:
		s = new djd43.gfx.Image();
		break;
	  default:
		djd43.debug("FATAL ERROR! tagName = " + node.tagName);
	}
	s.attach(node);
	return s;
};
djd43.lang.extend(djd43.gfx.Surface, {setDimensions:function (width, height) {
	if (!this.rawNode) {
		return this;
	}
	this.rawNode.setAttribute("width", width);
	this.rawNode.setAttribute("height", height);
	return this;
}, getDimensions:function () {
	return this.rawNode ? {width:this.rawNode.getAttribute("width"), height:this.rawNode.getAttribute("height")} : null;
}});
djd43.gfx.createSurface = function (parentNode, width, height) {
	var s = new djd43.gfx.Surface();
	s.rawNode = document.createElementNS(djd43.svg.xmlns.svg, "svg");
	s.rawNode.setAttribute("width", width);
	s.rawNode.setAttribute("height", height);
	var defs = new djd43.gfx.svg.Defines();
	var node = document.createElementNS(djd43.svg.xmlns.svg, djd43.gfx.svg.Defines.nodeType);
	defs.setRawNode(node);
	s.rawNode.appendChild(node);
	djd43.byId(parentNode).appendChild(s.rawNode);
	return s;
};
djd43.gfx.attachSurface = function (node) {
	var s = new djd43.gfx.Surface();
	s.rawNode = node;
	return s;
};
djd43.lang.extend(djd43.gfx.Group, djd43.gfx._creators);
djd43.lang.extend(djd43.gfx.Surface, djd43.gfx._creators);
delete djd43.gfx._creators;
djd43.gfx.svg.Defines = function () {
	this.rawNode = null;
};
djd43.lang.extend(djd43.gfx.svg.Defines, {setRawNode:function (rawNode) {
	this.rawNode = rawNode;
}});
djd43.gfx.svg.Defines.nodeType = "defs";

