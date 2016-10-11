/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.rpc.JsonService");
djd43.require("djd43.rpc.RpcService");
djd43.require("djd43.io.*");
djd43.require("djd43.json");
djd43.require("djd43.lang.common");
djd43.rpc.JsonService = function (args) {
	if (args) {
		if (djd43.lang.isString(args)) {
			this.connect(args);
		} else {
			if (args["smdUrl"]) {
				this.connect(args.smdUrl);
			}
			if (args["smdStr"]) {
				this.processSmd(dj_eval("(" + args.smdStr + ")"));
			}
			if (args["smdObj"]) {
				this.processSmd(args.smdObj);
			}
			if (args["serviceUrl"]) {
				this.serviceUrl = args.serviceUrl;
			}
			if (typeof args["strictArgChecks"] != "undefined") {
				this.strictArgChecks = args.strictArgChecks;
			}
		}
	}
};
djd43.inherits(djd43.rpc.JsonService, djd43.rpc.RpcService);
djd43.extend(djd43.rpc.JsonService, {bustCache:false, contentType:"application/json-rpc", lastSubmissionId:0, callRemote:function (method, params) {
	var deferred = new djd43.Deferred();
	this.bind(method, params, deferred);
	return deferred;
}, bind:function (method, parameters, deferredRequestHandler, url) {
	djd43.io.bind({url:url || this.serviceUrl, postContent:this.createRequest(method, parameters), method:"POST", contentType:this.contentType, mimetype:"text/json", load:this.resultCallback(deferredRequestHandler), error:this.errorCallback(deferredRequestHandler), preventCache:this.bustCache});
}, createRequest:function (method, params) {
	var req = {"params":params, "method":method, "id":++this.lastSubmissionId};
	var data = djd43.json.serialize(req);
	djd43.debug("JsonService: JSON-RPC Request: " + data);
	return data;
}, parseResults:function (obj) {
	if (!obj) {
		return;
	}
	if (obj["Result"] != null) {
		return obj["Result"];
	} else {
		if (obj["result"] != null) {
			return obj["result"];
		} else {
			if (obj["ResultSet"]) {
				return obj["ResultSet"];
			} else {
				return obj;
			}
		}
	}
}});

