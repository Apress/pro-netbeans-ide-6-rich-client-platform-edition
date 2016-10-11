/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.require("djd43.io.common");
djd43.provide("djd43.io.cometd");
djd43.require("djd43.AdapterRegistry");
djd43.require("djd43.json");
djd43.require("djd43.io.BrowserIO");
djd43.require("djd43.io.IframeIO");
djd43.require("djd43.io.ScriptSrcIO");
djd43.require("djd43.io.cookie");
djd43.require("djd43.event.*");
djd43.require("djd43.lang.common");
djd43.require("djd43.lang.func");
cometd = new function () {
	this.initialized = false;
	this.connected = false;
	this.connectionTypes = new djd43.AdapterRegistry(true);
	this.version = 0.1;
	this.minimumVersion = 0.1;
	this.clientId = null;
	this._isXD = false;
	this.handshakeReturn = null;
	this.currentTransport = null;
	this.url = null;
	this.lastMessage = null;
	this.globalTopicChannels = {};
	this.backlog = [];
	this.tunnelInit = function (childLocation, childDomain) {
	};
	this.tunnelCollapse = function () {
		djd43.debug("tunnel collapsed!");
	};
	this.init = function (props, root, bargs) {
		props = props || {};
		props.version = this.version;
		props.minimumVersion = this.minimumVersion;
		props.channel = "/meta/handshake";
		this.url = root || djConfig["cometdRoot"];
		if (!this.url) {
			djd43.debug("no cometd root specified in djConfig and no root passed");
			return;
		}
		var bindArgs = {url:this.url, method:"POST", mimetype:"text/json", load:djd43.lang.hitch(this, "finishInit"), content:{"message":djd43.json.serialize([props])}};
		var regexp = "^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$";
		var r = ("" + window.location).match(new RegExp(regexp));
		if (r[4]) {
			var tmp = r[4].split(":");
			var thisHost = tmp[0];
			var thisPort = tmp[1] || "80";
			r = this.url.match(new RegExp(regexp));
			if (r[4]) {
				tmp = r[4].split(":");
				var urlHost = tmp[0];
				var urlPort = tmp[1] || "80";
				if ((urlHost != thisHost) || (urlPort != thisPort)) {
					djd43.debug(thisHost, urlHost);
					djd43.debug(thisPort, urlPort);
					this._isXD = true;
					bindArgs.transport = "ScriptSrcTransport";
					bindArgs.jsonParamName = "jsonp";
					bindArgs.method = "GET";
				}
			}
		}
		if (bargs) {
			djd43.lang.mixin(bindArgs, bargs);
		}
		return djd43.io.bind(bindArgs);
	};
	this.finishInit = function (type, data, evt, request) {
		data = data[0];
		this.handshakeReturn = data;
		if (data["authSuccessful"] == false) {
			djd43.debug("cometd authentication failed");
			return;
		}
		if (data.version < this.minimumVersion) {
			djd43.debug("cometd protocol version mismatch. We wanted", this.minimumVersion, "but got", data.version);
			return;
		}
		this.currentTransport = this.connectionTypes.match(data.supportedConnectionTypes, data.version, this._isXD);
		this.currentTransport.version = data.version;
		this.clientId = data.clientId;
		this.tunnelInit = djd43.lang.hitch(this.currentTransport, "tunnelInit");
		this.tunnelCollapse = djd43.lang.hitch(this.currentTransport, "tunnelCollapse");
		this.initialized = true;
		this.currentTransport.startup(data);
		while (this.backlog.length != 0) {
			var cur = this.backlog.shift();
			var fn = cur.shift();
			this[fn].apply(this, cur);
		}
	};
	this._getRandStr = function () {
		return Math.random().toString().substring(2, 10);
	};
	this.deliver = function (messages) {
		djd43.lang.forEach(messages, this._deliver, this);
	};
	this._deliver = function (message) {
		if (!message["channel"]) {
			djd43.debug("cometd error: no channel for message!");
			return;
		}
		if (!this.currentTransport) {
			this.backlog.push(["deliver", message]);
			return;
		}
		this.lastMessage = message;
		if ((message.channel.length > 5) && (message.channel.substr(0, 5) == "/meta")) {
			switch (message.channel) {
			  case "/meta/subscribe":
				if (!message.successful) {
					djd43.debug("cometd subscription error for channel", message.channel, ":", message.error);
					return;
				}
				this.subscribed(message.subscription, message);
				break;
			  case "/meta/unsubscribe":
				if (!message.successful) {
					djd43.debug("cometd unsubscription error for channel", message.channel, ":", message.error);
					return;
				}
				this.unsubscribed(message.subscription, message);
				break;
			}
		}
		this.currentTransport.deliver(message);
		if (message.data) {
			var tname = (this.globalTopicChannels[message.channel]) ? message.channel : "/cometd" + message.channel;
			djd43.event.topic.publish(tname, message);
		}
	};
	this.disconnect = function () {
		if (!this.currentTransport) {
			djd43.debug("no current transport to disconnect from");
			return;
		}
		this.currentTransport.disconnect();
	};
	this.publish = function (channel, data, properties) {
		if (!this.currentTransport) {
			this.backlog.push(["publish", channel, data, properties]);
			return;
		}
		var message = {data:data, channel:channel};
		if (properties) {
			djd43.lang.mixin(message, properties);
		}
		return this.currentTransport.sendMessage(message);
	};
	this.subscribe = function (channel, useLocalTopics, objOrFunc, funcName) {
		if (!this.currentTransport) {
			this.backlog.push(["subscribe", channel, useLocalTopics, objOrFunc, funcName]);
			return;
		}
		if (objOrFunc) {
			var tname = (useLocalTopics) ? channel : "/cometd" + channel;
			if (useLocalTopics) {
				this.globalTopicChannels[channel] = true;
			}
			djd43.event.topic.subscribe(tname, objOrFunc, funcName);
		}
		return this.currentTransport.sendMessage({channel:"/meta/subscribe", subscription:channel});
	};
	this.subscribed = function (channel, message) {
		djd43.debug(channel);
		djd43.debugShallow(message);
	};
	this.unsubscribe = function (channel, useLocalTopics, objOrFunc, funcName) {
		if (!this.currentTransport) {
			this.backlog.push(["unsubscribe", channel, useLocalTopics, objOrFunc, funcName]);
			return;
		}
		if (objOrFunc) {
			var tname = (useLocalTopics) ? channel : "/cometd" + channel;
			djd43.event.topic.unsubscribe(tname, objOrFunc, funcName);
		}
		return this.currentTransport.sendMessage({channel:"/meta/unsubscribe", subscription:channel});
	};
	this.unsubscribed = function (channel, message) {
		djd43.debug(channel);
		djd43.debugShallow(message);
	};
};
cometd.iframeTransport = new function () {
	this.connected = false;
	this.connectionId = null;
	this.rcvNode = null;
	this.rcvNodeName = "";
	this.phonyForm = null;
	this.authToken = null;
	this.lastTimestamp = null;
	this.lastId = null;
	this.backlog = [];
	this.check = function (types, version, xdomain) {
		return ((!xdomain) && (!djd43.render.html.safari) && (djd43.lang.inArray(types, "iframe")));
	};
	this.tunnelInit = function () {
		this.postToIframe({message:djd43.json.serialize([{channel:"/meta/connect", clientId:cometd.clientId, connectionType:"iframe"}])});
	};
	this.tunnelCollapse = function () {
		if (this.connected) {
			this.connected = false;
			this.postToIframe({message:djd43.json.serialize([{channel:"/meta/reconnect", clientId:cometd.clientId, connectionId:this.connectionId, timestamp:this.lastTimestamp, id:this.lastId}])});
		}
	};
	this.deliver = function (message) {
		if (message["timestamp"]) {
			this.lastTimestamp = message.timestamp;
		}
		if (message["id"]) {
			this.lastId = message.id;
		}
		if ((message.channel.length > 5) && (message.channel.substr(0, 5) == "/meta")) {
			switch (message.channel) {
			  case "/meta/connect":
				if (!message.successful) {
					djd43.debug("cometd connection error:", message.error);
					return;
				}
				this.connectionId = message.connectionId;
				this.connected = true;
				this.processBacklog();
				break;
			  case "/meta/reconnect":
				if (!message.successful) {
					djd43.debug("cometd reconnection error:", message.error);
					return;
				}
				this.connected = true;
				break;
			  case "/meta/subscribe":
				if (!message.successful) {
					djd43.debug("cometd subscription error for channel", message.channel, ":", message.error);
					return;
				}
				djd43.debug(message.channel);
				break;
			}
		}
	};
	this.widenDomain = function (domainStr) {
		var cd = domainStr || document.domain;
		if (cd.indexOf(".") == -1) {
			return;
		}
		var dps = cd.split(".");
		if (dps.length <= 2) {
			return;
		}
		dps = dps.slice(dps.length - 2);
		document.domain = dps.join(".");
		return document.domain;
	};
	this.postToIframe = function (content, url) {
		if (!this.phonyForm) {
			if (djd43.render.html.ie) {
				this.phonyForm = document.createElement("<form enctype='application/x-www-form-urlencoded' method='POST' style='display: none;'>");
				djd43.body().appendChild(this.phonyForm);
			} else {
				this.phonyForm = document.createElement("form");
				this.phonyForm.style.display = "none";
				djd43.body().appendChild(this.phonyForm);
				this.phonyForm.enctype = "application/x-www-form-urlencoded";
				this.phonyForm.method = "POST";
			}
		}
		this.phonyForm.action = url || cometd.url;
		this.phonyForm.target = this.rcvNodeName;
		this.phonyForm.setAttribute("target", this.rcvNodeName);
		while (this.phonyForm.firstChild) {
			this.phonyForm.removeChild(this.phonyForm.firstChild);
		}
		for (var x in content) {
			var tn;
			if (djd43.render.html.ie) {
				tn = document.createElement("<input type='hidden' name='" + x + "' value='" + content[x] + "'>");
				this.phonyForm.appendChild(tn);
			} else {
				tn = document.createElement("input");
				this.phonyForm.appendChild(tn);
				tn.type = "hidden";
				tn.name = x;
				tn.value = content[x];
			}
		}
		this.phonyForm.submit();
	};
	this.processBacklog = function () {
		while (this.backlog.length > 0) {
			this.sendMessage(this.backlog.shift(), true);
		}
	};
	this.sendMessage = function (message, bypassBacklog) {
		if ((bypassBacklog) || (this.connected)) {
			message.connectionId = this.connectionId;
			message.clientId = cometd.clientId;
			var bindArgs = {url:cometd.url || djConfig["cometdRoot"], method:"POST", mimetype:"text/json", content:{message:djd43.json.serialize([message])}};
			return djd43.io.bind(bindArgs);
		} else {
			this.backlog.push(message);
		}
	};
	this.startup = function (handshakeData) {
		djd43.debug("startup!");
		djd43.debug(djd43.json.serialize(handshakeData));
		if (this.connected) {
			return;
		}
		this.rcvNodeName = "cometdRcv_" + cometd._getRandStr();
		var initUrl = cometd.url + "/?tunnelInit=iframe";
		if (false && djd43.render.html.ie) {
			this.rcvNode = new ActiveXObject("htmlfile");
			this.rcvNode.open();
			this.rcvNode.write("<html>");
			this.rcvNode.write("<script>document.domain = '" + document.domain + "'");
			this.rcvNode.write("</html>");
			this.rcvNode.close();
			var ifrDiv = this.rcvNode.createElement("div");
			this.rcvNode.appendChild(ifrDiv);
			this.rcvNode.parentWindow.dojo = dojo;
			ifrDiv.innerHTML = "<iframe src='" + initUrl + "'></iframe>";
		} else {
			this.rcvNode = djd43.io.createIFrame(this.rcvNodeName, "", initUrl);
		}
	};
};
cometd.mimeReplaceTransport = new function () {
	this.connected = false;
	this.connectionId = null;
	this.xhr = null;
	this.authToken = null;
	this.lastTimestamp = null;
	this.lastId = null;
	this.backlog = [];
	this.check = function (types, version, xdomain) {
		return ((!xdomain) && (djd43.render.html.mozilla) && (djd43.lang.inArray(types, "mime-message-block")));
	};
	this.tunnelInit = function () {
		if (this.connected) {
			return;
		}
		this.openTunnelWith({message:djd43.json.serialize([{channel:"/meta/connect", clientId:cometd.clientId, connectionType:"mime-message-block"}])});
		this.connected = true;
	};
	this.tunnelCollapse = function () {
		if (this.connected) {
			this.connected = false;
			this.openTunnelWith({message:djd43.json.serialize([{channel:"/meta/reconnect", clientId:cometd.clientId, connectionId:this.connectionId, timestamp:this.lastTimestamp, id:this.lastId}])});
		}
	};
	this.deliver = cometd.iframeTransport.deliver;
	this.handleOnLoad = function (resp) {
		cometd.deliver(djd43.json.evalJson(this.xhr.responseText));
	};
	this.openTunnelWith = function (content, url) {
		this.xhr = djd43.hostenv.getXmlhttpObject();
		this.xhr.multipart = true;
		if (djd43.render.html.mozilla) {
			this.xhr.addEventListener("load", djd43.lang.hitch(this, "handleOnLoad"), false);
		} else {
			if (djd43.render.html.safari) {
				djd43.debug("Webkit is broken with multipart responses over XHR = (");
				this.xhr.onreadystatechange = djd43.lang.hitch(this, "handleOnLoad");
			} else {
				this.xhr.onload = djd43.lang.hitch(this, "handleOnLoad");
			}
		}
		this.xhr.open("POST", (url || cometd.url), true);
		this.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		djd43.debug(djd43.json.serialize(content));
		this.xhr.send(djd43.io.argsFromMap(content, "utf8"));
	};
	this.processBacklog = function () {
		while (this.backlog.length > 0) {
			this.sendMessage(this.backlog.shift(), true);
		}
	};
	this.sendMessage = function (message, bypassBacklog) {
		if ((bypassBacklog) || (this.connected)) {
			message.connectionId = this.connectionId;
			message.clientId = cometd.clientId;
			var bindArgs = {url:cometd.url || djConfig["cometdRoot"], method:"POST", mimetype:"text/json", content:{message:djd43.json.serialize([message])}};
			return djd43.io.bind(bindArgs);
		} else {
			this.backlog.push(message);
		}
	};
	this.startup = function (handshakeData) {
		djd43.debugShallow(handshakeData);
		if (this.connected) {
			return;
		}
		this.tunnelInit();
	};
};
cometd.longPollTransport = new function () {
	this.connected = false;
	this.connectionId = null;
	this.authToken = null;
	this.lastTimestamp = null;
	this.lastId = null;
	this.backlog = [];
	this.check = function (types, version, xdomain) {
		return ((!xdomain) && (djd43.lang.inArray(types, "long-polling")));
	};
	this.tunnelInit = function () {
		if (this.connected) {
			return;
		}
		this.openTunnelWith({message:djd43.json.serialize([{channel:"/meta/connect", clientId:cometd.clientId, connectionType:"long-polling"}])});
		this.connected = true;
	};
	this.tunnelCollapse = function () {
		if (!this.connected) {
			this.connected = false;
			djd43.debug("clientId:", cometd.clientId);
			this.openTunnelWith({message:djd43.json.serialize([{channel:"/meta/reconnect", connectionType:"long-polling", clientId:cometd.clientId, connectionId:this.connectionId, timestamp:this.lastTimestamp, id:this.lastId}])});
		}
	};
	this.deliver = cometd.iframeTransport.deliver;
	this.openTunnelWith = function (content, url) {
		djd43.io.bind({url:(url || cometd.url), method:"post", content:content, mimetype:"text/json", load:djd43.lang.hitch(this, function (type, data, evt, args) {
			cometd.deliver(data);
			this.connected = false;
			this.tunnelCollapse();
		}), error:function () {
			djd43.debug("tunnel opening failed");
		}});
		this.connected = true;
	};
	this.processBacklog = function () {
		while (this.backlog.length > 0) {
			this.sendMessage(this.backlog.shift(), true);
		}
	};
	this.sendMessage = function (message, bypassBacklog) {
		if ((bypassBacklog) || (this.connected)) {
			message.connectionId = this.connectionId;
			message.clientId = cometd.clientId;
			var bindArgs = {url:cometd.url || djConfig["cometdRoot"], method:"post", mimetype:"text/json", content:{message:djd43.json.serialize([message])}, load:djd43.lang.hitch(this, function (type, data, evt, args) {
				cometd.deliver(data);
			})};
			return djd43.io.bind(bindArgs);
		} else {
			this.backlog.push(message);
		}
	};
	this.startup = function (handshakeData) {
		if (this.connected) {
			return;
		}
		this.tunnelInit();
	};
};
cometd.callbackPollTransport = new function () {
	this.connected = false;
	this.connectionId = null;
	this.authToken = null;
	this.lastTimestamp = null;
	this.lastId = null;
	this.backlog = [];
	this.check = function (types, version, xdomain) {
		return djd43.lang.inArray(types, "callback-polling");
	};
	this.tunnelInit = function () {
		if (this.connected) {
			return;
		}
		this.openTunnelWith({message:djd43.json.serialize([{channel:"/meta/connect", clientId:cometd.clientId, connectionType:"callback-polling"}])});
		this.connected = true;
	};
	this.tunnelCollapse = function () {
		if (!this.connected) {
			this.connected = false;
			this.openTunnelWith({message:djd43.json.serialize([{channel:"/meta/reconnect", connectionType:"long-polling", clientId:cometd.clientId, connectionId:this.connectionId, timestamp:this.lastTimestamp, id:this.lastId}])});
		}
	};
	this.deliver = cometd.iframeTransport.deliver;
	this.openTunnelWith = function (content, url) {
		var req = djd43.io.bind({url:(url || cometd.url), content:content, mimetype:"text/json", transport:"ScriptSrcTransport", jsonParamName:"jsonp", load:djd43.lang.hitch(this, function (type, data, evt, args) {
			cometd.deliver(data);
			this.connected = false;
			this.tunnelCollapse();
		}), error:function () {
			djd43.debug("tunnel opening failed");
		}});
		this.connected = true;
	};
	this.processBacklog = function () {
		while (this.backlog.length > 0) {
			this.sendMessage(this.backlog.shift(), true);
		}
	};
	this.sendMessage = function (message, bypassBacklog) {
		if ((bypassBacklog) || (this.connected)) {
			message.connectionId = this.connectionId;
			message.clientId = cometd.clientId;
			var bindArgs = {url:cometd.url || djConfig["cometdRoot"], mimetype:"text/json", transport:"ScriptSrcTransport", jsonParamName:"jsonp", content:{message:djd43.json.serialize([message])}, load:djd43.lang.hitch(this, function (type, data, evt, args) {
				cometd.deliver(data);
			})};
			return djd43.io.bind(bindArgs);
		} else {
			this.backlog.push(message);
		}
	};
	this.startup = function (handshakeData) {
		if (this.connected) {
			return;
		}
		this.tunnelInit();
	};
};
cometd.connectionTypes.register("mime-message-block", cometd.mimeReplaceTransport.check, cometd.mimeReplaceTransport);
cometd.connectionTypes.register("long-polling", cometd.longPollTransport.check, cometd.longPollTransport);
cometd.connectionTypes.register("callback-polling", cometd.callbackPollTransport.check, cometd.callbackPollTransport);
cometd.connectionTypes.register("iframe", cometd.iframeTransport.check, cometd.iframeTransport);
djd43.io.cometd = cometd;

