/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.demoEngine.SourcePane");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.HtmlWidget");
djd43.require("djd43.io.*");
djd43.widget.defineWidget("my.widget.demoEngine.SourcePane", djd43.widget.HtmlWidget, {templateString:"<div dojoAttachPoint=\"domNode\">\n\t<textarea dojoAttachPoint=\"sourceNode\" rows=\"100%\"></textarea>\n</div>\n", templateCssString:".sourcePane {\n\twidth: 100%;\n\theight: 100%;\n\tpadding: 0px;\n\tmargin: 0px;\n\toverflow: hidden;\n}\n\n.sourcePane textarea{\n\twidth: 100%;\n\theight: 100%;\n\tborder: 0px;\n\toverflow: auto;\n\tpadding: 0px;\n\tmargin:0px;\n}\n\n* html .sourcePane {\n\toverflow: auto;\n}\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "demoEngine/templates/SourcePane.css"), postCreate:function () {
	djd43.html.addClass(this.domNode, this.domNodeClass);
	djd43.debug("PostCreate");
}, getSource:function () {
	if (this.href) {
		djd43.io.bind({url:this.href, load:djd43.lang.hitch(this, "fillInSource"), mimetype:"text/plain"});
	}
}, fillInSource:function (type, source, e) {
	this.sourceNode.value = source;
}, setHref:function (url) {
	this.href = url;
	this.getSource();
}}, "", function () {
	djd43.debug("SourcePane Init");
	this.domNodeClass = "sourcePane";
	this.sourceNode = "";
	this.href = "";
});

