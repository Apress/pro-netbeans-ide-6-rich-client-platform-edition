/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
djd43.require("djd43.widget.TabContainer");

jmaki.namespace("jmaki.widgets.dojo.tabbedview");

jmaki.widgets.dojo.tabbedview.Widget = function(wargs) {
    
    var _widget = this;
    
    var container = document.getElementById(wargs.uuid);

    var tabs = [];
    var publish = "/dojo/tabbedview";
    var subscribe = ["/dojo/tabbedview", "/tabbedview"]; 
    
    var tabMappings = {};
    
    var showedModelWarning = false;
    
    function showModelDeprecation() {
        if (!showedModelWarning) {
             jmaki.log("Dojo tabbed view  widget with id " + wargs.uuid + " uses the incorrect data format. Please see " +
                       "<a href='http://wiki.java.net/bin/view/Projects/jMakiTabbedViewDataModel'>" +
                       "http://wiki.java.net/bin/view/Projects/jMakiTabbedViewDataModel</a> " +
                       "for the proper format.");
             showedModelWarning = true;
        }   
    }    

    // pull in the arguments
    if (wargs.args && wargs.args.topic ) {
            publish = wargs.args.topic;
            jmaki.log("Dojo tabbed view: widget uses deprecated topic property. Use publish instead. ");
    }
    if (wargs.publish) topic = wargs.publish;
    if (wargs.subscribe){
        if (typeof wargs.subscribe == "string") {
            subscribe = [];
            subscribe.push(wargs.subscribe);
        } else {
            subscribe = wargs.subscribe;
        }
    }
        
   this.selectTab = function(e) {      
        var tabId;
        if (e.message)e = e.message;
        if (e.targetId) tabId = e.targetId;
        else tabId = e;

        if (tabMappings[tabId]) {
            var tab = tabMappings[tabId];
            _widget.wrapper.selectChild(tab);
            if (tab.url && tab.contentLoad == false){
                tab.dcontainer.loadURL(tab.url);
                tab.contentLoaded = true;
            }
        }
    }
            
    this.setContent = function(e, c) {
        var tabId;
        var content;
        if (e.message)e = e.message;
        if (e.targetId) tabId = e.targetId;
        else tabId = e;
        if (e.value) content = e.value;
        else content = c;
        if (tabMappings[tabId]) {
            var tab = tabMappings[tabId];
            if (content){
                tab.dcontainer.setContent(content);
                tab.contentLoaded = true;
            }
        }
    }
       
    this.setInclude = function(e, c) {
        var tabId;
        var include;
        if (e.message)e = e.message;
        if (e.targetId) tabId = e.targetId;
        else tabId = e;
        if (e.value) include = e.value;
        else include = c;
        if (tabMappings[tabId]) {
            var tab = tabMappings[tabId];
            if (include){
                tab.dcontainer.loadURL(include);
                tab.contentLoaded = true;
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
   
   function init() {
       _widget.wrapper = djd43.widget.createWidget("TabContainer", null, container);       
       var select_tab;
       var firstTab;

       for(var _i=0;  tabs[_i] && tabs[_i].label && _i < tabs.length; ++ _i) {
            var _row = tabs[ _i];

            var divId = wargs.uuid + "_tab_div_" +  _i;
            var tabId = _row.id;
            if (!tabId) {
                tabId = wargs.uuid + "_tab_" +  _i;
            }

            var _c = djd43.widget.createWidget("ContentPane", {tabId : tabId, label: _row.label, id: _row.tabId});
            if ( typeof _row.selected != 'undefined' && _row.selected == true)  select_tab = tabId;
            tabMappings[tabId] = _c;
            if (_row.action) _c.action = _row.action;
            if (!firstTab) firstTab = _c;
            var cv = document.createElement("div");
            cv.id = divId;
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
        djd43.event.connect(_widget.wrapper, 'selectChild', function(tab){
            processActions(tab, tab.tabId, 'onSelect');
            if (tab.url && tab.contentLoaded == false){
                tab.dcontainer.loadURL(tab.url);
                tab.contentLoaded = true;
            }
        });  
        if (select_tab) _widget.selectTab(select_tab);
        else _widget.selectTab(firstTab);
        _widget.subs = [];
        for (var _i=0; _i < subscribe.length; _i++) {
            doSubscribe(subscribe[_i]  + "/select", _widget.selectTab);
            doSubscribe(subscribe[_i] + "/setContent", _widget.setContent);
            doSubscribe(subscribe[_i] + "/setInclude", _widget.setInclude);

        }
    }
    
    if (wargs.value) {     
        if (wargs.value.tabs) {
            showModelDeprecation();
            tabs = wargs.value.tabs;
        } else if (wargs.value.items) {
            tabs = wargs.value.items;
        } else {
            showModelDeprecation();
            return;
        }
        init();
    } else if (wargs.service){
        var  _s = wargs.service;
        var callback = function(req) {
            if (req.responseText == '') {  
                container.innerHTML = "Error loading widget data. No data.";
                return;
            }
            var obj = eval("(" + req.responseText + ")");
            
            if (obj.tabs) {
                showModelDeprecation();
                tabs = obj.tabs;
            } else if (obj.items){
                tabs = obj.items;
            } else {
               showModelDeprecation();
               return;
            }
            init(); 
        }
       
        jmaki.doAjax({url : _s,
            callback : callback,
            onerror : function() {
                container.innerHTML = "Error loading widget data.";
            }
        });       
    } else {
        var  _s = wargs.widgetDir + "/widget.json";
        var callback = function(req) {
            var obj = eval("(" + req.responseText + ")");
            tabs = obj.value.defaultValue.items;
            init();
        }
       
        jmaki.doAjax({url : _s,
            callback : callback,
            onerror : function() {
                container.innerHTML = "Error loading widget data.";
            }
        });
    }    
}
