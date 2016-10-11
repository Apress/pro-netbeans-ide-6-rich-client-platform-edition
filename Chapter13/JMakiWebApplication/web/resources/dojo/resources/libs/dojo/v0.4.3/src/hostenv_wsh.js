/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.hostenv.name_ = "wsh";
if (typeof WScript == "undefined") {
	djd43.raise("attempt to use WSH host environment when no WScript global");
}
djd43.hostenv.println = WScript.Echo;
djd43.hostenv.getCurrentScriptUri = function () {
	return WScript.ScriptFullName();
};
djd43.hostenv.getText = function (fpath) {
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var istream = fso.OpenTextFile(fpath, 1);
	if (!istream) {
		return null;
	}
	var contents = istream.ReadAll();
	istream.Close();
	return contents;
};
djd43.hostenv.exit = function (exitcode) {
	WScript.Quit(exitcode);
};
djd43.requireIf((djConfig["isDebug"] || djConfig["debugAtAllCosts"]), "djd43.debug");

