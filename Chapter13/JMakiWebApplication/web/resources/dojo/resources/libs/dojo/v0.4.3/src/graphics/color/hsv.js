/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.graphics.color.hsv");
djd43.require("djd43.gfx.color.hsv");
djd43.deprecated("djd43.graphics.color.hsv has been replaced by djd43.gfx.color.hsv", "0.5");
djd43.graphics.color.rgb2hsv = function (r, g, b) {
	djd43.deprecated("djd43.graphics.color.rgb2hsv has been replaced by djd43.gfx.color.rgb2hsv", "0.5");
	return djd43.gfx.color.rgb2hsv(r, g, b);
};
djd43.graphics.color.hsv2rgb = function (h, s, v) {
	djd43.deprecated("djd43.graphics.color.hsv2rgb has been replaced by djd43.gfx.color.hsv2rgb", "0.5");
	return djd43.gfx.color.hsv2rgb(h, s, v);
};

