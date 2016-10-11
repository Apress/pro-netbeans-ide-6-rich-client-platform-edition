/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.lfx.toggle");
djd43.require("djd43.lfx.*");
djd43.lfx.toggle.plain = {show:function (node, duration, easing, callback) {
	djd43.html.show(node);
	if (djd43.lang.isFunction(callback)) {
		callback();
	}
}, hide:function (node, duration, easing, callback) {
	djd43.html.hide(node);
	if (djd43.lang.isFunction(callback)) {
		callback();
	}
}};
djd43.lfx.toggle.fade = {show:function (node, duration, easing, callback) {
	djd43.lfx.fadeShow(node, duration, easing, callback).play();
}, hide:function (node, duration, easing, callback) {
	djd43.lfx.fadeHide(node, duration, easing, callback).play();
}};
djd43.lfx.toggle.wipe = {show:function (node, duration, easing, callback) {
	djd43.lfx.wipeIn(node, duration, easing, callback).play();
}, hide:function (node, duration, easing, callback) {
	djd43.lfx.wipeOut(node, duration, easing, callback).play();
}};
djd43.lfx.toggle.explode = {show:function (node, duration, easing, callback, explodeSrc) {
	djd43.lfx.explode(explodeSrc || {x:0, y:0, width:0, height:0}, node, duration, easing, callback).play();
}, hide:function (node, duration, easing, callback, explodeSrc) {
	djd43.lfx.implode(node, explodeSrc || {x:0, y:0, width:0, height:0}, duration, easing, callback).play();
}};

