/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.graphics.color.hsl");
djd43.require("djd43.gfx.color.hsl");
djd43.deprecated("djd43.graphics.color.hsl has been replaced with djd43.gfx.color.hsl", "0.5");
djd43.graphics.color.rgb2hsl = function (r, g, b) {
	djd43.deprecated("djd43.graphics.color.rgb2hsl has been replaced with djd43.gfx.color.rgb2hsl", "0.5");
	return djd43.gfx.color.rgb2hsl(r, g, b);
};
djd43.graphics.color.hsl2rgb = function (h, s, l) {
	djd43.deprecated("djd43.graphics.color.hsl2rgb has been replaced with djd43.gfx.color.hsl2rgb", "0.5");
	return djd43.gfx.color.hsl2rgb(h, s, l);
};
djd43.graphics.color.hsl2hex = function (h, s, l) {
	djd43.deprecated("djd43.graphics.color.hsl2hex has been replaced with djd43.gfx.color.hsl2hex", "0.5");
	return djd43.gfx.color.hsl2hex(h, s, l);
};
djd43.graphics.color.hex2hsl = function (hex) {
	djd43.deprecated("djd43.graphics.color.hex2hsl has been replaced with djd43.gfx.color.hex2hsl", "0.5");
	return djd43.gfx.color.hex2hsl(hex);
};

