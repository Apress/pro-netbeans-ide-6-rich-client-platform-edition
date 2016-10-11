/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.data.old.Value");
djd43.require("djd43.lang.assert");
djd43.data.old.Value = function (value) {
	this._value = value;
	this._type = null;
};
djd43.data.old.Value.prototype.toString = function () {
	return this._value.toString();
};
djd43.data.old.Value.prototype.getValue = function () {
	return this._value;
};
djd43.data.old.Value.prototype.getType = function () {
	djd43.unimplemented("djd43.data.old.Value.prototype.getType");
	return this._type;
};
djd43.data.old.Value.prototype.compare = function () {
	djd43.unimplemented("djd43.data.old.Value.prototype.compare");
};
djd43.data.old.Value.prototype.isEqual = function () {
	djd43.unimplemented("djd43.data.old.Value.prototype.isEqual");
};

