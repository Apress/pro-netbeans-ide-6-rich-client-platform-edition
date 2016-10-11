/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.lfx.html");
djd43.require("djd43.gfx.color");
djd43.require("djd43.lfx.Animation");
djd43.require("djd43.lang.array");
djd43.require("djd43.html.display");
djd43.require("djd43.html.color");
djd43.require("djd43.html.layout");
djd43.lfx.html._byId = function (nodes) {
	if (!nodes) {
		return [];
	}
	if (djd43.lang.isArrayLike(nodes)) {
		if (!nodes.alreadyChecked) {
			var n = [];
			djd43.lang.forEach(nodes, function (node) {
				n.push(djd43.byId(node));
			});
			n.alreadyChecked = true;
			return n;
		} else {
			return nodes;
		}
	} else {
		var n = [];
		n.push(djd43.byId(nodes));
		n.alreadyChecked = true;
		return n;
	}
};
djd43.lfx.html.propertyAnimation = function (nodes, propertyMap, duration, easing, handlers) {
	nodes = djd43.lfx.html._byId(nodes);
	var targs = {"propertyMap":propertyMap, "nodes":nodes, "duration":duration, "easing":easing || djd43.lfx.easeDefault};
	var setEmUp = function (args) {
		if (args.nodes.length == 1) {
			var pm = args.propertyMap;
			if (!djd43.lang.isArray(args.propertyMap)) {
				var parr = [];
				for (var pname in pm) {
					pm[pname].property = pname;
					parr.push(pm[pname]);
				}
				pm = args.propertyMap = parr;
			}
			djd43.lang.forEach(pm, function (prop) {
				if (dj_undef("start", prop)) {
					if (prop.property != "opacity") {
						prop.start = parseInt(djd43.html.getComputedStyle(args.nodes[0], prop.property));
					} else {
						prop.start = djd43.html.getOpacity(args.nodes[0]);
					}
				}
			});
		}
	};
	var coordsAsInts = function (coords) {
		var cints = [];
		djd43.lang.forEach(coords, function (c) {
			cints.push(Math.round(c));
		});
		return cints;
	};
	var setStyle = function (n, style) {
		n = djd43.byId(n);
		if (!n || !n.style) {
			return;
		}
		for (var s in style) {
			try {
				if (s == "opacity") {
					djd43.html.setOpacity(n, style[s]);
				} else {
					n.style[s] = style[s];
				}
			}
			catch (e) {
				djd43.debug(e);
			}
		}
	};
	var propLine = function (properties) {
		this._properties = properties;
		this.diffs = new Array(properties.length);
		djd43.lang.forEach(properties, function (prop, i) {
			if (djd43.lang.isFunction(prop.start)) {
				prop.start = prop.start(prop, i);
			}
			if (djd43.lang.isFunction(prop.end)) {
				prop.end = prop.end(prop, i);
			}
			if (djd43.lang.isArray(prop.start)) {
				this.diffs[i] = null;
			} else {
				if (prop.start instanceof djd43.gfx.color.Color) {
					prop.startRgb = prop.start.toRgb();
					prop.endRgb = prop.end.toRgb();
				} else {
					this.diffs[i] = prop.end - prop.start;
				}
			}
		}, this);
		this.getValue = function (n) {
			var ret = {};
			djd43.lang.forEach(this._properties, function (prop, i) {
				var value = null;
				if (djd43.lang.isArray(prop.start)) {
				} else {
					if (prop.start instanceof djd43.gfx.color.Color) {
						value = (prop.units || "rgb") + "(";
						for (var j = 0; j < prop.startRgb.length; j++) {
							value += Math.round(((prop.endRgb[j] - prop.startRgb[j]) * n) + prop.startRgb[j]) + (j < prop.startRgb.length - 1 ? "," : "");
						}
						value += ")";
					} else {
						value = ((this.diffs[i]) * n) + prop.start + (prop.property != "opacity" ? prop.units || "px" : "");
					}
				}
				ret[djd43.html.toCamelCase(prop.property)] = value;
			}, this);
			return ret;
		};
	};
	var anim = new djd43.lfx.Animation({beforeBegin:function () {
		setEmUp(targs);
		anim.curve = new propLine(targs.propertyMap);
	}, onAnimate:function (propValues) {
		djd43.lang.forEach(targs.nodes, function (node) {
			setStyle(node, propValues);
		});
	}}, targs.duration, null, targs.easing);
	if (handlers) {
		for (var x in handlers) {
			if (djd43.lang.isFunction(handlers[x])) {
				anim.connect(x, anim, handlers[x]);
			}
		}
	}
	return anim;
};
djd43.lfx.html._makeFadeable = function (nodes) {
	var makeFade = function (node) {
		if (djd43.render.html.ie) {
			if ((node.style.zoom.length == 0) && (djd43.html.getStyle(node, "zoom") == "normal")) {
				node.style.zoom = "1";
			}
			if ((node.style.width.length == 0) && (djd43.html.getStyle(node, "width") == "auto")) {
				node.style.width = "auto";
			}
		}
	};
	if (djd43.lang.isArrayLike(nodes)) {
		djd43.lang.forEach(nodes, makeFade);
	} else {
		makeFade(nodes);
	}
};
djd43.lfx.html.fade = function (nodes, values, duration, easing, callback) {
	nodes = djd43.lfx.html._byId(nodes);
	var props = {property:"opacity"};
	if (!dj_undef("start", values)) {
		props.start = values.start;
	} else {
		props.start = function () {
			return djd43.html.getOpacity(nodes[0]);
		};
	}
	if (!dj_undef("end", values)) {
		props.end = values.end;
	} else {
		djd43.raise("djd43.lfx.html.fade needs an end value");
	}
	var anim = djd43.lfx.propertyAnimation(nodes, [props], duration, easing);
	anim.connect("beforeBegin", function () {
		djd43.lfx.html._makeFadeable(nodes);
	});
	if (callback) {
		anim.connect("onEnd", function () {
			callback(nodes, anim);
		});
	}
	return anim;
};
djd43.lfx.html.fadeIn = function (nodes, duration, easing, callback) {
	return djd43.lfx.html.fade(nodes, {end:1}, duration, easing, callback);
};
djd43.lfx.html.fadeOut = function (nodes, duration, easing, callback) {
	return djd43.lfx.html.fade(nodes, {end:0}, duration, easing, callback);
};
djd43.lfx.html.fadeShow = function (nodes, duration, easing, callback) {
	nodes = djd43.lfx.html._byId(nodes);
	djd43.lang.forEach(nodes, function (node) {
		djd43.html.setOpacity(node, 0);
	});
	var anim = djd43.lfx.html.fadeIn(nodes, duration, easing, callback);
	anim.connect("beforeBegin", function () {
		if (djd43.lang.isArrayLike(nodes)) {
			djd43.lang.forEach(nodes, djd43.html.show);
		} else {
			djd43.html.show(nodes);
		}
	});
	return anim;
};
djd43.lfx.html.fadeHide = function (nodes, duration, easing, callback) {
	var anim = djd43.lfx.html.fadeOut(nodes, duration, easing, function () {
		if (djd43.lang.isArrayLike(nodes)) {
			djd43.lang.forEach(nodes, djd43.html.hide);
		} else {
			djd43.html.hide(nodes);
		}
		if (callback) {
			callback(nodes, anim);
		}
	});
	return anim;
};
djd43.lfx.html.wipeIn = function (nodes, duration, easing, callback) {
	nodes = djd43.lfx.html._byId(nodes);
	var anims = [];
	djd43.lang.forEach(nodes, function (node) {
		var oprop = {};
		var origTop, origLeft, origPosition;
		with (node.style) {
			origTop = top;
			origLeft = left;
			origPosition = position;
			top = "-9999px";
			left = "-9999px";
			position = "absolute";
			display = "";
		}
		var nodeHeight = djd43.html.getBorderBox(node).height;
		with (node.style) {
			top = origTop;
			left = origLeft;
			position = origPosition;
			display = "none";
		}
		var anim = djd43.lfx.propertyAnimation(node, {"height":{start:1, end:function () {
			return nodeHeight;
		}}}, duration, easing);
		anim.connect("beforeBegin", function () {
			oprop.overflow = node.style.overflow;
			oprop.height = node.style.height;
			with (node.style) {
				overflow = "hidden";
				height = "1px";
			}
			djd43.html.show(node);
		});
		anim.connect("onEnd", function () {
			with (node.style) {
				overflow = oprop.overflow;
				height = oprop.height;
			}
			if (callback) {
				callback(node, anim);
			}
		});
		anims.push(anim);
	});
	return djd43.lfx.combine(anims);
};
djd43.lfx.html.wipeOut = function (nodes, duration, easing, callback) {
	nodes = djd43.lfx.html._byId(nodes);
	var anims = [];
	djd43.lang.forEach(nodes, function (node) {
		var oprop = {};
		var anim = djd43.lfx.propertyAnimation(node, {"height":{start:function () {
			return djd43.html.getContentBox(node).height;
		}, end:1}}, duration, easing, {"beforeBegin":function () {
			oprop.overflow = node.style.overflow;
			oprop.height = node.style.height;
			with (node.style) {
				overflow = "hidden";
			}
			djd43.html.show(node);
		}, "onEnd":function () {
			djd43.html.hide(node);
			with (node.style) {
				overflow = oprop.overflow;
				height = oprop.height;
			}
			if (callback) {
				callback(node, anim);
			}
		}});
		anims.push(anim);
	});
	return djd43.lfx.combine(anims);
};
djd43.lfx.html.slideTo = function (nodes, coords, duration, easing, callback) {
	nodes = djd43.lfx.html._byId(nodes);
	var anims = [];
	var compute = djd43.html.getComputedStyle;
	if (djd43.lang.isArray(coords)) {
		djd43.deprecated("djd43.lfx.html.slideTo(node, array)", "use djd43.lfx.html.slideTo(node, {top: value, left: value});", "0.5");
		coords = {top:coords[0], left:coords[1]};
	}
	djd43.lang.forEach(nodes, function (node) {
		var top = null;
		var left = null;
		var init = (function () {
			var innerNode = node;
			return function () {
				var pos = compute(innerNode, "position");
				top = (pos == "absolute" ? node.offsetTop : parseInt(compute(node, "top")) || 0);
				left = (pos == "absolute" ? node.offsetLeft : parseInt(compute(node, "left")) || 0);
				if (!djd43.lang.inArray(["absolute", "relative"], pos)) {
					var ret = djd43.html.abs(innerNode, true);
					djd43.html.setStyleAttributes(innerNode, "position:absolute;top:" + ret.y + "px;left:" + ret.x + "px;");
					top = ret.y;
					left = ret.x;
				}
			};
		})();
		init();
		var anim = djd43.lfx.propertyAnimation(node, {"top":{start:top, end:(coords.top || 0)}, "left":{start:left, end:(coords.left || 0)}}, duration, easing, {"beforeBegin":init});
		if (callback) {
			anim.connect("onEnd", function () {
				callback(nodes, anim);
			});
		}
		anims.push(anim);
	});
	return djd43.lfx.combine(anims);
};
djd43.lfx.html.slideBy = function (nodes, coords, duration, easing, callback) {
	nodes = djd43.lfx.html._byId(nodes);
	var anims = [];
	var compute = djd43.html.getComputedStyle;
	if (djd43.lang.isArray(coords)) {
		djd43.deprecated("djd43.lfx.html.slideBy(node, array)", "use djd43.lfx.html.slideBy(node, {top: value, left: value});", "0.5");
		coords = {top:coords[0], left:coords[1]};
	}
	djd43.lang.forEach(nodes, function (node) {
		var top = null;
		var left = null;
		var init = (function () {
			var innerNode = node;
			return function () {
				var pos = compute(innerNode, "position");
				top = (pos == "absolute" ? node.offsetTop : parseInt(compute(node, "top")) || 0);
				left = (pos == "absolute" ? node.offsetLeft : parseInt(compute(node, "left")) || 0);
				if (!djd43.lang.inArray(["absolute", "relative"], pos)) {
					var ret = djd43.html.abs(innerNode, true);
					djd43.html.setStyleAttributes(innerNode, "position:absolute;top:" + ret.y + "px;left:" + ret.x + "px;");
					top = ret.y;
					left = ret.x;
				}
			};
		})();
		init();
		var anim = djd43.lfx.propertyAnimation(node, {"top":{start:top, end:top + (coords.top || 0)}, "left":{start:left, end:left + (coords.left || 0)}}, duration, easing).connect("beforeBegin", init);
		if (callback) {
			anim.connect("onEnd", function () {
				callback(nodes, anim);
			});
		}
		anims.push(anim);
	});
	return djd43.lfx.combine(anims);
};
djd43.lfx.html.explode = function (start, endNode, duration, easing, callback) {
	var h = djd43.html;
	start = djd43.byId(start);
	endNode = djd43.byId(endNode);
	var startCoords = h.toCoordinateObject(start, true);
	var outline = document.createElement("div");
	h.copyStyle(outline, endNode);
	if (endNode.explodeClassName) {
		outline.className = endNode.explodeClassName;
	}
	with (outline.style) {
		position = "absolute";
		display = "none";
		var backgroundStyle = h.getStyle(start, "background-color");
		backgroundColor = backgroundStyle ? backgroundStyle.toLowerCase() : "transparent";
		backgroundColor = (backgroundColor == "transparent") ? "rgb(221, 221, 221)" : backgroundColor;
	}
	djd43.body().appendChild(outline);
	with (endNode.style) {
		visibility = "hidden";
		display = "block";
	}
	var endCoords = h.toCoordinateObject(endNode, true);
	with (endNode.style) {
		display = "none";
		visibility = "visible";
	}
	var props = {opacity:{start:0.5, end:1}};
	djd43.lang.forEach(["height", "width", "top", "left"], function (type) {
		props[type] = {start:startCoords[type], end:endCoords[type]};
	});
	var anim = new djd43.lfx.propertyAnimation(outline, props, duration, easing, {"beforeBegin":function () {
		h.setDisplay(outline, "block");
	}, "onEnd":function () {
		h.setDisplay(endNode, "block");
		outline.parentNode.removeChild(outline);
	}});
	if (callback) {
		anim.connect("onEnd", function () {
			callback(endNode, anim);
		});
	}
	return anim;
};
djd43.lfx.html.implode = function (startNode, end, duration, easing, callback) {
	var h = djd43.html;
	startNode = djd43.byId(startNode);
	end = djd43.byId(end);
	var startCoords = djd43.html.toCoordinateObject(startNode, true);
	var endCoords = djd43.html.toCoordinateObject(end, true);
	var outline = document.createElement("div");
	djd43.html.copyStyle(outline, startNode);
	if (startNode.explodeClassName) {
		outline.className = startNode.explodeClassName;
	}
	djd43.html.setOpacity(outline, 0.3);
	with (outline.style) {
		position = "absolute";
		display = "none";
		backgroundColor = h.getStyle(startNode, "background-color").toLowerCase();
	}
	djd43.body().appendChild(outline);
	var props = {opacity:{start:1, end:0.5}};
	djd43.lang.forEach(["height", "width", "top", "left"], function (type) {
		props[type] = {start:startCoords[type], end:endCoords[type]};
	});
	var anim = new djd43.lfx.propertyAnimation(outline, props, duration, easing, {"beforeBegin":function () {
		djd43.html.hide(startNode);
		djd43.html.show(outline);
	}, "onEnd":function () {
		outline.parentNode.removeChild(outline);
	}});
	if (callback) {
		anim.connect("onEnd", function () {
			callback(startNode, anim);
		});
	}
	return anim;
};
djd43.lfx.html.highlight = function (nodes, startColor, duration, easing, callback) {
	nodes = djd43.lfx.html._byId(nodes);
	var anims = [];
	djd43.lang.forEach(nodes, function (node) {
		var color = djd43.html.getBackgroundColor(node);
		var bg = djd43.html.getStyle(node, "background-color").toLowerCase();
		var bgImage = djd43.html.getStyle(node, "background-image");
		var wasTransparent = (bg == "transparent" || bg == "rgba(0, 0, 0, 0)");
		while (color.length > 3) {
			color.pop();
		}
		var rgb = new djd43.gfx.color.Color(startColor);
		var endRgb = new djd43.gfx.color.Color(color);
		var anim = djd43.lfx.propertyAnimation(node, {"background-color":{start:rgb, end:endRgb}}, duration, easing, {"beforeBegin":function () {
			if (bgImage) {
				node.style.backgroundImage = "none";
			}
			node.style.backgroundColor = "rgb(" + rgb.toRgb().join(",") + ")";
		}, "onEnd":function () {
			if (bgImage) {
				node.style.backgroundImage = bgImage;
			}
			if (wasTransparent) {
				node.style.backgroundColor = "transparent";
			}
			if (callback) {
				callback(node, anim);
			}
		}});
		anims.push(anim);
	});
	return djd43.lfx.combine(anims);
};
djd43.lfx.html.unhighlight = function (nodes, endColor, duration, easing, callback) {
	nodes = djd43.lfx.html._byId(nodes);
	var anims = [];
	djd43.lang.forEach(nodes, function (node) {
		var color = new djd43.gfx.color.Color(djd43.html.getBackgroundColor(node));
		var rgb = new djd43.gfx.color.Color(endColor);
		var bgImage = djd43.html.getStyle(node, "background-image");
		var anim = djd43.lfx.propertyAnimation(node, {"background-color":{start:color, end:rgb}}, duration, easing, {"beforeBegin":function () {
			if (bgImage) {
				node.style.backgroundImage = "none";
			}
			node.style.backgroundColor = "rgb(" + color.toRgb().join(",") + ")";
		}, "onEnd":function () {
			if (callback) {
				callback(node, anim);
			}
		}});
		anims.push(anim);
	});
	return djd43.lfx.combine(anims);
};
djd43.lang.mixin(djd43.lfx, djd43.lfx.html);

