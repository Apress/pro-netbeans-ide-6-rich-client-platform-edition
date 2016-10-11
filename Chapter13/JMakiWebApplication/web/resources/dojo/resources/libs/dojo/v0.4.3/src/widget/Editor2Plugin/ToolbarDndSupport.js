/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Editor2Plugin.ToolbarDndSupport");
djd43.require("djd43.dnd.*");
djd43.event.topic.subscribe("djd43.widget.Editor2::preLoadingToolbar", function (editor) {
	djd43.dnd.dragManager.nestedTargets = true;
	var p = new djd43.widget.Editor2Plugin.ToolbarDndSupport(editor);
});
djd43.declare("djd43.widget.Editor2Plugin.ToolbarDndSupport", null, {lookForClass:"dojoEditorToolbarDnd TB_ToolbarSet TB_Toolbar", initializer:function (editor) {
	this.editor = editor;
	djd43.event.connect(this.editor, "toolbarLoaded", this, "setup");
	this.editor.registerLoadedPlugin(this);
}, setup:function () {
	djd43.event.disconnect(this.editor, "toolbarLoaded", this, "setup");
	var tbw = this.editor.toolbarWidget;
	djd43.event.connect("before", tbw, "destroy", this, "destroy");
	var nodes = djd43.html.getElementsByClass(this.lookForClass, tbw.domNode, null, djd43.html.classMatchType.ContainsAny);
	if (!nodes) {
		djd43.debug("djd43.widget.Editor2Plugin.ToolbarDndSupport: No dom node with class in " + this.lookForClass);
		return;
	}
	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		var droptarget = node.getAttribute("dojoETDropTarget");
		if (droptarget) {
			(new djd43.dnd.HtmlDropTarget(node, [droptarget + tbw.widgetId])).vertical = true;
		}
		var dragsource = node.getAttribute("dojoETDragSource");
		if (dragsource) {
			new djd43.dnd.HtmlDragSource(node, dragsource + tbw.widgetId);
		}
	}
}, destroy:function () {
	this.editor.unregisterLoadedPlugin(this);
}});

