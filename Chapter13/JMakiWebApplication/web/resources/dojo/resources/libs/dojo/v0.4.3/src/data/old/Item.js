/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.data.old.Item");
djd43.require("djd43.data.old.Observable");
djd43.require("djd43.data.old.Value");
djd43.require("djd43.lang.common");
djd43.require("djd43.lang.assert");
djd43.data.old.Item = function (dataProvider) {
	djd43.lang.assertType(dataProvider, djd43.data.old.provider.Base, {optional:true});
	djd43.data.old.Observable.call(this);
	this._dataProvider = dataProvider;
	this._dictionaryOfAttributeValues = {};
};
djd43.inherits(djd43.data.old.Item, djd43.data.old.Observable);
djd43.data.old.Item.compare = function (itemOne, itemTwo) {
	djd43.lang.assertType(itemOne, djd43.data.old.Item);
	if (!djd43.lang.isOfType(itemTwo, djd43.data.old.Item)) {
		return -1;
	}
	var nameOne = itemOne.getName();
	var nameTwo = itemTwo.getName();
	if (nameOne == nameTwo) {
		var attributeArrayOne = itemOne.getAttributes();
		var attributeArrayTwo = itemTwo.getAttributes();
		if (attributeArrayOne.length != attributeArrayTwo.length) {
			if (attributeArrayOne.length > attributeArrayTwo.length) {
				return 1;
			} else {
				return -1;
			}
		}
		for (var i in attributeArrayOne) {
			var attribute = attributeArrayOne[i];
			var arrayOfValuesOne = itemOne.getValues(attribute);
			var arrayOfValuesTwo = itemTwo.getValues(attribute);
			djd43.lang.assert(arrayOfValuesOne && (arrayOfValuesOne.length > 0));
			if (!arrayOfValuesTwo) {
				return 1;
			}
			if (arrayOfValuesOne.length != arrayOfValuesTwo.length) {
				if (arrayOfValuesOne.length > arrayOfValuesTwo.length) {
					return 1;
				} else {
					return -1;
				}
			}
			for (var j in arrayOfValuesOne) {
				var value = arrayOfValuesOne[j];
				if (!itemTwo.hasAttributeValue(value)) {
					return 1;
				}
			}
			return 0;
		}
	} else {
		if (nameOne > nameTwo) {
			return 1;
		} else {
			return -1;
		}
	}
};
djd43.data.old.Item.prototype.toString = function () {
	var arrayOfStrings = [];
	var attributes = this.getAttributes();
	for (var i in attributes) {
		var attribute = attributes[i];
		var arrayOfValues = this.getValues(attribute);
		var valueString;
		if (arrayOfValues.length == 1) {
			valueString = arrayOfValues[0];
		} else {
			valueString = "[";
			valueString += arrayOfValues.join(", ");
			valueString += "]";
		}
		arrayOfStrings.push("  " + attribute + ": " + valueString);
	}
	var returnString = "{ ";
	returnString += arrayOfStrings.join(",\n");
	returnString += " }";
	return returnString;
};
djd43.data.old.Item.prototype.compare = function (otherItem) {
	return djd43.data.old.Item.compare(this, otherItem);
};
djd43.data.old.Item.prototype.isEqual = function (otherItem) {
	return (this.compare(otherItem) == 0);
};
djd43.data.old.Item.prototype.getName = function () {
	return this.get("name");
};
djd43.data.old.Item.prototype.get = function (attributeId) {
	var literalOrValueOrArray = this._dictionaryOfAttributeValues[attributeId];
	if (djd43.lang.isUndefined(literalOrValueOrArray)) {
		return null;
	}
	if (literalOrValueOrArray instanceof djd43.data.old.Value) {
		return literalOrValueOrArray.getValue();
	}
	if (djd43.lang.isArray(literalOrValueOrArray)) {
		var dojoDataValue = literalOrValueOrArray[0];
		return dojoDataValue.getValue();
	}
	return literalOrValueOrArray;
};
djd43.data.old.Item.prototype.getValue = function (attributeId) {
	var literalOrValueOrArray = this._dictionaryOfAttributeValues[attributeId];
	if (djd43.lang.isUndefined(literalOrValueOrArray)) {
		return null;
	}
	if (literalOrValueOrArray instanceof djd43.data.old.Value) {
		return literalOrValueOrArray;
	}
	if (djd43.lang.isArray(literalOrValueOrArray)) {
		var dojoDataValue = literalOrValueOrArray[0];
		return dojoDataValue;
	}
	var literal = literalOrValueOrArray;
	dojoDataValue = new djd43.data.old.Value(literal);
	this._dictionaryOfAttributeValues[attributeId] = dojoDataValue;
	return dojoDataValue;
};
djd43.data.old.Item.prototype.getValues = function (attributeId) {
	var literalOrValueOrArray = this._dictionaryOfAttributeValues[attributeId];
	if (djd43.lang.isUndefined(literalOrValueOrArray)) {
		return null;
	}
	if (literalOrValueOrArray instanceof djd43.data.old.Value) {
		var array = [literalOrValueOrArray];
		this._dictionaryOfAttributeValues[attributeId] = array;
		return array;
	}
	if (djd43.lang.isArray(literalOrValueOrArray)) {
		return literalOrValueOrArray;
	}
	var literal = literalOrValueOrArray;
	var dojoDataValue = new djd43.data.old.Value(literal);
	array = [dojoDataValue];
	this._dictionaryOfAttributeValues[attributeId] = array;
	return array;
};
djd43.data.old.Item.prototype.load = function (attributeId, value) {
	this._dataProvider.registerAttribute(attributeId);
	var literalOrValueOrArray = this._dictionaryOfAttributeValues[attributeId];
	if (djd43.lang.isUndefined(literalOrValueOrArray)) {
		this._dictionaryOfAttributeValues[attributeId] = value;
		return;
	}
	if (!(value instanceof djd43.data.old.Value)) {
		value = new djd43.data.old.Value(value);
	}
	if (literalOrValueOrArray instanceof djd43.data.old.Value) {
		var array = [literalOrValueOrArray, value];
		this._dictionaryOfAttributeValues[attributeId] = array;
		return;
	}
	if (djd43.lang.isArray(literalOrValueOrArray)) {
		literalOrValueOrArray.push(value);
		return;
	}
	var literal = literalOrValueOrArray;
	var dojoDataValue = new djd43.data.old.Value(literal);
	array = [dojoDataValue, value];
	this._dictionaryOfAttributeValues[attributeId] = array;
};
djd43.data.old.Item.prototype.set = function (attributeId, value) {
	this._dataProvider.registerAttribute(attributeId);
	this._dictionaryOfAttributeValues[attributeId] = value;
	this._dataProvider.noteChange(this, attributeId, value);
};
djd43.data.old.Item.prototype.setValue = function (attributeId, value) {
	this.set(attributeId, value);
};
djd43.data.old.Item.prototype.addValue = function (attributeId, value) {
	this.load(attributeId, value);
	this._dataProvider.noteChange(this, attributeId, value);
};
djd43.data.old.Item.prototype.setValues = function (attributeId, arrayOfValues) {
	djd43.lang.assertType(arrayOfValues, Array);
	this._dataProvider.registerAttribute(attributeId);
	var finalArray = [];
	this._dictionaryOfAttributeValues[attributeId] = finalArray;
	for (var i in arrayOfValues) {
		var value = arrayOfValues[i];
		if (!(value instanceof djd43.data.old.Value)) {
			value = new djd43.data.old.Value(value);
		}
		finalArray.push(value);
		this._dataProvider.noteChange(this, attributeId, value);
	}
};
djd43.data.old.Item.prototype.getAttributes = function () {
	var arrayOfAttributes = [];
	for (var key in this._dictionaryOfAttributeValues) {
		arrayOfAttributes.push(this._dataProvider.getAttribute(key));
	}
	return arrayOfAttributes;
};
djd43.data.old.Item.prototype.hasAttribute = function (attributeId) {
	return (attributeId in this._dictionaryOfAttributeValues);
};
djd43.data.old.Item.prototype.hasAttributeValue = function (attributeId, value) {
	var arrayOfValues = this.getValues(attributeId);
	for (var i in arrayOfValues) {
		var candidateValue = arrayOfValues[i];
		if (candidateValue.isEqual(value)) {
			return true;
		}
	}
	return false;
};

