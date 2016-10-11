/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.demoEngine.DemoPane");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.HtmlWidget");
djd43.widget.defineWidget("my.widget.demoEngine.DemoPane", djd43.widget.HtmlWidget, {templateString:"<div dojoAttachPoint=\"domNode\">\n\t<iframe dojoAttachPoint=\"demoNode\"></iframe>\n</div>\n", templateCssString:".demoPane {\n\twidth: 100%;\n\theight: 100%;\n\tpadding: 0px;\n\tmargin: 0px;\n\toverflow: hidden;\n}\n\n.demoPane iframe {\n\twidth: 100%;\n\theight: 100%;\n\tborder: 0px;\n\tborder: none;\n\toverflow: auto;\n\tpadding: 0px;\n\tmargin:0px;\n\tbackground: #ffffff;\n}\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "demoEngine/templates/DemoPane.css"), postCreate:function () {
	djd43.html.addClass(this.domNode, this.domNodeClass);
	djd43.debug("PostCreate");
	this._launchDemo();
}, _launchDemo:function () {
	djd43.debug("Launching Demo");
	djd43.debug(this.demoNode);
	this.demoNode.src = this.href;
}, setHref:function (url) {
	this.href = url;
	this._launchDemo();
}}, "", function () {
	djd43.debug("DemoPane Init");
	this.domNodeClass = "demoPane";
	this.demoNode = "";
	this.href = "";
});

