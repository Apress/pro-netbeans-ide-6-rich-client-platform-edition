/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.SvgButton");
djd43.require("djd43.experimental");
djd43.experimental("djd43.widget.SvgButton");
djd43.widget.SvgButton = function () {
	djd43.widget.DomButton.call(this);
	djd43.widget.SvgWidget.call(this);
	this.onFoo = function () {
		alert("bar");
	};
	this.label = "huzzah!";
	this.setLabel = function (x, y, textSize, label, shape) {
		var coords = djd43.widget.SvgButton.prototype.coordinates(x, y, textSize, label, shape);
		var textString = "";
		switch (shape) {
		  case "ellipse":
			textString = "<text x='" + coords[6] + "' y='" + coords[7] + "'>" + label + "</text>";
			break;
		  case "rectangle":
			textString = "";
			break;
		  case "circle":
			textString = "";
			break;
		}
		return textString;
	};
	this.fillInTemplate = function (x, y, textSize, label, shape) {
		this.textSize = textSize || 12;
		this.label = label;
		var textWidth = this.label.length * this.textSize;
	};
};
djd43.inherits(djd43.widget.SvgButton, djd43.widget.DomButton);
djd43.widget.SvgButton.prototype.shapeString = function (x, y, textSize, label, shape) {
	switch (shape) {
	  case "ellipse":
		var coords = djd43.widget.SvgButton.prototype.coordinates(x, y, textSize, label, shape);
		return "<ellipse cx='" + coords[4] + "' cy='" + coords[5] + "' rx='" + coords[2] + "' ry='" + coords[3] + "'/>";
		break;
	  case "rect":
		return "";
		break;
	  case "circle":
		return "";
		break;
	}
};
djd43.widget.SvgButton.prototype.coordinates = function (x, y, textSize, label, shape) {
	switch (shape) {
	  case "ellipse":
		var buttonWidth = label.length * textSize;
		var buttonHeight = textSize * 2.5;
		var rx = buttonWidth / 2;
		var ry = buttonHeight / 2;
		var cx = rx + x;
		var cy = ry + y;
		var textX = cx - rx * textSize / 25;
		var textY = cy * 1.1;
		return [buttonWidth, buttonHeight, rx, ry, cx, cy, textX, textY];
		break;
	  case "rectangle":
		return "";
		break;
	  case "circle":
		return "";
		break;
	}
};
djd43.widget.SvgButton.prototype.labelString = function (x, y, textSize, label, shape) {
	var textString = "";
	var coords = djd43.widget.SvgButton.prototype.coordinates(x, y, textSize, label, shape);
	switch (shape) {
	  case "ellipse":
		textString = "<text x='" + coords[6] + "' y='" + coords[7] + "'>" + label + "</text>";
		break;
	  case "rectangle":
		textString = "";
		break;
	  case "circle":
		textString = "";
		break;
	}
	return textString;
};
djd43.widget.SvgButton.prototype.templateString = function (x, y, textSize, label, shape) {
	return "<g class='dojoButton' dojoAttachEvent='onClick; onMouseMove: onFoo;' dojoAttachPoint='labelNode'>" + djd43.widgets.SVGButton.prototype.shapeString(x, y, textSize, label, shape) + djd43.widget.SVGButton.prototype.labelString(x, y, textSize, label, shape) + "</g>";
};

