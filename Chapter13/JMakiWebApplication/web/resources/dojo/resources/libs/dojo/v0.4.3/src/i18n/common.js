/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.i18n.common");
djd43.i18n.getLocalization = function (packageName, bundleName, locale) {
	djd43.hostenv.preloadLocalizations();
	locale = djd43.hostenv.normalizeLocale(locale);
	var elements = locale.split("-");
	var module = [packageName, "nls", bundleName].join(".");
	var bundle = djd43.hostenv.findModule(module, true);
	var localization;
	for (var i = elements.length; i > 0; i--) {
		var loc = elements.slice(0, i).join("_");
		if (bundle[loc]) {
			localization = bundle[loc];
			break;
		}
	}
	if (!localization) {
		localization = bundle.ROOT;
	}
	if (localization) {
		var clazz = function () {
		};
		clazz.prototype = localization;
		return new clazz();
	}
	djd43.raise("Bundle not found: " + bundleName + " in " + packageName + " , locale=" + locale);
};
djd43.i18n.isLTR = function (locale) {
	var lang = djd43.hostenv.normalizeLocale(locale).split("-")[0];
	var RTL = {ar:true, fa:true, he:true, ur:true, yi:true};
	return !RTL[lang];
};

