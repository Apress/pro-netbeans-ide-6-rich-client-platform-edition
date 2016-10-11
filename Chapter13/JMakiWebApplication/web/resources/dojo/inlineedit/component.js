/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
djd43.require("djd43.widget.InlineEditBox");
djd43.require("djd43.event.*");

jmaki.namespace("jmaki.widgets.dojo.inlineedit");

jmaki.widgets.dojo.inlineedit.Widget = function(wargs) {

    var self = this;
    var topic = "/dojo/inlineedit/";
    var container = document.getElementById(wargs.uuid);

    // set the initial value
    if (wargs.value) {  
        container.innerHTML = wargs.value;
    }
    
    self.wrapper = djd43.widget.createWidget("InlineEditBox",null, container);

    if (wargs.args) {
        if (wargs.args.topic) {
            topic = wargs.args.topic;
	    jmaki.log("Dojo inlineedit: widget uses deprecated topic property. Use publish instead. ");
        }
    } else if (wargs.publish) {
	topic = wargs.publish;
    }

    this.getValue = function() {
        return self.wrapper.value;
    }

    // add a saveState function
    if (wargs.service) {
        self.wrapper.onSave = function(newValue, oldValue) {   
            // we need to be able to adjust this
            var url = wargs.service;
            djd43.io.bind({
                    url: url + "?cmd=update",
                    method: "post",
                content: { "value" : newValue  },
                load: function (type,data,evt) {
                    // do something if there is an error
                }
            });
        }
    } else {
        self.wrapper.onSave = function(newValue, oldValue) {
            jmaki.publish(topic + "onSave", {id: wargs.uuid, wargs: wargs, value: newValue});
        }
    }
    this.saveState = this.wrapper.onSave;
}
