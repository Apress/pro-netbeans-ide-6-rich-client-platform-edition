/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
// define the namespaces
jmaki.namespace("jmaki.widgets.spry.accordion");

jmaki.widgets.spry.accordion.Widget = function(wargs) {

    var _widget = this;    
    var gradient = "AquaAccordionTab";
    var rows = [];
    var selectedIndex = 0;
    var autoHeight = true;
    var counter = 0;
    var panelMappings = {};
    var subscribe =  ["/spry/accordion", "/accordion"];
    var publish = "/spry/accordion";
    
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
    
    var container = document.getElementById(wargs.uuid);
    
    function genId() {
        return wargs.uuid + "_panel_" + counter++;
    }
    
    if (wargs.publish) publish = wargs.publish;
    if (wargs.subscribe){
        if (typeof wargs.subscribe == "string") {
            subscribe = [];
            subscribe.push(wargs.subscribe);
        } else {
            subscribe = wargs.subscribe;
        }
    } 
    
    // load the gradient background if provided
    if (wargs.args && wargs.args.gradient) {
        if (wargs.args.gradient == 'aqua') {
            gradient = "AquaAccordionTab";
        } else  if (wargs.args.gradient == 'blue') {
            gradient = "BlueAccordionTab";
        } else  if (wargs.args.gradient == 'green') {
            gradient = "GreenAccordionTab";
        } else  if (wargs.args.gradient == 'gray') {
            gradient = "GrayAccordionTab";
        }
        if (wargs.autoHeight) {
            autoHeight = wargs.autoHeight;
        }
    }
        
    function addRow(label, content,_height, url, overflow, iframe, _id, lazyLoad, index, action) {
        
        var _row = document.createElement("div");
        _row.pid = _id;
        _row.index = index;
        _row.action = action;
        _row.className = "AccordionPanel";
        var _rowTitle = document.createElement("div");     
        _rowTitle.className = gradient;
        _rowTitle.appendChild(document.createTextNode(label));
        _row.appendChild(_rowTitle);
        var _rowContent = document.createElement("div");
        _rowContent.className = "AccordionPanelContent";
        if (autoHeight && typeof _height == "number" && _height > 0) _rowContent.style.height = _height + "px";
        _row.appendChild(_rowContent);
     
        if (url) {
            _row.url = url;
            _row.contentLoaded = false;
        }
        if (!content) content = "";
       _row.dcontainer = new jmaki.DContainer(
            {target: _rowContent,
             content : content,
             useIframe : iframe,
             overflow: overflow,
             startHeight : _height}
             );
      
       if (url && lazyLoad == false) {
           _row.dcontainer.loadURL(url);
           _row.contentLoaded = true;
       }       
       Spry.Widget.Accordion.addEventListener(_row, "click", function(e) {
            var pid = _widget.wrapper.currentPanel.pid;
            _widget.selectPane(pid);
        }, false);
        panelMappings[_id] = _row;
        container.appendChild(_row);
    }

    function clone(t) {
       var obj = {};
       for (var i in t) {
            obj[i] = t[i];
       }
       return obj;
    }    
    
    function processActions(m, pid) {
        if (m) {
            var _topic = publish + "/onSelect";
            var _m = {widgetId : wargs.uuid, topic : publish, type : 'onSelect', targetId : pid};

            var action = m.action;

           if (action && action instanceof Array) {
              for (var _a=0; _a < action.length; _a++) {
                  var payload = clone(_m);
                  if (action[_a].topic) payload.topic = action[_a].topic;
                  else payload.topic = _topic;
                  if (action[_a].message) payload.message = action[_a].message;
                  jmaki.publish(payload.topic,payload);
              }
          } else {
              if (m.action && m.action.topic) {
                  _topic = _m.topic = m.action.topic;
              }
              if (m.action && m.action.message) _m.message = m.action.message;                  
              jmaki.publish(_topic,_m);
          } 
        }
    }
    
    this.selectPane = function(e) {
        var panelId;
        if (e.message) e=e.message;
        if (e.targetId) panelId = e.targetId;
        else panelId = e;
        if (panelMappings[panelId]) {
            var panel = panelMappings[panelId];
            processActions(panel, panelId);
            _widget.wrapper.openPanel(panel);
            if (panel.url && panel.contentLoaded == false) {
                panel.dcontainer.loadURL(panel.url);
                panel.contentLoaded = true;
            }
        }
    }
    
    this.setContent = function(e,c) {
        var panelId;
        var content;
        if (e.message) e=e.message;
        if (e.targetId) panelId = e.targetId;
        else panelId = e;
        if (e.value) content = e.value;
        else content = c;
        if (panelMappings[panelId]) {
            var panel = panelMappings[panelId];
            if (content) {
                panel.dcontainer.setContent(content);
                panel.contentLoaded = true;
            }
        }
    }
      
    this.setInclude = function(e,c) {
        var panelId;
        var include;
        if (e.message) e=e.message;
        if (e.targetId) panelId = e.targetId;
        else panelId = e;
        if (e.value) include = e.value;
        else include = c;
        if (panelMappings[panelId]) {
            var panel = panelMappings[panelId];
            if (include) {
                panel.dcontainer.loadURL(include);
                panel.contentLoaded = true;
            }
        }
    }    
        
    function init() {
        // if the user used a custom template and no value 
        //use it otherwise use the built in one
        var firstPane;
        var selectedPane;
        if (rows && !container.firstChild) {      
            // calculate the height
            var ch = container.clientHeight;
	    var contentHeight = 100;           
            if (ch != 0) contentHeight = ch - ((rows.length + 1) * 30);            
            for(var i=0; i <rows.length; ++i) {
                var _row = rows[i];
                var _ll = false;
                if (_row.lazyLoad) _ll = _row.lazyLoad;
                var of = 'hidden';
                if (_row.overflow) of = _row.overflow;
                var iframe = _row.iframe;
                var _url = _row.url;
                var _id = _row.id;
                if (typeof _id == 'undefined') _id = genId();
                if (!firstPane) firstPane = _id;
                if (_row.selected && _row.selected == true) selectedPane = _id;
                if (_row.include) _url = _row.include;
                addRow(_row.label,_row.content, contentHeight, _url, of, iframe, _id, _ll, i, _row.action);
            }
        } else if (typeof gradient != 'undefined'){
            // set the gradient on the template if a gradient
            jmaki.replaceStyleClass(wargs.uuid, 'AccordionPanelTab', gradient);	
        }
        // this code finds the correct selected pane and loads it if it has lazy load set
        var panel;
        if (selectedPane)panel = panelMappings[selectedPane];
        else panel = panelMappings[firstPane];
        if (panel.url) {
                panel.dcontainer.loadURL(panel.url);
                panel.contentLoaded = true;
        }
        _widget.wrapper = new Spry.Widget.Accordion(wargs.uuid,{ defaultPanel: panel.index });
        
        for (var _i=0; _i < subscribe.length; _i++) {
            jmaki.subscribe(subscribe[_i] + "/setContent", _widget.setContent);
            jmaki.subscribe(subscribe[_i] + "/setInclude", _widget.setInclude);
            jmaki.subscribe(subscribe[_i] + "/select", _widget.selectPane);
        }        
    }
    
    if (wargs.value) {     
        if (wargs.value.rows) {
            showModelDeprecation();
            rows = wargs.value.rows;
        } else if (wargs.value.items) {
            rows = wargs.value.items;
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
            
            if (obj.rows) {
                showModelDeprecation();
                rows = obj.rows;
            } else if (obj.items){
                rows = obj.items;
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
            rows = obj.value.defaultValue.items;
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
