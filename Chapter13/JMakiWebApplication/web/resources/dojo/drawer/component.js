/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
djd43.require("djd43.lfx.*");
djd43.require("djd43.lfx.extras");

jmaki.namespace("jmaki.widgets.dojo.drawer");

jmaki.widgets.dojo.drawer.Widget = function(wargs) {

    var _widget = this;
    var subscribe = ["/dojo/drawer"]; 
    var publish = "/dojo/drawer";
    var open = false;
    var icon;
    var lazyLoad = false;
    var contentPane;
    var tooltip_open = "Open";
    var tooltip_close = "Close";
    var rate = 250;
    var contentLoad = false;
    var color = "gray";
    var dcontainer = null;
    var _url = null;
    var labelText;
    var data;
    var payload;
    var content;

    var showedModelWarning = false;
    
    function showModelDeprecation() {
        if (!showedModelWarning) {
             jmaki.log("Dojo drawer  widget with id " + wargs.uuid + " uses the incorrect data format. Please see " +
                       "<a href='http://wiki.java.net/bin/view/Projects/jMakiDrawerDataModel'>" +
                       "http://wiki.java.net/bin/view/Projects/jMakiDrawerDataModel</a> " +
                       "for the proper format.");
             showedModelWarning = true;
        }   
    }     
            
    var of = 'hidden';
    if (wargs.args && wargs.args.overflow) of = wargs.args.overflow;
    var iframe = false;

    // pull in the arguments
    if (wargs.args) {
        if (wargs.args.iframe) iframe = false;
        if (wargs.args.open) {
            open = wargs.args.open;
        }
        if (wargs.args.lazyLoad) {
            lazyLoad = wargs.args.lazyLoad;
        }
        if (wargs.args.title) {
            jmaki.log("Dojo drawer: widget uses deprecated title property. Use label instead. ");
            labelText = wargs.args.title;
        }
        if (wargs.args.content) {
            content = wargs.args.content;
        }        
        if (wargs.args.label) {
            labelText = wargs.args.label;
        }              
        if (wargs.args.color) {
            color = wargs.args.color;
        }
        if (wargs.args.rate) {
            rate = wargs.args.rate;
        }
        if (wargs.args.url) {
            jmaki.log("Dojo drawer: widget uses deprecated url property. Use include instead. ");
            _url = wargs.args.url;
        }
        if (wargs.args.include) {
            _url = wargs.args.include;
        }        
        if (wargs.args.topic) {
            subscribe = wargs.args.topic;
	    jmaki.log("Dojo drawer: widget uses deprecated topic property. Use subscribe instead. ");
        }      
    }
   
    if (wargs.subscribe){
        if (typeof wargs.subscribe == "string") {
            subscribe = [];
            subscribe.push(wargs.subscribe);
        }
    }
    
    if (wargs.value) {        
       data = wargs.value;
    } else if (wargs.service) {
        jmaki.doAjax({url: wargs.service, callback: function(req) {
           if (req.responseText =="") {
               container.innerHTML = "Error loading widget data. No data."
               return;
           }            
           var vc = eval('(' + req.responseText + ')');
           if (vc) {
               data = vc;
               init();
           } else {
               jmaki.log(wargs.uuid + " : Data format error. Need to have an object with at content property.");
           }
        }});
    }    
    var container = document.getElementById(wargs.uuid);
    
    function setIcon(src) {
        if (/MSIE 6/i.test(navigator.userAgent)) {
           icon.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,sizingMethod=image,src=" + src + ")";
        } else {
            icon.src = src;
        }
    }
    
    
    function init() {
        if (data && data.content) content = data.content;
        if (data && data.label) labelText = data.label;
        if (data && data.include) _url = data.include;
        if (data && data.expanded) open = data.expanded;
        var label = document.createElement("div");
        label.className = "drawer-label";
        var iconDiv = document.createElement("div");
        if (/MSIE/i.test(navigator.userAgent)) {
            icon = document.createElement("img");
            icon.style.width = "20px";
            icon.style.height = "20px";
            setIcon(wargs.widgetDir + "/images/arrow_closed_" + color +".png");
        } else {
            icon = document.createElement("img");
        }

        icon.className = "drawer-icon";
        label.appendChild(icon);

        icon.title = tooltip_open;
        if (labelText) {
            var labelTitle = document.createElement("div");
            var labelTextNode = document.createTextNode(labelText);
            labelTitle.appendChild(labelTextNode);

            labelTitle.className = "drawer-title-text";
            label.appendChild(labelTitle);
            labelTitle.onclick = function() {
                if (open) {
                    _widget.setOpen(false);
                } else {
                    _widget.setOpen(true);
                }
            }        
        } 

        icon.onclick = function() {
            var type;
            if (open) {
                type = "open";
                _widget.setOpen(false);
            } else {
                type = "close";
                _widget.setOpen(true);
            }      
        }        
        
        contentPane = document.createElement("div");

             dcontainer = new jmaki.DContainer(
            {target: contentPane,
             useIframe : iframe,
             content : content,
             overflow: of});
     
            container.appendChild(label);
            container.appendChild(contentPane);
            if (!open) {
                contentPane.style.display = "none";
                setIcon(wargs.widgetDir + "/images/arrow_closed_" + color +".png");               
            } else {
                setIcon(wargs.widgetDir + "/images/arrow_opened_" + color +".png");     
            }
            if (!lazyLoad && _url) {
                   _widget.setInclude( _url);
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

    this.setInclude = function(e) {
       var url; 
       if (e.message) e = e.message;
       if (e.value) url = e.value;
       else url = e;
       if (url) {
           if (dcontainer) {     
               dcontainer.loadURL(url);
               contentLoad = true;
           }
       }
    }    
    
    this.setContent = function(e) {
        var content;
        if (e.message)e = e.message;
        if (e.value) content = e.value;
        if (content) {
            contentPane.innerHTML = content;
        }
    }
    
    this.getContent = function() {
        return contentPane.innerHTML;
    }
    
    function show() {
        if (lazyLoad && !contentLoad && _url) {
            _widget.loadURL(_url);
        }
        setIcon(wargs.widgetDir + "/images/arrow_opened_" + color +".png");     
        icon.title = tooltip_close;
        djd43.lfx.html.wipeIn(contentPane, rate).play();
        open = true;
        if (!payload) payload = {};
        payload.widgetId = wargs.uuid;
        payload.type = "onExpand";
        jmaki.publish(publish + "/onExpand", payload);    
    }
    
    function hide() {
        djd43.lfx.html.wipeOut(contentPane, rate).play();
        setIcon(wargs.widgetDir + "/images/arrow_closed_" + color +".png");  
        icon.title = tooltip_open;
        open = false;
        if (!payload) payload = {};
        payload.widgetId = wargs.uuid;
        payload.type = "onCollapse";
        jmaki.publish(publish + "/onCollapse", payload);         
    }
    
    this.setOpen = function(_open) {
        if (_open) {
           show();
        } else {
           hide();
        }
        processActions(data, 'default', 'onSelect');
    }
    
    this.expand = function() {
        if (!open) {
           show();
        }
    }
    
    this.collapse = function() {
        if (open) hide();    
    }
    
    init();
    
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
        for (var _i=0; _i < subscribe.length; _i++) {
            doSubscribe(subscribe[_i] + "/setContent", _widget.setContent);
            doSubscribe(subscribe[_i] + "/setInclude", _widget.setInclude);
            doSubscribe(subscribe[_i] + "/collapse", hide);
            doSubscribe(subscribe[_i] + "/expand", show);            
        }
    }    
}
