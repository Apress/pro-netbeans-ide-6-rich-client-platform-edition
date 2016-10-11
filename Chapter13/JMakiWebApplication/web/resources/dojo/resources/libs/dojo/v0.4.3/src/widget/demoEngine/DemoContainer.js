/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.demoEngine.DemoContainer");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.HtmlWidget");
djd43.require("djd43.widget.demoEngine.DemoPane");
djd43.require("djd43.widget.demoEngine.SourcePane");
djd43.require("djd43.widget.TabContainer");
djd43.widget.defineWidget("my.widget.demoEngine.DemoContainer", djd43.widget.HtmlWidget, {templateString:"<div dojoAttachPoint=\"domNode\">\n\t<table width=\"100%\" cellspacing=\"0\" cellpadding=\"5\">\n\t\t<tbody>\n\t\t\t<tr dojoAttachPoint=\"headerNode\">\n\t\t\t\t<td dojoAttachPoint=\"returnNode\" valign=\"middle\" width=\"1%\">\n\t\t\t\t\t<img dojoAttachPoint=\"returnImageNode\" dojoAttachEvent=\"onclick: returnToDemos\"/>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<h1 dojoAttachPoint=\"demoNameNode\"></h1>\n\t\t\t\t\t<p dojoAttachPoint=\"summaryNode\"></p>\n\t\t\t\t</td>\n\t\t\t\t<td dojoAttachPoint=\"tabControlNode\" valign=\"middle\" align=\"right\" nowrap>\n\t\t\t\t\t<span dojoAttachPoint=\"sourceButtonNode\" dojoAttachEvent=\"onclick: showSource\">source</span>\n\t\t\t\t\t<span dojoAttachPoint=\"demoButtonNode\" dojoAttachEvent=\"onclick: showDemo\">demo</span>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td colspan=\"3\">\n\t\t\t\t\t<div dojoAttachPoint=\"tabNode\">\n\t\t\t\t\t</div>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>\n</div>\n", templateCssString:".demoContainer{\n\twidth: 100%;\n\theight: 100%;\n\tpadding: 0px;\n\tmargin: 0px;\n}\n\n.demoContainer .return {\n\tcursor: pointer;\n}\n\n.demoContainer span {\n\tmargin-right: 10px;\n\tcursor: pointer;\n}\n\n.demoContainer .selected {\n\tborder-bottom: 5px solid #95bfff;\n}\n\n.demoContainer table {\n\tbackground: #f5f5f5;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.demoContainerTabs {\n\twidth: 100%;\n\theight: 400px;\n}\n\n.demoContainerTabs .dojoTabLabels-top {\n\tdisplay: none;\n}\n\n.demoContainerTabs .dojoTabPaneWrapper {\n\tborder: 0px;\n}\n\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "demoEngine/templates/DemoContainer.css"), postCreate:function () {
	djd43.html.addClass(this.domNode, this.domNodeClass);
	djd43.html.addClass(this.tabNode, this.tabClass);
	djd43.html.addClass(this.returnImageNode, this.returnClass);
	this.returnImageNode.src = this.returnImage;
	this.tabContainer = djd43.widget.createWidget("TabContainer", {}, this.tabNode);
	this.demoTab = djd43.widget.createWidget("DemoPane", {});
	this.tabContainer.addChild(this.demoTab);
	this.sourceTab = djd43.widget.createWidget("SourcePane", {});
	this.tabContainer.addChild(this.sourceTab);
	djd43.html.setOpacity(this.domNode, 0);
	djd43.html.hide(this.domNode);
}, loadDemo:function (url) {
	this.demoTab.setHref(url);
	this.sourceTab.setHref(url);
	this.showDemo();
}, setName:function (name) {
	djd43.html.removeChildren(this.demoNameNode);
	this.demoNameNode.appendChild(document.createTextNode(name));
}, setSummary:function (summary) {
	djd43.html.removeChildren(this.summaryNode);
	this.summaryNode.appendChild(document.createTextNode(summary));
}, showSource:function () {
	djd43.html.removeClass(this.demoButtonNode, this.selectedButtonClass);
	djd43.html.addClass(this.sourceButtonNode, this.selectedButtonClass);
	this.tabContainer.selectTab(this.sourceTab);
}, showDemo:function () {
	djd43.html.removeClass(this.sourceButtonNode, this.selectedButtonClass);
	djd43.html.addClass(this.demoButtonNode, this.selectedButtonClass);
	this.tabContainer.selectTab(this.demoTab);
}, returnToDemos:function () {
	djd43.debug("Return To Demos");
}, show:function () {
	djd43.html.setOpacity(this.domNode, 1);
	djd43.html.show(this.domNode);
	this.tabContainer.checkSize();
}}, "", function () {
	djd43.debug("DemoPane Init");
	this.domNodeClass = "demoContainer";
	this.tabContainer = "";
	this.sourceTab = "";
	this.demoTab = "";
	this.headerNode = "";
	this.returnNode = "";
	this.returnImageNode = "";
	this.returnImage = "images/dojoDemos.gif";
	this.returnClass = "return";
	this.summaryNode = "";
	this.demoNameNode = "";
	this.tabControlNode = "";
	this.tabNode = "";
	this.tabClass = "demoContainerTabs";
	this.sourceButtonNode = "";
	this.demoButtonNode = "";
	this.selectedButtonClass = "selected";
});

