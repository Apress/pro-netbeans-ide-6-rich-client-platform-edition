/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.rpc.YahooService");
djd43.require("djd43.rpc.RpcService");
djd43.require("djd43.rpc.JsonService");
djd43.require("djd43.json");
djd43.require("djd43.uri.*");
djd43.require("djd43.io.ScriptSrcIO");
djd43.rpc.YahooService = function (appId) {
	this.appId = appId;
	if (!appId) {
		this.appId = "dojotoolkit";
		djd43.debug("please initialize the YahooService class with your own", "application ID. Using the default may cause problems during", "deployment of your application");
	}
	if (djConfig["useXDomain"] && !djConfig["yahooServiceSmdUrl"]) {
		djd43.debug("djd43.rpc.YahooService: When using cross-domain Dojo builds," + " please save yahoo.smd to your domain and set djConfig.yahooServiceSmdUrl" + " to the path on your domain to yahoo.smd");
	}
	this.connect(djConfig["yahooServiceSmdUrl"] || djd43.uri.moduleUri("djd43.rpc", "yahoo.smd"));
	this.strictArgChecks = false;
};
djd43.inherits(djd43.rpc.YahooService, djd43.rpc.JsonService);
djd43.lang.extend(djd43.rpc.YahooService, {strictArgChecks:false, bind:function (method, parameters, deferredRequestHandler, url) {
	var params = parameters;
	if ((djd43.lang.isArrayLike(parameters)) && (parameters.length == 1)) {
		params = parameters[0];
	}
	params.output = "json";
	params.appid = this.appId;
	djd43.io.bind({url:url || this.serviceUrl, transport:"ScriptSrcTransport", content:params, jsonParamName:"callback", mimetype:"text/json", load:this.resultCallback(deferredRequestHandler), error:this.errorCallback(deferredRequestHandler), preventCache:true});
}});

