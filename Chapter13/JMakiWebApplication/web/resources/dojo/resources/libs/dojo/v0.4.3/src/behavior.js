/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.behavior");
djd43.require("djd43.event.*");
djd43.require("djd43.experimental");
djd43.experimental("djd43.behavior");
djd43.behavior = new function () {
	function arrIn(obj, name) {
		if (!obj[name]) {
			obj[name] = [];
		}
		return obj[name];
	}
	function forIn(obj, scope, func) {
		var tmpObj = {};
		for (var x in obj) {
			if (typeof tmpObj[x] == "undefined") {
				if (!func) {
					scope(obj[x], x);
				} else {
					func.call(scope, obj[x], x);
				}
			}
		}
	}
	this.behaviors = {};
	this.add = function (behaviorObj) {
		var tmpObj = {};
		forIn(behaviorObj, this, function (behavior, name) {
			var tBehavior = arrIn(this.behaviors, name);
			if ((djd43.lang.isString(behavior)) || (djd43.lang.isFunction(behavior))) {
				behavior = {found:behavior};
			}
			forIn(behavior, function (rule, ruleName) {
				arrIn(tBehavior, ruleName).push(rule);
			});
		});
	};
	this.apply = function () {
		djd43.profile.start("djd43.behavior.apply");
		var r = djd43.render.html;
		var safariGoodEnough = (!r.safari);
		if (r.safari) {
			var uas = r.UA.split("AppleWebKit/")[1];
			if (parseInt(uas.match(/[0-9.]{3,}/)) >= 420) {
				safariGoodEnough = true;
			}
		}
		if ((dj_undef("behaviorFastParse", djConfig) ? (safariGoodEnough) : djConfig["behaviorFastParse"])) {
			this.applyFast();
		} else {
			this.applySlow();
		}
		djd43.profile.end("djd43.behavior.apply");
	};
	this.matchCache = {};
	this.elementsById = function (id, handleRemoved) {
		var removed = [];
		var added = [];
		arrIn(this.matchCache, id);
		if (handleRemoved) {
			var nodes = this.matchCache[id];
			for (var x = 0; x < nodes.length; x++) {
				if (nodes[x].id != "") {
					removed.push(nodes[x]);
					nodes.splice(x, 1);
					x--;
				}
			}
		}
		var tElem = djd43.byId(id);
		while (tElem) {
			if (!tElem["idcached"]) {
				added.push(tElem);
			}
			tElem.id = "";
			tElem = djd43.byId(id);
		}
		this.matchCache[id] = this.matchCache[id].concat(added);
		djd43.lang.forEach(this.matchCache[id], function (node) {
			node.id = id;
			node.idcached = true;
		});
		return {"removed":removed, "added":added, "match":this.matchCache[id]};
	};
	this.applyToNode = function (node, action, ruleSetName) {
		if (typeof action == "string") {
			djd43.event.topic.registerPublisher(action, node, ruleSetName);
		} else {
			if (typeof action == "function") {
				if (ruleSetName == "found") {
					action(node);
				} else {
					djd43.event.connect(node, ruleSetName, action);
				}
			} else {
				action.srcObj = node;
				action.srcFunc = ruleSetName;
				djd43.event.kwConnect(action);
			}
		}
	};
	this.applyFast = function () {
		djd43.profile.start("djd43.behavior.applyFast");
		forIn(this.behaviors, function (tBehavior, id) {
			var elems = djd43.behavior.elementsById(id);
			djd43.lang.forEach(elems.added, function (elem) {
				forIn(tBehavior, function (ruleSet, ruleSetName) {
					if (djd43.lang.isArray(ruleSet)) {
						djd43.lang.forEach(ruleSet, function (action) {
							djd43.behavior.applyToNode(elem, action, ruleSetName);
						});
					}
				});
			});
		});
		djd43.profile.end("djd43.behavior.applyFast");
	};
	this.applySlow = function () {
		djd43.profile.start("djd43.behavior.applySlow");
		var all = document.getElementsByTagName("*");
		var allLen = all.length;
		for (var x = 0; x < allLen; x++) {
			var elem = all[x];
			if ((elem.id) && (!elem["behaviorAdded"]) && (this.behaviors[elem.id])) {
				elem["behaviorAdded"] = true;
				forIn(this.behaviors[elem.id], function (ruleSet, ruleSetName) {
					if (djd43.lang.isArray(ruleSet)) {
						djd43.lang.forEach(ruleSet, function (action) {
							djd43.behavior.applyToNode(elem, action, ruleSetName);
						});
					}
				});
			}
		}
		djd43.profile.end("djd43.behavior.applySlow");
	};
};
djd43.addOnLoad(djd43.behavior, "apply");

