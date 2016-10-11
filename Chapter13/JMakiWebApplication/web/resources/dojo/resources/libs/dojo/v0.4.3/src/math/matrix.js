/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.math.matrix");
djd43.math.matrix.iDF = 0;
djd43.math.matrix.ALMOST_ZERO = 1e-10;
djd43.math.matrix.multiply = function (a, b) {
	var ay = a.length;
	var ax = a[0].length;
	var by = b.length;
	var bx = b[0].length;
	if (ax != by) {
		djd43.debug("Can't multiply matricies of sizes " + ax + "," + ay + " and " + bx + "," + by);
		return [[0]];
	}
	var c = [];
	for (var k = 0; k < ay; k++) {
		c[k] = [];
		for (var i = 0; i < bx; i++) {
			c[k][i] = 0;
			for (var m = 0; m < ax; m++) {
				c[k][i] += a[k][m] * b[m][i];
			}
		}
	}
	return c;
};
djd43.math.matrix.product = function () {
	if (arguments.length == 0) {
		djd43.debug("can't multiply 0 matrices!");
		return 1;
	}
	var result = arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		result = djd43.math.matrix.multiply(result, arguments[i]);
	}
	return result;
};
djd43.math.matrix.sum = function () {
	if (arguments.length == 0) {
		djd43.debug("can't sum 0 matrices!");
		return 0;
	}
	var result = djd43.math.matrix.copy(arguments[0]);
	var rows = result.length;
	if (rows == 0) {
		djd43.debug("can't deal with matrices of 0 rows!");
		return 0;
	}
	var cols = result[0].length;
	if (cols == 0) {
		djd43.debug("can't deal with matrices of 0 cols!");
		return 0;
	}
	for (var i = 1; i < arguments.length; ++i) {
		var arg = arguments[i];
		if (arg.length != rows || arg[0].length != cols) {
			djd43.debug("can't add matrices of different dimensions: first dimensions were " + rows + "x" + cols + ", current dimensions are " + arg.length + "x" + arg[0].length);
			return 0;
		}
		for (var r = 0; r < rows; r++) {
			for (var c = 0; c < cols; c++) {
				result[r][c] += arg[r][c];
			}
		}
	}
	return result;
};
djd43.math.matrix.inverse = function (a) {
	if (a.length == 1 && a[0].length == 1) {
		return [[1 / a[0][0]]];
	}
	var tms = a.length;
	var m = djd43.math.matrix.create(tms, tms);
	var mm = djd43.math.matrix.adjoint(a);
	var det = djd43.math.matrix.determinant(a);
	var dd = 0;
	if (det == 0) {
		djd43.debug("Determinant Equals 0, Not Invertible.");
		return [[0]];
	} else {
		dd = 1 / det;
	}
	for (var i = 0; i < tms; i++) {
		for (var j = 0; j < tms; j++) {
			m[i][j] = dd * mm[i][j];
		}
	}
	return m;
};
djd43.math.matrix.determinant = function (a) {
	if (a.length != a[0].length) {
		djd43.debug("Can't calculate the determiant of a non-squre matrix!");
		return 0;
	}
	var tms = a.length;
	var det = 1;
	var b = djd43.math.matrix.upperTriangle(a);
	for (var i = 0; i < tms; i++) {
		var bii = b[i][i];
		if (Math.abs(bii) < djd43.math.matrix.ALMOST_ZERO) {
			return 0;
		}
		det *= bii;
	}
	det = det * djd43.math.matrix.iDF;
	return det;
};
djd43.math.matrix.upperTriangle = function (m) {
	m = djd43.math.matrix.copy(m);
	var f1 = 0;
	var temp = 0;
	var tms = m.length;
	var v = 1;
	djd43.math.matrix.iDF = 1;
	for (var col = 0; col < tms - 1; col++) {
		if (typeof m[col][col] != "number") {
			djd43.debug("non-numeric entry found in a numeric matrix: m[" + col + "][" + col + "]=" + m[col][col]);
		}
		v = 1;
		var stop_loop = 0;
		while ((m[col][col] == 0) && !stop_loop) {
			if (col + v >= tms) {
				djd43.math.matrix.iDF = 0;
				stop_loop = 1;
			} else {
				for (var r = 0; r < tms; r++) {
					temp = m[col][r];
					m[col][r] = m[col + v][r];
					m[col + v][r] = temp;
				}
				v++;
				djd43.math.matrix.iDF *= -1;
			}
		}
		for (var row = col + 1; row < tms; row++) {
			if (typeof m[row][col] != "number") {
				djd43.debug("non-numeric entry found in a numeric matrix: m[" + row + "][" + col + "]=" + m[row][col]);
			}
			if (typeof m[col][row] != "number") {
				djd43.debug("non-numeric entry found in a numeric matrix: m[" + col + "][" + row + "]=" + m[col][row]);
			}
			if (m[col][col] != 0) {
				var f1 = (-1) * m[row][col] / m[col][col];
				for (var i = col; i < tms; i++) {
					m[row][i] = f1 * m[col][i] + m[row][i];
				}
			}
		}
	}
	return m;
};
djd43.math.matrix.create = function (a, b, value) {
	if (!value) {
		value = 0;
	}
	var m = [];
	for (var i = 0; i < b; i++) {
		m[i] = [];
		for (var j = 0; j < a; j++) {
			m[i][j] = value;
		}
	}
	return m;
};
djd43.math.matrix.ones = function (a, b) {
	return djd43.math.matrix.create(a, b, 1);
};
djd43.math.matrix.zeros = function (a, b) {
	return djd43.math.matrix.create(a, b, 0);
};
djd43.math.matrix.identity = function (size, scale) {
	if (!scale) {
		scale = 1;
	}
	var m = [];
	for (var i = 0; i < size; i++) {
		m[i] = [];
		for (var j = 0; j < size; j++) {
			m[i][j] = (i == j ? scale : 0);
		}
	}
	return m;
};
djd43.math.matrix.adjoint = function (a) {
	var tms = a.length;
	if (tms <= 1) {
		djd43.debug("Can't find the adjoint of a matrix with a dimension less than 2");
		return [[0]];
	}
	if (a.length != a[0].length) {
		djd43.debug("Can't find the adjoint of a non-square matrix");
		return [[0]];
	}
	var m = djd43.math.matrix.create(tms, tms);
	var ii = 0;
	var jj = 0;
	var ia = 0;
	var ja = 0;
	var det = 0;
	var ap = djd43.math.matrix.create(tms - 1, tms - 1);
	for (var i = 0; i < tms; i++) {
		for (var j = 0; j < tms; j++) {
			ia = 0;
			for (ii = 0; ii < tms; ii++) {
				if (ii == i) {
					continue;
				}
				ja = 0;
				for (jj = 0; jj < tms; jj++) {
					if (jj == j) {
						continue;
					}
					ap[ia][ja] = a[ii][jj];
					ja++;
				}
				ia++;
			}
			det = djd43.math.matrix.determinant(ap);
			m[i][j] = Math.pow(-1, (i + j)) * det;
		}
	}
	m = djd43.math.matrix.transpose(m);
	return m;
};
djd43.math.matrix.transpose = function (a) {
	var m = djd43.math.matrix.create(a.length, a[0].length);
	for (var i = 0; i < a.length; i++) {
		for (var j = 0; j < a[i].length; j++) {
			m[j][i] = a[i][j];
		}
	}
	return m;
};
djd43.math.matrix.format = function (a, decimal_points) {
	if (arguments.length <= 1) {
		decimal_points = 5;
	}
	function format_int(x, dp) {
		var fac = Math.pow(10, dp);
		var a = Math.round(x * fac) / fac;
		var b = a.toString();
		if (b.charAt(0) != "-") {
			b = " " + b;
		}
		var has_dp = 0;
		for (var i = 1; i < b.length; i++) {
			if (b.charAt(i) == ".") {
				has_dp = 1;
			}
		}
		if (!has_dp) {
			b += ".";
		}
		while (b.length < dp + 3) {
			b += "0";
		}
		return b;
	}
	var ya = a.length;
	var xa = ya > 0 ? a[0].length : 0;
	var buffer = "";
	for (var y = 0; y < ya; y++) {
		buffer += "| ";
		for (var x = 0; x < xa; x++) {
			buffer += format_int(a[y][x], decimal_points) + " ";
		}
		buffer += "|\n";
	}
	return buffer;
};
djd43.math.matrix.copy = function (a) {
	var ya = a.length;
	var xa = a[0].length;
	var m = djd43.math.matrix.create(xa, ya);
	for (var y = 0; y < ya; y++) {
		for (var x = 0; x < xa; x++) {
			m[y][x] = a[y][x];
		}
	}
	return m;
};
djd43.math.matrix.scale = function (k, a) {
	a = djd43.math.matrix.copy(a);
	var ya = a.length;
	var xa = a[0].length;
	for (var y = 0; y < ya; y++) {
		for (var x = 0; x < xa; x++) {
			a[y][x] *= k;
		}
	}
	return a;
};

