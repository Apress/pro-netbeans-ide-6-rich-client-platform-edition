/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.Select");
djd43.require("djd43.widget.ComboBox");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.html.stabile");
djd43.widget.defineWidget("djd43.widget.Select", djd43.widget.ComboBox, {forceValidOption:true, setValue:function (value) {
	this.comboBoxValue.value = value;
	djd43.widget.html.stabile.setState(this.widgetId, this.getState(), true);
	this.onValueChanged(value);
}, setLabel:function (value) {
	this.comboBoxSelectionValue.value = value;
	if (this.textInputNode.value != value) {
		this.textInputNode.value = value;
	}
}, getLabel:function () {
	return this.comboBoxSelectionValue.value;
}, getState:function () {
	return {value:this.getValue(), label:this.getLabel()};
}, onKeyUp:function (evt) {
	this.setLabel(this.textInputNode.value);
}, setState:function (state) {
	this.setValue(state.value);
	this.setLabel(state.label);
}, setAllValues:function (value1, value2) {
	this.setLabel(value1);
	this.setValue(value2);
}});

