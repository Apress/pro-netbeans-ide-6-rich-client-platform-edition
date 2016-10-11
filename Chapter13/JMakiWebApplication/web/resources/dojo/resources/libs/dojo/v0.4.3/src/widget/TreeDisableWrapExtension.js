/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.TreeDisableWrapExtension");
djd43.require("djd43.widget.HtmlWidget");
djd43.require("djd43.widget.TreeExtension");
djd43.widget.defineWidget("djd43.widget.TreeDisableWrapExtension", djd43.widget.TreeExtension, {templateCssString:"\n/* CSS for TreeDisableWrapExtension */\n\n.TreeDisableWrap {\n\twhite-space: nowrap;\n}\n.TreeIEDisableWrap {\n\twidth: expression( 5 + firstChild.offsetWidth );\n}\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "templates/TreeDisableWrap.css"), listenTree:function (tree) {
	var wrappingDiv = document.createElement("div");
	var clazz = tree.classPrefix + "DisableWrap";
	if (djd43.render.html.ie) {
		clazz = clazz + " " + tree.classPrefix + "IEDisableWrap";
	}
	djd43.html.setClass(wrappingDiv, clazz);
	var table = document.createElement("table");
	wrappingDiv.appendChild(table);
	var tbody = document.createElement("tbody");
	table.appendChild(tbody);
	var tr = document.createElement("tr");
	tbody.appendChild(tr);
	var td = document.createElement("td");
	tr.appendChild(td);
	if (tree.domNode.parentNode) {
		tree.domNode.parentNode.replaceChild(wrappingDiv, tree.domNode);
	}
	td.appendChild(tree.domNode);
	tree.domNode = wrappingDiv;
}});

