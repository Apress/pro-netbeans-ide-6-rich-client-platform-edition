/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.cal.textDirectory");
djd43.require("djd43.string");
djd43.cal.textDirectory.Property = function (line) {
	var left = djd43.string.trim(line.substring(0, line.indexOf(":")));
	var right = djd43.string.trim(line.substr(line.indexOf(":") + 1));
	var parameters = djd43.string.splitEscaped(left, ";");
	this.name = parameters[0];
	parameters.splice(0, 1);
	this.params = [];
	var arr;
	for (var i = 0; i < parameters.length; i++) {
		arr = parameters[i].split("=");
		var key = djd43.string.trim(arr[0].toUpperCase());
		if (arr.length == 1) {
			this.params.push([key]);
			continue;
		}
		var values = djd43.string.splitEscaped(arr[1], ",");
		for (var j = 0; j < values.length; j++) {
			if (djd43.string.trim(values[j]) != "") {
				this.params.push([key, djd43.string.trim(values[j])]);
			}
		}
	}
	if (this.name.indexOf(".") > 0) {
		arr = this.name.split(".");
		this.group = arr[0];
		this.name = arr[1];
	}
	this.value = right;
};
djd43.cal.textDirectory.tokenise = function (text) {
	var nText = djd43.string.normalizeNewlines(text, "\n").replace(/\n[ \t]/g, "").replace(/\x00/g, "");
	var lines = nText.split("\n");
	var properties = [];
	for (var i = 0; i < lines.length; i++) {
		if (djd43.string.trim(lines[i]) == "") {
			continue;
		}
		var prop = new djd43.cal.textDirectory.Property(lines[i]);
		properties.push(prop);
	}
	return properties;
};

