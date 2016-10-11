/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.TaskBar");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.FloatingPane");
djd43.require("djd43.widget.HtmlWidget");
djd43.require("djd43.event.*");
djd43.require("djd43.html.selection");
djd43.widget.defineWidget("djd43.widget.TaskBarItem", djd43.widget.HtmlWidget, {iconSrc:"", caption:"Untitled", templateString:"<div class=\"dojoTaskBarItem\" dojoAttachEvent=\"onClick\">\n</div>\n", templateCssString:".dojoTaskBarItem {\n\tdisplay: inline-block;\n\tbackground-color: ThreeDFace;\n\tborder: outset 2px;\n\tmargin-right: 5px;\n\tcursor: pointer;\n\theight: 35px;\n\twidth: 100px;\n\tfont-size: 10pt;\n\twhite-space: nowrap;\n\ttext-align: center;\n\tfloat: left;\n\toverflow: hidden;\n}\n\n.dojoTaskBarItem img {\n\tvertical-align: middle;\n\tmargin-right: 5px;\n\tmargin-left: 5px;\t\n\theight: 32px;\n\twidth: 32px;\n}\n\n.dojoTaskBarItem a {\n\t color: black;\n\ttext-decoration: none;\n}\n\n\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "templates/TaskBar.css"), fillInTemplate:function () {
	if (this.iconSrc) {
		var img = document.createElement("img");
		img.src = this.iconSrc;
		this.domNode.appendChild(img);
	}
	this.domNode.appendChild(document.createTextNode(this.caption));
	djd43.html.disableSelection(this.domNode);
}, postCreate:function () {
	this.window = djd43.widget.getWidgetById(this.windowId);
	this.window.explodeSrc = this.domNode;
	djd43.event.connect(this.window, "destroy", this, "destroy");
}, onClick:function () {
	this.window.toggleDisplay();
}});
djd43.widget.defineWidget("djd43.widget.TaskBar", djd43.widget.FloatingPane, function () {
	this._addChildStack = [];
}, {resizable:false, titleBarDisplay:false, addChild:function (child) {
	if (!this.containerNode) {
		this._addChildStack.push(child);
	} else {
		if (this._addChildStack.length > 0) {
			var oarr = this._addChildStack;
			this._addChildStack = [];
			djd43.lang.forEach(oarr, this.addChild, this);
		}
	}
	var tbi = djd43.widget.createWidget("TaskBarItem", {windowId:child.widgetId, caption:child.title, iconSrc:child.iconSrc});
	djd43.widget.TaskBar.superclass.addChild.call(this, tbi);
}});

