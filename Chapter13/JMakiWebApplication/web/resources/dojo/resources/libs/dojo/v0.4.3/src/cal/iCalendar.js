/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.cal.iCalendar");
djd43.require("djd43.lang.common");
djd43.require("djd43.cal.textDirectory");
djd43.require("djd43.date.common");
djd43.require("djd43.date.serialize");
djd43.cal.iCalendar.fromText = function (text) {
	var properties = djd43.cal.textDirectory.tokenise(text);
	var calendars = [];
	for (var i = 0, begun = false; i < properties.length; i++) {
		var prop = properties[i];
		if (!begun) {
			if (prop.name == "BEGIN" && prop.value == "VCALENDAR") {
				begun = true;
				var calbody = [];
			}
		} else {
			if (prop.name == "END" && prop.value == "VCALENDAR") {
				calendars.push(new djd43.cal.iCalendar.VCalendar(calbody));
				begun = false;
			} else {
				calbody.push(prop);
			}
		}
	}
	return calendars;
};
djd43.cal.iCalendar.Component = function (body) {
	if (!this.name) {
		this.name = "COMPONENT";
	}
	this.properties = [];
	this.components = [];
	if (body) {
		for (var i = 0, context = ""; i < body.length; i++) {
			if (context == "") {
				if (body[i].name == "BEGIN") {
					context = body[i].value;
					var childprops = [];
				} else {
					this.addProperty(new djd43.cal.iCalendar.Property(body[i]));
				}
			} else {
				if (body[i].name == "END" && body[i].value == context) {
					if (context == "VEVENT") {
						this.addComponent(new djd43.cal.iCalendar.VEvent(childprops));
					} else {
						if (context == "VTIMEZONE") {
							this.addComponent(new djd43.cal.iCalendar.VTimeZone(childprops));
						} else {
							if (context == "VTODO") {
								this.addComponent(new djd43.cal.iCalendar.VTodo(childprops));
							} else {
								if (context == "VJOURNAL") {
									this.addComponent(new djd43.cal.iCalendar.VJournal(childprops));
								} else {
									if (context == "VFREEBUSY") {
										this.addComponent(new djd43.cal.iCalendar.VFreeBusy(childprops));
									} else {
										if (context == "STANDARD") {
											this.addComponent(new djd43.cal.iCalendar.Standard(childprops));
										} else {
											if (context == "DAYLIGHT") {
												this.addComponent(new djd43.cal.iCalendar.Daylight(childprops));
											} else {
												if (context == "VALARM") {
													this.addComponent(new djd43.cal.iCalendar.VAlarm(childprops));
												} else {
													djd43.unimplemented("djd43.cal.iCalendar." + context);
												}
											}
										}
									}
								}
							}
						}
					}
					context = "";
				} else {
					childprops.push(body[i]);
				}
			}
		}
		if (this._ValidProperties) {
			this.postCreate();
		}
	}
};
djd43.extend(djd43.cal.iCalendar.Component, {addProperty:function (prop) {
	this.properties.push(prop);
	this[prop.name.toLowerCase()] = prop;
}, addComponent:function (prop) {
	this.components.push(prop);
}, postCreate:function () {
	for (var x = 0; x < this._ValidProperties.length; x++) {
		var evtProperty = this._ValidProperties[x];
		var found = false;
		for (var y = 0; y < this.properties.length; y++) {
			var prop = this.properties[y];
			var propName = prop.name.toLowerCase();
			if (djd43.lang.isArray(evtProperty)) {
				var alreadySet = false;
				for (var z = 0; z < evtProperty.length; z++) {
					var evtPropertyName = evtProperty[z].name.toLowerCase();
					if ((this[evtPropertyName]) && (evtPropertyName != propName)) {
						alreadySet = true;
					}
				}
				if (!alreadySet) {
					this[propName] = prop;
				}
			} else {
				if (propName == evtProperty.name.toLowerCase()) {
					found = true;
					if (evtProperty.occurance == 1) {
						this[propName] = prop;
					} else {
						found = true;
						if (!djd43.lang.isArray(this[propName])) {
							this[propName] = [];
						}
						this[propName].push(prop);
					}
				}
			}
		}
		if (evtProperty.required && !found) {
			djd43.debug("iCalendar - " + this.name + ": Required Property not found: " + evtProperty.name);
		}
	}
	if (djd43.lang.isArray(this.rrule)) {
		for (var x = 0; x < this.rrule.length; x++) {
			var rule = this.rrule[x].value;
			this.rrule[x].cache = function () {
			};
			var temp = rule.split(";");
			for (var y = 0; y < temp.length; y++) {
				var pair = temp[y].split("=");
				var key = pair[0].toLowerCase();
				var val = pair[1];
				if ((key == "freq") || (key == "interval") || (key == "until")) {
					this.rrule[x][key] = val;
				} else {
					var valArray = val.split(",");
					this.rrule[x][key] = valArray;
				}
			}
		}
		this.recurring = true;
	}
}, toString:function () {
	return "[iCalendar.Component; " + this.name + ", " + this.properties.length + " properties, " + this.components.length + " components]";
}});
djd43.cal.iCalendar.Property = function (prop) {
	this.name = prop.name;
	this.group = prop.group;
	this.params = prop.params;
	this.value = prop.value;
};
djd43.extend(djd43.cal.iCalendar.Property, {toString:function () {
	return "[iCalenday.Property; " + this.name + ": " + this.value + "]";
}});
var _P = function (n, oc, req) {
	return {name:n, required:(req) ? true : false, occurance:(oc == "*" || !oc) ? -1 : oc};
};
djd43.cal.iCalendar.VCalendar = function (calbody) {
	this.name = "VCALENDAR";
	this.recurring = [];
	this.nonRecurringEvents = function () {
	};
	djd43.cal.iCalendar.Component.call(this, calbody);
};
djd43.inherits(djd43.cal.iCalendar.VCalendar, djd43.cal.iCalendar.Component);
djd43.extend(djd43.cal.iCalendar.VCalendar, {addComponent:function (prop) {
	this.components.push(prop);
	if (prop.name.toLowerCase() == "vevent") {
		if (prop.rrule) {
			this.recurring.push(prop);
		} else {
			var startDate = prop.getDate();
			var month = startDate.getMonth() + 1;
			var dateString = month + "-" + startDate.getDate() + "-" + startDate.getFullYear();
			if (!djd43.lang.isArray(this[dateString])) {
				this.nonRecurringEvents[dateString] = [];
			}
			this.nonRecurringEvents[dateString].push(prop);
		}
	}
}, preComputeRecurringEvents:function (until) {
	var calculatedEvents = function () {
	};
	for (var x = 0; x < this.recurring.length; x++) {
		var dates = this.recurring[x].getDates(until);
		for (var y = 0; y < dates.length; y++) {
			var month = dates[y].getMonth() + 1;
			var dateStr = month + "-" + dates[y].getDate() + "-" + dates[y].getFullYear();
			if (!djd43.lang.isArray(calculatedEvents[dateStr])) {
				calculatedEvents[dateStr] = [];
			}
			if (!djd43.lang.inArray(calculatedEvents[dateStr], this.recurring[x])) {
				calculatedEvents[dateStr].push(this.recurring[x]);
			}
		}
	}
	this.recurringEvents = calculatedEvents;
}, getEvents:function (date) {
	var events = [];
	var recur = [];
	var nonRecur = [];
	var month = date.getMonth() + 1;
	var dateStr = month + "-" + date.getDate() + "-" + date.getFullYear();
	if (djd43.lang.isArray(this.nonRecurringEvents[dateStr])) {
		nonRecur = this.nonRecurringEvents[dateStr];
		djd43.debug("Number of nonRecurring Events: " + nonRecur.length);
	}
	if (djd43.lang.isArray(this.recurringEvents[dateStr])) {
		recur = this.recurringEvents[dateStr];
	}
	events = recur.concat(nonRecur);
	if (events.length > 0) {
		return events;
	}
	return null;
}});
var StandardProperties = [_P("dtstart", 1, true), _P("tzoffsetto", 1, true), _P("tzoffsetfrom", 1, true), _P("comment"), _P("rdate"), _P("rrule"), _P("tzname")];
djd43.cal.iCalendar.Standard = function (body) {
	this.name = "STANDARD";
	this._ValidProperties = StandardProperties;
	djd43.cal.iCalendar.Component.call(this, body);
};
djd43.inherits(djd43.cal.iCalendar.Standard, djd43.cal.iCalendar.Component);
var DaylightProperties = [_P("dtstart", 1, true), _P("tzoffsetto", 1, true), _P("tzoffsetfrom", 1, true), _P("comment"), _P("rdate"), _P("rrule"), _P("tzname")];
djd43.cal.iCalendar.Daylight = function (body) {
	this.name = "DAYLIGHT";
	this._ValidProperties = DaylightProperties;
	djd43.cal.iCalendar.Component.call(this, body);
};
djd43.inherits(djd43.cal.iCalendar.Daylight, djd43.cal.iCalendar.Component);
var VEventProperties = [_P("class", 1), _P("created", 1), _P("description", 1), _P("dtstart", 1), _P("geo", 1), _P("last-mod", 1), _P("location", 1), _P("organizer", 1), _P("priority", 1), _P("dtstamp", 1), _P("seq", 1), _P("status", 1), _P("summary", 1), _P("transp", 1), _P("uid", 1), _P("url", 1), _P("recurid", 1), [_P("dtend", 1), _P("duration", 1)], _P("attach"), _P("attendee"), _P("categories"), _P("comment"), _P("contact"), _P("exdate"), _P("exrule"), _P("rstatus"), _P("related"), _P("resources"), _P("rdate"), _P("rrule")];
djd43.cal.iCalendar.VEvent = function (body) {
	this._ValidProperties = VEventProperties;
	this.name = "VEVENT";
	djd43.cal.iCalendar.Component.call(this, body);
	this.recurring = false;
	this.startDate = djd43.date.fromIso8601(this.dtstart.value);
};
djd43.inherits(djd43.cal.iCalendar.VEvent, djd43.cal.iCalendar.Component);
djd43.extend(djd43.cal.iCalendar.VEvent, {getDates:function (until) {
	var dtstart = this.getDate();
	var recurranceSet = [];
	var weekdays = ["su", "mo", "tu", "we", "th", "fr", "sa"];
	var order = {"daily":1, "weekly":2, "monthly":3, "yearly":4, "byday":1, "bymonthday":1, "byweekno":2, "bymonth":3, "byyearday":4};
	for (var x = 0; x < this.rrule.length; x++) {
		var rrule = this.rrule[x];
		var freq = rrule.freq.toLowerCase();
		var interval = 1;
		if (rrule.interval > interval) {
			interval = rrule.interval;
		}
		var set = [];
		var freqInt = order[freq];
		if (rrule.until) {
			var tmpUntil = djd43.date.fromIso8601(rrule.until);
		} else {
			var tmpUntil = until;
		}
		if (tmpUntil > until) {
			tmpUntil = until;
		}
		if (dtstart < tmpUntil) {
			var expandingRules = function () {
			};
			var cullingRules = function () {
			};
			expandingRules.length = 0;
			cullingRules.length = 0;
			switch (freq) {
			  case "yearly":
				var nextDate = new Date(dtstart);
				set.push(nextDate);
				while (nextDate < tmpUntil) {
					nextDate.setYear(nextDate.getFullYear() + interval);
					tmpDate = new Date(nextDate);
					if (tmpDate < tmpUntil) {
						set.push(tmpDate);
					}
				}
				break;
			  case "monthly":
				nextDate = new Date(dtstart);
				set.push(nextDate);
				while (nextDate < tmpUntil) {
					nextDate.setMonth(nextDate.getMonth() + interval);
					var tmpDate = new Date(nextDate);
					if (tmpDate < tmpUntil) {
						set.push(tmpDate);
					}
				}
				break;
			  case "weekly":
				nextDate = new Date(dtstart);
				set.push(nextDate);
				while (nextDate < tmpUntil) {
					nextDate.setDate(nextDate.getDate() + (7 * interval));
					var tmpDate = new Date(nextDate);
					if (tmpDate < tmpUntil) {
						set.push(tmpDate);
					}
				}
				break;
			  case "daily":
				nextDate = new Date(dtstart);
				set.push(nextDate);
				while (nextDate < tmpUntil) {
					nextDate.setDate(nextDate.getDate() + interval);
					var tmpDate = new Date(nextDate);
					if (tmpDate < tmpUntil) {
						set.push(tmpDate);
					}
				}
				break;
			}
			if ((rrule["bymonth"]) && (order["bymonth"] < freqInt)) {
				for (var z = 0; z < rrule["bymonth"].length; z++) {
					if (z == 0) {
						for (var zz = 0; zz < set.length; zz++) {
							set[zz].setMonth(rrule["bymonth"][z] - 1);
						}
					} else {
						var subset = [];
						for (var zz = 0; zz < set.length; zz++) {
							var newDate = new Date(set[zz]);
							newDate.setMonth(rrule[z]);
							subset.push(newDate);
						}
						tmp = set.concat(subset);
						set = tmp;
					}
				}
			}
			if (rrule["byweekno"] && !rrule["bymonth"]) {
				djd43.debug("TODO: no support for byweekno yet");
			}
			if (rrule["byyearday"] && !rrule["bymonth"] && !rrule["byweekno"]) {
				if (rrule["byyearday"].length > 1) {
					var regex = "([+-]?)([0-9]{1,3})";
					for (var z = 1; x < rrule["byyearday"].length; z++) {
						var regexResult = rrule["byyearday"][z].match(regex);
						if (z == 1) {
							for (var zz = 0; zz < set.length; zz++) {
								if (regexResult[1] == "-") {
									djd43.date.setDayOfYear(set[zz], 366 - regexResult[2]);
								} else {
									djd43.date.setDayOfYear(set[zz], regexResult[2]);
								}
							}
						} else {
							var subset = [];
							for (var zz = 0; zz < set.length; zz++) {
								var newDate = new Date(set[zz]);
								if (regexResult[1] == "-") {
									djd43.date.setDayOfYear(newDate, 366 - regexResult[2]);
								} else {
									djd43.date.setDayOfYear(newDate, regexResult[2]);
								}
								subset.push(newDate);
							}
							tmp = set.concat(subset);
							set = tmp;
						}
					}
				}
			}
			if (rrule["bymonthday"] && (order["bymonthday"] < freqInt)) {
				if (rrule["bymonthday"].length > 0) {
					var regex = "([+-]?)([0-9]{1,3})";
					for (var z = 0; z < rrule["bymonthday"].length; z++) {
						var regexResult = rrule["bymonthday"][z].match(regex);
						if (z == 0) {
							for (var zz = 0; zz < set.length; zz++) {
								if (regexResult[1] == "-") {
									if (regexResult[2] < djd43.date.getDaysInMonth(set[zz])) {
										set[zz].setDate(djd43.date.getDaysInMonth(set[zz]) - regexResult[2]);
									}
								} else {
									if (regexResult[2] < djd43.date.getDaysInMonth(set[zz])) {
										set[zz].setDate(regexResult[2]);
									}
								}
							}
						} else {
							var subset = [];
							for (var zz = 0; zz < set.length; zz++) {
								var newDate = new Date(set[zz]);
								if (regexResult[1] == "-") {
									if (regexResult[2] < djd43.date.getDaysInMonth(set[zz])) {
										newDate.setDate(djd43.date.getDaysInMonth(set[zz]) - regexResult[2]);
									}
								} else {
									if (regexResult[2] < djd43.date.getDaysInMonth(set[zz])) {
										newDate.setDate(regexResult[2]);
									}
								}
								subset.push(newDate);
							}
							tmp = set.concat(subset);
							set = tmp;
						}
					}
				}
			}
			if (rrule["byday"] && (order["byday"] < freqInt)) {
				if (rrule["bymonth"]) {
					if (rrule["byday"].length > 0) {
						var regex = "([+-]?)([0-9]{0,1}?)([A-Za-z]{1,2})";
						for (var z = 0; z < rrule["byday"].length; z++) {
							var regexResult = rrule["byday"][z].match(regex);
							var occurance = regexResult[2];
							var day = regexResult[3].toLowerCase();
							if (z == 0) {
								for (var zz = 0; zz < set.length; zz++) {
									if (regexResult[1] == "-") {
										var numDaysFound = 0;
										var lastDayOfMonth = djd43.date.getDaysInMonth(set[zz]);
										var daysToSubtract = 1;
										set[zz].setDate(lastDayOfMonth);
										if (weekdays[set[zz].getDay()] == day) {
											numDaysFound++;
											daysToSubtract = 7;
										}
										daysToSubtract = 1;
										while (numDaysFound < occurance) {
											set[zz].setDate(set[zz].getDate() - daysToSubtract);
											if (weekdays[set[zz].getDay()] == day) {
												numDaysFound++;
												daysToSubtract = 7;
											}
										}
									} else {
										if (occurance) {
											var numDaysFound = 0;
											set[zz].setDate(1);
											var daysToAdd = 1;
											if (weekdays[set[zz].getDay()] == day) {
												numDaysFound++;
												daysToAdd = 7;
											}
											while (numDaysFound < occurance) {
												set[zz].setDate(set[zz].getDate() + daysToAdd);
												if (weekdays[set[zz].getDay()] == day) {
													numDaysFound++;
													daysToAdd = 7;
												}
											}
										} else {
											var numDaysFound = 0;
											var subset = [];
											lastDayOfMonth = new Date(set[zz]);
											var daysInMonth = djd43.date.getDaysInMonth(set[zz]);
											lastDayOfMonth.setDate(daysInMonth);
											set[zz].setDate(1);
											if (weekdays[set[zz].getDay()] == day) {
												numDaysFound++;
											}
											var tmpDate = new Date(set[zz]);
											daysToAdd = 1;
											while (tmpDate.getDate() < lastDayOfMonth) {
												if (weekdays[tmpDate.getDay()] == day) {
													numDaysFound++;
													if (numDaysFound == 1) {
														set[zz] = tmpDate;
													} else {
														subset.push(tmpDate);
														tmpDate = new Date(tmpDate);
														daysToAdd = 7;
														tmpDate.setDate(tmpDate.getDate() + daysToAdd);
													}
												} else {
													tmpDate.setDate(tmpDate.getDate() + daysToAdd);
												}
											}
											var t = set.concat(subset);
											set = t;
										}
									}
								}
							} else {
								var subset = [];
								for (var zz = 0; zz < set.length; zz++) {
									var newDate = new Date(set[zz]);
									if (regexResult[1] == "-") {
										if (regexResult[2] < djd43.date.getDaysInMonth(set[zz])) {
											newDate.setDate(djd43.date.getDaysInMonth(set[zz]) - regexResult[2]);
										}
									} else {
										if (regexResult[2] < djd43.date.getDaysInMonth(set[zz])) {
											newDate.setDate(regexResult[2]);
										}
									}
									subset.push(newDate);
								}
								tmp = set.concat(subset);
								set = tmp;
							}
						}
					}
				} else {
					djd43.debug("TODO: byday within a yearly rule without a bymonth");
				}
			}
			djd43.debug("TODO: Process BYrules for units larger than frequency");
			var tmp = recurranceSet.concat(set);
			recurranceSet = tmp;
		}
	}
	recurranceSet.push(dtstart);
	return recurranceSet;
}, getDate:function () {
	return djd43.date.fromIso8601(this.dtstart.value);
}});
var VTimeZoneProperties = [_P("tzid", 1, true), _P("last-mod", 1), _P("tzurl", 1)];
djd43.cal.iCalendar.VTimeZone = function (body) {
	this.name = "VTIMEZONE";
	this._ValidProperties = VTimeZoneProperties;
	djd43.cal.iCalendar.Component.call(this, body);
};
djd43.inherits(djd43.cal.iCalendar.VTimeZone, djd43.cal.iCalendar.Component);
var VTodoProperties = [_P("class", 1), _P("completed", 1), _P("created", 1), _P("description", 1), _P("dtstart", 1), _P("geo", 1), _P("last-mod", 1), _P("location", 1), _P("organizer", 1), _P("percent", 1), _P("priority", 1), _P("dtstamp", 1), _P("seq", 1), _P("status", 1), _P("summary", 1), _P("uid", 1), _P("url", 1), _P("recurid", 1), [_P("due", 1), _P("duration", 1)], _P("attach"), _P("attendee"), _P("categories"), _P("comment"), _P("contact"), _P("exdate"), _P("exrule"), _P("rstatus"), _P("related"), _P("resources"), _P("rdate"), _P("rrule")];
djd43.cal.iCalendar.VTodo = function (body) {
	this.name = "VTODO";
	this._ValidProperties = VTodoProperties;
	djd43.cal.iCalendar.Component.call(this, body);
};
djd43.inherits(djd43.cal.iCalendar.VTodo, djd43.cal.iCalendar.Component);
var VJournalProperties = [_P("class", 1), _P("created", 1), _P("description", 1), _P("dtstart", 1), _P("last-mod", 1), _P("organizer", 1), _P("dtstamp", 1), _P("seq", 1), _P("status", 1), _P("summary", 1), _P("uid", 1), _P("url", 1), _P("recurid", 1), _P("attach"), _P("attendee"), _P("categories"), _P("comment"), _P("contact"), _P("exdate"), _P("exrule"), _P("related"), _P("rstatus"), _P("rdate"), _P("rrule")];
djd43.cal.iCalendar.VJournal = function (body) {
	this.name = "VJOURNAL";
	this._ValidProperties = VJournalProperties;
	djd43.cal.iCalendar.Component.call(this, body);
};
djd43.inherits(djd43.cal.iCalendar.VJournal, djd43.cal.iCalendar.Component);
var VFreeBusyProperties = [_P("contact"), _P("dtstart", 1), _P("dtend"), _P("duration"), _P("organizer", 1), _P("dtstamp", 1), _P("uid", 1), _P("url", 1), _P("attendee"), _P("comment"), _P("freebusy"), _P("rstatus")];
djd43.cal.iCalendar.VFreeBusy = function (body) {
	this.name = "VFREEBUSY";
	this._ValidProperties = VFreeBusyProperties;
	djd43.cal.iCalendar.Component.call(this, body);
};
djd43.inherits(djd43.cal.iCalendar.VFreeBusy, djd43.cal.iCalendar.Component);
var VAlarmProperties = [[_P("action", 1, true), _P("trigger", 1, true), [_P("duration", 1), _P("repeat", 1)], _P("attach", 1)], [_P("action", 1, true), _P("description", 1, true), _P("trigger", 1, true), [_P("duration", 1), _P("repeat", 1)]], [_P("action", 1, true), _P("description", 1, true), _P("trigger", 1, true), _P("summary", 1, true), _P("attendee", "*", true), [_P("duration", 1), _P("repeat", 1)], _P("attach", 1)], [_P("action", 1, true), _P("attach", 1, true), _P("trigger", 1, true), [_P("duration", 1), _P("repeat", 1)], _P("description", 1)]];
djd43.cal.iCalendar.VAlarm = function (body) {
	this.name = "VALARM";
	this._ValidProperties = VAlarmProperties;
	djd43.cal.iCalendar.Component.call(this, body);
};
djd43.inherits(djd43.cal.iCalendar.VAlarm, djd43.cal.iCalendar.Component);

