/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.data.OpmlStore");
djd43.require("djd43.data.core.Read");
djd43.require("djd43.data.core.Result");
djd43.require("djd43.lang.assert");
djd43.require("djd43.json");
djd43.require("djd43.experimental");
djd43.experimental("djd43.data.OpmlStore");
djd43.declare("djd43.data.OpmlStore", djd43.data.core.Read, {initializer:function (keywordParameters) {
	this._arrayOfTopLevelItems = [];
	this._metadataNodes = null;
	this._loadFinished = false;
	this._opmlFileUrl = keywordParameters["url"];
}, _assertIsItem:function (item) {
	if (!this.isItem(item)) {
		throw new Error("djd43.data.OpmlStore: a function was passed an item argument that was not an item");
	}
}, _removeChildNodesThatAreNotElementNodes:function (node, recursive) {
	var childNodes = node.childNodes;
	if (childNodes.length == 0) {
		return;
	}
	var nodesToRemove = [];
	var i, childNode;
	for (i = 0; i < childNodes.length; ++i) {
		childNode = childNodes[i];
		if (childNode.nodeType != Node.ELEMENT_NODE) {
			nodesToRemove.push(childNode);
		}
	}
	for (i = 0; i < nodesToRemove.length; ++i) {
		childNode = nodesToRemove[i];
		node.removeChild(childNode);
	}
	if (recursive) {
		for (i = 0; i < childNodes.length; ++i) {
			childNode = childNodes[i];
			this._removeChildNodesThatAreNotElementNodes(childNode, recursive);
		}
	}
}, _processRawXmlTree:function (rawXmlTree) {
	var headNodes = rawXmlTree.getElementsByTagName("head");
	var headNode = headNodes[0];
	this._removeChildNodesThatAreNotElementNodes(headNode);
	this._metadataNodes = headNode.childNodes;
	var bodyNodes = rawXmlTree.getElementsByTagName("body");
	var bodyNode = bodyNodes[0];
	this._removeChildNodesThatAreNotElementNodes(bodyNode, true);
	var bodyChildNodes = bodyNodes[0].childNodes;
	for (var i = 0; i < bodyChildNodes.length; ++i) {
		var node = bodyChildNodes[i];
		if (node.tagName == "outline") {
			this._arrayOfTopLevelItems.push(node);
		}
	}
}, get:function (item, attribute, defaultValue) {
	this._assertIsItem(item);
	if (attribute == "children") {
		return (item.firstChild || defaultValue);
	} else {
		var value = item.getAttribute(attribute);
		value = (value != undefined) ? value : defaultValue;
		return value;
	}
}, getValues:function (item, attribute) {
	this._assertIsItem(item);
	if (attribute == "children") {
		var array = [];
		for (var i = 0; i < item.childNodes.length; ++i) {
			array.push(item.childNodes[i]);
		}
		return array;
	} else {
		return [item.getAttribute(attribute)];
	}
}, getAttributes:function (item) {
	this._assertIsItem(item);
	var attributes = [];
	var xmlNode = item;
	var xmlAttributes = xmlNode.attributes;
	for (var i = 0; i < xmlAttributes.length; ++i) {
		var xmlAttribute = xmlAttributes.item(i);
		attributes.push(xmlAttribute.nodeName);
	}
	if (xmlNode.childNodes.length > 0) {
		attributes.push("children");
	}
	return attributes;
}, hasAttribute:function (item, attribute) {
	return (this.getValues(item, attribute).length > 0);
}, containsValue:function (item, attribute, value) {
	var values = this.getValues(item, attribute);
	for (var i = 0; i < values.length; ++i) {
		var possibleValue = values[i];
		if (value == possibleValue) {
			return true;
		}
	}
	return false;
}, isItem:function (something) {
	return (something && something.nodeType == Node.ELEMENT_NODE && something.tagName == "outline");
}, isItemAvailable:function (something) {
	return this.isItem(something);
}, find:function (keywordArgs) {
	var result = null;
	if (keywordArgs instanceof djd43.data.core.Result) {
		result = keywordArgs;
		result.store = this;
	} else {
		result = new djd43.data.core.Result(keywordArgs, this);
	}
	var self = this;
	var bindHandler = function (type, data, evt) {
		var scope = result.scope || dj_global;
		if (type == "load") {
			self._processRawXmlTree(data);
			if (result.saveResult) {
				result.items = self._arrayOfTopLevelItems;
			}
			if (result.onbegin) {
				result.onbegin.call(scope, result);
			}
			for (var i = 0; i < self._arrayOfTopLevelItems.length; i++) {
				var item = self._arrayOfTopLevelItems[i];
				if (result.onnext && !result._aborted) {
					result.onnext.call(scope, item, result);
				}
			}
			if (result.oncompleted && !result._aborted) {
				result.oncompleted.call(scope, result);
			}
		} else {
			if (type == "error" || type == "timeout") {
				var errorObject = data;
				if (result.onerror) {
					result.onerror.call(scope, data);
				}
			}
		}
	};
	if (!this._loadFinished) {
		if (this._opmlFileUrl) {
			var bindRequest = djd43.io.bind({url:this._opmlFileUrl, handle:bindHandler, mimetype:"text/xml", sync:(result.sync || false)});
			result._abortFunc = bindRequest.abort;
		}
	}
	return result;
}, getIdentity:function (item) {
	djd43.unimplemented("djd43.data.OpmlStore.getIdentity()");
	return null;
}, findByIdentity:function (identity) {
	djd43.unimplemented("djd43.data.OpmlStore.findByIdentity()");
	return null;
}});

