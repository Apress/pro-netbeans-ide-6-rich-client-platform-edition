/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.data.old.provider.FlatFile");
djd43.require("djd43.data.old.provider.Base");
djd43.require("djd43.data.old.Item");
djd43.require("djd43.data.old.Attribute");
djd43.require("djd43.data.old.ResultSet");
djd43.require("djd43.data.old.format.Json");
djd43.require("djd43.data.old.format.Csv");
djd43.require("djd43.lang.assert");
djd43.data.old.provider.FlatFile = function (keywordParameters) {
	djd43.lang.assertType(keywordParameters, "pureobject", {optional:true});
	djd43.data.old.provider.Base.call(this);
	this._arrayOfItems = [];
	this._resultSet = null;
	this._dictionaryOfAttributes = {};
	if (keywordParameters) {
		var jsonObjects = keywordParameters["jsonObjects"];
		var jsonString = keywordParameters["jsonString"];
		var fileUrl = keywordParameters["url"];
		if (jsonObjects) {
			djd43.data.old.format.Json.loadDataProviderFromArrayOfJsonData(this, jsonObjects);
		}
		if (jsonString) {
			djd43.data.old.format.Json.loadDataProviderFromFileContents(this, jsonString);
		}
		if (fileUrl) {
			var arrayOfParts = fileUrl.split(".");
			var lastPart = arrayOfParts[(arrayOfParts.length - 1)];
			var formatParser = null;
			if (lastPart == "json") {
				formatParser = djd43.data.old.format.Json;
			}
			if (lastPart == "csv") {
				formatParser = djd43.data.old.format.Csv;
			}
			if (formatParser) {
				var fileContents = djd43.hostenv.getText(fileUrl);
				formatParser.loadDataProviderFromFileContents(this, fileContents);
			} else {
				djd43.lang.assert(false, "new djd43.data.old.provider.FlatFile({url: }) was passed a file without a .csv or .json suffix");
			}
		}
	}
};
djd43.inherits(djd43.data.old.provider.FlatFile, djd43.data.old.provider.Base);
djd43.data.old.provider.FlatFile.prototype.getProviderCapabilities = function (keyword) {
	djd43.lang.assertType(keyword, String, {optional:true});
	if (!this._ourCapabilities) {
		this._ourCapabilities = {transactions:false, undo:false, login:false, versioning:false, anonymousRead:true, anonymousWrite:false, permissions:false, queries:false, strongTyping:false, datatypes:[String, Date, Number]};
	}
	if (keyword) {
		return this._ourCapabilities[keyword];
	} else {
		return this._ourCapabilities;
	}
};
djd43.data.old.provider.FlatFile.prototype.registerAttribute = function (attributeId) {
	var registeredAttribute = this.getAttribute(attributeId);
	if (!registeredAttribute) {
		var newAttribute = new djd43.data.old.Attribute(this, attributeId);
		this._dictionaryOfAttributes[attributeId] = newAttribute;
		registeredAttribute = newAttribute;
	}
	return registeredAttribute;
};
djd43.data.old.provider.FlatFile.prototype.getAttribute = function (attributeId) {
	var attribute = (this._dictionaryOfAttributes[attributeId] || null);
	return attribute;
};
djd43.data.old.provider.FlatFile.prototype.getAttributes = function () {
	var arrayOfAttributes = [];
	for (var key in this._dictionaryOfAttributes) {
		var attribute = this._dictionaryOfAttributes[key];
		arrayOfAttributes.push(attribute);
	}
	return arrayOfAttributes;
};
djd43.data.old.provider.FlatFile.prototype.fetchArray = function (query) {
	return this._arrayOfItems;
};
djd43.data.old.provider.FlatFile.prototype.fetchResultSet = function (query) {
	if (!this._resultSet) {
		this._resultSet = new djd43.data.old.ResultSet(this, this.fetchArray(query));
	}
	return this._resultSet;
};
djd43.data.old.provider.FlatFile.prototype._newItem = function () {
	var item = new djd43.data.old.Item(this);
	this._arrayOfItems.push(item);
	return item;
};
djd43.data.old.provider.FlatFile.prototype._newAttribute = function (attributeId) {
	djd43.lang.assertType(attributeId, String);
	djd43.lang.assert(this.getAttribute(attributeId) === null);
	var attribute = new djd43.data.old.Attribute(this, attributeId);
	this._dictionaryOfAttributes[attributeId] = attribute;
	return attribute;
};
djd43.data.old.provider.Base.prototype._getResultSets = function () {
	return [this._resultSet];
};

