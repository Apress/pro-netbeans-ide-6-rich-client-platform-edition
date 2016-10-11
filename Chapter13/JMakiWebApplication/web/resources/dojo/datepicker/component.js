/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
djd43.require("djd43.widget.DatePicker");
djd43.require("djd43.event.*");

jmaki.namespace("jmaki.widgets.dojo.datepicker");

jmaki.widgets.dojo.datepicker.Widget = function(wargs) {
    var _widget = this;
    var container = document.getElementById(wargs.uuid);
    this.wrapper = djd43.widget.createWidget("DatePicker", null, container);
    var topic = "/dojo/datepicker";
	
    if (wargs.value) {
	    var date = new Date(wargs.value);
	    this.wrapper.setDate(date);
    }

   if (typeof wargs.topic != "undefined") {
	    topic = wargs.topic;
	    jmaki.log("Dojo datepicker: widget uses deprecated topic property. Use publish instead. ");
	}
	
	if ( wargs.publish) {
	    topic = wargs.publish;
	}
	
    this.getValue = function() {
        return  _widget.wrapper.getValue().replace(/-/g, '/');
    }

   this.datepickerEvent = function(date) {
        jmaki.publish(topic + '/onSelect', {widgetId: wargs.uuid, topic : topic, type : 'onSelect', value: _widget.getValue()});
    }


    djd43.event.connect(_widget.wrapper, "onValueChanged", _widget, "datepickerEvent" );    

}
