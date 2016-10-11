/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
djd43.require("djd43.widget.FisheyeList");

// define the namespaces
jmaki.namespace("jmaki.widgets.dojo.fisheye");

jmaki.widgets.dojo.fisheye.Widget = function(wargs) {

    // default topic
    var _widget = this;
    var publish = "/dojo/fisheye";
    var orientation = "horizontal";
    var labelEdge = "bottom";
    var items = ["item1","item2","item3"];
    // create the top level widget
    var container = document.getElementById(wargs.uuid);

    var counter = 0;

    function genId() {
        return wargs.uuid + "_item_" + counter++;
    }

    var showedDeprecation = false;
    
    function showDeprecationMessage() {
        if (showedDeprecation == false) {
            jmaki.log("FishEye with id : " + wargs.uuid + " uses a deprecated model. Please see " +
                  "<a href='http://wiki.java.net/bin/view/Projects/jMakiFisheyeModel'>"+
                  "http://wiki.java.net/bin/view/Projects/jMakiFisheyeModel</a> " +
                  "for more on the model.");
            showedDeprecation = true;
        }
    }

    if (wargs.args) {
        if (wargs.args.orientation){
           orientation = wargs.args.orientation;
           if (orientation == "vertical") {
               labelEdge = "right";
           }
        }
        if (wargs.args.labelEdge){
               labelEdge = wargs.args.labelEdge;
        }
        
        if (wargs.args.topic) {
            publish = wargs.args.topic;
	    jmaki.log("Dojo fisheye: widget uses deprecated topic property. Use publish instead. ");
        }        
    }

    if (wargs.publish ) {
	    publish = wargs.publish; 
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
       
   this.init= function() {
        var fishEye =  djd43.widget.createWidget("FishEyeList", 
          { orientation : orientation, 
            itemWidth:50,
            itemHeight:50,
            itemMaxWidth:200,
            itemMaxHeight:200,
            effectUnits:2,
            itemPadding:10,
            attachEdge:"top",
            labelEdge:labelEdge,
            enableCrappySvgSupport:false
         }, container);
         if (wargs.args && wargs.args.items) {
            showDeprecationMessage();
            for (var ii=0; ii < wargs.args.items.length; ii++) {
                var i = wargs.args.items[ii];
                var icon = djd43.widget.createWidget("FisheyeListItem", i);
                if (i.id) icon.targetId = i.id;
                icon.onClick = function () {
                    jmaki.publish(topic + "/onSelect", {widgetId : wargs.uuid, target:this, targetId : this.targetId});
                }
                fishEye.addChild(icon);
            }
            return;
         }   
         for (var i=0; i < data.length; i++) {
            var t = data[i];
            var fi = { iconSrc : t.iconSrc, caption : t.label};
            var icon = djd43.widget.createWidget("FisheyeListItem", fi);
            if (t.id)icon.targetId = t.id;
            else icon.targetId = genId();
            
            if (t.action) {
                icon.action = t.action;
                icon.onClick = function() {
                    processActions(this, this.targetId, 'onSelect');
                }
            } else if (t.href) {
                icon.onClick = function() {
                   window.location.href = t.href;
                }
            } else {
                icon.onClick = function() {
                   processActions(this, this.targetId, 'onSelect');     
                }
            }
            fishEye.addChild(icon);
        }
    }     

    if (wargs.value) {
        data = wargs.value;
        if (data instanceof Array) {
          _widget.init();  
        } else {
            showDeprecationMessage();
        }    
    } else if (wargs.service) {
       djd43.io.bind({
            url: wargs.service,
            method: "get",
            mimetype: "text/json",
            error: function (type,_data,evt) {
                 container.innerHTML = "Data format error loading from " + wargs.service;
                 return;      
            },
            load : function(type, _data,evt) {
                if (_data == false) {
                    container.innerHTML = "Data format error loading from " + wargs.service;
                    return;
                } else {
                    data = _data;
                    _widget.init();
                }
            }
        });
    } else {
       djd43.io.bind({
            url: wargs.widgetDir + "/widget.json",
            method: "get",
            mimetype: "text/json",
            load: function (type,_data,evt) {
                if (data == false) {
                    container.innerHTML = "Data format error loading data widget.json file.";
                    return;
                } else {
                    if (_data.value.defaultValue) {
                        data = _data.value.defaultValue;
                        _widget.init();
                    }
                }
            }
        });
   }
 
   this.destroy = function() {
   }
}
