/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.require("djd43.html.style");
djd43.provide("djd43.html.color");
djd43.require("djd43.gfx.color");
djd43.require("djd43.lang.common");
djd43.html.getBackgroundColor = function (node) {
	node = djd43.byId(node);
	var color;
	do {
		color = djd43.html.getStyle(node, "background-color");
		if (color.toLowerCase() == "rgba(0, 0, 0, 0)") {
			color = "transparent";
		}
		if (node == document.getElementsByTagName("body")[0]) {
			node = null;
			break;
		}
		node = node.parentNode;
	} while (node && djd43.lang.inArray(["transparent", ""], color));
	if (color == "transparent") {
		color = [255, 255, 255, 0];
	} else {
		color = djd43.gfx.color.extractRGB(color);
	}
	return color;
};

