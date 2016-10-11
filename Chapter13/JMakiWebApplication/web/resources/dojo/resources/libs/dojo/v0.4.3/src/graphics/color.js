/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.graphics.color");
djd43.require("djd43.gfx.color");
djd43.deprecated("djd43.graphics.color.Color is now djd43.gfx.color.Color.", "0.5");
djd43.graphics.color.Color = djd43.gfx.color.Color;
djd43.graphics.color.named = djd43.gfx.color.named;
djd43.graphics.color.blend = function (a, b, weight) {
	djd43.deprecated("djd43.graphics.color.blend is now djd43.gfx.color.blend", "0.5");
	return djd43.gfx.color.blend(a, b, weight);
};
djd43.graphics.color.blendHex = function (a, b, weight) {
	djd43.deprecated("djd43.graphics.color.blendHex is now djd43.gfx.color.blendHex", "0.5");
	return djd43.gfx.color.rgb2hex(djd43.gfx.color.blend(djd43.gfx.color.hex2rgb(a), djd43.gfx.color.hex2rgb(b), weight));
};
djd43.graphics.color.extractRGB = function (color) {
	djd43.deprecated("djd43.graphics.color.extractRGB is now djd43.gfx.color.extractRGB", "0.5");
	return djd43.gfx.color.extractRGB(color);
};
djd43.graphics.color.hex2rgb = function (hex) {
	djd43.deprecated("djd43.graphics.color.hex2rgb is now djd43.gfx.color.hex2rgb", "0.5");
	return djd43.gfx.color.hex2rgb(hex);
};
djd43.graphics.color.rgb2hex = function (r, g, b) {
	djd43.deprecated("djd43.graphics.color.rgb2hex is now djd43.gfx.color.rgb2hex", "0.5");
	return djd43.gfx.color.rgb2hex;
};

