/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.logging.Logger");
djd43.provide("djd43.logging.LogFilter");
djd43.provide("djd43.logging.Record");
djd43.provide("djd43.log");
djd43.require("djd43.lang.common");
djd43.require("djd43.lang.declare");
djd43.logging.Record = function (logLevel, message) {
	this.level = logLevel;
	this.message = "";
	this.msgArgs = [];
	this.time = new Date();
	if (djd43.lang.isArray(message)) {
		if (message.length > 0 && djd43.lang.isString(message[0])) {
			this.message = message.shift();
		}
		this.msgArgs = message;
	} else {
		this.message = message;
	}
};
djd43.logging.LogFilter = function (loggerChain) {
	this.passChain = loggerChain || "";
	this.filter = function (record) {
		return true;
	};
};
djd43.logging.Logger = function () {
	this.cutOffLevel = 0;
	this.propagate = true;
	this.parent = null;
	this.data = [];
	this.filters = [];
	this.handlers = [];
};
djd43.extend(djd43.logging.Logger, {_argsToArr:function (args) {
	var ret = [];
	for (var x = 0; x < args.length; x++) {
		ret.push(args[x]);
	}
	return ret;
}, setLevel:function (lvl) {
	this.cutOffLevel = parseInt(lvl);
}, isEnabledFor:function (lvl) {
	return parseInt(lvl) >= this.cutOffLevel;
}, getEffectiveLevel:function () {
	if ((this.cutOffLevel == 0) && (this.parent)) {
		return this.parent.getEffectiveLevel();
	}
	return this.cutOffLevel;
}, addFilter:function (flt) {
	this.filters.push(flt);
	return this.filters.length - 1;
}, removeFilterByIndex:function (fltIndex) {
	if (this.filters[fltIndex]) {
		delete this.filters[fltIndex];
		return true;
	}
	return false;
}, removeFilter:function (fltRef) {
	for (var x = 0; x < this.filters.length; x++) {
		if (this.filters[x] === fltRef) {
			delete this.filters[x];
			return true;
		}
	}
	return false;
}, removeAllFilters:function () {
	this.filters = [];
}, filter:function (rec) {
	for (var x = 0; x < this.filters.length; x++) {
		if ((this.filters[x]["filter"]) && (!this.filters[x].filter(rec)) || (rec.level < this.cutOffLevel)) {
			return false;
		}
	}
	return true;
}, addHandler:function (hdlr) {
	this.handlers.push(hdlr);
	return this.handlers.length - 1;
}, handle:function (rec) {
	if ((!this.filter(rec)) || (rec.level < this.cutOffLevel)) {
		return false;
	}
	for (var x = 0; x < this.handlers.length; x++) {
		if (this.handlers[x]["handle"]) {
			this.handlers[x].handle(rec);
		}
	}
	return true;
}, log:function (lvl, msg) {
	if ((this.propagate) && (this.parent) && (this.parent.rec.level >= this.cutOffLevel)) {
		this.parent.log(lvl, msg);
		return false;
	}
	this.handle(new djd43.logging.Record(lvl, msg));
	return true;
}, debug:function (msg) {
	return this.logType("DEBUG", this._argsToArr(arguments));
}, info:function (msg) {
	return this.logType("INFO", this._argsToArr(arguments));
}, warning:function (msg) {
	return this.logType("WARNING", this._argsToArr(arguments));
}, error:function (msg) {
	return this.logType("ERROR", this._argsToArr(arguments));
}, critical:function (msg) {
	return this.logType("CRITICAL", this._argsToArr(arguments));
}, exception:function (msg, e, squelch) {
	if (e) {
		var eparts = [e.name, (e.description || e.message)];
		if (e.fileName) {
			eparts.push(e.fileName);
			eparts.push("line " + e.lineNumber);
		}
		msg += " " + eparts.join(" : ");
	}
	this.logType("ERROR", msg);
	if (!squelch) {
		throw e;
	}
}, logType:function (type, args) {
	return this.log.apply(this, [djd43.logging.log.getLevel(type), args]);
}, warn:function () {
	this.warning.apply(this, arguments);
}, err:function () {
	this.error.apply(this, arguments);
}, crit:function () {
	this.critical.apply(this, arguments);
}});
djd43.logging.LogHandler = function (level) {
	this.cutOffLevel = (level) ? level : 0;
	this.formatter = null;
	this.data = [];
	this.filters = [];
};
djd43.lang.extend(djd43.logging.LogHandler, {setFormatter:function (formatter) {
	djd43.unimplemented("setFormatter");
}, flush:function () {
}, close:function () {
}, handleError:function () {
	djd43.deprecated("djd43.logging.LogHandler.handleError", "use handle()", "0.6");
}, handle:function (record) {
	if ((this.filter(record)) && (record.level >= this.cutOffLevel)) {
		this.emit(record);
	}
}, emit:function (record) {
	djd43.unimplemented("emit");
}});
void (function () {
	var names = ["setLevel", "addFilter", "removeFilterByIndex", "removeFilter", "removeAllFilters", "filter"];
	var tgt = djd43.logging.LogHandler.prototype;
	var src = djd43.logging.Logger.prototype;
	for (var x = 0; x < names.length; x++) {
		tgt[names[x]] = src[names[x]];
	}
})();
djd43.logging.log = new djd43.logging.Logger();
djd43.logging.log.levels = [{"name":"DEBUG", "level":1}, {"name":"INFO", "level":2}, {"name":"WARNING", "level":3}, {"name":"ERROR", "level":4}, {"name":"CRITICAL", "level":5}];
djd43.logging.log.loggers = {};
djd43.logging.log.getLogger = function (name) {
	if (!this.loggers[name]) {
		this.loggers[name] = new djd43.logging.Logger();
		this.loggers[name].parent = this;
	}
	return this.loggers[name];
};
djd43.logging.log.getLevelName = function (lvl) {
	for (var x = 0; x < this.levels.length; x++) {
		if (this.levels[x].level == lvl) {
			return this.levels[x].name;
		}
	}
	return null;
};
djd43.logging.log.getLevel = function (name) {
	for (var x = 0; x < this.levels.length; x++) {
		if (this.levels[x].name.toUpperCase() == name.toUpperCase()) {
			return this.levels[x].level;
		}
	}
	return null;
};
djd43.declare("djd43.logging.MemoryLogHandler", djd43.logging.LogHandler, {initializer:function (level, recordsToKeep, postType, postInterval) {
	djd43.logging.LogHandler.call(this, level);
	this.numRecords = (typeof djConfig["loggingNumRecords"] != "undefined") ? djConfig["loggingNumRecords"] : ((recordsToKeep) ? recordsToKeep : -1);
	this.postType = (typeof djConfig["loggingPostType"] != "undefined") ? djConfig["loggingPostType"] : (postType || -1);
	this.postInterval = (typeof djConfig["loggingPostInterval"] != "undefined") ? djConfig["loggingPostInterval"] : (postType || -1);
}, emit:function (record) {
	if (!djConfig.isDebug) {
		return;
	}
	var logStr = String(djd43.log.getLevelName(record.level) + ": " + record.time.toLocaleTimeString()) + ": " + record.message;
	if (!dj_undef("println", djd43.hostenv)) {
		djd43.hostenv.println(logStr, record.msgArgs);
	}
	this.data.push(record);
	if (this.numRecords != -1) {
		while (this.data.length > this.numRecords) {
			this.data.shift();
		}
	}
}});
djd43.logging.logQueueHandler = new djd43.logging.MemoryLogHandler(0, 50, 0, 10000);
djd43.logging.log.addHandler(djd43.logging.logQueueHandler);
djd43.log = djd43.logging.log;

