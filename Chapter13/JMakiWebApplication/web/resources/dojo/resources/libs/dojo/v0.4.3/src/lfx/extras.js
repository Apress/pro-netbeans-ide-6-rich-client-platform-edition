/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.lfx.extras");
djd43.require("djd43.lfx.html");
djd43.require("djd43.lfx.Animation");
djd43.lfx.html.fadeWipeIn = function (nodes, duration, easing, callback) {
	nodes = djd43.lfx.html._byId(nodes);
	var anim = djd43.lfx.combine(djd43.lfx.fadeIn(nodes, duration, easing), djd43.lfx.wipeIn(nodes, duration, easing));
	if (callback) {
		anim.connect("onEnd", function () {
			callback(nodes, anim);
		});
	}
	return anim;
};
djd43.lfx.html.fadeWipeOut = function (nodes, duration, easing, callback) {
	nodes = djd43.lfx.html._byId(nodes);
	var anim = djd43.lfx.combine(djd43.lfx.fadeOut(nodes, duration, easing), djd43.lfx.wipeOut(nodes, duration, easing));
	if (callback) {
		anim.connect("onEnd", function () {
			callback(nodes, anim);
		});
	}
	return anim;
};
djd43.lfx.html.scale = function (nodes, percentage, scaleContent, fromCenter, duration, easing, callback) {
	nodes = djd43.lfx.html._byId(nodes);
	var anims = [];
	djd43.lang.forEach(nodes, function (node) {
		var outer = djd43.html.getMarginBox(node);
		var actualPct = percentage / 100;
		var props = [{property:"width", start:outer.width, end:outer.width * actualPct}, {property:"height", start:outer.height, end:outer.height * actualPct}];
		if (scaleContent) {
			var fontSize = djd43.html.getStyle(node, "font-size");
			var fontSizeType = null;
			if (!fontSize) {
				fontSize = parseFloat("100%");
				fontSizeType = "%";
			} else {
				djd43.lang.some(["em", "px", "%"], function (item, index, arr) {
					if (fontSize.indexOf(item) > 0) {
						fontSize = parseFloat(fontSize);
						fontSizeType = item;
						return true;
					}
				});
			}
			props.push({property:"font-size", start:fontSize, end:fontSize * actualPct, units:fontSizeType});
		}
		if (fromCenter) {
			var positioning = djd43.html.getStyle(node, "position");
			var originalTop = node.offsetTop;
			var originalLeft = node.offsetLeft;
			var endTop = ((outer.height * actualPct) - outer.height) / 2;
			var endLeft = ((outer.width * actualPct) - outer.width) / 2;
			props.push({property:"top", start:originalTop, end:(positioning == "absolute" ? originalTop - endTop : (-1 * endTop))});
			props.push({property:"left", start:originalLeft, end:(positioning == "absolute" ? originalLeft - endLeft : (-1 * endLeft))});
		}
		var anim = djd43.lfx.propertyAnimation(node, props, duration, easing);
		if (callback) {
			anim.connect("onEnd", function () {
				callback(node, anim);
			});
		}
		anims.push(anim);
	});
	return djd43.lfx.combine(anims);
};
djd43.lang.mixin(djd43.lfx, djd43.lfx.html);

