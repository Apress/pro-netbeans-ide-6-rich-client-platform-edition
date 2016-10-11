/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.date.serialize");
djd43.require("djd43.string.common");
djd43.date.setIso8601 = function (dateObject, formattedString) {
	var comps = (formattedString.indexOf("T") == -1) ? formattedString.split(" ") : formattedString.split("T");
	dateObject = djd43.date.setIso8601Date(dateObject, comps[0]);
	if (comps.length == 2) {
		dateObject = djd43.date.setIso8601Time(dateObject, comps[1]);
	}
	return dateObject;
};
djd43.date.fromIso8601 = function (formattedString) {
	return djd43.date.setIso8601(new Date(0, 0), formattedString);
};
djd43.date.setIso8601Date = function (dateObject, formattedString) {
	var regexp = "^([0-9]{4})((-?([0-9]{2})(-?([0-9]{2}))?)|" + "(-?([0-9]{3}))|(-?W([0-9]{2})(-?([1-7]))?))?$";
	var d = formattedString.match(new RegExp(regexp));
	if (!d) {
		djd43.debug("invalid date string: " + formattedString);
		return null;
	}
	var year = d[1];
	var month = d[4];
	var date = d[6];
	var dayofyear = d[8];
	var week = d[10];
	var dayofweek = d[12] ? d[12] : 1;
	dateObject.setFullYear(year);
	if (dayofyear) {
		dateObject.setMonth(0);
		dateObject.setDate(Number(dayofyear));
	} else {
		if (week) {
			dateObject.setMonth(0);
			dateObject.setDate(1);
			var gd = dateObject.getDay();
			var day = gd ? gd : 7;
			var offset = Number(dayofweek) + (7 * Number(week));
			if (day <= 4) {
				dateObject.setDate(offset + 1 - day);
			} else {
				dateObject.setDate(offset + 8 - day);
			}
		} else {
			if (month) {
				dateObject.setDate(1);
				dateObject.setMonth(month - 1);
			}
			if (date) {
				dateObject.setDate(date);
			}
		}
	}
	return dateObject;
};
djd43.date.fromIso8601Date = function (formattedString) {
	return djd43.date.setIso8601Date(new Date(0, 0), formattedString);
};
djd43.date.setIso8601Time = function (dateObject, formattedString) {
	var timezone = "Z|(([-+])([0-9]{2})(:?([0-9]{2}))?)$";
	var d = formattedString.match(new RegExp(timezone));
	var offset = 0;
	if (d) {
		if (d[0] != "Z") {
			offset = (Number(d[3]) * 60) + Number(d[5]);
			offset *= ((d[2] == "-") ? 1 : -1);
		}
		offset -= dateObject.getTimezoneOffset();
		formattedString = formattedString.substr(0, formattedString.length - d[0].length);
	}
	var regexp = "^([0-9]{2})(:?([0-9]{2})(:?([0-9]{2})(.([0-9]+))?)?)?$";
	d = formattedString.match(new RegExp(regexp));
	if (!d) {
		djd43.debug("invalid time string: " + formattedString);
		return null;
	}
	var hours = d[1];
	var mins = Number((d[3]) ? d[3] : 0);
	var secs = (d[5]) ? d[5] : 0;
	var ms = d[7] ? (Number("0." + d[7]) * 1000) : 0;
	dateObject.setHours(hours);
	dateObject.setMinutes(mins);
	dateObject.setSeconds(secs);
	dateObject.setMilliseconds(ms);
	if (offset !== 0) {
		dateObject.setTime(dateObject.getTime() + offset * 60000);
	}
	return dateObject;
};
djd43.date.fromIso8601Time = function (formattedString) {
	return djd43.date.setIso8601Time(new Date(0, 0), formattedString);
};
djd43.date.toRfc3339 = function (dateObject, selector) {
	if (!dateObject) {
		dateObject = new Date();
	}
	var _ = djd43.string.pad;
	var formattedDate = [];
	if (selector != "timeOnly") {
		var date = [_(dateObject.getFullYear(), 4), _(dateObject.getMonth() + 1, 2), _(dateObject.getDate(), 2)].join("-");
		formattedDate.push(date);
	}
	if (selector != "dateOnly") {
		var time = [_(dateObject.getHours(), 2), _(dateObject.getMinutes(), 2), _(dateObject.getSeconds(), 2)].join(":");
		var timezoneOffset = dateObject.getTimezoneOffset();
		time += (timezoneOffset > 0 ? "-" : "+") + _(Math.floor(Math.abs(timezoneOffset) / 60), 2) + ":" + _(Math.abs(timezoneOffset) % 60, 2);
		formattedDate.push(time);
	}
	return formattedDate.join("T");
};
djd43.date.fromRfc3339 = function (rfcDate) {
	if (rfcDate.indexOf("Tany") != -1) {
		rfcDate = rfcDate.replace("Tany", "");
	}
	var dateObject = new Date();
	return djd43.date.setIso8601(dateObject, rfcDate);
};

