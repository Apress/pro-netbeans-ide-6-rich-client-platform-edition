/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.rpc.JotService");
djd43.require("djd43.rpc.RpcService");
djd43.require("djd43.rpc.JsonService");
djd43.require("djd43.json");
djd43.rpc.JotService = function () {
	this.serviceUrl = "/_/jsonrpc";
};
djd43.inherits(djd43.rpc.JotService, djd43.rpc.JsonService);
djd43.lang.extend(djd43.rpc.JotService, {bind:function (method, parameters, deferredRequestHandler, url) {
	djd43.io.bind({url:url || this.serviceUrl, content:{json:this.createRequest(method, parameters)}, method:"POST", mimetype:"text/json", load:this.resultCallback(deferredRequestHandler), error:this.errorCallback(deferredRequestHandler), preventCache:true});
}, createRequest:function (method, params) {
	var req = {"params":params, "method":method, "id":this.lastSubmissionId++};
	return djd43.json.serialize(req);
}});

