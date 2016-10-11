/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.TreeRPCController");
djd43.require("djd43.event.*");
djd43.require("djd43.json");
djd43.require("djd43.io.*");
djd43.require("djd43.widget.TreeLoadingController");
djd43.widget.defineWidget("djd43.widget.TreeRPCController", djd43.widget.TreeLoadingController, {doMove:function (child, newParent, index) {
	var params = {child:this.getInfo(child), childTree:this.getInfo(child.tree), newParent:this.getInfo(newParent), newParentTree:this.getInfo(newParent.tree), newIndex:index};
	var success;
	this.runRPC({url:this.getRPCUrl("move"), load:function (response) {
		success = this.doMoveProcessResponse(response, child, newParent, index);
	}, sync:true, lock:[child, newParent], params:params});
	return success;
}, doMoveProcessResponse:function (response, child, newParent, index) {
	if (!djd43.lang.isUndefined(response.error)) {
		this.RPCErrorHandler("server", response.error);
		return false;
	}
	var args = [child, newParent, index];
	return djd43.widget.TreeLoadingController.prototype.doMove.apply(this, args);
}, doRemoveNode:function (node, callObj, callFunc) {
	var params = {node:this.getInfo(node), tree:this.getInfo(node.tree)};
	this.runRPC({url:this.getRPCUrl("removeNode"), load:function (response) {
		this.doRemoveNodeProcessResponse(response, node, callObj, callFunc);
	}, params:params, lock:[node]});
}, doRemoveNodeProcessResponse:function (response, node, callObj, callFunc) {
	if (!djd43.lang.isUndefined(response.error)) {
		this.RPCErrorHandler("server", response.error);
		return false;
	}
	if (!response) {
		return false;
	}
	if (response == true) {
		var args = [node, callObj, callFunc];
		djd43.widget.TreeLoadingController.prototype.doRemoveNode.apply(this, args);
		return;
	} else {
		if (djd43.lang.isObject(response)) {
			djd43.raise(response.error);
		} else {
			djd43.raise("Invalid response " + response);
		}
	}
}, doCreateChild:function (parent, index, output, callObj, callFunc) {
	var params = {tree:this.getInfo(parent.tree), parent:this.getInfo(parent), index:index, data:output};
	this.runRPC({url:this.getRPCUrl("createChild"), load:function (response) {
		this.doCreateChildProcessResponse(response, parent, index, callObj, callFunc);
	}, params:params, lock:[parent]});
}, doCreateChildProcessResponse:function (response, parent, index, callObj, callFunc) {
	if (!djd43.lang.isUndefined(response.error)) {
		this.RPCErrorHandler("server", response.error);
		return false;
	}
	if (!djd43.lang.isObject(response)) {
		djd43.raise("Invalid result " + response);
	}
	var args = [parent, index, response, callObj, callFunc];
	djd43.widget.TreeLoadingController.prototype.doCreateChild.apply(this, args);
}});

