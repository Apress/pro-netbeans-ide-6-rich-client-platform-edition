/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.widget.DropdownTimePicker");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.DropdownContainer");
djd43.require("djd43.widget.TimePicker");
djd43.require("djd43.event.*");
djd43.require("djd43.html.*");
djd43.require("djd43.date.format");
djd43.require("djd43.date.serialize");
djd43.require("djd43.i18n.common");
djd43.requireLocalization("djd43.widget", "DropdownTimePicker", null, "ROOT");
djd43.widget.defineWidget("djd43.widget.DropdownTimePicker", djd43.widget.DropdownContainer, {iconURL:djd43.uri.moduleUri("djd43.widget", "templates/images/timeIcon.gif"), formatLength:"short", displayFormat:"", timeFormat:"", saveFormat:"", value:"", name:"", postMixInProperties:function () {
	djd43.widget.DropdownTimePicker.superclass.postMixInProperties.apply(this, arguments);
	var messages = djd43.i18n.getLocalization("djd43.widget", "DropdownTimePicker", this.lang);
	this.iconAlt = messages.selectTime;
	if (typeof (this.value) == "string" && this.value.toLowerCase() == "today") {
		this.value = new Date();
	}
	if (this.value && isNaN(this.value)) {
		var orig = this.value;
		this.value = djd43.date.fromRfc3339(this.value);
		if (!this.value) {
			var d = djd43.date.format(new Date(), {selector:"dateOnly", datePattern:"yyyy-MM-dd"});
			var c = orig.split(":");
			for (var i = 0; i < c.length; ++i) {
				if (c[i].length == 1) {
					c[i] = "0" + c[i];
				}
			}
			orig = c.join(":");
			this.value = djd43.date.fromRfc3339(d + "T" + orig);
			djd43.deprecated("djd43.widget.DropdownTimePicker", "time attributes must be passed in Rfc3339 format", "0.5");
		}
	}
	if (this.value && !isNaN(this.value)) {
		this.value = new Date(this.value);
	}
}, fillInTemplate:function () {
	djd43.widget.DropdownTimePicker.superclass.fillInTemplate.apply(this, arguments);
	var value = "";
	if (this.value instanceof Date) {
		value = this.value;
	} else {
		if (this.value) {
			var orig = this.value;
			var d = djd43.date.format(new Date(), {selector:"dateOnly", datePattern:"yyyy-MM-dd"});
			var c = orig.split(":");
			for (var i = 0; i < c.length; ++i) {
				if (c[i].length == 1) {
					c[i] = "0" + c[i];
				}
			}
			orig = c.join(":");
			value = djd43.date.fromRfc3339(d + "T" + orig);
		}
	}
	var tpArgs = {widgetContainerId:this.widgetId, lang:this.lang, value:value};
	this.timePicker = djd43.widget.createWidget("TimePicker", tpArgs, this.containerNode, "child");
	djd43.event.connect(this.timePicker, "onValueChanged", this, "_updateText");
	if (this.value) {
		this._updateText();
	}
	this.containerNode.style.zIndex = this.zIndex;
	this.containerNode.explodeClassName = "timeContainer";
	this.valueNode.name = this.name;
}, getValue:function () {
	return this.valueNode.value;
}, getTime:function () {
	return this.timePicker.storedTime;
}, setValue:function (rfcDate) {
	this.setTime(rfcDate);
}, setTime:function (dateObj) {
	var value = "";
	if (dateObj instanceof Date) {
		value = dateObj;
	} else {
		if (this.value) {
			var orig = this.value;
			var d = djd43.date.format(new Date(), {selector:"dateOnly", datePattern:"yyyy-MM-dd"});
			var c = orig.split(":");
			for (var i = 0; i < c.length; ++i) {
				if (c[i].length == 1) {
					c[i] = "0" + c[i];
				}
			}
			orig = c.join(":");
			value = djd43.date.fromRfc3339(d + "T" + orig);
		}
	}
	this.timePicker.setTime(value);
	this._syncValueNode();
}, _updateText:function () {
	if (this.timePicker.selectedTime.anyTime) {
		this.inputNode.value = "";
	} else {
		if (this.timeFormat) {
			djd43.deprecated("djd43.widget.DropdownTimePicker", "Must use displayFormat attribute instead of timeFormat.  See djd43.date.format for specification.", "0.5");
			this.inputNode.value = djd43.date.strftime(this.timePicker.time, this.timeFormat, this.lang);
		} else {
			this.inputNode.value = djd43.date.format(this.timePicker.time, {formatLength:this.formatLength, timePattern:this.displayFormat, selector:"timeOnly", locale:this.lang});
		}
	}
	this._syncValueNode();
	this.onValueChanged(this.getTime());
	this.hideContainer();
}, onValueChanged:function (dateObj) {
}, onInputChange:function () {
	if (this.dateFormat) {
		djd43.deprecated("djd43.widget.DropdownTimePicker", "Cannot parse user input.  Must use displayFormat attribute instead of dateFormat.  See djd43.date.format for specification.", "0.5");
	} else {
		var input = djd43.string.trim(this.inputNode.value);
		if (input) {
			var inputTime = djd43.date.parse(input, {formatLength:this.formatLength, timePattern:this.displayFormat, selector:"timeOnly", locale:this.lang});
			if (inputTime) {
				this.setTime(inputTime);
			}
		} else {
			this.valueNode.value = input;
		}
	}
	if (input) {
		this._updateText();
	}
}, _syncValueNode:function () {
	var time = this.timePicker.time;
	var value;
	switch (this.saveFormat.toLowerCase()) {
	  case "rfc":
	  case "iso":
	  case "":
		value = djd43.date.toRfc3339(time, "timeOnly");
		break;
	  case "posix":
	  case "unix":
		value = Number(time);
		break;
	  default:
		value = djd43.date.format(time, {datePattern:this.saveFormat, selector:"timeOnly", locale:this.lang});
	}
	this.valueNode.value = value;
}, destroy:function (finalize) {
	this.timePicker.destroy(finalize);
	djd43.widget.DropdownTimePicker.superclass.destroy.apply(this, arguments);
}});

