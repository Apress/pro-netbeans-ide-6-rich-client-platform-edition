/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.ResizableTextarea");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.LayoutContainer");
djd43.require("djd43.widget.ResizeHandle");
djd43.widget.defineWidget("djd43.widget.ResizableTextarea", djd43.widget.HtmlWidget, {templateString:"<div>\n\t<div style=\"border: 2px solid black; width: 90%; height: 200px;\"\n\t\tdojoAttachPoint=\"rootLayoutNode\">\n\t\t<div dojoAttachPoint=\"textAreaContainerNode\" \n\t\t\tstyle=\"border: 0px; margin: 0px; overflow: hidden;\">\n\t\t</div>\n\t\t<div dojoAttachPoint=\"statusBarContainerNode\" class=\"statusBar\">\n\t\t\t<div dojoAttachPoint=\"statusLabelNode\" \n\t\t\t\tclass=\"statusPanel\"\n\t\t\t\tstyle=\"padding-right: 0px; z-index: 1;\">drag to resize</div>\n\t\t\t<div dojoAttachPoint=\"resizeHandleNode\"></div>\n\t\t</div>\n\t</div>\n</div>\n", templateCssString:"div.statusBar {\n\tbackground-color: ThreeDFace;\n\theight: 28px;\n\tpadding: 1px;\n\toverflow: hidden;\n\tfont-size: 12px;\n}\n\ndiv.statusPanel {\n\tbackground-color: ThreeDFace;\n\tborder: 1px solid;\n\tborder-color: ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow;\n\tmargin: 1px;\n\tpadding: 2px 6px;\n}\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "templates/ResizableTextarea.css"), fillInTemplate:function (args, frag) {
	this.textAreaNode = this.getFragNodeRef(frag).cloneNode(true);
	djd43.body().appendChild(this.domNode);
	this.rootLayout = djd43.widget.createWidget("LayoutContainer", {minHeight:50, minWidth:100}, this.rootLayoutNode);
	this.textAreaContainer = djd43.widget.createWidget("LayoutContainer", {layoutAlign:"client"}, this.textAreaContainerNode);
	this.rootLayout.addChild(this.textAreaContainer);
	this.textAreaContainer.domNode.appendChild(this.textAreaNode);
	with (this.textAreaNode.style) {
		width = "100%";
		height = "100%";
	}
	this.statusBar = djd43.widget.createWidget("LayoutContainer", {layoutAlign:"bottom", minHeight:28}, this.statusBarContainerNode);
	this.rootLayout.addChild(this.statusBar);
	this.statusLabel = djd43.widget.createWidget("LayoutContainer", {layoutAlign:"client", minWidth:50}, this.statusLabelNode);
	this.statusBar.addChild(this.statusLabel);
	this.resizeHandle = djd43.widget.createWidget("ResizeHandle", {targetElmId:this.rootLayout.widgetId}, this.resizeHandleNode);
	this.statusBar.addChild(this.resizeHandle);
}});

