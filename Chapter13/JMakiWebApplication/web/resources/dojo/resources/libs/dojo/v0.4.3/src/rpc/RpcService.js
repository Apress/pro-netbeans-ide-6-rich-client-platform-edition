/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.rpc.RpcService");
djd43.require("djd43.io.*");
djd43.require("djd43.json");
djd43.require("djd43.lang.func");
djd43.require("djd43.Deferred");
djd43.rpc.RpcService = function (url) {
	if (url) {
		this.connect(url);
	}
};
djd43.lang.extend(djd43.rpc.RpcService, {strictArgChecks:true, serviceUrl:"", parseResults:function (obj) {
	return obj;
}, errorCallback:function (deferredRequestHandler) {
	return function (type, e) {
		deferredRequestHandler.errback(new Error(e.message));
	};
}, resultCallback:function (deferredRequestHandler) {
	var tf = djd43.lang.hitch(this, function (type, obj, e) {
		if (obj["error"] != null) {
			var err = new Error(obj.error);
			err.id = obj.id;
			deferredRequestHandler.errback(err);
		} else {
			var results = this.parseResults(obj);
			deferredRequestHandler.callback(results);
		}
	});
	return tf;
}, generateMethod:function (method, parameters, url) {
	return djd43.lang.hitch(this, function () {
		var deferredRequestHandler = new djd43.Deferred();
		if ((this.strictArgChecks) && (parameters != null) && (arguments.length != parameters.length)) {
			djd43.raise("Invalid number of parameters for remote method.");
		} else {
			this.bind(method, arguments, deferredRequestHandler, url);
		}
		return deferredRequestHandler;
	});
}, processSmd:function (object) {
	djd43.debug("RpcService: Processing returned SMD.");
	if (object.methods) {
		djd43.lang.forEach(object.methods, function (m) {
			if (m && m["name"]) {
				djd43.debug("RpcService: Creating Method: this.", m.name, "()");
				this[m.name] = this.generateMethod(m.name, m.parameters, m["url"] || m["serviceUrl"] || m["serviceURL"]);
				if (djd43.lang.isFunction(this[m.name])) {
					djd43.debug("RpcService: Successfully created", m.name, "()");
				} else {
					djd43.debug("RpcService: Failed to create", m.name, "()");
				}
			}
		}, this);
	}
	this.serviceUrl = object.serviceUrl || object.serviceURL;
	djd43.debug("RpcService: Dojo RpcService is ready for use.");
}, connect:function (smdUrl) {
	djd43.debug("RpcService: Attempting to load SMD document from:", smdUrl);
	djd43.io.bind({url:smdUrl, mimetype:"text/json", load:djd43.lang.hitch(this, function (type, object, e) {
		return this.processSmd(object);
	}), sync:true});
}});

