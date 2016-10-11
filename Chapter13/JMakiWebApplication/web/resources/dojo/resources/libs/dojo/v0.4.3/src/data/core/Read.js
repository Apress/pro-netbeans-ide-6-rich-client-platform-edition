/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.data.core.Read");
djd43.require("djd43.data.core.Result");
djd43.require("djd43.lang.declare");
djd43.require("djd43.experimental");
djd43.experimental("djd43.data.core.Read");
djd43.declare("djd43.data.core.Read", null, {get:function (item, attribute, defaultValue) {
	djd43.unimplemented("djd43.data.core.Read.get");
	var attributeValue = null;
	return attributeValue;
}, getValues:function (item, attribute) {
	djd43.unimplemented("djd43.data.core.Read.getValues");
	var array = null;
	return array;
}, getAttributes:function (item) {
	djd43.unimplemented("djd43.data.core.Read.getAttributes");
	var array = null;
	return array;
}, hasAttribute:function (item, attribute) {
	djd43.unimplemented("djd43.data.core.Read.hasAttribute");
	return false;
}, containsValue:function (item, attribute, value) {
	djd43.unimplemented("djd43.data.core.Read.containsValue");
	return false;
}, isItem:function (something) {
	djd43.unimplemented("djd43.data.core.Read.isItem");
	return false;
}, isItemAvailable:function (something) {
	djd43.unimplemented("djd43.data.core.Read.isItemAvailable");
	return false;
}, find:function (keywordArgs) {
	djd43.unimplemented("djd43.data.core.Read.find");
	var result = null;
	return result;
}, getIdentity:function (item) {
	djd43.unimplemented("djd43.data.core.Read.getIdentity");
	var itemIdentifyString = null;
	return itemIdentifyString;
}, findByIdentity:function (identity) {
	djd43.unimplemented("djd43.data.core.Read.getByIdentity");
	var item = null;
	return item;
}});

