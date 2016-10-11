/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.data.old.Observable");
djd43.require("djd43.lang.common");
djd43.require("djd43.lang.assert");
djd43.data.old.Observable = function () {
};
djd43.data.old.Observable.prototype.addObserver = function (observer) {
	djd43.lang.assertType(observer, Object);
	djd43.lang.assertType(observer.observedObjectHasChanged, Function);
	if (!this._arrayOfObservers) {
		this._arrayOfObservers = [];
	}
	if (!djd43.lang.inArray(this._arrayOfObservers, observer)) {
		this._arrayOfObservers.push(observer);
	}
};
djd43.data.old.Observable.prototype.removeObserver = function (observer) {
	if (!this._arrayOfObservers) {
		return;
	}
	var index = djd43.lang.indexOf(this._arrayOfObservers, observer);
	if (index != -1) {
		this._arrayOfObservers.splice(index, 1);
	}
};
djd43.data.old.Observable.prototype.getObservers = function () {
	return this._arrayOfObservers;
};

