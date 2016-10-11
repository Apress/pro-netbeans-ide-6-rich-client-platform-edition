/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
djd43.require("djd43.widget.AccordionContainer");

// define the namespaces
jmaki.namespace("jmaki.widgets.dojo.accordion");

jmaki.widgets.dojo.accordion.Widget = function(wargs) {

    var _widget = this;
    var publish = "/dojo/accordion";
    var subscribe =  ["/dojo/accordion", "/accordion"];
    var rowMappings = {};
    var panes = [];
    var showedModelWarning = false;
    
    var container = document.getElementById(wargs.uuid);
    _widget.wrapper = djd43.widget.createWidget("AccordionContainer", null, container);    
    if (container && container.style && container.style.height <= 0 && container.parentNode.nodeName == "BODY") {
      container.style.height = "300px";
    }
    this.rows = [];   
    
    function showModelDeprecation() {
        if (showedModelWarning == false) {
             jmaki.log("Dojo accordion  widget with id " + wargs.uuid + " uses the incorrect data format. Please see " +
                       "<a href='http://wiki.java.net/bin/view/Projects/jMakiAccordionDataModel'>" +
                       "http://wiki.java.net/bin/view/Projects/jMakiAccordionDataModel</a> " +
                       "for the proper format.");
             showedModelWarning = true;
        }   
    }  

   this.selectRow = function(e) {
        var rowId;
        if (e.message)e = e.message;
        if (e.targetId) rowId = e.targetId;
        else rowId = e;
        if (rowMappings[rowId]) {
           
            var row = rowMappings[rowId];

            var targetIndex = row.index; 
            var targetPane = _widget.wrapper.children[targetIndex];                    
            _widget.wrapper.selectChild(targetPane);

            if (row.url && row.contentLoaded == false){
                row.dcontainer.loadURL(row.url);
                row.contentLoaded = true;
            }
        }
    }
            
    this.setContent = function(e, c) {
        var rowId;
        var content;
        if (e.message)e = e.message;
        if (e.targetId) rowId = e.targetId;
        else rowId = e;
        if (e.value) content = e.value;
        else content = c;
        if (rowMappings[rowId]) {        
            var row = rowMappings[rowId];
            if (content){
                row.dcontainer.setContent(content);
                row.contentLoaded = true;
            }
        }
    }
       
    this.setInclude = function(e, c) {
        var rowId;
        var include;
        if (e.message)e = e.message;
        if (e.targetId) rowId = e.targetId;
        else rowId = e;
        if (e.value) include = e.value;
        else include = c;
        if (rowMappings[rowId]) {
            var row = rowMappings[rowId];
            if (include){
                row.dcontainer.loadURL(include);
                row.contentLoaded = true;
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

    function doSubscribe(topic, handler) {
        var i = jmaki.subscribe(topic, handler);
        _widget.subs.push(i);
    }
    
    this.destroy = function() {
        for (var i=0; _widget.subs && i < _widget.subs.length; i++) {
            jmaki.unsubscribe(_widget.subs[i]);
        }
    }    
    
    this.init = function() {
    	_widget.subs = [];
        var _selected;
        var _first;
        for(var i=0; i < _widget.rows.length; ++i) {
               var _row = _widget.rows[i];
               var rowId = _row.id;
               if (typeof rowId == 'undefined') {
                 rowId = wargs.uuid + "_tab_" + i;
               }
              var _c = undefined;
              _c = djd43.widget.createWidget("ContentPane", {targetId: rowId, label: _row.label, index : i});
              panes.push(_c);
            if ( typeof _row.selected != 'undefined' && _row.selected == true)  _selected= rowId;
            rowMappings[rowId] = _c;
            if (_row.action) _c.action = _row.action;
            if (!_selected) selected = _c;
            var cv = document.createElement("div");
            cv.id = rowId;
            _c.setContent(cv);
            var of = 'hidden';
            if (_row.overflow) of = _row.overflow;
            var iframe = _row.iframe;
            _widget.wrapper.addChild(_c);
            _widget.wrapper.onResized();
            var _iurl = undefined;
            if (_row.lazyLoad && _row.lazyLoad == true) {
                _c.url = _row.include;                
                _c.contentLoaded = false; 
                if (_row.url) {
                    showModelDeprecation();
                    _c.url = _row.url;
                }        
            } else if (_row.include){
                 _iurl = _row.include;
                _c.contentLoaded = true;
            } else if (_row.url) {
                showModelDeprecation();
                 _iurl = _row.url;
                _c.contentLoaded = true;
            }
            if (!_row.content && _row.include) _row.content = "Loading...";  

            _c.dcontainer = new jmaki.DContainer(
                {target: cv,
                content : _row.content,
                useIframe : iframe,
                overflow: of,
                url :  _iurl});                  
          }
          _widget.wrapper.onResized();

          if (_selected) _widget.selectRow(_selected);
          else if (_first) _widget.selectRow(_first);
          djd43.event.connect(_widget.wrapper, 'selectChild', function(row){
              var pane;
              for (var i=0; i < _widget.wrapper.children.length; i++)  {
                  if (_widget.wrapper.children[i] == row) {
                       pane =  panes[i];
                   }
              }
              if (pane) {
         
                 processActions(pane,pane.targetId, 'onSelect');
                 if (pane.url && pane.contentLoaded == false){
                    pane.dcontainer.loadURL(pane.url);
                    pane.contentLoaded = true;
                }
             }

        });  
        for (var _i=0; _i < subscribe.length; _i++) {
            doSubscribe(subscribe[_i] + "/setContent", _widget.setContent);
            doSubscribe(subscribe[_i] + "/setInclude", _widget.setInclude);
            doSubscribe(subscribe[_i] + "/select", _widget.selectRow);
        }      
      }

    if (wargs.args){
	if (wargs.args.topic) {
	    publish = wargs.args.topic;
	    jmaki.log("Dojo accordion: widget uses deprecated topic property. Use publish instead. ");
	}
    }
    
    if (wargs.publish) {
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
      
    // pull in the arguments
    if (typeof wargs.value != "undefined") {
        if (wargs.value.rows){
            showModelDeprecation();
            _widget.rows = wargs.value.rows;
        } else if (wargs.value.items){
            _widget.rows = wargs.value.items;
        } else {
            showModelDeprecation();
            return;
        }
        _widget.init();         
    } else if (wargs.service) {
        jmaki.doAjax({url: wargs.service,
            callback: function(req) {
                if (req.responseText =="") {
                    container.innerHTML = "Error loading widget data. No data."
                    return;
                }
                var data = eval('(' + req.responseText + ')');
               if (data.rows){
                   showModelDeprecation();
                   _widget.rows = data.rows;
               } else if (data.items){
                   _widget.rows = data.items;
               } else {
                   showModelDeprecation();
                   return;
               }
               _widget.init();              
           }, onerror : function(m) {          
               container.innerHTML = "Error loading widget data. " + m;
           }
      });
    } else {
        var  _s = wargs.widgetDir + "/widget.json";
        var callback = function(req) {
            var obj = eval("(" + req.responseText + ")");
            _widget.rows = obj.value.defaultValue.items;
            _widget.init(); 
        }
       
        jmaki.doAjax({url : _s,
            callback : callback,
            asynchronous : false,
            onerror : function() {
                container.innerHTML = "Error loading widget data.";
            }
        });
    }     
}
