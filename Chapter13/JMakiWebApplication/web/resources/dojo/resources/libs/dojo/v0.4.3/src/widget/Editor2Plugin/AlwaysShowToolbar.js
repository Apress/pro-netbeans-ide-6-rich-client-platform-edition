/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Editor2Plugin.AlwaysShowToolbar");
djd43.event.topic.subscribe("djd43.widget.Editor2::onLoad", function (editor) {
	if (editor.toolbarAlwaysVisible) {
		var p = new djd43.widget.Editor2Plugin.AlwaysShowToolbar(editor);
	}
});
djd43.declare("djd43.widget.Editor2Plugin.AlwaysShowToolbar", null, function (editor) {
	this.editor = editor;
	this.editor.registerLoadedPlugin(this);
	this.setup();
}, {_scrollSetUp:false, _fixEnabled:false, _scrollThreshold:false, _handleScroll:true, setup:function () {
	var tdn = this.editor.toolbarWidget;
	if (!tdn.tbBgIframe) {
		tdn.tbBgIframe = new djd43.html.BackgroundIframe(tdn.domNode);
		tdn.tbBgIframe.onResized();
	}
	this.scrollInterval = setInterval(djd43.lang.hitch(this, "globalOnScrollHandler"), 100);
	djd43.event.connect("before", this.editor.toolbarWidget, "destroy", this, "destroy");
}, globalOnScrollHandler:function () {
	var isIE = djd43.render.html.ie;
	if (!this._handleScroll) {
		return;
	}
	var dh = djd43.html;
	var tdn = this.editor.toolbarWidget.domNode;
	var db = djd43.body();
	if (!this._scrollSetUp) {
		this._scrollSetUp = true;
		var editorWidth = dh.getMarginBox(this.editor.domNode).width;
		this._scrollThreshold = dh.abs(tdn, true).y;
		if ((isIE) && (db) && (dh.getStyle(db, "background-image") == "none")) {
			with (db.style) {
				backgroundImage = "url(" + djd43.uri.moduleUri("djd43.widget", "templates/images/blank.gif") + ")";
				backgroundAttachment = "fixed";
			}
		}
	}
	var scrollPos = (window["pageYOffset"]) ? window["pageYOffset"] : (document["documentElement"] || document["body"]).scrollTop;
	if (scrollPos > this._scrollThreshold) {
		if (!this._fixEnabled) {
			var tdnbox = djd43.html.getMarginBox(tdn);
			this.editor.editorObject.style.marginTop = tdnbox.height + "px";
			if (isIE) {
				tdn.style.left = djd43.html.abs(tdn, djd43.html.boxSizing.MARGIN_BOX).x;
				if (tdn.previousSibling) {
					this._IEOriginalPos = ["after", tdn.previousSibling];
				} else {
					if (tdn.nextSibling) {
						this._IEOriginalPos = ["before", tdn.nextSibling];
					} else {
						this._IEOriginalPos = ["", tdn.parentNode];
					}
				}
				djd43.body().appendChild(tdn);
				djd43.html.addClass(tdn, "IEFixedToolbar");
			} else {
				with (tdn.style) {
					position = "fixed";
					top = "0px";
				}
			}
			tdn.style.width = tdnbox.width + "px";
			tdn.style.zIndex = 1000;
			this._fixEnabled = true;
		}
		if (!djd43.render.html.safari) {
			var eHeight = (this.height) ? parseInt(this.editor.height) : this.editor._lastHeight;
			if (scrollPos > (this._scrollThreshold + eHeight)) {
				tdn.style.display = "none";
			} else {
				tdn.style.display = "";
			}
		}
	} else {
		if (this._fixEnabled) {
			(this.editor.object || this.editor.iframe).style.marginTop = null;
			with (tdn.style) {
				position = "";
				top = "";
				zIndex = "";
				display = "";
			}
			if (isIE) {
				tdn.style.left = "";
				djd43.html.removeClass(tdn, "IEFixedToolbar");
				if (this._IEOriginalPos) {
					djd43.html.insertAtPosition(tdn, this._IEOriginalPos[1], this._IEOriginalPos[0]);
					this._IEOriginalPos = null;
				} else {
					djd43.html.insertBefore(tdn, this.editor.object || this.editor.iframe);
				}
			}
			tdn.style.width = "";
			this._fixEnabled = false;
		}
	}
}, destroy:function () {
	this._IEOriginalPos = null;
	this._handleScroll = false;
	clearInterval(this.scrollInterval);
	this.editor.unregisterLoadedPlugin(this);
	if (djd43.render.html.ie) {
		djd43.html.removeClass(this.editor.toolbarWidget.domNode, "IEFixedToolbar");
	}
}});

