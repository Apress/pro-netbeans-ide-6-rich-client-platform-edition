/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.DropdownDatePicker");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.DropdownContainer");
djd43.require("djd43.widget.DatePicker");
djd43.require("djd43.event.*");
djd43.require("djd43.html.*");
djd43.require("djd43.date.format");
djd43.require("djd43.date.serialize");
djd43.require("djd43.string.common");
djd43.require("djd43.i18n.common");
djd43.requireLocalization("djd43.widget", "DropdownDatePicker", null, "ROOT");
djd43.widget.defineWidget("djd43.widget.DropdownDatePicker", djd43.widget.DropdownContainer, {iconURL:djd43.uri.moduleUri("djd43.widget", "templates/images/dateIcon.gif"), formatLength:"short", displayFormat:"", saveFormat:"", value:"", name:"", displayWeeks:6, adjustWeeks:false, startDate:"1492-10-12", endDate:"2941-10-12", weekStartsOn:"", staticDisplay:false, postMixInProperties:function (localProperties, frag) {
	djd43.widget.DropdownDatePicker.superclass.postMixInProperties.apply(this, arguments);
	var messages = djd43.i18n.getLocalization("djd43.widget", "DropdownDatePicker", this.lang);
	this.iconAlt = messages.selectDate;
	if (typeof (this.value) == "string" && this.value.toLowerCase() == "today") {
		this.value = new Date();
	}
	if (this.value && isNaN(this.value)) {
		var orig = this.value;
		this.value = djd43.date.fromRfc3339(this.value);
		if (!this.value) {
			this.value = new Date(orig);
			djd43.deprecated("djd43.widget.DropdownDatePicker", "date attributes must be passed in Rfc3339 format", "0.5");
		}
	}
	if (this.value && !isNaN(this.value)) {
		this.value = new Date(this.value);
	}
}, fillInTemplate:function (args, frag) {
	djd43.widget.DropdownDatePicker.superclass.fillInTemplate.call(this, args, frag);
	var dpArgs = {widgetContainerId:this.widgetId, lang:this.lang, value:this.value, startDate:this.startDate, endDate:this.endDate, displayWeeks:this.displayWeeks, weekStartsOn:this.weekStartsOn, adjustWeeks:this.adjustWeeks, staticDisplay:this.staticDisplay};
	this.datePicker = djd43.widget.createWidget("DatePicker", dpArgs, this.containerNode, "child");
	djd43.event.connect(this.datePicker, "onValueChanged", this, "_updateText");
	djd43.event.connect(this.inputNode, "onChange", this, "_updateText");
	if (this.value) {
		this._updateText();
	}
	this.containerNode.explodeClassName = "calendarBodyContainer";
	this.valueNode.name = this.name;
}, getValue:function () {
	return this.valueNode.value;
}, getDate:function () {
	return this.datePicker.value;
}, setValue:function (rfcDate) {
	this.setDate(rfcDate);
}, setDate:function (dateObj) {
	this.datePicker.setDate(dateObj);
	this._syncValueNode();
}, _updateText:function () {
	this.inputNode.value = this.datePicker.value ? djd43.date.format(this.datePicker.value, {formatLength:this.formatLength, datePattern:this.displayFormat, selector:"dateOnly", locale:this.lang}) : "";
	if (this.value < this.datePicker.startDate || this.value > this.datePicker.endDate) {
		this.inputNode.value = "";
	}
	this._syncValueNode();
	this.onValueChanged(this.getDate());
	this.hideContainer();
}, onValueChanged:function (dateObj) {
}, onInputChange:function () {
	var input = djd43.string.trim(this.inputNode.value);
	if (input) {
		var inputDate = djd43.date.parse(input, {formatLength:this.formatLength, datePattern:this.displayFormat, selector:"dateOnly", locale:this.lang});
		if (!this.datePicker._isDisabledDate(inputDate)) {
			this.setDate(inputDate);
		}
	} else {
		if (input == "") {
			this.datePicker.setDate("");
		}
		this.valueNode.value = input;
	}
	if (input) {
		this._updateText();
	}
}, _syncValueNode:function () {
	var date = this.datePicker.value;
	var value = "";
	switch (this.saveFormat.toLowerCase()) {
	  case "rfc":
	  case "iso":
	  case "":
		value = djd43.date.toRfc3339(date, "dateOnly");
		break;
	  case "posix":
	  case "unix":
		value = Number(date);
		break;
	  default:
		if (date) {
			value = djd43.date.format(date, {datePattern:this.saveFormat, selector:"dateOnly", locale:this.lang});
		}
	}
	this.valueNode.value = value;
}, destroy:function (finalize) {
	this.datePicker.destroy(finalize);
	djd43.widget.DropdownDatePicker.superclass.destroy.apply(this, arguments);
}});

