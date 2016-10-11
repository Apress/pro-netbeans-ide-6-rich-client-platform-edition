/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.gfx.matrix");
djd43.require("djd43.lang.common");
djd43.require("djd43.math.*");
djd43.gfx.matrix.Matrix2D = function (arg) {
	if (arg) {
		if (arg instanceof Array) {
			if (arg.length > 0) {
				var m = djd43.gfx.matrix.normalize(arg[0]);
				for (var i = 1; i < arg.length; ++i) {
					var l = m;
					var r = djd43.gfx.matrix.normalize(arg[i]);
					m = new djd43.gfx.matrix.Matrix2D();
					m.xx = l.xx * r.xx + l.xy * r.yx;
					m.xy = l.xx * r.xy + l.xy * r.yy;
					m.yx = l.yx * r.xx + l.yy * r.yx;
					m.yy = l.yx * r.xy + l.yy * r.yy;
					m.dx = l.xx * r.dx + l.xy * r.dy + l.dx;
					m.dy = l.yx * r.dx + l.yy * r.dy + l.dy;
				}
				djd43.mixin(this, m);
			}
		} else {
			djd43.mixin(this, arg);
		}
	}
};
djd43.extend(djd43.gfx.matrix.Matrix2D, {xx:1, xy:0, yx:0, yy:1, dx:0, dy:0});
djd43.mixin(djd43.gfx.matrix, {identity:new djd43.gfx.matrix.Matrix2D(), flipX:new djd43.gfx.matrix.Matrix2D({xx:-1}), flipY:new djd43.gfx.matrix.Matrix2D({yy:-1}), flipXY:new djd43.gfx.matrix.Matrix2D({xx:-1, yy:-1}), translate:function (a, b) {
	if (arguments.length > 1) {
		return new djd43.gfx.matrix.Matrix2D({dx:a, dy:b});
	}
	return new djd43.gfx.matrix.Matrix2D({dx:a.x, dy:a.y});
}, scale:function (a, b) {
	if (arguments.length > 1) {
		return new djd43.gfx.matrix.Matrix2D({xx:a, yy:b});
	}
	if (typeof a == "number") {
		return new djd43.gfx.matrix.Matrix2D({xx:a, yy:a});
	}
	return new djd43.gfx.matrix.Matrix2D({xx:a.x, yy:a.y});
}, rotate:function (angle) {
	var c = Math.cos(angle);
	var s = Math.sin(angle);
	return new djd43.gfx.matrix.Matrix2D({xx:c, xy:s, yx:-s, yy:c});
}, rotateg:function (degree) {
	return djd43.gfx.matrix.rotate(djd43.math.degToRad(degree));
}, skewX:function (angle) {
	return new djd43.gfx.matrix.Matrix2D({xy:Math.tan(angle)});
}, skewXg:function (degree) {
	return djd43.gfx.matrix.skewX(djd43.math.degToRad(degree));
}, skewY:function (angle) {
	return new djd43.gfx.matrix.Matrix2D({yx:-Math.tan(angle)});
}, skewYg:function (degree) {
	return djd43.gfx.matrix.skewY(djd43.math.degToRad(degree));
}, normalize:function (matrix) {
	return (matrix instanceof djd43.gfx.matrix.Matrix2D) ? matrix : new djd43.gfx.matrix.Matrix2D(matrix);
}, clone:function (matrix) {
	var obj = new djd43.gfx.matrix.Matrix2D();
	for (var i in matrix) {
		if (typeof (matrix[i]) == "number" && typeof (obj[i]) == "number" && obj[i] != matrix[i]) {
			obj[i] = matrix[i];
		}
	}
	return obj;
}, invert:function (matrix) {
	var m = djd43.gfx.matrix.normalize(matrix);
	var D = m.xx * m.yy - m.xy * m.yx;
	var M = new djd43.gfx.matrix.Matrix2D({xx:m.yy / D, xy:-m.xy / D, yx:-m.yx / D, yy:m.xx / D, dx:(m.yx * m.dy - m.yy * m.dx) / D, dy:(m.xy * m.dx - m.xx * m.dy) / D});
	return M;
}, _multiplyPoint:function (m, x, y) {
	return {x:m.xx * x + m.xy * y + m.dx, y:m.yx * x + m.yy * y + m.dy};
}, multiplyPoint:function (matrix, a, b) {
	var m = djd43.gfx.matrix.normalize(matrix);
	if (typeof a == "number" && typeof b == "number") {
		return djd43.gfx.matrix._multiplyPoint(m, a, b);
	}
	return djd43.gfx.matrix._multiplyPoint(m, a.x, a.y);
}, multiply:function (matrix) {
	var m = djd43.gfx.matrix.normalize(matrix);
	for (var i = 1; i < arguments.length; ++i) {
		var l = m;
		var r = djd43.gfx.matrix.normalize(arguments[i]);
		m = new djd43.gfx.matrix.Matrix2D();
		m.xx = l.xx * r.xx + l.xy * r.yx;
		m.xy = l.xx * r.xy + l.xy * r.yy;
		m.yx = l.yx * r.xx + l.yy * r.yx;
		m.yy = l.yx * r.xy + l.yy * r.yy;
		m.dx = l.xx * r.dx + l.xy * r.dy + l.dx;
		m.dy = l.yx * r.dx + l.yy * r.dy + l.dy;
	}
	return m;
}, _sandwich:function (m, x, y) {
	return djd43.gfx.matrix.multiply(djd43.gfx.matrix.translate(x, y), m, djd43.gfx.matrix.translate(-x, -y));
}, scaleAt:function (a, b, c, d) {
	switch (arguments.length) {
	  case 4:
		return djd43.gfx.matrix._sandwich(djd43.gfx.matrix.scale(a, b), c, d);
	  case 3:
		if (typeof c == "number") {
			return djd43.gfx.matrix._sandwich(djd43.gfx.matrix.scale(a), b, c);
		}
		return djd43.gfx.matrix._sandwich(djd43.gfx.matrix.scale(a, b), c.x, c.y);
	}
	return djd43.gfx.matrix._sandwich(djd43.gfx.matrix.scale(a), b.x, b.y);
}, rotateAt:function (angle, a, b) {
	if (arguments.length > 2) {
		return djd43.gfx.matrix._sandwich(djd43.gfx.matrix.rotate(angle), a, b);
	}
	return djd43.gfx.matrix._sandwich(djd43.gfx.matrix.rotate(angle), a.x, a.y);
}, rotategAt:function (degree, a, b) {
	if (arguments.length > 2) {
		return djd43.gfx.matrix._sandwich(djd43.gfx.matrix.rotateg(degree), a, b);
	}
	return djd43.gfx.matrix._sandwich(djd43.gfx.matrix.rotateg(degree), a.x, a.y);
}, skewXAt:function (angle, a, b) {
	if (arguments.length > 2) {
		return djd43.gfx.matrix._sandwich(djd43.gfx.matrix.skewX(angle), a, b);
	}
	return djd43.gfx.matrix._sandwich(djd43.gfx.matrix.skewX(angle), a.x, a.y);
}, skewXgAt:function (degree, a, b) {
	if (arguments.length > 2) {
		return djd43.gfx.matrix._sandwich(djd43.gfx.matrix.skewXg(degree), a, b);
	}
	return djd43.gfx.matrix._sandwich(djd43.gfx.matrix.skewXg(degree), a.x, a.y);
}, skewYAt:function (angle, a, b) {
	if (arguments.length > 2) {
		return djd43.gfx.matrix._sandwich(djd43.gfx.matrix.skewY(angle), a, b);
	}
	return djd43.gfx.matrix._sandwich(djd43.gfx.matrix.skewY(angle), a.x, a.y);
}, skewYgAt:function (degree, a, b) {
	if (arguments.length > 2) {
		return djd43.gfx.matrix._sandwich(djd43.gfx.matrix.skewYg(degree), a, b);
	}
	return djd43.gfx.matrix._sandwich(djd43.gfx.matrix.skewYg(degree), a.x, a.y);
}});

