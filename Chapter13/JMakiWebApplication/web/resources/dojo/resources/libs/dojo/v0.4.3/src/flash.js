/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.flash");
djd43.require("djd43.string.*");
djd43.require("djd43.uri.*");
djd43.require("djd43.html.common");
djd43.flash = function () {
};
djd43.flash = {flash6_version:null, flash8_version:null, ready:false, _visible:true, _loadedListeners:new Array(), _installingListeners:new Array(), setSwf:function (fileInfo) {
	if (fileInfo == null || djd43.lang.isUndefined(fileInfo)) {
		return;
	}
	if (fileInfo.flash6 != null && !djd43.lang.isUndefined(fileInfo.flash6)) {
		this.flash6_version = fileInfo.flash6;
	}
	if (fileInfo.flash8 != null && !djd43.lang.isUndefined(fileInfo.flash8)) {
		this.flash8_version = fileInfo.flash8;
	}
	if (!djd43.lang.isUndefined(fileInfo.visible)) {
		this._visible = fileInfo.visible;
	}
	this._initialize();
}, useFlash6:function () {
	if (this.flash6_version == null) {
		return false;
	} else {
		if (this.flash6_version != null && djd43.flash.info.commVersion == 6) {
			return true;
		} else {
			return false;
		}
	}
}, useFlash8:function () {
	if (this.flash8_version == null) {
		return false;
	} else {
		if (this.flash8_version != null && djd43.flash.info.commVersion == 8) {
			return true;
		} else {
			return false;
		}
	}
}, addLoadedListener:function (listener) {
	this._loadedListeners.push(listener);
}, addInstallingListener:function (listener) {
	this._installingListeners.push(listener);
}, loaded:function () {
	djd43.flash.ready = true;
	if (djd43.flash._loadedListeners.length > 0) {
		for (var i = 0; i < djd43.flash._loadedListeners.length; i++) {
			djd43.flash._loadedListeners[i].call(null);
		}
	}
}, installing:function () {
	if (djd43.flash._installingListeners.length > 0) {
		for (var i = 0; i < djd43.flash._installingListeners.length; i++) {
			djd43.flash._installingListeners[i].call(null);
		}
	}
}, _initialize:function () {
	var installer = new djd43.flash.Install();
	djd43.flash.installer = installer;
	if (installer.needed() == true) {
		installer.install();
	} else {
		djd43.flash.obj = new djd43.flash.Embed(this._visible);
		djd43.flash.obj.write(djd43.flash.info.commVersion);
		djd43.flash.comm = new djd43.flash.Communicator();
	}
}};
djd43.flash.Info = function () {
	if (djd43.render.html.ie) {
		document.writeln("<script language=\"VBScript\" type=\"text/vbscript\">");
		document.writeln("Function VBGetSwfVer(i)");
		document.writeln("  on error resume next");
		document.writeln("  Dim swControl, swVersion");
		document.writeln("  swVersion = 0");
		document.writeln("  set swControl = CreateObject(\"ShockwaveFlash.ShockwaveFlash.\" + CStr(i))");
		document.writeln("  if (IsObject(swControl)) then");
		document.writeln("	swVersion = swControl.GetVariable(\"$version\")");
		document.writeln("  end if");
		document.writeln("  VBGetSwfVer = swVersion");
		document.writeln("End Function");
		document.writeln("</script>");
	}
	this._detectVersion();
	this._detectCommunicationVersion();
};
djd43.flash.Info.prototype = {version:-1, versionMajor:-1, versionMinor:-1, versionRevision:-1, capable:false, commVersion:6, installing:false, isVersionOrAbove:function (reqMajorVer, reqMinorVer, reqVer) {
	reqVer = parseFloat("." + reqVer);
	if (this.versionMajor >= reqMajorVer && this.versionMinor >= reqMinorVer && this.versionRevision >= reqVer) {
		return true;
	} else {
		return false;
	}
}, _detectVersion:function () {
	var versionStr;
	for (var testVersion = 25; testVersion > 0; testVersion--) {
		if (djd43.render.html.ie) {
			versionStr = VBGetSwfVer(testVersion);
		} else {
			versionStr = this._JSFlashInfo(testVersion);
		}
		if (versionStr == -1) {
			this.capable = false;
			return;
		} else {
			if (versionStr != 0) {
				var versionArray;
				if (djd43.render.html.ie) {
					var tempArray = versionStr.split(" ");
					var tempString = tempArray[1];
					versionArray = tempString.split(",");
				} else {
					versionArray = versionStr.split(".");
				}
				this.versionMajor = versionArray[0];
				this.versionMinor = versionArray[1];
				this.versionRevision = versionArray[2];
				var versionString = this.versionMajor + "." + this.versionRevision;
				this.version = parseFloat(versionString);
				this.capable = true;
				break;
			}
		}
	}
}, _JSFlashInfo:function (testVersion) {
	if (navigator.plugins != null && navigator.plugins.length > 0) {
		if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
			var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
			var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
			var descArray = flashDescription.split(" ");
			var tempArrayMajor = descArray[2].split(".");
			var versionMajor = tempArrayMajor[0];
			var versionMinor = tempArrayMajor[1];
			if (descArray[3] != "") {
				var tempArrayMinor = descArray[3].split("r");
			} else {
				var tempArrayMinor = descArray[4].split("r");
			}
			var versionRevision = tempArrayMinor[1] > 0 ? tempArrayMinor[1] : 0;
			var version = versionMajor + "." + versionMinor + "." + versionRevision;
			return version;
		}
	}
	return -1;
}, _detectCommunicationVersion:function () {
	if (this.capable == false) {
		this.commVersion = null;
		return;
	}
	if (typeof djConfig["forceFlashComm"] != "undefined" && typeof djConfig["forceFlashComm"] != null) {
		this.commVersion = djConfig["forceFlashComm"];
		return;
	}
	if (djd43.render.html.safari == true || djd43.render.html.opera == true) {
		this.commVersion = 8;
	} else {
		this.commVersion = 6;
	}
}};
djd43.flash.Embed = function (visible) {
	this._visible = visible;
};
djd43.flash.Embed.prototype = {width:215, height:138, id:"flashObject", _visible:true, protocol:function () {
	switch (window.location.protocol) {
	  case "https:":
		return "https";
		break;
	  default:
		return "http";
		break;
	}
}, write:function (flashVer, doExpressInstall) {
	if (djd43.lang.isUndefined(doExpressInstall)) {
		doExpressInstall = false;
	}
	var containerStyle = new djd43.string.Builder();
	containerStyle.append("width: " + this.width + "px; ");
	containerStyle.append("height: " + this.height + "px; ");
	if (this._visible == false) {
		containerStyle.append("position: absolute; ");
		containerStyle.append("z-index: 10000; ");
		containerStyle.append("top: -1000px; ");
		containerStyle.append("left: -1000px; ");
	}
	containerStyle = containerStyle.toString();
	var objectHTML;
	var swfloc;
	if (flashVer == 6) {
		swfloc = djd43.flash.flash6_version;
		var dojoPath = djConfig.baseRelativePath;
		swfloc = swfloc + "?baseRelativePath=" + escape(dojoPath);
		objectHTML = "<embed id=\"" + this.id + "\" src=\"" + swfloc + "\" " + "	quality=\"high\" bgcolor=\"#ffffff\" " + "	width=\"" + this.width + "\" height=\"" + this.height + "\" " + "	name=\"" + this.id + "\" " + "	align=\"middle\" allowScriptAccess=\"sameDomain\" " + "	type=\"application/x-shockwave-flash\" swLiveConnect=\"true\" " + "	pluginspage=\"" + this.protocol() + "://www.macromedia.com/go/getflashplayer\">";
	} else {
		swfloc = djd43.flash.flash8_version;
		var swflocObject = swfloc;
		var swflocEmbed = swfloc;
		var dojoPath = djConfig.baseRelativePath;
		if (doExpressInstall) {
			var redirectURL = escape(window.location);
			document.title = document.title.slice(0, 47) + " - Flash Player Installation";
			var docTitle = escape(document.title);
			swflocObject += "?MMredirectURL=" + redirectURL + "&MMplayerType=ActiveX" + "&MMdoctitle=" + docTitle + "&baseRelativePath=" + escape(dojoPath);
			swflocEmbed += "?MMredirectURL=" + redirectURL + "&MMplayerType=PlugIn" + "&baseRelativePath=" + escape(dojoPath);
		}
		if (swflocEmbed.indexOf("?") == -1) {
			swflocEmbed += "?baseRelativePath=" + escape(dojoPath) + "' ";
		}
		objectHTML = "<object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" " + "codebase=\"" + this.protocol() + "://fpdownload.macromedia.com/pub/shockwave/cabs/flash/" + "swflash.cab#version=8,0,0,0\" " + "width=\"" + this.width + "\" " + "height=\"" + this.height + "\" " + "id=\"" + this.id + "\" " + "align=\"middle\"> " + "<param name=\"allowScriptAccess\" value=\"sameDomain\" /> " + "<param name=\"movie\" value=\"" + swflocObject + "\" /> " + "<param name=\"quality\" value=\"high\" /> " + "<param name=\"bgcolor\" value=\"#ffffff\" /> " + "<embed src=\"" + swflocEmbed + "' " + "quality=\"high\" " + "bgcolor=\"#ffffff\" " + "width=\"" + this.width + "\" " + "height=\"" + this.height + "\" " + "id=\"" + this.id + "\" " + "name=\"" + this.id + "\" " + "swLiveConnect=\"true\" " + "align=\"middle\" " + "allowScriptAccess=\"sameDomain\" " + "type=\"application/x-shockwave-flash\" " + "pluginspage=\"" + this.protocol() + "://www.macromedia.com/go/getflashplayer\" />" + "</object>";
	}
	objectHTML = "<div id=\"" + this.id + "Container\" style=\"" + containerStyle + "\"> " + objectHTML + "</div>";
	document.writeln(objectHTML);
}, get:function () {
	return document.getElementById(this.id);
}, setVisible:function (visible) {
	var container = djd43.byId(this.id + "Container");
	if (visible == true) {
		container.style.visibility = "visible";
	} else {
		container.style.position = "absolute";
		container.style.x = "-1000px";
		container.style.y = "-1000px";
		container.style.visibility = "hidden";
	}
}, center:function () {
	var elementWidth = this.width;
	var elementHeight = this.height;
	var scroll_offset = djd43.html.getScroll().offset;
	var viewport_size = djd43.html.getViewport();
	var x = scroll_offset.x + (viewport_size.width - elementWidth) / 2;
	var y = scroll_offset.y + (viewport_size.height - elementHeight) / 2;
	var container = djd43.byId(this.id + "Container");
	container.style.top = y + "px";
	container.style.left = x + "px";
}};
djd43.flash.Communicator = function () {
	if (djd43.flash.useFlash6()) {
		this._writeFlash6();
	} else {
		if (djd43.flash.useFlash8()) {
			this._writeFlash8();
		}
	}
};
djd43.flash.Communicator.prototype = {_writeFlash6:function () {
	var id = djd43.flash.obj.id;
	document.writeln("<script language=\"JavaScript\">");
	document.writeln("  function " + id + "_DoFSCommand(command, args){ ");
	document.writeln("	djd43.flash.comm._handleFSCommand(command, args); ");
	document.writeln("}");
	document.writeln("</script>");
	if (djd43.render.html.ie) {
		document.writeln("<SCRIPT LANGUAGE=VBScript> ");
		document.writeln("on error resume next ");
		document.writeln("Sub " + id + "_FSCommand(ByVal command, ByVal args)");
		document.writeln(" call " + id + "_DoFSCommand(command, args)");
		document.writeln("end sub");
		document.writeln("</SCRIPT> ");
	}
}, _writeFlash8:function () {
}, _handleFSCommand:function (command, args) {
	if (command != null && !djd43.lang.isUndefined(command) && /^FSCommand:(.*)/.test(command) == true) {
		command = command.match(/^FSCommand:(.*)/)[1];
	}
	if (command == "addCallback") {
		this._fscommandAddCallback(command, args);
	} else {
		if (command == "call") {
			this._fscommandCall(command, args);
		} else {
			if (command == "fscommandReady") {
				this._fscommandReady();
			}
		}
	}
}, _fscommandAddCallback:function (command, args) {
	var functionName = args;
	var callFunc = function () {
		return djd43.flash.comm._call(functionName, arguments);
	};
	djd43.flash.comm[functionName] = callFunc;
	djd43.flash.obj.get().SetVariable("_succeeded", true);
}, _fscommandCall:function (command, args) {
	var plugin = djd43.flash.obj.get();
	var functionName = args;
	var numArgs = parseInt(plugin.GetVariable("_numArgs"));
	var flashArgs = new Array();
	for (var i = 0; i < numArgs; i++) {
		var currentArg = plugin.GetVariable("_" + i);
		flashArgs.push(currentArg);
	}
	var runMe;
	if (functionName.indexOf(".") == -1) {
		runMe = window[functionName];
	} else {
		runMe = eval(functionName);
	}
	var results = null;
	if (!djd43.lang.isUndefined(runMe) && runMe != null) {
		results = runMe.apply(null, flashArgs);
	}
	plugin.SetVariable("_returnResult", results);
}, _fscommandReady:function () {
	var plugin = djd43.flash.obj.get();
	plugin.SetVariable("fscommandReady", "true");
}, _call:function (functionName, args) {
	var plugin = djd43.flash.obj.get();
	plugin.SetVariable("_functionName", functionName);
	plugin.SetVariable("_numArgs", args.length);
	for (var i = 0; i < args.length; i++) {
		var value = args[i];
		value = value.replace(/\0/g, "\\0");
		plugin.SetVariable("_" + i, value);
	}
	plugin.TCallLabel("/_flashRunner", "execute");
	var results = plugin.GetVariable("_returnResult");
	results = results.replace(/\\0/g, "\x00");
	return results;
}, _addExternalInterfaceCallback:function (methodName) {
	var wrapperCall = function () {
		var methodArgs = new Array(arguments.length);
		for (var i = 0; i < arguments.length; i++) {
			methodArgs[i] = arguments[i];
		}
		return djd43.flash.comm._execFlash(methodName, methodArgs);
	};
	djd43.flash.comm[methodName] = wrapperCall;
}, _encodeData:function (data) {
	var entityRE = /\&([^;]*)\;/g;
	data = data.replace(entityRE, "&amp;$1;");
	data = data.replace(/</g, "&lt;");
	data = data.replace(/>/g, "&gt;");
	data = data.replace("\\", "&custom_backslash;&custom_backslash;");
	data = data.replace(/\n/g, "\\n");
	data = data.replace(/\r/g, "\\r");
	data = data.replace(/\f/g, "\\f");
	data = data.replace(/\0/g, "\\0");
	data = data.replace(/\'/g, "\\'");
	data = data.replace(/\"/g, "\\\"");
	return data;
}, _decodeData:function (data) {
	if (data == null || typeof data == "undefined") {
		return data;
	}
	data = data.replace(/\&custom_lt\;/g, "<");
	data = data.replace(/\&custom_gt\;/g, ">");
	data = eval("\"" + data + "\"");
	return data;
}, _chunkArgumentData:function (value, argIndex) {
	var plugin = djd43.flash.obj.get();
	var numSegments = Math.ceil(value.length / 1024);
	for (var i = 0; i < numSegments; i++) {
		var startCut = i * 1024;
		var endCut = i * 1024 + 1024;
		if (i == (numSegments - 1)) {
			endCut = i * 1024 + value.length;
		}
		var piece = value.substring(startCut, endCut);
		piece = this._encodeData(piece);
		plugin.CallFunction("<invoke name=\"chunkArgumentData\" " + "returntype=\"javascript\">" + "<arguments>" + "<string>" + piece + "</string>" + "<number>" + argIndex + "</number>" + "</arguments>" + "</invoke>");
	}
}, _chunkReturnData:function () {
	var plugin = djd43.flash.obj.get();
	var numSegments = plugin.getReturnLength();
	var resultsArray = new Array();
	for (var i = 0; i < numSegments; i++) {
		var piece = plugin.CallFunction("<invoke name=\"chunkReturnData\" " + "returntype=\"javascript\">" + "<arguments>" + "<number>" + i + "</number>" + "</arguments>" + "</invoke>");
		if (piece == "\"\"" || piece == "''") {
			piece = "";
		} else {
			piece = piece.substring(1, piece.length - 1);
		}
		resultsArray.push(piece);
	}
	var results = resultsArray.join("");
	return results;
}, _execFlash:function (methodName, methodArgs) {
	var plugin = djd43.flash.obj.get();
	plugin.startExec();
	plugin.setNumberArguments(methodArgs.length);
	for (var i = 0; i < methodArgs.length; i++) {
		this._chunkArgumentData(methodArgs[i], i);
	}
	plugin.exec(methodName);
	var results = this._chunkReturnData();
	results = this._decodeData(results);
	plugin.endExec();
	return results;
}};
djd43.flash.Install = function () {
};
djd43.flash.Install.prototype = {needed:function () {
	if (djd43.flash.info.capable == false) {
		return true;
	}
	if (djd43.render.os.mac == true && !djd43.flash.info.isVersionOrAbove(8, 0, 0)) {
		return true;
	}
	if (!djd43.flash.info.isVersionOrAbove(6, 0, 0)) {
		return true;
	}
	return false;
}, install:function () {
	djd43.flash.info.installing = true;
	djd43.flash.installing();
	if (djd43.flash.info.capable == false) {
		var installObj = new djd43.flash.Embed(false);
		installObj.write(8);
	} else {
		if (djd43.flash.info.isVersionOrAbove(6, 0, 65)) {
			var installObj = new djd43.flash.Embed(false);
			installObj.write(8, true);
			installObj.setVisible(true);
			installObj.center();
		} else {
			alert("This content requires a more recent version of the Macromedia " + " Flash Player.");
			window.location.href = +djd43.flash.Embed.protocol() + "://www.macromedia.com/go/getflashplayer";
		}
	}
}, _onInstallStatus:function (msg) {
	if (msg == "Download.Complete") {
		djd43.flash._initialize();
	} else {
		if (msg == "Download.Cancelled") {
			alert("This content requires a more recent version of the Macromedia " + " Flash Player.");
			window.location.href = djd43.flash.Embed.protocol() + "://www.macromedia.com/go/getflashplayer";
		} else {
			if (msg == "Download.Failed") {
				alert("There was an error downloading the Flash Player update. " + "Please try again later, or visit macromedia.com to download " + "the latest version of the Flash plugin.");
			}
		}
	}
}};
djd43.flash.info = new djd43.flash.Info();

