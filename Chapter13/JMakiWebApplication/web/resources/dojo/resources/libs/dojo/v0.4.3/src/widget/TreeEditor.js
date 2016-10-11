/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.require("djd43.widget.*");
djd43.require("djd43.widget.HtmlWidget");
djd43.require("djd43.widget.RichText");
djd43.provide("djd43.widget.TreeEditor");
djd43.widget.defineWidget("djd43.widget.TreeEditor", djd43.widget.HtmlWidget, {singleLineMode:false, saveOnBlur:true, sync:false, selectOnOpen:true, controller:null, node:null, richTextParams:{styleSheets:"src/widget/templates/TreeEditor.css"}, getContents:function () {
	return this.richText.getEditorContent();
}, open:function (node) {
	if (!this.richText) {
		this.richText = djd43.widget.createWidget("RichText", this.richTextParams, node.labelNode);
		djd43.event.connect("around", this.richText, "onKeyDown", this, "richText_onKeyDown");
		djd43.event.connect(this.richText, "onBlur", this, "richText_onBlur");
		var self = this;
		djd43.event.connect(this.richText, "onLoad", function () {
			if (self.selectOnOpen) {
				self.richText.execCommand("selectall");
			}
		});
	} else {
		this.richText.open(node.labelNode);
	}
	this.node = node;
}, close:function (save) {
	this.richText.close(save);
	this.node = null;
}, isClosed:function () {
	return !this.richText || this.richText.isClosed;
}, execCommand:function () {
	this.richText.execCommand.apply(this.richText, arguments);
}, richText_onKeyDown:function (invocation) {
	var e = invocation.args[0];
	if ((!e) && (this.object)) {
		e = djd43.event.browser.fixEvent(this.editor.window.event);
	}
	switch (e.keyCode) {
	  case e.KEY_ESCAPE:
		this.finish(false);
		djd43.event.browser.stopEvent(e);
		break;
	  case e.KEY_ENTER:
		if (e.ctrlKey && !this.singleLineMode) {
			this.execCommand("inserthtml", "<br/>");
		} else {
			this.finish(true);
		}
		djd43.event.browser.stopEvent(e);
		break;
	  default:
		return invocation.proceed();
	}
}, richText_onBlur:function () {
	this.finish(this.saveOnBlur);
}, finish:function (save) {
	return this.controller.editLabelFinish(save, this.sync);
}});

