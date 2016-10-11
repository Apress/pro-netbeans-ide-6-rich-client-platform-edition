/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.storage");
djd43.require("djd43.lang.*");
djd43.require("djd43.event.*");
djd43.storage = new function () {
};
djd43.declare("djd43.storage", null, {SUCCESS:"success", FAILED:"failed", PENDING:"pending", SIZE_NOT_AVAILABLE:"Size not available", SIZE_NO_LIMIT:"No size limit", namespace:"default", onHideSettingsUI:null, initialize:function () {
	djd43.unimplemented("djd43.storage.initialize");
}, isAvailable:function () {
	djd43.unimplemented("djd43.storage.isAvailable");
}, put:function (key, value, resultsHandler) {
	djd43.unimplemented("djd43.storage.put");
}, get:function (key) {
	djd43.unimplemented("djd43.storage.get");
}, hasKey:function (key) {
	return (this.get(key) != null);
}, getKeys:function () {
	djd43.unimplemented("djd43.storage.getKeys");
}, clear:function () {
	djd43.unimplemented("djd43.storage.clear");
}, remove:function (key) {
	djd43.unimplemented("djd43.storage.remove");
}, isPermanent:function () {
	djd43.unimplemented("djd43.storage.isPermanent");
}, getMaximumSize:function () {
	djd43.unimplemented("djd43.storage.getMaximumSize");
}, hasSettingsUI:function () {
	return false;
}, showSettingsUI:function () {
	djd43.unimplemented("djd43.storage.showSettingsUI");
}, hideSettingsUI:function () {
	djd43.unimplemented("djd43.storage.hideSettingsUI");
}, getType:function () {
	djd43.unimplemented("djd43.storage.getType");
}, isValidKey:function (keyName) {
	if ((keyName == null) || (typeof keyName == "undefined")) {
		return false;
	}
	return /^[0-9A-Za-z_]*$/.test(keyName);
}});
djd43.storage.manager = new function () {
	this.currentProvider = null;
	this.available = false;
	this._initialized = false;
	this._providers = [];
	this.namespace = "default";
	this.initialize = function () {
		this.autodetect();
	};
	this.register = function (name, instance) {
		this._providers[this._providers.length] = instance;
		this._providers[name] = instance;
	};
	this.setProvider = function (storageClass) {
	};
	this.autodetect = function () {
		if (this._initialized == true) {
			return;
		}
		var providerToUse = null;
		for (var i = 0; i < this._providers.length; i++) {
			providerToUse = this._providers[i];
			if (djd43.lang.isUndefined(djConfig["forceStorageProvider"]) == false && providerToUse.getType() == djConfig["forceStorageProvider"]) {
				providerToUse.isAvailable();
				break;
			} else {
				if (djd43.lang.isUndefined(djConfig["forceStorageProvider"]) == true && providerToUse.isAvailable()) {
					break;
				}
			}
		}
		if (providerToUse == null) {
			this._initialized = true;
			this.available = false;
			this.currentProvider = null;
			djd43.raise("No storage provider found for this platform");
		}
		this.currentProvider = providerToUse;
		for (var i in providerToUse) {
			djd43.storage[i] = providerToUse[i];
		}
		djd43.storage.manager = this;
		djd43.storage.initialize();
		this._initialized = true;
		this.available = true;
	};
	this.isAvailable = function () {
		return this.available;
	};
	this.isInitialized = function () {
		if (this.currentProvider.getType() == "djd43.storage.browser.FlashStorageProvider" && djd43.flash.ready == false) {
			return false;
		} else {
			return this._initialized;
		}
	};
	this.supportsProvider = function (storageClass) {
		try {
			var provider = eval("new " + storageClass + "()");
			var results = provider.isAvailable();
			if (results == null || typeof results == "undefined") {
				return false;
			}
			return results;
		}
		catch (exception) {
			return false;
		}
	};
	this.getProvider = function () {
		return this.currentProvider;
	};
	this.loaded = function () {
	};
};

