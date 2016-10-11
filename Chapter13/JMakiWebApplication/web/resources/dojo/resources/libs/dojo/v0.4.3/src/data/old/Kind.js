/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.data.old.Kind");
djd43.require("djd43.data.old.Item");
djd43.data.old.Kind = function (dataProvider) {
	djd43.data.old.Item.call(this, dataProvider);
};
djd43.inherits(djd43.data.old.Kind, djd43.data.old.Item);

