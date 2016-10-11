/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.data.core.Result");
djd43.require("djd43.lang.declare");
djd43.require("djd43.experimental");
djd43.experimental("djd43.data.core.Result");
djd43.declare("djd43.data.core.Result", null, {initializer:function (keywordArgs, store) {
	this.fromKwArgs(keywordArgs || {});
	this.items = null;
	this.resultMetadata = null;
	this.length = -1;
	this.store = store;
	this._aborted = false;
	this._abortFunc = null;
}, sync:true, abort:function () {
	this._aborted = true;
	if (this._abortFunc) {
		this._abortFunc();
	}
}, fromKwArgs:function (kwArgs) {
	if (typeof kwArgs.saveResult == "undefined") {
		this.saveResult = kwArgs.onnext ? false : true;
	}
	djd43.lang.mixin(this, kwArgs);
}});

