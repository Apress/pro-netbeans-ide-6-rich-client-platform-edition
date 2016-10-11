/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.ShowAction");
djd43.require("djd43.widget.*");
djd43.widget.defineWidget("djd43.widget.ShowAction", djd43.widget.HtmlWidget, {on:"", action:"fade", duration:350, from:"", to:"", auto:"false", postMixInProperties:function () {
	if (djd43.render.html.opera) {
		this.action = this.action.split("/").pop();
	}
}});

