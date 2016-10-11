/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.data.old.Attribute");
djd43.require("djd43.data.old.Item");
djd43.require("djd43.lang.assert");
djd43.data.old.Attribute = function (dataProvider, attributeId) {
	djd43.lang.assertType(dataProvider, djd43.data.old.provider.Base, {optional:true});
	djd43.lang.assertType(attributeId, String);
	djd43.data.old.Item.call(this, dataProvider);
	this._attributeId = attributeId;
};
djd43.inherits(djd43.data.old.Attribute, djd43.data.old.Item);
djd43.data.old.Attribute.prototype.toString = function () {
	return this._attributeId;
};
djd43.data.old.Attribute.prototype.getAttributeId = function () {
	return this._attributeId;
};
djd43.data.old.Attribute.prototype.getType = function () {
	return this.get("type");
};
djd43.data.old.Attribute.prototype.setType = function (type) {
	this.set("type", type);
};

