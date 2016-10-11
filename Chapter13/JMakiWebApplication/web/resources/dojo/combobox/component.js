/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
djd43.require("djd43.widget.ComboBox");
djd43.require("djd43.io.*");

// define the namespaces
jmaki.namespace("jmaki.widgets.dojo.combobox");

jmaki.widgets.dojo.combobox.Widget = function(wargs) {

    var _widget = this;
    var publish = "/dojo/combobox";
    var subscribe = ["/dojo/combobox"];
    
    if (wargs.publish ) {
	    publish = wargs.publish;
    }
     
    if (wargs.subscribe){
        if (typeof wargs.subscribe == "string") {
            subscribe = [];
            subscribe.push(wargs.subscribe);
        } else {
            subscribe = wargs.subscribe;
        }
    }
    
    var showedDeprecation = false;
    
    function showDeprecationMessage() {
        if (showedDeprecation == false) {
            jmaki.log("Combobox with id : " + wargs.uuid + " uses a deprecated model. Please see " +
                  "<a href='http://wiki.java.net/bin/view/Projects/jMakiComboxModel'>"+
                  "http://wiki.java.net/bin/view/Projects/jMakiComboxModel</a> " +
                  "for more on the model.");
            showedDeprecation = true;
        }
    }    
        
    var container = document.getElementById(wargs.uuid);
    var containerInput = document.getElementById(wargs.uuid + "_input");
    _widget.wrapper = djd43.widget.createWidget("ComboBox", {autocomplete:true}, containerInput);
    var vmappings = {};
    var counter = 0;
    
    function genKey(){
        return wargs.uuid + "_item_" + counter++;
    }

    function modelConverter(data) {
        var model = [];
        for (var i=0; i < data.length; i++) {
            var _val = data[i].value;
            var _label = data[i].label;
            // if only a value is specified make the label equal to the value
            if (!_val && _label) _val = _label;
            if (_val && !_label) _label = _val;
            if (!data[i].value && data[i].name) {
                showDeprecationMessage();
                _val = data[i].name;
            }             
            if (!_label && !_val) { 
                showDeprecationMessage();       
            }

            var key =  data[i].id;
            if (!key) key = genKey();
            if (data[i].selected &&  data[i].selected == true) {
                   _widget.selected = _val;             
            }                
            vmappings[_val] = { label : _label, targetId : key, action : data[i].action};
            model.push([_label,_val]);

        }
        return model;
    }
        
    if (wargs.service) {
        djd43.io.bind({
                url: wargs.service,
                method: "get",
                mimetype: "text/json",
                sync : true,
                load: function (type,data,evt) {
                    if (typeof data != 'undefined') {
                        if (data[0] instanceof Array) {
                            jmaki.debug = true;                          
                            jmaki.log("Widget with id " + wargs.uuid + " uses a deprecated model. See <a href='http://wiki.java.net/bin/view/Projects/jMakiComboxModel'>http://wiki.java.net/bin/view/Projects/jMakiComboxModel</a> for the correct format.");
                            _widget.wrapper.dataProvider.setData(data);
                        } else if (data[0] instanceof Object) {
                            _widget.wrapper.dataProvider.setData(modelConverter(data));
                        }
                    }
                }        
        });
    }
    
    this.saveState = function() {
        jmaki.log(wargs.uuid + " error : saveSate no longer supported. Please provide save login in your glue code");
    }


    // if a plain string it is the value
    if (wargs.value) {
        if (wargs.value[0] instanceof Array) {
                jmaki.log("Widget with id " + wargs.uuid + " uses a deprecated model. See <a href='http://wiki.java.net/bin/view/Projects/jMakiComboxModel'>http://wiki.java.net/bin/view/Projects/jMakiComboxModel</a> for the correct format.");
                _widget.wrapper.dataProvider.setData(wargs.value);
            } else if (wargs.value[0] instanceof Object) {
                _widget.wrapper.dataProvider.setData(modelConverter(wargs.value));
            }        
    }

    if (wargs.args && wargs.args.publish) {
        publish = wargs.args.publish;
        jmaki.log("Dojo combobox: widget uses deprecated publish property. Use publish instead. ");
    }
    
    function doSubscribe(topic, handler) {
        var i = jmaki.subscribe(topic, handler);
        _widget.subs.push(i);
    }
    
    this.destroy = function() {
        for (var i=0; _widget.subs && i < _widget.subs.length; i++) {
            jmaki.unsubscribe(_widget.subs[i]);
        }
    }

    this.postLoad = function() {
        _widget.subs = [];
        if (wargs.args && wargs.args.selected) {        
            _widget.selected = wargs.args.selected;     
        }
        if (_widget.selected){
           if (vmappings[_widget.selected]) _widget.select(vmappings[_widget.selected]);
        }
        for (var _i=0; _i < subscribe.length; _i++) {
            doSubscribe(subscribe[_i]  + "/select", _widget.select);
            doSubscribe(subscribe[_i]  + "/setValues", _widget.setValues);
        }
    }

    this.getValue = function() {
        return this.wrapper.getValue();
    }
    
    this.select = function(e){
        var targetId;
        var _target;
        if (e.message)e = e.message;
        if (e.targetId) targetId = e.targetId;
        var _val;
        for (var i in vmappings) {
            if (vmappings[i].targetId == targetId) {
                _target = vmappings[i];
                _val = i;
                break;
            }
        }
        if (_target) {
            processActions(_target,_target.targetId, 'onSelect', _val);
           _widget.wrapper.setValue(_target.label);   
        }
    }

    this.setValues = function(e){  
        var _values;
        if (e.message && e.message.value) _values = e.message.value;
        else _values = e;
        var _selected;
        // clear out the selected value so we can reselect
        _widget.selected = undefined;
        if (_values) {
           vmappings = {};
           _widget.wrapper.setValue("");
           _widget.wrapper.dataProvider.setData(modelConverter(_values));
           if (_widget.selected &&
                vmappings[_widget.selected]) {
                _widget.wrapper.setValue(vmappings[_widget.selected].label);
           }
        }
    }    
    
    function clone(t) {
       var obj = {};
       for (var i in t) {
            obj[i] = t[i];
       }
       return obj;
    }    
    
    function processActions(_t, _pid, _type, _value) {
        if (_t) {
            var _topic = publish;
            var _m = {widgetId : wargs.uuid, type : _type, targetId : _pid};
            if (typeof _value != "undefined") _m.value = _value;
            var action = _t.action;
            if (!action) _topic = _topic + "/" + _type;
            if (action && action instanceof Array) {
              for (var _a=0; _a < action.length; _a++) {
                  var payload = clone(_m);
                  if (action[_a].topic) payload.topic = action[_a].topic;
                  else payload.topic = publish;
                  if (action[_a].message) payload.message = action[_a].message;
                  jmaki.publish(payload.topic,payload);
              }
            } else {
              if (action && action.topic) {
                  _topic = _m.topic = action.topic;
              }
              if (action && action.message) _m.message = action.message;                
              jmaki.publish(_topic,_m);
            } 
        }
    }    

    this.onChange = function(value){
       var _target = vmappings[value];
       processActions(_target,_target.targetId, 'onSelect', value);
    }

    djd43.event.connect(this.wrapper, "setSelectedValue", _widget, "onChange");	
}
