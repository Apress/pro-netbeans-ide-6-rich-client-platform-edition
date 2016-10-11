/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.logging.ConsoleLogger");
djd43.require("djd43.logging.Logger");
djd43.lang.extend(djd43.logging.MemoryLogHandler, {debug:function () {
	djd43.hostenv.println.apply(this, arguments);
}, info:function () {
	djd43.hostenv.println.apply(this, arguments);
}, warn:function () {
	djd43.hostenv.println.apply(this, arguments);
}, error:function () {
	djd43.hostenv.println.apply(this, arguments);
}, critical:function () {
	djd43.hostenv.println.apply(this, arguments);
}, emit:function (record) {
	if (!djConfig.isDebug) {
		return;
	}
	var funcName = null;
	switch (record.level) {
	  case 1:
		funcName = "debug";
		break;
	  case 2:
		funcName = "info";
		break;
	  case 3:
		funcName = "warn";
		break;
	  case 4:
		funcName = "error";
		break;
	  case 5:
		funcName = "critical";
		break;
	  default:
		funcName = "debug";
	}
	var logStr = String(djd43.log.getLevelName(record.level) + ": " + record.time.toLocaleTimeString()) + ": " + record.message;
	if (record.msgArgs && record.msgArgs.length > 0) {
		this[funcName].call(this, logStr, record.msgArgs);
	} else {
		this[funcName].call(this, logStr);
	}
	this.data.push(record);
	if (this.numRecords != -1) {
		while (this.data.length > this.numRecords) {
			this.data.shift();
		}
	}
}});
if (!dj_undef("console") && !dj_undef("info", console)) {
	djd43.lang.extend(djd43.logging.MemoryLogHandler, {debug:function () {
		console.debug.apply(this, arguments);
	}, info:function () {
		console.info.apply(this, arguments);
	}, warn:function () {
		console.warn.apply(this, arguments);
	}, error:function () {
		console.error.apply(this, arguments);
	}, critical:function () {
		console.error.apply(this, arguments);
	}});
	djd43.lang.extend(djd43.logging.Logger, {exception:function (msg, e, squelch) {
		var args = [msg];
		if (e) {
			msg += " : " + e.name + " " + (e.description || e.message);
			args.push(e);
		}
		this.logType("ERROR", args);
		if (!squelch) {
			throw e;
		}
	}});
}

