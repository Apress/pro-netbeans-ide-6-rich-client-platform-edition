/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.AccordionContainer");
djd43.require("djd43.widget.*");
djd43.require("djd43.html.*");
djd43.require("djd43.lfx.html");
djd43.require("djd43.html.selection");
djd43.require("djd43.widget.html.layout");
djd43.require("djd43.widget.PageContainer");
djd43.widget.defineWidget("djd43.widget.AccordionContainer", djd43.widget.HtmlWidget, {isContainer:true, labelNodeClass:"label", containerNodeClass:"accBody", duration:250, fillInTemplate:function () {
	with (this.domNode.style) {
		if (position != "absolute") {
			position = "relative";
		}
		overflow = "hidden";
	}
}, addChild:function (widget) {
	var child = this._addChild(widget);
	this._setSizes();
	return child;
}, _addChild:function (widget) {
	if (widget.open) {
		djd43.deprecated("open parameter deprecated, use 'selected=true' instead will be removed in ", "0.5");
		djd43.debug(widget.widgetId + ": open == " + widget.open);
		widget.selected = true;
	}
	if (widget.widgetType != "AccordionPane") {
		var wrapper = djd43.widget.createWidget("AccordionPane", {label:widget.label, selected:widget.selected, labelNodeClass:this.labelNodeClass, containerNodeClass:this.containerNodeClass, allowCollapse:this.allowCollapse});
		wrapper.addChild(widget);
		this.addWidgetAsDirectChild(wrapper);
		this.registerChild(wrapper, this.children.length);
		return wrapper;
	} else {
		djd43.html.addClass(widget.containerNode, this.containerNodeClass);
		djd43.html.addClass(widget.labelNode, this.labelNodeClass);
		this.addWidgetAsDirectChild(widget);
		this.registerChild(widget, this.children.length);
		return widget;
	}
}, postCreate:function () {
	var tmpChildren = this.children;
	this.children = [];
	djd43.html.removeChildren(this.domNode);
	djd43.lang.forEach(tmpChildren, djd43.lang.hitch(this, "_addChild"));
	this._setSizes();
}, removeChild:function (widget) {
	djd43.widget.AccordionContainer.superclass.removeChild.call(this, widget);
	this._setSizes();
}, onResized:function () {
	this._setSizes();
}, _setSizes:function () {
	var totalCollapsedHeight = 0;
	var openIdx = 0;
	djd43.lang.forEach(this.children, function (child, idx) {
		totalCollapsedHeight += child.getLabelHeight();
		if (child.selected) {
			openIdx = idx;
		}
	});
	var mySize = djd43.html.getContentBox(this.domNode);
	var y = 0;
	djd43.lang.forEach(this.children, function (child, idx) {
		var childCollapsedHeight = child.getLabelHeight();
		child.resizeTo(mySize.width, mySize.height - totalCollapsedHeight + childCollapsedHeight);
		child.domNode.style.zIndex = idx + 1;
		child.domNode.style.position = "absolute";
		child.domNode.style.top = y + "px";
		y += (idx == openIdx) ? djd43.html.getBorderBox(child.domNode).height : childCollapsedHeight;
	});
}, selectChild:function (page) {
	djd43.lang.forEach(this.children, function (child) {
		child.setSelected(child == page);
	});
	var y = 0;
	var anims = [];
	djd43.lang.forEach(this.children, function (child, idx) {
		if (child.domNode.style.top != (y + "px")) {
			anims.push(djd43.lfx.html.slideTo(child.domNode, {top:y, left:0}, this.duration));
		}
		y += child.selected ? djd43.html.getBorderBox(child.domNode).height : child.getLabelHeight();
	}, this);
	djd43.lfx.combine(anims).play();
}});
djd43.widget.defineWidget("djd43.widget.AccordionPane", djd43.widget.HtmlWidget, {label:"", "class":"dojoAccordionPane", labelNodeClass:"label", containerNodeClass:"accBody", selected:false, templateString:"<div dojoAttachPoint=\"domNode\">\n<div dojoAttachPoint=\"labelNode\" dojoAttachEvent=\"onclick: onLabelClick\" class=\"${this.labelNodeClass}\">${this.label}</div>\n<div dojoAttachPoint=\"containerNode\" style=\"overflow: hidden;\" class=\"${this.containerNodeClass}\"></div>\n</div>\n", templateCssString:".dojoAccordionPane .label {\n\tcolor: #000;\n\tfont-weight: bold;\n\tbackground: url(\"images/soriaAccordionOff.gif\") repeat-x top left #85aeec;\n\tborder:1px solid #d9d9d9;\n\tfont-size:0.9em;\n}\n\n.dojoAccordionPane-selected .label {\n\tbackground: url(\"images/soriaAccordionSelected.gif\") repeat-x top left #85aeec;\n\tborder:1px solid #84a3d1;\n}\n\n.dojoAccordionPane .label:hover {\n\tcursor: pointer;\n}\n\n.dojoAccordionPane .accBody {\n\tbackground: #fff;\n\toverflow: auto;\n\tborder:1px solid #84a3d1;\n}\n", templateCssPath:djd43.uri.moduleUri("djd43.widget", "templates/AccordionPane.css"), isContainer:true, fillInTemplate:function () {
	djd43.html.addClass(this.domNode, this["class"]);
	djd43.widget.AccordionPane.superclass.fillInTemplate.call(this);
	djd43.html.disableSelection(this.labelNode);
	this.setSelected(this.selected);
}, setLabel:function (label) {
	this.labelNode.innerHTML = label;
}, resizeTo:function (width, height) {
	djd43.html.setMarginBox(this.domNode, {width:width, height:height});
	var children = [{domNode:this.labelNode, layoutAlign:"top"}, {domNode:this.containerNode, layoutAlign:"client"}];
	djd43.widget.html.layout(this.domNode, children);
	var childSize = djd43.html.getContentBox(this.containerNode);
	this.children[0].resizeTo(childSize.width, childSize.height);
}, getLabelHeight:function () {
	return djd43.html.getMarginBox(this.labelNode).height;
}, onLabelClick:function () {
	this.parent.selectChild(this);
}, setSelected:function (isSelected) {
	this.selected = isSelected;
	(isSelected ? djd43.html.addClass : djd43.html.removeClass)(this.domNode, this["class"] + "-selected");
	var child = this.children[0];
	if (child) {
		if (isSelected) {
			if (!child.isShowing()) {
				child.show();
			} else {
				child.onShow();
			}
		} else {
			child.onHide();
		}
	}
}});
djd43.lang.extend(djd43.widget.Widget, {open:false});

