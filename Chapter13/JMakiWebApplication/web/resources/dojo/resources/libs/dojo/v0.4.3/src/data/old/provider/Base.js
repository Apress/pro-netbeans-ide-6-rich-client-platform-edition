/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.data.old.provider.Base");
djd43.require("djd43.lang.assert");
djd43.data.old.provider.Base = function () {
	this._countOfNestedTransactions = 0;
	this._changesInCurrentTransaction = null;
};
djd43.data.old.provider.Base.prototype.beginTransaction = function () {
	if (this._countOfNestedTransactions === 0) {
		this._changesInCurrentTransaction = [];
	}
	this._countOfNestedTransactions += 1;
};
djd43.data.old.provider.Base.prototype.endTransaction = function () {
	this._countOfNestedTransactions -= 1;
	djd43.lang.assert(this._countOfNestedTransactions >= 0);
	if (this._countOfNestedTransactions === 0) {
		var listOfChangesMade = this._saveChanges();
		this._changesInCurrentTransaction = null;
		if (listOfChangesMade.length > 0) {
			this._notifyObserversOfChanges(listOfChangesMade);
		}
	}
};
djd43.data.old.provider.Base.prototype.getNewItemToLoad = function () {
	return this._newItem();
};
djd43.data.old.provider.Base.prototype.newItem = function (itemName) {
	djd43.lang.assertType(itemName, String, {optional:true});
	var item = this._newItem();
	if (itemName) {
		item.set("name", itemName);
	}
	return item;
};
djd43.data.old.provider.Base.prototype.newAttribute = function (attributeId) {
	djd43.lang.assertType(attributeId, String, {optional:true});
	var attribute = this._newAttribute(attributeId);
	return attribute;
};
djd43.data.old.provider.Base.prototype.getAttribute = function (attributeId) {
	djd43.unimplemented("djd43.data.old.provider.Base");
	var attribute;
	return attribute;
};
djd43.data.old.provider.Base.prototype.getAttributes = function () {
	djd43.unimplemented("djd43.data.old.provider.Base");
	return this._arrayOfAttributes;
};
djd43.data.old.provider.Base.prototype.fetchArray = function () {
	djd43.unimplemented("djd43.data.old.provider.Base");
	return [];
};
djd43.data.old.provider.Base.prototype.fetchResultSet = function () {
	djd43.unimplemented("djd43.data.old.provider.Base");
	var resultSet;
	return resultSet;
};
djd43.data.old.provider.Base.prototype.noteChange = function (item, attribute, value) {
	var change = {item:item, attribute:attribute, value:value};
	if (this._countOfNestedTransactions === 0) {
		this.beginTransaction();
		this._changesInCurrentTransaction.push(change);
		this.endTransaction();
	} else {
		this._changesInCurrentTransaction.push(change);
	}
};
djd43.data.old.provider.Base.prototype.addItemObserver = function (item, observer) {
	djd43.lang.assertType(item, djd43.data.old.Item);
	item.addObserver(observer);
};
djd43.data.old.provider.Base.prototype.removeItemObserver = function (item, observer) {
	djd43.lang.assertType(item, djd43.data.old.Item);
	item.removeObserver(observer);
};
djd43.data.old.provider.Base.prototype._newItem = function () {
	var item = new djd43.data.old.Item(this);
	return item;
};
djd43.data.old.provider.Base.prototype._newAttribute = function (attributeId) {
	var attribute = new djd43.data.old.Attribute(this);
	return attribute;
};
djd43.data.old.provider.Base.prototype._saveChanges = function () {
	var arrayOfChangesMade = this._changesInCurrentTransaction;
	return arrayOfChangesMade;
};
djd43.data.old.provider.Base.prototype._notifyObserversOfChanges = function (arrayOfChanges) {
	var arrayOfResultSets = this._getResultSets();
	for (var i in arrayOfChanges) {
		var change = arrayOfChanges[i];
		var changedItem = change.item;
		var arrayOfItemObservers = changedItem.getObservers();
		for (var j in arrayOfItemObservers) {
			var observer = arrayOfItemObservers[j];
			observer.observedObjectHasChanged(changedItem, change);
		}
		for (var k in arrayOfResultSets) {
			var resultSet = arrayOfResultSets[k];
			var arrayOfResultSetObservers = resultSet.getObservers();
			for (var m in arrayOfResultSetObservers) {
				observer = arrayOfResultSetObservers[m];
				observer.observedObjectHasChanged(resultSet, change);
			}
		}
	}
};
djd43.data.old.provider.Base.prototype._getResultSets = function () {
	djd43.unimplemented("djd43.data.old.provider.Base");
	return [];
};

