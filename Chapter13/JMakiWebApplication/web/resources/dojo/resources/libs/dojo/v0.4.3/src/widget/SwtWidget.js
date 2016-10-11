/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.SwtWidget");
djd43.require("djd43.experimental");
djd43.experimental("djd43.widget.SwtWidget");
djd43.require("djd43.event.*");
djd43.require("djd43.widget.Widget");
djd43.require("djd43.uri.*");
djd43.require("djd43.lang.func");
djd43.require("djd43.lang.extras");
try {
	importPackage(Packages.org.eclipse.swt.widgets);
	djd43.declare("djd43.widget.SwtWidget", djd43.widget.Widget, function () {
		if ((arguments.length > 0) && (typeof arguments[0] == "object")) {
			this.create(arguments[0]);
		}
	}, {display:null, shell:null, show:function () {
	}, hide:function () {
	}, addChild:function () {
	}, registerChild:function () {
	}, addWidgetAsDirectChild:function () {
	}, removeChild:function () {
	}, destroyRendering:function () {
	}, postInitialize:function () {
	}});
	djd43.widget.SwtWidget.prototype.display = new Display();
	djd43.widget.SwtWidget.prototype.shell = new Shell(djd43.widget.SwtWidget.prototype.display);
	djd43.widget.manager.startShell = function () {
		var sh = djd43.widget.SwtWidget.prototype.shell;
		var d = djd43.widget.SwtWidget.prototype.display;
		sh.open();
		while (!sh.isDisposed()) {
			djd43.widget.manager.doNext();
			if (!d.readAndDispatch()) {
				d.sleep();
			}
		}
		d.dispose();
	};
}
catch (e) {
	djd43.debug("djd43.widget.SwtWidget not loaded. SWT classes not available");
}

