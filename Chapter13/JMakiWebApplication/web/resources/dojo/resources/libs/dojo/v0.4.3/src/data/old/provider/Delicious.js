/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.data.old.provider.Delicious");
djd43.require("djd43.data.old.provider.FlatFile");
djd43.require("djd43.data.old.format.Json");
djd43.data.old.provider.Delicious = function () {
	djd43.data.old.provider.FlatFile.call(this);
	if (Delicious && Delicious.posts) {
		djd43.data.old.format.Json.loadDataProviderFromArrayOfJsonData(this, Delicious.posts);
	} else {
	}
	var u = this.registerAttribute("u");
	var d = this.registerAttribute("d");
	var t = this.registerAttribute("t");
	u.load("name", "Bookmark");
	d.load("name", "Description");
	t.load("name", "Tags");
	u.load("type", "String");
	d.load("type", "String");
	t.load("type", "String");
};
djd43.inherits(djd43.data.old.provider.Delicious, djd43.data.old.provider.FlatFile);

