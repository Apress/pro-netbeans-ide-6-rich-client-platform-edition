/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.io.common");
djd43.require("djd43.string");
djd43.require("djd43.lang.extras");
djd43.io.transports = [];
djd43.io.hdlrFuncNames = ["load", "error", "timeout"];
djd43.io.Request = function (url, mimetype, transport, changeUrl) {
	if ((arguments.length == 1) && (arguments[0].constructor == Object)) {
		this.fromKwArgs(arguments[0]);
	} else {
		this.url = url;
		if (mimetype) {
			this.mimetype = mimetype;
		}
		if (transport) {
			this.transport = transport;
		}
		if (arguments.length >= 4) {
			this.changeUrl = changeUrl;
		}
	}
};
djd43.lang.extend(djd43.io.Request, {url:"", mimetype:"text/plain", method:"GET", content:undefined, transport:undefined, changeUrl:undefined, formNode:undefined, sync:false, bindSuccess:false, useCache:false, preventCache:false, jsonFilter:function (value) {
	if ((this.mimetype == "text/json-comment-filtered") || (this.mimetype == "application/json-comment-filtered")) {
		var cStartIdx = value.indexOf("/*");
		var cEndIdx = value.lastIndexOf("*/");
		if ((cStartIdx == -1) || (cEndIdx == -1)) {
			djd43.debug("your JSON wasn't comment filtered!");
			return "";
		}
		return value.substring(cStartIdx + 2, cEndIdx);
	}
	djd43.debug("please consider using a mimetype of text/json-comment-filtered to avoid potential security issues with JSON endpoints");
	return value;
}, load:function (type, data, transportImplementation, kwArgs) {
}, error:function (type, error, transportImplementation, kwArgs) {
}, timeout:function (type, empty, transportImplementation, kwArgs) {
}, handle:function (type, data, transportImplementation, kwArgs) {
}, timeoutSeconds:0, abort:function () {
}, fromKwArgs:function (kwArgs) {
	if (kwArgs["url"]) {
		kwArgs.url = kwArgs.url.toString();
	}
	if (kwArgs["formNode"]) {
		kwArgs.formNode = djd43.byId(kwArgs.formNode);
	}
	if (!kwArgs["method"] && kwArgs["formNode"] && kwArgs["formNode"].method) {
		kwArgs.method = kwArgs["formNode"].method;
	}
	if (!kwArgs["handle"] && kwArgs["handler"]) {
		kwArgs.handle = kwArgs.handler;
	}
	if (!kwArgs["load"] && kwArgs["loaded"]) {
		kwArgs.load = kwArgs.loaded;
	}
	if (!kwArgs["changeUrl"] && kwArgs["changeURL"]) {
		kwArgs.changeUrl = kwArgs.changeURL;
	}
	kwArgs.encoding = djd43.lang.firstValued(kwArgs["encoding"], djConfig["bindEncoding"], "");
	kwArgs.sendTransport = djd43.lang.firstValued(kwArgs["sendTransport"], djConfig["ioSendTransport"], false);
	var isFunction = djd43.lang.isFunction;
	for (var x = 0; x < djd43.io.hdlrFuncNames.length; x++) {
		var fn = djd43.io.hdlrFuncNames[x];
		if (kwArgs[fn] && isFunction(kwArgs[fn])) {
			continue;
		}
		if (kwArgs["handle"] && isFunction(kwArgs["handle"])) {
			kwArgs[fn] = kwArgs.handle;
		}
	}
	djd43.lang.mixin(this, kwArgs);
}});
djd43.io.Error = function (msg, type, num) {
	this.message = msg;
	this.type = type || "unknown";
	this.number = num || 0;
};
djd43.io.transports.addTransport = function (name) {
	this.push(name);
	this[name] = djd43.io[name];
};
djd43.io.bind = function (request) {
	if (!(request instanceof djd43.io.Request)) {
		try {
			request = new djd43.io.Request(request);
		}
		catch (e) {
			djd43.debug(e);
		}
	}
	var tsName = "";
	if (request["transport"]) {
		tsName = request["transport"];
		if (!this[tsName]) {
			djd43.io.sendBindError(request, "No djd43.io.bind() transport with name '" + request["transport"] + "'.");
			return request;
		}
		if (!this[tsName].canHandle(request)) {
			djd43.io.sendBindError(request, "djd43.io.bind() transport with name '" + request["transport"] + "' cannot handle this type of request.");
			return request;
		}
	} else {
		for (var x = 0; x < djd43.io.transports.length; x++) {
			var tmp = djd43.io.transports[x];
			if ((this[tmp]) && (this[tmp].canHandle(request))) {
				tsName = tmp;
				break;
			}
		}
		if (tsName == "") {
			djd43.io.sendBindError(request, "None of the loaded transports for djd43.io.bind()" + " can handle the request.");
			return request;
		}
	}
	this[tsName].bind(request);
	request.bindSuccess = true;
	return request;
};
djd43.io.sendBindError = function (request, message) {
	if ((typeof request.error == "function" || typeof request.handle == "function") && (typeof setTimeout == "function" || typeof setTimeout == "object")) {
		var errorObject = new djd43.io.Error(message);
		setTimeout(function () {
			request[(typeof request.error == "function") ? "error" : "handle"]("error", errorObject, null, request);
		}, 50);
	} else {
		djd43.raise(message);
	}
};
djd43.io.queueBind = function (request) {
	if (!(request instanceof djd43.io.Request)) {
		try {
			request = new djd43.io.Request(request);
		}
		catch (e) {
			djd43.debug(e);
		}
	}
	var oldLoad = request.load;
	request.load = function () {
		djd43.io._queueBindInFlight = false;
		var ret = oldLoad.apply(this, arguments);
		djd43.io._dispatchNextQueueBind();
		return ret;
	};
	var oldErr = request.error;
	request.error = function () {
		djd43.io._queueBindInFlight = false;
		var ret = oldErr.apply(this, arguments);
		djd43.io._dispatchNextQueueBind();
		return ret;
	};
	djd43.io._bindQueue.push(request);
	djd43.io._dispatchNextQueueBind();
	return request;
};
djd43.io._dispatchNextQueueBind = function () {
	if (!djd43.io._queueBindInFlight) {
		djd43.io._queueBindInFlight = true;
		if (djd43.io._bindQueue.length > 0) {
			djd43.io.bind(djd43.io._bindQueue.shift());
		} else {
			djd43.io._queueBindInFlight = false;
		}
	}
};
djd43.io._bindQueue = [];
djd43.io._queueBindInFlight = false;
djd43.io.argsFromMap = function (map, encoding, last) {
	var enc = /utf/i.test(encoding || "") ? encodeURIComponent : djd43.string.encodeAscii;
	var mapped = [];
	var control = new Object();
	for (var name in map) {
		var domap = function (elt) {
			var val = enc(name) + "=" + enc(elt);
			mapped[(last == name) ? "push" : "unshift"](val);
		};
		if (!control[name]) {
			var value = map[name];
			if (djd43.lang.isArray(value)) {
				djd43.lang.forEach(value, domap);
			} else {
				domap(value);
			}
		}
	}
	return mapped.join("&");
};
djd43.io.setIFrameSrc = function (iframe, src, replace) {
	try {
		var r = djd43.render.html;
		if (!replace) {
			if (r.safari) {
				iframe.location = src;
			} else {
				frames[iframe.name].location = src;
			}
		} else {
			var idoc;
			if (r.ie) {
				idoc = iframe.contentWindow.document;
			} else {
				if (r.safari) {
					idoc = iframe.document;
				} else {
					idoc = iframe.contentWindow;
				}
			}
			if (!idoc) {
				iframe.location = src;
				return;
			} else {
				idoc.location.replace(src);
			}
		}
	}
	catch (e) {
		djd43.debug(e);
		djd43.debug("setIFrameSrc: " + e);
	}
};

