/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.charting.Chart");
djd43.require("djd43.lang.common");
djd43.require("djd43.charting.PlotArea");
djd43.charting.Chart = function (node, title, description) {
	this.node = node || null;
	this.title = title || "Chart";
	this.description = description || "";
	this.plotAreas = [];
};
djd43.extend(djd43.charting.Chart, {addPlotArea:function (obj, doRender) {
	if (obj.x != null && obj.left == null) {
		obj.left = obj.x;
	}
	if (obj.y != null && obj.top == null) {
		obj.top = obj.y;
	}
	this.plotAreas.push(obj);
	if (doRender) {
		this.render();
	}
}, onInitialize:function (chart) {
}, onRender:function (chart) {
}, onDestroy:function (chart) {
}, initialize:function () {
	if (!this.node) {
		djd43.raise("djd43.charting.Chart.initialize: there must be a root node defined for the Chart.");
	}
	this.destroy();
	this.render();
	this.onInitialize(this);
}, render:function () {
	if (this.node.style.position != "absolute") {
		this.node.style.position = "relative";
	}
	for (var i = 0; i < this.plotAreas.length; i++) {
		var area = this.plotAreas[i].plotArea;
		var node = area.initialize();
		node.style.position = "absolute";
		node.style.top = this.plotAreas[i].top + "px";
		node.style.left = this.plotAreas[i].left + "px";
		this.node.appendChild(node);
		area.render();
	}
}, destroy:function () {
	for (var i = 0; i < this.plotAreas.length; i++) {
		this.plotAreas[i].plotArea.destroy();
	}
	while (this.node && this.node.childNodes && this.node.childNodes.length > 0) {
		this.node.removeChild(this.node.childNodes[0]);
	}
}});

