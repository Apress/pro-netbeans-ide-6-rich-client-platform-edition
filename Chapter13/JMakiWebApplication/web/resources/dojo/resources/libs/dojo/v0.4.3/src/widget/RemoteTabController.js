/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.RemoteTabController");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.TabContainer");
djd43.require("djd43.event.*");
djd43.deprecated("djd43.widget.RemoteTabController is slated for removal in 0.5; use PageController or TabController instead.", "0.5");
djd43.widget.defineWidget("djd43.widget.RemoteTabController", djd43.widget.TabController, {templateCssString:".dojoRemoteTabController {\n\tposition: relative;\n}\n\n.dojoRemoteTab {\n\tposition : relative;\n\tfloat : left;\n\tpadding-left : 9px;\n\tborder-bottom : 1px solid #6290d2;\n\tbackground : url(images/tab_left.gif) no-repeat left top;\n\tcursor: pointer;\n\twhite-space: nowrap;\n\tz-index: 3;\n}\n\n.dojoRemoteTab div {\n\tdisplay : block;\n\tpadding : 4px 15px 4px 6px;\n\tbackground : url(images/tab_top_right.gif) no-repeat right top;\n\tcolor : #333;\n\tfont-size : 90%;\n}\n\n.dojoRemoteTabPaneClose {\n\tposition : absolute;\n\tbottom : 0px;\n\tright : 6px;\n\theight : 12px;\n\twidth : 12px;\n\tbackground : url(images/tab_close.gif) no-repeat right top;\n}\n\n.dojoRemoteTabPaneCloseHover {\n\tbackground-image : url(images/tab_close_h.gif);\n}\n\n.dojoRemoteTabClose {\n\tdisplay : inline-block;\n\theight : 12px;\n\twidth : 12px;\n\tpadding : 0 12px 0 0;\n\tmargin : 0 -10px 0 10px;\n\tbackground : url(images/tab_close.gif) no-repeat right top;\n\tcursor : default;\n}\n\n.dojoRemoteTabCloseHover {\n\tbackground-image : url(images/tab_close_h.gif);\n}\n\n.dojoRemoteTab.current {\n\tpadding-bottom : 1px;\n\tborder-bottom : 0;\n\tbackground-position : 0 -150px;\n}\n\n.dojoRemoteTab.current div {\n\tpadding-bottom : 5px;\n\tmargin-bottom : -1px;\n\tbackground-position : 100% -150px;\n}\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "templates/RemoteTabControl.css"), templateString:"<div dojoAttachPoint=\"domNode\" wairole=\"tablist\"></div>", "class":"dojoRemoteTabController", tabContainer:"", postMixInProperties:function () {
	this.containerId = this.tabContainer;
	djd43.widget.RemoteTabController.superclass.postMixInProperties.apply(this, arguments);
}, fillInTemplate:function () {
	djd43.html.addClass(this.domNode, this["class"]);
	if (this.tabContainer) {
		djd43.addOnLoad(djd43.lang.hitch(this, "setupTabs"));
	}
	djd43.widget.RemoteTabController.superclass.fillInTemplate.apply(this, arguments);
}});

