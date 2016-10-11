/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.animation.AnimationEvent");
djd43.require("djd43.lang.common");
djd43.deprecated("djd43.animation.AnimationEvent is slated for removal in 0.5; use djd43.lfx.* instead.", "0.5");
djd43.animation.AnimationEvent = function (animation, type, coords, startTime, currentTime, endTime, duration, percent, fps) {
	this.type = type;
	this.animation = animation;
	this.coords = coords;
	this.x = coords[0];
	this.y = coords[1];
	this.z = coords[2];
	this.startTime = startTime;
	this.currentTime = currentTime;
	this.endTime = endTime;
	this.duration = duration;
	this.percent = percent;
	this.fps = fps;
};
djd43.extend(djd43.animation.AnimationEvent, {coordsAsInts:function () {
	var cints = new Array(this.coords.length);
	for (var i = 0; i < this.coords.length; i++) {
		cints[i] = Math.round(this.coords[i]);
	}
	return cints;
}});

