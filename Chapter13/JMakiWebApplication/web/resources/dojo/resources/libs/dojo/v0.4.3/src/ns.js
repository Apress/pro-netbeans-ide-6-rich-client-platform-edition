/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.ns");
djd43.ns = {namespaces:{}, failed:{}, loading:{}, loaded:{}, register:function (name, module, resolver, noOverride) {
	if (!noOverride || !this.namespaces[name]) {
		this.namespaces[name] = new djd43.ns.Ns(name, module, resolver);
	}
}, allow:function (name) {
	if (this.failed[name]) {
		return false;
	}
	if ((djConfig.excludeNamespace) && (djd43.lang.inArray(djConfig.excludeNamespace, name))) {
		return false;
	}
	return ((name == this.dojo) || (!djConfig.includeNamespace) || (djd43.lang.inArray(djConfig.includeNamespace, name)));
}, get:function (name) {
	return this.namespaces[name];
}, require:function (name) {
	var ns = this.namespaces[name];
	if ((ns) && (this.loaded[name])) {
		return ns;
	}
	if (!this.allow(name)) {
		return false;
	}
	if (this.loading[name]) {
		djd43.debug("djd43.namespace.require: re-entrant request to load namespace \"" + name + "\" must fail.");
		return false;
	}
	var req = djd43.require;
	this.loading[name] = true;
	try {
		if (name == "djd43") {
			req("djd43.namespaces.dojo");
		} else {
			if (!djd43.hostenv.moduleHasPrefix(name)) {
				djd43.registerModulePath(name, "../" + name);
			}
			req([name, "manifest"].join("."), false, true);
		}
		if (!this.namespaces[name]) {
			this.failed[name] = true;
		}
	}
	finally {
		this.loading[name] = false;
	}
	return this.namespaces[name];
}};
djd43.ns.Ns = function (name, module, resolver) {
	this.name = name;
	this.module = module;
	this.resolver = resolver;
	this._loaded = [];
	this._failed = [];
};
djd43.ns.Ns.prototype.resolve = function (name, domain, omitModuleCheck) {
	if (!this.resolver || djConfig["skipAutoRequire"]) {
		return false;
	}
	var fullName = this.resolver(name, domain);
	if ((fullName) && (!this._loaded[fullName]) && (!this._failed[fullName])) {
		var req = djd43.require;
		req(fullName, false, true);
		if (djd43.hostenv.findModule(fullName, false)) {
			this._loaded[fullName] = true;
		} else {
			if (!omitModuleCheck) {
				djd43.raise("djd43.ns.Ns.resolve: module '" + fullName + "' not found after loading via namespace '" + this.name + "'");
			}
			this._failed[fullName] = true;
		}
	}
	return Boolean(this._loaded[fullName]);
};
djd43.registerNamespace = function (name, module, resolver) {
	djd43.ns.register.apply(djd43.ns, arguments);
};
djd43.registerNamespaceResolver = function (name, resolver) {
	var n = djd43.ns.namespaces[name];
	if (n) {
		n.resolver = resolver;
	}
};
djd43.registerNamespaceManifest = function (module, path, name, widgetModule, resolver) {
	djd43.registerModulePath(name, path);
	djd43.registerNamespace(name, widgetModule, resolver);
};
djd43.registerNamespace("djd43", "djd43.widget");

