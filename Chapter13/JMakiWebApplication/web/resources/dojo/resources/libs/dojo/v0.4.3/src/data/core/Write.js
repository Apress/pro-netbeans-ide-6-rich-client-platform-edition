/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.data.core.Write");
djd43.require("djd43.data.core.Read");
djd43.require("djd43.lang.declare");
djd43.require("djd43.experimental");
djd43.experimental("djd43.data.core.Write");
djd43.declare("djd43.data.core.Write", djd43.data.core.Read, {newItem:function (keywordArgs) {
	var newItem;
	djd43.unimplemented("djd43.data.core.Write.newItem");
	return newItem;
}, deleteItem:function (item) {
	djd43.unimplemented("djd43.data.core.Write.deleteItem");
	return false;
}, set:function (item, attribute, value) {
	djd43.unimplemented("djd43.data.core.Write.set");
	return false;
}, setValues:function (item, attribute, values) {
	djd43.unimplemented("djd43.data.core.Write.setValues");
	return false;
}, unsetAttribute:function (item, attribute) {
	djd43.unimplemented("djd43.data.core.Write.clear");
	return false;
}, save:function () {
	djd43.unimplemented("djd43.data.core.Write.save");
	return false;
}, revert:function () {
	djd43.unimplemented("djd43.data.core.Write.revert");
	return false;
}, isDirty:function (item) {
	djd43.unimplemented("djd43.data.core.Write.isDirty");
	return false;
}});

