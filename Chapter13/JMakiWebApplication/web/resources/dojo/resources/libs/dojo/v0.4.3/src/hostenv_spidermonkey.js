/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.hostenv.name_ = "spidermonkey";
djd43.hostenv.println = print;
djd43.hostenv.exit = function (exitcode) {
	quit(exitcode);
};
djd43.hostenv.getVersion = function () {
	return version();
};
if (typeof line2pc == "undefined") {
	djd43.raise("attempt to use SpiderMonkey host environment when no 'line2pc' global");
}
function dj_spidermonkey_current_file(depth) {
	var s = "";
	try {
		throw Error("whatever");
	}
	catch (e) {
		s = e.stack;
	}
	var matches = s.match(/[^@]*\.js/gi);
	if (!matches) {
		djd43.raise("could not parse stack string: '" + s + "'");
	}
	var fname = (typeof depth != "undefined" && depth) ? matches[depth + 1] : matches[matches.length - 1];
	if (!fname) {
		djd43.raise("could not find file name in stack string '" + s + "'");
	}
	return fname;
}
if (!djd43.hostenv.library_script_uri_) {
	djd43.hostenv.library_script_uri_ = dj_spidermonkey_current_file(0);
}
djd43.hostenv.loadUri = function (uri) {
	var ok = load(uri);
	return 1;
};
djd43.requireIf((djConfig["isDebug"] || djConfig["debugAtAllCosts"]), "djd43.debug");

