/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.require("djd43.Deferred");
djd43.provide("djd43.DeferredList");
djd43.DeferredList = function (list, fireOnOneCallback, fireOnOneErrback, consumeErrors, canceller) {
	this.list = list;
	this.resultList = new Array(this.list.length);
	this.chain = [];
	this.id = this._nextId();
	this.fired = -1;
	this.paused = 0;
	this.results = [null, null];
	this.canceller = canceller;
	this.silentlyCancelled = false;
	if (this.list.length === 0 && !fireOnOneCallback) {
		this.callback(this.resultList);
	}
	this.finishedCount = 0;
	this.fireOnOneCallback = fireOnOneCallback;
	this.fireOnOneErrback = fireOnOneErrback;
	this.consumeErrors = consumeErrors;
	var index = 0;
	var _this = this;
	djd43.lang.forEach(this.list, function (d) {
		var _index = index;
		d.addCallback(function (r) {
			_this._cbDeferred(_index, true, r);
		});
		d.addErrback(function (r) {
			_this._cbDeferred(_index, false, r);
		});
		index++;
	});
};
djd43.inherits(djd43.DeferredList, djd43.Deferred);
djd43.lang.extend(djd43.DeferredList, {_cbDeferred:function (index, succeeded, result) {
	this.resultList[index] = [succeeded, result];
	this.finishedCount += 1;
	if (this.fired !== 0) {
		if (succeeded && this.fireOnOneCallback) {
			this.callback([index, result]);
		} else {
			if (!succeeded && this.fireOnOneErrback) {
				this.errback(result);
			} else {
				if (this.finishedCount == this.list.length) {
					this.callback(this.resultList);
				}
			}
		}
	}
	if (!succeeded && this.consumeErrors) {
		result = null;
	}
	return result;
}, gatherResults:function (deferredList) {
	var d = new djd43.DeferredList(deferredList, false, true, false);
	d.addCallback(function (results) {
		var ret = [];
		for (var i = 0; i < results.length; i++) {
			ret.push(results[i][1]);
		}
		return ret;
	});
	return d;
}});

