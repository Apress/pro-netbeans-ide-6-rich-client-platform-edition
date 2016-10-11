/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.AnimatedPng");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.HtmlWidget");
djd43.widget.defineWidget("djd43.widget.AnimatedPng", djd43.widget.HtmlWidget, {isContainer:false, width:0, height:0, aniSrc:"", interval:100, _blankSrc:djd43.uri.moduleUri("djd43.widget", "templates/images/blank.gif"), templateString:"<img class=\"dojoAnimatedPng\" />", postCreate:function () {
	this.cellWidth = this.width;
	this.cellHeight = this.height;
	var img = new Image();
	var self = this;
	img.onload = function () {
		self._initAni(img.width, img.height);
	};
	img.src = this.aniSrc;
}, _initAni:function (w, h) {
	this.domNode.src = this._blankSrc;
	this.domNode.width = this.cellWidth;
	this.domNode.height = this.cellHeight;
	this.domNode.style.backgroundImage = "url(" + this.aniSrc + ")";
	this.domNode.style.backgroundRepeat = "no-repeat";
	this.aniCols = Math.floor(w / this.cellWidth);
	this.aniRows = Math.floor(h / this.cellHeight);
	this.aniCells = this.aniCols * this.aniRows;
	this.aniFrame = 0;
	window.setInterval(djd43.lang.hitch(this, "_tick"), this.interval);
}, _tick:function () {
	this.aniFrame++;
	if (this.aniFrame == this.aniCells) {
		this.aniFrame = 0;
	}
	var col = this.aniFrame % this.aniCols;
	var row = Math.floor(this.aniFrame / this.aniCols);
	var bx = -1 * col * this.cellWidth;
	var by = -1 * row * this.cellHeight;
	this.domNode.style.backgroundPosition = bx + "px " + by + "px";
}});

