/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Widget");
djd43.require("djd43.lang.func");
djd43.require("djd43.lang.array");
djd43.require("djd43.lang.extras");
djd43.require("djd43.lang.declare");
djd43.require("djd43.ns");
djd43.require("djd43.widget.Manager");
djd43.require("djd43.event.*");
djd43.require("djd43.a11y");
djd43.declare("djd43.widget.Widget", null, function () {
	this.children = [];
	this.extraArgs = {};
}, {parent:null, isTopLevel:false, disabled:false, isContainer:false, widgetId:"", widgetType:"Widget", ns:"djd43", getNamespacedType:function () {
	return (this.ns ? this.ns + ":" + this.widgetType : this.widgetType).toLowerCase();
}, toString:function () {
	return "[Widget " + this.getNamespacedType() + ", " + (this.widgetId || "NO ID") + "]";
}, repr:function () {
	return this.toString();
}, enable:function () {
	this.disabled = false;
}, disable:function () {
	this.disabled = true;
}, onResized:function () {
	this.notifyChildrenOfResize();
}, notifyChildrenOfResize:function () {
	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if (child.onResized) {
			child.onResized();
		}
	}
}, create:function (args, fragment, parent, ns) {
	if (ns) {
		this.ns = ns;
	}
	this.satisfyPropertySets(args, fragment, parent);
	this.mixInProperties(args, fragment, parent);
	this.postMixInProperties(args, fragment, parent);
	djd43.widget.manager.add(this);
	this.buildRendering(args, fragment, parent);
	this.initialize(args, fragment, parent);
	this.postInitialize(args, fragment, parent);
	this.postCreate(args, fragment, parent);
	return this;
}, destroy:function (finalize) {
	if (this.parent) {
		this.parent.removeChild(this);
	}
	this.destroyChildren();
	this.uninitialize();
	this.destroyRendering(finalize);
	djd43.widget.manager.removeById(this.widgetId);
}, destroyChildren:function () {
	var widget;
	var i = 0;
	while (this.children.length > i) {
		widget = this.children[i];
		if (widget instanceof djd43.widget.Widget) {
			this.removeChild(widget);
			widget.destroy();
			continue;
		}
		i++;
	}
}, getChildrenOfType:function (type, recurse) {
	var ret = [];
	var isFunc = djd43.lang.isFunction(type);
	if (!isFunc) {
		type = type.toLowerCase();
	}
	for (var x = 0; x < this.children.length; x++) {
		if (isFunc) {
			if (this.children[x] instanceof type) {
				ret.push(this.children[x]);
			}
		} else {
			if (this.children[x].widgetType.toLowerCase() == type) {
				ret.push(this.children[x]);
			}
		}
		if (recurse) {
			ret = ret.concat(this.children[x].getChildrenOfType(type, recurse));
		}
	}
	return ret;
}, getDescendants:function () {
	var result = [];
	var stack = [this];
	var elem;
	while ((elem = stack.pop())) {
		result.push(elem);
		if (elem.children) {
			djd43.lang.forEach(elem.children, function (elem) {
				stack.push(elem);
			});
		}
	}
	return result;
}, isFirstChild:function () {
	return this === this.parent.children[0];
}, isLastChild:function () {
	return this === this.parent.children[this.parent.children.length - 1];
}, satisfyPropertySets:function (args) {
	return args;
}, mixInProperties:function (args, frag) {
	if ((args["fastMixIn"]) || (frag["fastMixIn"])) {
		for (var x in args) {
			this[x] = args[x];
		}
		return;
	}
	var undef;
	var lcArgs = djd43.widget.lcArgsCache[this.widgetType];
	if (lcArgs == null) {
		lcArgs = {};
		for (var y in this) {
			lcArgs[((new String(y)).toLowerCase())] = y;
		}
		djd43.widget.lcArgsCache[this.widgetType] = lcArgs;
	}
	var visited = {};
	for (var x in args) {
		if (!this[x]) {
			var y = lcArgs[(new String(x)).toLowerCase()];
			if (y) {
				args[y] = args[x];
				x = y;
			}
		}
		if (visited[x]) {
			continue;
		}
		visited[x] = true;
		if ((typeof this[x]) != (typeof undef)) {
			if (typeof args[x] != "string") {
				this[x] = args[x];
			} else {
				if (djd43.lang.isString(this[x])) {
					this[x] = args[x];
				} else {
					if (djd43.lang.isNumber(this[x])) {
						this[x] = new Number(args[x]);
					} else {
						if (djd43.lang.isBoolean(this[x])) {
							this[x] = (args[x].toLowerCase() == "false") ? false : true;
						} else {
							if (djd43.lang.isFunction(this[x])) {
								if (args[x].search(/[^\w\.]+/i) == -1) {
									this[x] = djd43.evalObjPath(args[x], false);
								} else {
									var tn = djd43.lang.nameAnonFunc(new Function(args[x]), this);
									djd43.event.kwConnect({srcObj:this, srcFunc:x, adviceObj:this, adviceFunc:tn});
								}
							} else {
								if (djd43.lang.isArray(this[x])) {
									this[x] = args[x].split(";");
								} else {
									if (this[x] instanceof Date) {
										this[x] = new Date(Number(args[x]));
									} else {
										if (typeof this[x] == "object") {
											if (this[x] instanceof djd43.uri.Uri) {
												this[x] = djd43.uri.dojoUri(args[x]);
											} else {
												var pairs = args[x].split(";");
												for (var y = 0; y < pairs.length; y++) {
													var si = pairs[y].indexOf(":");
													if ((si != -1) && (pairs[y].length > si)) {
														this[x][pairs[y].substr(0, si).replace(/^\s+|\s+$/g, "")] = pairs[y].substr(si + 1);
													}
												}
											}
										} else {
											this[x] = args[x];
										}
									}
								}
							}
						}
					}
				}
			}
		} else {
			this.extraArgs[x.toLowerCase()] = args[x];
		}
	}
}, postMixInProperties:function (args, frag, parent) {
}, initialize:function (args, frag, parent) {
	return false;
}, postInitialize:function (args, frag, parent) {
	return false;
}, postCreate:function (args, frag, parent) {
	return false;
}, uninitialize:function () {
	return false;
}, buildRendering:function (args, frag, parent) {
	djd43.unimplemented("djd43.widget.Widget.buildRendering, on " + this.toString() + ", ");
	return false;
}, destroyRendering:function () {
	djd43.unimplemented("djd43.widget.Widget.destroyRendering");
	return false;
}, addedTo:function (parent) {
}, addChild:function (child) {
	djd43.unimplemented("djd43.widget.Widget.addChild");
	return false;
}, removeChild:function (widget) {
	for (var x = 0; x < this.children.length; x++) {
		if (this.children[x] === widget) {
			this.children.splice(x, 1);
			widget.parent = null;
			break;
		}
	}
	return widget;
}, getPreviousSibling:function () {
	var idx = this.getParentIndex();
	if (idx <= 0) {
		return null;
	}
	return this.parent.children[idx - 1];
}, getSiblings:function () {
	return this.parent.children;
}, getParentIndex:function () {
	return djd43.lang.indexOf(this.parent.children, this, true);
}, getNextSibling:function () {
	var idx = this.getParentIndex();
	if (idx == this.parent.children.length - 1) {
		return null;
	}
	if (idx < 0) {
		return null;
	}
	return this.parent.children[idx + 1];
}});
djd43.widget.lcArgsCache = {};
djd43.widget.tags = {};
djd43.widget.tags.addParseTreeHandler = function (type) {
	djd43.deprecated("addParseTreeHandler", ". ParseTreeHandlers are now reserved for components. Any unfiltered DojoML tag without a ParseTreeHandler is assumed to be a widget", "0.5");
};
djd43.widget.tags["dojo:propertyset"] = function (fragment, widgetParser, parentComp) {
	var properties = widgetParser.parseProperties(fragment["dojo:propertyset"]);
};
djd43.widget.tags["dojo:connect"] = function (fragment, widgetParser, parentComp) {
	var properties = widgetParser.parseProperties(fragment["dojo:connect"]);
};
djd43.widget.buildWidgetFromParseTree = function (type, frag, parser, parentComp, insertionIndex, localProps) {
	djd43.a11y.setAccessibleMode();
	var stype = type.split(":");
	stype = (stype.length == 2) ? stype[1] : type;
	var localProperties = localProps || parser.parseProperties(frag[frag["ns"] + ":" + stype]);
	var twidget = djd43.widget.manager.getImplementation(stype, null, null, frag["ns"]);
	if (!twidget) {
		throw new Error("cannot find \"" + type + "\" widget");
	} else {
		if (!twidget.create) {
			throw new Error("\"" + type + "\" widget object has no \"create\" method and does not appear to implement *Widget");
		}
	}
	localProperties["dojoinsertionindex"] = insertionIndex;
	var ret = twidget.create(localProperties, frag, parentComp, frag["ns"]);
	return ret;
};
djd43.widget.defineWidget = function (widgetClass, renderer, superclasses, init, props) {
	if (djd43.lang.isString(arguments[3])) {
		djd43.widget._defineWidget(arguments[0], arguments[3], arguments[1], arguments[4], arguments[2]);
	} else {
		var args = [arguments[0]], p = 3;
		if (djd43.lang.isString(arguments[1])) {
			args.push(arguments[1], arguments[2]);
		} else {
			args.push("", arguments[1]);
			p = 2;
		}
		if (djd43.lang.isFunction(arguments[p])) {
			args.push(arguments[p], arguments[p + 1]);
		} else {
			args.push(null, arguments[p]);
		}
		djd43.widget._defineWidget.apply(this, args);
	}
};
djd43.widget.defineWidget.renderers = "html|svg|vml";
djd43.widget._defineWidget = function (widgetClass, renderer, superclasses, init, props) {
	var module = widgetClass.split(".");
	var type = module.pop();
	var regx = "\\.(" + (renderer ? renderer + "|" : "") + djd43.widget.defineWidget.renderers + ")\\.";
	var r = widgetClass.search(new RegExp(regx));
	module = (r < 0 ? module.join(".") : widgetClass.substr(0, r));
	djd43.widget.manager.registerWidgetPackage(module);
	var pos = module.indexOf(".");
	var nsName = (pos > -1) ? module.substring(0, pos) : module;
	props = (props) || {};
	props.widgetType = type;
	if ((!init) && (props["classConstructor"])) {
		init = props.classConstructor;
		delete props.classConstructor;
	}
	djd43.declare(widgetClass, superclasses, init, props);
};

