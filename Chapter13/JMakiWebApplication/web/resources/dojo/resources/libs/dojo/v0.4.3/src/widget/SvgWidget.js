/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.require("djd43.widget.DomWidget");
djd43.provide("djd43.widget.SvgWidget");
djd43.provide("djd43.widget.SVGWidget");
djd43.require("djd43.dom");
djd43.require("djd43.experimental");
djd43.experimental("djd43.widget.SvgWidget");
djd43.widget.declare("djd43.widget.SvgWidget", djd43.widget.DomWidget, {createNodesFromText:function (txt, wrap) {
	return djd43.svg.createNodesFromText(txt, wrap);
}});
djd43.widget.SVGWidget = djd43.widget.SvgWidget;
try {
	(function () {
		var tf = function () {
			var rw = new function () {
				djd43.widget.SvgWidget.call(this);
				this.buildRendering = function () {
					return;
				};
				this.destroyRendering = function () {
					return;
				};
				this.postInitialize = function () {
					return;
				};
				this.widgetType = "SVGRootWidget";
				this.domNode = document.documentElement;
			};
			var wm = djd43.widget.manager;
			wm.root = rw;
			wm.add(rw);
			wm.getWidgetFromNode = function (node) {
				var filter = function (x) {
					if (x.domNode == node) {
						return true;
					}
				};
				var widgets = [];
				while ((node) && (widgets.length < 1)) {
					widgets = this.getWidgetsByFilter(filter);
					node = node.parentNode;
				}
				if (widgets.length > 0) {
					return widgets[0];
				} else {
					return null;
				}
			};
			wm.getWidgetFromEvent = function (domEvt) {
				return this.getWidgetFromNode(domEvt.target);
			};
			wm.getWidgetFromPrimitive = wm.getWidgetFromNode;
		};
		djd43.event.connect(djd43.hostenv, "loaded", tf);
	})();
}
catch (e) {
	alert(e);
}

