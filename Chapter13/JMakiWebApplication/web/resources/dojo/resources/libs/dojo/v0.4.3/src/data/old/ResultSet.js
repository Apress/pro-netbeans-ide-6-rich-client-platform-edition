/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.data.old.ResultSet");
djd43.require("djd43.lang.assert");
djd43.require("djd43.collections.Collections");
djd43.data.old.ResultSet = function (dataProvider, arrayOfItems) {
	djd43.lang.assertType(dataProvider, djd43.data.old.provider.Base, {optional:true});
	djd43.lang.assertType(arrayOfItems, Array, {optional:true});
	djd43.data.old.Observable.call(this);
	this._dataProvider = dataProvider;
	this._arrayOfItems = [];
	if (arrayOfItems) {
		this._arrayOfItems = arrayOfItems;
	}
};
djd43.inherits(djd43.data.old.ResultSet, djd43.data.old.Observable);
djd43.data.old.ResultSet.prototype.toString = function () {
	var returnString = this._arrayOfItems.join(", ");
	return returnString;
};
djd43.data.old.ResultSet.prototype.toArray = function () {
	return this._arrayOfItems;
};
djd43.data.old.ResultSet.prototype.getIterator = function () {
	return new djd43.collections.Iterator(this._arrayOfItems);
};
djd43.data.old.ResultSet.prototype.getLength = function () {
	return this._arrayOfItems.length;
};
djd43.data.old.ResultSet.prototype.getItemAt = function (index) {
	return this._arrayOfItems[index];
};
djd43.data.old.ResultSet.prototype.indexOf = function (item) {
	return djd43.lang.indexOf(this._arrayOfItems, item);
};
djd43.data.old.ResultSet.prototype.contains = function (item) {
	return djd43.lang.inArray(this._arrayOfItems, item);
};
djd43.data.old.ResultSet.prototype.getDataProvider = function () {
	return this._dataProvider;
};

