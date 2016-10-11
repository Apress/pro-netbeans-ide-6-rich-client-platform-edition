/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.demoEngine.DemoNavigator");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.HtmlWidget");
djd43.require("djd43.widget.Button");
djd43.require("djd43.widget.demoEngine.DemoItem");
djd43.require("djd43.io.*");
djd43.require("djd43.lfx.*");
djd43.require("djd43.lang.common");
djd43.widget.defineWidget("my.widget.demoEngine.DemoNavigator", djd43.widget.HtmlWidget, {templateString:"<div dojoAttachPoint=\"domNode\">\n\t<table width=\"100%\" cellspacing=\"0\" cellpadding=\"5\">\n\t\t<tbody>\n\t\t\t<tr dojoAttachPoint=\"navigationContainer\">\n\t\t\t\t<td dojoAttachPoint=\"categoriesNode\" valign=\"top\" width=\"1%\">\n\t\t\t\t\t<h1>Categories</h1>\n\t\t\t\t\t<div dojoAttachPoint=\"categoriesButtonsNode\"></div>\n\t\t\t\t</td>\n\n\t\t\t\t<td dojoAttachPoint=\"demoListNode\" valign=\"top\">\n\t\t\t\t\t<div dojoAttachPoint=\"demoListWrapperNode\">\n\t\t\t\t\t\t<div dojoAttachPoint=\"demoListContainerNode\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td colspan=\"2\">\n\t\t\t\t\t<div dojoAttachPoint=\"demoNode\"></div>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>\n</div>\n", templateCssString:".demoNavigatorListWrapper {\n\tborder:1px solid #dcdbdb;\n\tbackground-color:#f8f8f8;\n\tpadding:2px;\n}\n\n.demoNavigatorListContainer {\n\tborder:1px solid #f0f0f0;\n\tbackground-color:#fff;\n\tpadding:1em;\n}\n\n.demoNavigator h1 {\n\tmargin-top: 0px;\n\tmargin-bottom: 10px;\n\tfont-size: 1.2em;\n\tborder-bottom:1px dotted #a9ccf5;\n}\n\n.demoNavigator .dojoButton {\n\tmargin-bottom: 5px;\n}\n\n.demoNavigator .dojoButton .dojoButtonContents {\n\tfont-size: 1.1em;\n\twidth: 100px;\n\tcolor: black;\n}\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "demoEngine/templates/DemoNavigator.css"), postCreate:function () {
	djd43.html.addClass(this.domNode, this.domNodeClass);
	djd43.html.addClass(this.demoListWrapperNode, this.demoListWrapperClass);
	djd43.html.addClass(this.demoListContainerNode, this.demoListContainerClass);
	if (djd43.render.html.ie) {
		djd43.debug("render ie");
		djd43.html.hide(this.demoListWrapperNode);
	} else {
		djd43.debug("render non-ie");
		djd43.lfx.html.fadeHide(this.demoListWrapperNode, 0).play();
	}
	this.getRegistry(this.demoRegistryUrl);
	this.demoContainer = djd43.widget.createWidget("DemoContainer", {returnImage:this.returnImage}, this.demoNode);
	djd43.event.connect(this.demoContainer, "returnToDemos", this, "returnToDemos");
	this.demoContainer.hide();
}, returnToDemos:function () {
	this.demoContainer.hide();
	if (djd43.render.html.ie) {
		djd43.debug("render ie");
		djd43.html.show(this.navigationContainer);
	} else {
		djd43.debug("render non-ie");
		djd43.lfx.html.fadeShow(this.navigationContainer, 250).play();
	}
	djd43.lang.forEach(this.categoriesChildren, djd43.lang.hitch(this, function (child) {
		child.checkSize();
	}));
	djd43.lang.forEach(this.demoListChildren, djd43.lang.hitch(this, function (child) {
		child.checkSize();
	}));
}, show:function () {
	djd43.html.show(this.domNode);
	djd43.html.setOpacity(this.domNode, 1);
	djd43.html.setOpacity(this.navigationContainer, 1);
	djd43.lang.forEach(this.categoriesChildren, djd43.lang.hitch(this, function (child) {
		child.checkSize();
	}));
	djd43.lang.forEach(this.demoListChildren, djd43.lang.hitch(this, function (child) {
		child.checkSize();
	}));
}, getRegistry:function (url) {
	djd43.io.bind({url:url, load:djd43.lang.hitch(this, this.processRegistry), mimetype:"text/json"});
}, processRegistry:function (type, registry, e) {
	djd43.debug("Processing Registry");
	this.registry = registry;
	djd43.lang.forEach(this.registry.navigation, djd43.lang.hitch(this, this.addCategory));
}, addCategory:function (category) {
	var newCat = djd43.widget.createWidget("Button", {caption:category.name});
	if (!djd43.lang.isObject(this.registry.categories)) {
		this.registry.categories = function () {
		};
	}
	this.registry.categories[category.name] = category;
	this.categoriesChildren.push(newCat);
	this.categoriesButtonsNode.appendChild(newCat.domNode);
	newCat.domNode.categoryName = category.name;
	djd43.event.connect(newCat, "onClick", this, "onSelectCategory");
}, addDemo:function (demoName) {
	var demo = this.registry.definitions[demoName];
	if (djd43.render.html.ie) {
		djd43.html.show(this.demoListWrapperNode);
	} else {
		djd43.lfx.html.fadeShow(this.demoListWrapperNode, 250).play();
	}
	var newDemo = djd43.widget.createWidget("DemoItem", {viewDemoImage:this.viewDemoImage, name:demoName, description:demo.description, thumbnail:demo.thumbnail});
	this.demoListChildren.push(newDemo);
	this.demoListContainerNode.appendChild(newDemo.domNode);
	djd43.event.connect(newDemo, "onSelectDemo", this, "onSelectDemo");
}, onSelectCategory:function (e) {
	catName = e.currentTarget.categoryName;
	djd43.debug("Selected Category: " + catName);
	djd43.lang.forEach(this.demoListChildren, function (child) {
		child.destroy();
	});
	this.demoListChildren = [];
	djd43.lang.forEach(this.registry.categories[catName].demos, djd43.lang.hitch(this, function (demoName) {
		this.addDemo(demoName);
	}));
}, onSelectDemo:function (e) {
	djd43.debug("Demo Selected: " + e.target.name);
	if (djd43.render.html.ie) {
		djd43.debug("render ie");
		djd43.html.hide(this.navigationContainer);
		this.demoContainer.show();
		this.demoContainer.showDemo();
	} else {
		djd43.debug("render non-ie");
		djd43.lfx.html.fadeHide(this.navigationContainer, 250, null, djd43.lang.hitch(this, function () {
			this.demoContainer.show();
			this.demoContainer.showDemo();
		})).play();
	}
	this.demoContainer.loadDemo(this.registry.definitions[e.target.name].url);
	this.demoContainer.setName(e.target.name);
	this.demoContainer.setSummary(this.registry.definitions[e.target.name].description);
}}, "", function () {
	this.demoRegistryUrl = "demoRegistry.json";
	this.registry = function () {
	};
	this.categoriesNode = "";
	this.categoriesButtonsNode = "";
	this.navigationContainer = "";
	this.domNodeClass = "demoNavigator";
	this.demoNode = "";
	this.demoContainer = "";
	this.demoListWrapperNode = "";
	this.demoListWrapperClass = "demoNavigatorListWrapper";
	this.demoListContainerClass = "demoNavigatorListContainer";
	this.returnImage = "images/dojoDemos.gif";
	this.viewDemoImage = "images/viewDemo.png";
	this.demoListChildren = [];
	this.categoriesChildren = [];
});

