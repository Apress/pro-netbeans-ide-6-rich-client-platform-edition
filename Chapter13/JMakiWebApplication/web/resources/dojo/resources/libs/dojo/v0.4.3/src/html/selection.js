/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.require("djd43.html.common");
djd43.provide("djd43.html.selection");
djd43.require("djd43.dom");
djd43.require("djd43.lang.common");
djd43.html.selectionType = {NONE:0, TEXT:1, CONTROL:2};
djd43.html.clearSelection = function () {
	var _window = djd43.global();
	var _document = djd43.doc();
	try {
		if (_window["getSelection"]) {
			if (djd43.render.html.safari) {
				_window.getSelection().collapse();
			} else {
				_window.getSelection().removeAllRanges();
			}
		} else {
			if (_document.selection) {
				if (_document.selection.empty) {
					_document.selection.empty();
				} else {
					if (_document.selection.clear) {
						_document.selection.clear();
					}
				}
			}
		}
		return true;
	}
	catch (e) {
		djd43.debug(e);
		return false;
	}
};
djd43.html.disableSelection = function (element) {
	element = djd43.byId(element) || djd43.body();
	var h = djd43.render.html;
	if (h.mozilla) {
		element.style.MozUserSelect = "none";
	} else {
		if (h.safari) {
			element.style.KhtmlUserSelect = "none";
		} else {
			if (h.ie) {
				element.unselectable = "on";
			} else {
				return false;
			}
		}
	}
	return true;
};
djd43.html.enableSelection = function (element) {
	element = djd43.byId(element) || djd43.body();
	var h = djd43.render.html;
	if (h.mozilla) {
		element.style.MozUserSelect = "";
	} else {
		if (h.safari) {
			element.style.KhtmlUserSelect = "";
		} else {
			if (h.ie) {
				element.unselectable = "off";
			} else {
				return false;
			}
		}
	}
	return true;
};
djd43.html.selectElement = function (element) {
	djd43.deprecated("djd43.html.selectElement", "replaced by djd43.html.selection.selectElementChildren", 0.5);
};
djd43.html.selectInputText = function (element) {
	var _window = djd43.global();
	var _document = djd43.doc();
	element = djd43.byId(element);
	if (_document["selection"] && djd43.body()["createTextRange"]) {
		var range = element.createTextRange();
		range.moveStart("character", 0);
		range.moveEnd("character", element.value.length);
		range.select();
	} else {
		if (_window["getSelection"]) {
			var selection = _window.getSelection();
			element.setSelectionRange(0, element.value.length);
		}
	}
	element.focus();
};
djd43.html.isSelectionCollapsed = function () {
	djd43.deprecated("djd43.html.isSelectionCollapsed", "replaced by djd43.html.selection.isCollapsed", 0.5);
	return djd43.html.selection.isCollapsed();
};
djd43.lang.mixin(djd43.html.selection, {getType:function () {
	if (djd43.doc()["selection"]) {
		return djd43.html.selectionType[djd43.doc().selection.type.toUpperCase()];
	} else {
		var stype = djd43.html.selectionType.TEXT;
		var oSel;
		try {
			oSel = djd43.global().getSelection();
		}
		catch (e) {
		}
		if (oSel && oSel.rangeCount == 1) {
			var oRange = oSel.getRangeAt(0);
			if (oRange.startContainer == oRange.endContainer && (oRange.endOffset - oRange.startOffset) == 1 && oRange.startContainer.nodeType != djd43.dom.TEXT_NODE) {
				stype = djd43.html.selectionType.CONTROL;
			}
		}
		return stype;
	}
}, isCollapsed:function () {
	var _window = djd43.global();
	var _document = djd43.doc();
	if (_document["selection"]) {
		return _document.selection.createRange().text == "";
	} else {
		if (_window["getSelection"]) {
			var selection = _window.getSelection();
			if (djd43.lang.isString(selection)) {
				return selection == "";
			} else {
				return selection.isCollapsed || selection.toString() == "";
			}
		}
	}
}, getSelectedElement:function () {
	if (djd43.html.selection.getType() == djd43.html.selectionType.CONTROL) {
		if (djd43.doc()["selection"]) {
			var range = djd43.doc().selection.createRange();
			if (range && range.item) {
				return djd43.doc().selection.createRange().item(0);
			}
		} else {
			var selection = djd43.global().getSelection();
			return selection.anchorNode.childNodes[selection.anchorOffset];
		}
	}
}, getParentElement:function () {
	if (djd43.html.selection.getType() == djd43.html.selectionType.CONTROL) {
		var p = djd43.html.selection.getSelectedElement();
		if (p) {
			return p.parentNode;
		}
	} else {
		if (djd43.doc()["selection"]) {
			return djd43.doc().selection.createRange().parentElement();
		} else {
			var selection = djd43.global().getSelection();
			if (selection) {
				var node = selection.anchorNode;
				while (node && node.nodeType != djd43.dom.ELEMENT_NODE) {
					node = node.parentNode;
				}
				return node;
			}
		}
	}
}, getSelectedText:function () {
	if (djd43.doc()["selection"]) {
		if (djd43.html.selection.getType() == djd43.html.selectionType.CONTROL) {
			return null;
		}
		return djd43.doc().selection.createRange().text;
	} else {
		var selection = djd43.global().getSelection();
		if (selection) {
			return selection.toString();
		}
	}
}, getSelectedHtml:function () {
	if (djd43.doc()["selection"]) {
		if (djd43.html.selection.getType() == djd43.html.selectionType.CONTROL) {
			return null;
		}
		return djd43.doc().selection.createRange().htmlText;
	} else {
		var selection = djd43.global().getSelection();
		if (selection && selection.rangeCount) {
			var frag = selection.getRangeAt(0).cloneContents();
			var div = document.createElement("div");
			div.appendChild(frag);
			return div.innerHTML;
		}
		return null;
	}
}, hasAncestorElement:function (tagName) {
	return (djd43.html.selection.getAncestorElement.apply(this, arguments) != null);
}, getAncestorElement:function (tagName) {
	var node = djd43.html.selection.getSelectedElement() || djd43.html.selection.getParentElement();
	while (node) {
		if (djd43.html.selection.isTag(node, arguments).length > 0) {
			return node;
		}
		node = node.parentNode;
	}
	return null;
}, isTag:function (node, tags) {
	if (node && node.tagName) {
		for (var i = 0; i < tags.length; i++) {
			if (node.tagName.toLowerCase() == String(tags[i]).toLowerCase()) {
				return String(tags[i]).toLowerCase();
			}
		}
	}
	return "";
}, selectElement:function (element) {
	var _window = djd43.global();
	var _document = djd43.doc();
	element = djd43.byId(element);
	if (_document.selection && djd43.body().createTextRange) {
		try {
			var range = djd43.body().createControlRange();
			range.addElement(element);
			range.select();
		}
		catch (e) {
			djd43.html.selection.selectElementChildren(element);
		}
	} else {
		if (_window["getSelection"]) {
			var selection = _window.getSelection();
			if (selection["removeAllRanges"]) {
				var range = _document.createRange();
				range.selectNode(element);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		}
	}
}, selectElementChildren:function (element) {
	var _window = djd43.global();
	var _document = djd43.doc();
	element = djd43.byId(element);
	if (_document.selection && djd43.body().createTextRange) {
		var range = djd43.body().createTextRange();
		range.moveToElementText(element);
		range.select();
	} else {
		if (_window["getSelection"]) {
			var selection = _window.getSelection();
			if (selection["setBaseAndExtent"]) {
				selection.setBaseAndExtent(element, 0, element, element.innerText.length - 1);
			} else {
				if (selection["selectAllChildren"]) {
					selection.selectAllChildren(element);
				}
			}
		}
	}
}, getBookmark:function () {
	var bookmark;
	var _document = djd43.doc();
	if (_document["selection"]) {
		var range = _document.selection.createRange();
		bookmark = range.getBookmark();
	} else {
		var selection;
		try {
			selection = djd43.global().getSelection();
		}
		catch (e) {
		}
		if (selection) {
			var range = selection.getRangeAt(0);
			bookmark = range.cloneRange();
		} else {
			djd43.debug("No idea how to store the current selection for this browser!");
		}
	}
	return bookmark;
}, moveToBookmark:function (bookmark) {
	var _document = djd43.doc();
	if (_document["selection"]) {
		var range = _document.selection.createRange();
		range.moveToBookmark(bookmark);
		range.select();
	} else {
		var selection;
		try {
			selection = djd43.global().getSelection();
		}
		catch (e) {
		}
		if (selection && selection["removeAllRanges"]) {
			selection.removeAllRanges();
			selection.addRange(bookmark);
		} else {
			djd43.debug("No idea how to restore selection for this browser!");
		}
	}
}, collapse:function (beginning) {
	if (djd43.global()["getSelection"]) {
		var selection = djd43.global().getSelection();
		if (selection.removeAllRanges) {
			if (beginning) {
				selection.collapseToStart();
			} else {
				selection.collapseToEnd();
			}
		} else {
			djd43.global().getSelection().collapse(beginning);
		}
	} else {
		if (djd43.doc().selection) {
			var range = djd43.doc().selection.createRange();
			range.collapse(beginning);
			range.select();
		}
	}
}, remove:function () {
	if (djd43.doc().selection) {
		var selection = djd43.doc().selection;
		if (selection.type.toUpperCase() != "NONE") {
			selection.clear();
		}
		return selection;
	} else {
		var selection = djd43.global().getSelection();
		for (var i = 0; i < selection.rangeCount; i++) {
			selection.getRangeAt(i).deleteContents();
		}
		return selection;
	}
}});

