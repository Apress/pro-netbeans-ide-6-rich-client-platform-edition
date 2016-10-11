/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Repeater");
djd43.require("djd43.widget.HtmlWidget");
djd43.require("djd43.string");
djd43.require("djd43.event.*");
djd43.require("djd43.experimental");
djd43.experimental("djd43.widget.Repeater");
djd43.widget.defineWidget("djd43.widget.Repeater", djd43.widget.HtmlWidget, {name:"", rowTemplate:"", myObject:null, pattern:"", useDnd:false, isContainer:true, initialize:function (args, frag) {
	var node = this.getFragNodeRef(frag);
	node.removeAttribute("dojotype");
	this.setRow(djd43.string.trim(node.innerHTML), {});
	node.innerHTML = "";
	frag = null;
}, postCreate:function (args, frag) {
	if (this.useDnd) {
		djd43.require("djd43.dnd.*");
		var dnd = new djd43.dnd.HtmlDropTarget(this.domNode, [this.widgetId]);
	}
}, _reIndexRows:function () {
	for (var i = 0, len = this.domNode.childNodes.length; i < len; i++) {
		var elems = ["INPUT", "SELECT", "TEXTAREA"];
		for (var k = 0; k < elems.length; k++) {
			var list = this.domNode.childNodes[i].getElementsByTagName(elems[k]);
			for (var j = 0, len2 = list.length; j < len2; j++) {
				var name = list[j].name;
				var index = djd43.string.escape("regexp", this.pattern);
				index = index.replace(/(%\\\{index\\\})/g, "%{index}");
				var nameRegexp = djd43.string.substituteParams(index, {"index":"[0-9]*"});
				var newName = djd43.string.substituteParams(this.pattern, {"index":"" + i});
				var re = new RegExp(nameRegexp, "g");
				list[j].name = name.replace(re, newName);
			}
		}
	}
}, onDeleteRow:function (e) {
	var index = djd43.string.escape("regexp", this.pattern);
	index = index.replace(/%\\\{index\\\}/g, "%{index}");
	var nameRegexp = djd43.string.substituteParams(index, {"index":"([0-9]*)"});
	var re = new RegExp(nameRegexp, "g");
	this.deleteRow(re.exec(e.target.name)[1]);
}, hasRows:function () {
	if (this.domNode.childNodes.length > 0) {
		return true;
	}
	return false;
}, getRowCount:function () {
	return this.domNode.childNodes.length;
}, deleteRow:function (idx) {
	this.domNode.removeChild(this.domNode.childNodes[idx]);
	this._reIndexRows();
}, _changeRowPosition:function (e) {
	if (e.dragStatus == "dropFailure") {
		this.domNode.removeChild(e["dragSource"].domNode);
	} else {
		if (e.dragStatus == "dropSuccess") {
		}
	}
	this._reIndexRows();
}, setRow:function (template, myObject) {
	template = template.replace(/\%\{(index)\}/g, "0");
	this.rowTemplate = template;
	this.myObject = myObject;
}, getRow:function () {
	return this.rowTemplate;
}, _initRow:function (node) {
	if (typeof (node) == "number") {
		node = this.domNode.childNodes[node];
	}
	var elems = ["INPUT", "SELECT", "IMG"];
	for (var k = 0; k < elems.length; k++) {
		var list = node.getElementsByTagName(elems[k]);
		for (var i = 0, len = list.length; i < len; i++) {
			var child = list[i];
			if (child.nodeType != 1) {
				continue;
			}
			if (child.getAttribute("rowFunction") != null) {
				if (typeof (this.myObject[child.getAttribute("rowFunction")]) == "undefined") {
					djd43.debug("Function " + child.getAttribute("rowFunction") + " not found");
				} else {
					this.myObject[child.getAttribute("rowFunction")](child);
				}
			} else {
				if (child.getAttribute("rowAction") != null) {
					if (child.getAttribute("rowAction") == "delete") {
						child.name = djd43.string.substituteParams(this.pattern, {"index":"" + (this.getRowCount() - 1)});
						djd43.event.connect(child, "onclick", this, "onDeleteRow");
					}
				}
			}
		}
	}
}, onAddRow:function (e) {
}, addRow:function (doInit) {
	if (typeof (doInit) == "undefined") {
		doInit = true;
	}
	var node = document.createElement("span");
	node.innerHTML = this.getRow();
	if (node.childNodes.length == 1) {
		node = node.childNodes[0];
	}
	this.domNode.appendChild(node);
	var parser = new djd43.xml.Parse();
	var frag = parser.parseElement(node, null, true);
	djd43.widget.getParser().createSubComponents(frag, this);
	this._reIndexRows();
	if (doInit) {
		this._initRow(node);
	}
	if (this.useDnd) {
		node = new djd43.dnd.HtmlDragSource(node, this.widgetId);
		djd43.event.connect(node, "onDragEnd", this, "_changeRowPosition");
	}
	this.onAddRow(node);
}});

