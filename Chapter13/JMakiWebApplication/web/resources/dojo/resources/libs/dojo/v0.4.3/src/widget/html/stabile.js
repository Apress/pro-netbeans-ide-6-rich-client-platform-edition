/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.html.stabile");
djd43.widget.html.stabile = {_sqQuotables:new RegExp("([\\\\'])", "g"), _depth:0, _recur:false, depthLimit:2};
djd43.widget.html.stabile.getState = function (id) {
	djd43.widget.html.stabile.setup();
	return djd43.widget.html.stabile.widgetState[id];
};
djd43.widget.html.stabile.setState = function (id, state, isCommit) {
	djd43.widget.html.stabile.setup();
	djd43.widget.html.stabile.widgetState[id] = state;
	if (isCommit) {
		djd43.widget.html.stabile.commit(djd43.widget.html.stabile.widgetState);
	}
};
djd43.widget.html.stabile.setup = function () {
	if (!djd43.widget.html.stabile.widgetState) {
		var text = djd43.widget.html.stabile._getStorage().value;
		djd43.widget.html.stabile.widgetState = text ? dj_eval("(" + text + ")") : {};
	}
};
djd43.widget.html.stabile.commit = function (state) {
	djd43.widget.html.stabile._getStorage().value = djd43.widget.html.stabile.description(state);
};
djd43.widget.html.stabile.description = function (v, showAll) {
	var depth = djd43.widget.html.stabile._depth;
	var describeThis = function () {
		return this.description(this, true);
	};
	try {
		if (v === void (0)) {
			return "undefined";
		}
		if (v === null) {
			return "null";
		}
		if (typeof (v) == "boolean" || typeof (v) == "number" || v instanceof Boolean || v instanceof Number) {
			return v.toString();
		}
		if (typeof (v) == "string" || v instanceof String) {
			var v1 = v.replace(djd43.widget.html.stabile._sqQuotables, "\\$1");
			v1 = v1.replace(/\n/g, "\\n");
			v1 = v1.replace(/\r/g, "\\r");
			return "'" + v1 + "'";
		}
		if (v instanceof Date) {
			return "new Date(" + d.getFullYear + "," + d.getMonth() + "," + d.getDate() + ")";
		}
		var d;
		if (v instanceof Array || v.push) {
			if (depth >= djd43.widget.html.stabile.depthLimit) {
				return "[ ... ]";
			}
			d = "[";
			var first = true;
			djd43.widget.html.stabile._depth++;
			for (var i = 0; i < v.length; i++) {
				if (first) {
					first = false;
				} else {
					d += ",";
				}
				d += arguments.callee(v[i], showAll);
			}
			return d + "]";
		}
		if (v.constructor == Object || v.toString == describeThis) {
			if (depth >= djd43.widget.html.stabile.depthLimit) {
				return "{ ... }";
			}
			if (typeof (v.hasOwnProperty) != "function" && v.prototype) {
				throw new Error("description: " + v + " not supported by script engine");
			}
			var first = true;
			d = "{";
			djd43.widget.html.stabile._depth++;
			for (var key in v) {
				if (v[key] == void (0) || typeof (v[key]) == "function") {
					continue;
				}
				if (first) {
					first = false;
				} else {
					d += ", ";
				}
				var kd = key;
				if (!kd.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
					kd = arguments.callee(key, showAll);
				}
				d += kd + ": " + arguments.callee(v[key], showAll);
			}
			return d + "}";
		}
		if (showAll) {
			if (djd43.widget.html.stabile._recur) {
				var objectToString = Object.prototype.toString;
				return objectToString.apply(v, []);
			} else {
				djd43.widget.html.stabile._recur = true;
				return v.toString();
			}
		} else {
			throw new Error("Unknown type: " + v);
			return "'unknown'";
		}
	}
	finally {
		djd43.widget.html.stabile._depth = depth;
	}
};
djd43.widget.html.stabile._getStorage = function () {
	if (djd43.widget.html.stabile.dataField) {
		return djd43.widget.html.stabile.dataField;
	}
	var form = document.forms._dojo_form;
	return djd43.widget.html.stabile.dataField = form ? form.stabile : {value:""};
};

