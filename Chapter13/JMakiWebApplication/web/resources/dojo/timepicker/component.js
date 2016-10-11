/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
djd43.require("djd43.widget.TimePicker");

jmaki.namespace("jmaki.widgets.dojo.timepicker");

jmaki.widgets.dojo.timepicker.Widget = function(wargs) {
    var _widget = this;
    var container = document.getElementById(wargs.uuid);
    this.wrapper = djd43.widget.createWidget("TimePicker", null,container);
    var topic = "/dojo/timepicker";

    if (typeof wargs.value != 'undefined') {
        var splitme = wargs.value.split(':');
        var hour = Number(splitme[0]);
        var minute = Number(splitme[1]);
        var time = new Date()
        time.setHours(hour);
        time.setMinutes(minute);
        this.wrapper.setTime(time);
        this.wrapper.initUI();
    }

    if (wargs.topic) {
	topic = wargs.topic;
	jmaki.log("Dojo timepicker: widget uses deprecated topic property. Use publish instead. ");
    }
    
    if (wargs.publish) {
	topic = wargs.publish;
    }

    this.getValue = function() {
        var date = new Date();
        var time = this.wrapper.selectedTime;
        date.setHours(time.hour);
        date.setMinutes(time.minute);
        return date;
    }
    
   this.timepickerEvent = function(date) {
        jmaki.publish(topic + '/onSelect', {widgetId: wargs.uuid, topic : topic, type : 'onSelect', value: date});
    }

    djd43.event.connect(_widget.wrapper, "onValueChanged", _widget, "timepickerEvent" );    
}
