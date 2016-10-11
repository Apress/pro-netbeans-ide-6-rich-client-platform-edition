/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
djd43.require("djd43.widget.Editor2Plugin.SimpleSignalCommands");
djd43.require("djd43.widget.Editor2");

//create namespace
jmaki.namespace("jmaki.widgets.dojo.editor");

jmaki.widgets.dojo.editor.Widget = function(wargs) {
    
    var _widget = this;
    var topic = "/dojo/editor/";
    var container = document.getElementById(wargs.uuid);

    var toolbarSmall = wargs.widgetDir + "/toolbars/toolbar-small.html";
    var toolbarMedium = wargs.widgetDir + "/toolbars/toolbar-medium.html";
    var toolbarFull = wargs.widgetDir + "/toolbars/toolbar-full.html";
    var toolbar = toolbarSmall;

    if (wargs.args) {
        if (wargs.args.topic) {
            topic = wargs.args.topic;
	    jmaki.log("widget uses deprecated topic property. Use publish instead. ");
        }  
        if (wargs.args.toolbar) {
            if (wargs.args.toolbar == "full") {
                toolbar = toolbarFull;
            }
        }
        if (wargs.args.toolbar) {
            if (wargs.args.toolbar == "medium") {
                toolbar = toolbarMedium;
            }
        }
        if (wargs.args.toolbar) {
            if (wargs.args.toolbar == "small") {
                toolbar = toolbarSmall;
            }
        }
    }

  	if (wargs.publish)topic = wargs.publish;
     
    var eargs = {toolbarTemplatePath: toolbar, shareToolbar: false};
    
    this.init = function() {    
        _widget.wrapper = djd43.widget.createWidget("Editor2", eargs, container);
        djd43.event.connect(_widget.wrapper, "save", djd43.lang.hitch(_widget, function() {
	    _widget.saveState();
    }));
    if (wargs.service) {
 	    var url = wargs.service;
            djd43.io.bind({
                url: url,
                load: function (type,data,evt) {
                    _widget.setValue(data);
                    _widget.init();
                }
            });
    }        
    }

    this.setValue = function(_v) {
        document.getElementById(wargs.uuid).value = _v;
    }

    this.getValue = function() {
        return this.wrapper.getEditorContent();
    }

    this.saveState = function() {
        jmaki.publish(topic + "/onSave", {widgetId: wargs.uuid, value: _widget.getValue()});
    }
   
    this.postLoad = function() {
        if (wargs.value) {
            jmaki.subscribe("/jmaki/runtime/loadComplete", function() {
                _widget.setValue(wargs.value);
                _widget.init();
            });   
        }
    }
}
