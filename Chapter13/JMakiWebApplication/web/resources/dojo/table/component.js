/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
djd43.require("djd43.widget.FilteringTable");

// define the namespaces
jmaki.namespace("jmaki.widgets.dojo.table");

jmaki.widgets.dojo.table.Widget = function(wargs) {

    var _widget = this;
    var columns = [];

    var uuid = wargs.uuid;
    var topic = "/dojo/table";
    var subscribe = ["/dojo/table", "/table"];
    var filter = "jmaki.filters.tableModelFilter";
    
    var container = document.getElementById(uuid);
    var table;
    var counter = 0;    
    
    // FIXME: this code can be removed for 1.0 release
    var showedModelWarning = false;
    
    function showModelDeprecation() {
        if (!showedModelWarning) {
             jmaki.log("Dojo table widget uses the incorrect data format. " +
                       "Please see <a href='http://wiki.java.net/bin/view/Projects/jMakiTableDataModel'>" +
                       "http://wiki.java.net/bin/view/Projects/jMakiTableDataModel</a> for the proper format.");
             showedModelWarning = true;
        }   
    }
    
    function genId() {
        return wargs.uuid + "_nid_" + counter++;
    }

    if (wargs.args) {
        if (wargs.args.topic) {
            topic = wargs.args.topic;
	    jmaki.log("Dojo table: widget uses deprecated topic property. Use publish instead. ");
        }
        if (wargs.args.filter) {
           filter = wargs.args.filter;
        }
    }
    
    if (wargs.publish ) {
	topic = wargs.publish;
     }
     
    if (wargs.subscribe){
        if (typeof wargs.subscribe == "string") {
            subscribe = [];
            subscribe.push(wargs.subscribe);
        } else {
            subscribe = wargs.subscribe;
        }
    }
    
    // initialize the widget
    this.init = function() {

        // backwards compatibility
        if (typeof columns[0] != 'object') { 
            showModelDeprecation();
        } else if (_widget.rows.length > 0 && _widget.rows[0] instanceof Array) {
            showModelDeprecation();
        }           
        table = djd43.widget.createWidget("FilteringTable",{valueField: "id"},container);
         
        // provide generic column names if they were not provided.
        for (var l = 0; l < columns.length; l++) {
            var c = columns[l];
            if (!c.id)c.id = l + "" ;              
            c.field =  c.id;
            if (c.title)  c.label = c.title;
            c.dataType = "String";
        }
       
        for (var x = 0; x < columns.length; x++) {
            table.columns.push(table.createMetaData(columns[x]));
        }
        
        var data = [];

        // add an Id for everything as it is needed for sorting
        for (var i=0; i < _widget.rows.length; i++) {
            var nRow;
 
            if (!(_widget.rows[i] instanceof Array)) {
              nRow = _widget.rows[i];
            } else {
               nRow = {};
               for (var cl = 0; cl < columns.length; cl++) { 
                   nRow[columns[cl].id] = _widget.rows[i][cl];
                }
            }
            if (typeof _widget.rows[i].id == "undefined") {          
                nRow.id = genId();
            } else {
                nRow.id = _widget.rows[i].id;
            }
            data.push(nRow);
        }
        count = _widget.rows.length;
        table.store.setData(data);
        djd43.event.connect(table, "onSelect", _widget, "onSelect");        
    }

    // set columns from the widget arguments if provided.
    if (wargs.args && wargs.args.columns) {
        columns = wargs.args.columns;     
    }
    
    // pull in the arguments
    if (wargs.value) {
        // convert value if a jmakiRSS type
        if (wargs.value.dataType == 'jmakiRSS') {
           wargs.value = jmaki.filter(wargs.value, filter);
        }
        if (!wargs.value.rows) {
            showModelDeprecation();
            return;
        }
        if (wargs.value.rows){
            _widget.rows = wargs.value.rows;
        } else if (wargs.value instanceof  Array) {
            _widget.rows = wargs.value;
        }
        if (wargs.value.columns) {
            columns = wargs.value.columns;
        }
        _widget.init();
        
    } else if (wargs.service) {
        djd43.io.bind({
            url: wargs.service,
            method: "get",
            mimetype: "text/json",
            load: function (type,data,evt) {
                if (data == false) {
                    container.innerHTML = "Data format error loading data from " + wargs.service;
                } else {
                    // convert value if a jmakiRSS type
                    if (data.dataType == 'jmakiRSS') {
                        data = jmaki.filter(data, filter);
                    }
                    if (!data.rows) {
                        showModelDeprecation();
                        return;
                    }
                    if (data.rows) {
                        _widget.rows = data.rows;                   
                    }
                    if (data.columns) {
                       columns = data.columns;
                    }
                    _widget.init();
                }
            }
        });
    } else {
        djd43.io.bind({
            url: wargs.widgetDir + "/widget.json",
            method: "get",
            mimetype: "text/json",
            load: function (type,data,evt) {
                if (data == false) {
                    container.innerHTML = "Data format error loading data widget.json file.";
                } else {
                    var _d;
                    // convert value if a jmakiRSS type
                    if (data.dataType == 'jmakiRSS') {
                        _d = jmaki.filter(data, filter);
                    } else {
                        if (data.value.defaultValue) _d = data.value.defaultValue;
                    }
                    if (_d.rows) {
                        _widget.rows = _d.rows;                   
                    }
                    if (_d.columns) {
                       columns = _d.columns;                        
                    }
                    _widget.init();
                }
            }
        });
    }
    
    this.clearFilters = function(){
        table.clearFilters();
    }
    
    this.clear = function() {
        table.store.setData([]);        
        table.store.clearData();
        counter = 0;
    }
    
    this.addRows = function(b){
        if (b.message)b = b.message;
        for (var i=0; i < b.value.length; i++) {
            _widget.addRow({ value : b.value[i]}, false);
        }
    }
 
    this.removeRow = function(b){
        var index;
        if (b.message)b = b.message;
        if (b.targetId) {
           index = b.targetId;
        } else {
            index = b;
        }    
        if (index && table.store.getDataByKey(index)) {
            table.store.removeDataByKey(index);
        }
    }
    
    this.updateRow = function(b, d) {
        var index;
        var data;
        if (d) data = d;
        if (b.message) {
            b = b.message;
        }
        if (b.value) {
            data = b.value;    
        }
        if (b.targetId) {
           index = b.targetId;
        } else {
            index = b;
        }
        if (typeof index != 'undefined' && table.store.getDataByKey(index)) {
            var s = table.store.getDataByKey(index);
            if (s) {
                var r = table.getRow(s);
                for (var i in data) {
                  s[i] = data[i];    
                }
                // update the table cells to match the model
              	for (var j = 0; j < table.columns.length; j++) {
		    r.childNodes[j].innerHTML = data[table.columns[j].id];
                } 
            } 
        }
    }

    this.select = function(b){
        var index;
        if (b.message)b = b.message;
        if (b.targetId) {
           index = b.targetId;
        } else {
            index = b;
        }    
        if (index && table.store.getDataByKey(index)) {
            var s = table.store.getDataByKey(index);
            if (s) {
                var r = table.getRow(s);
                r.isSelected = true;         
                table.resetSelections();
                table.toggleSelectionByRow(r); 
                table.renderSelections();
                jmaki.publish(topic + "/onSelect", { widgetId : wargs.uuid, type : 'onSelect', targetId : index, value : s });
            } 
        }
    }      
    
    this.addRow = function(b){
        var r;
        if (b.message)b = b.message;
        if (b.value) {
            r = b.value;
        } else {
            r = b;
        }
        var targetId;
        if (r.id) targetId = r.id;
        
        if (table.store.getDataByKey(targetId)) {
            jmaki.log(wargs.uuid  + " : Warning. Attempt to add record to dojo.table. with duplicate row id: " + targetId + ". Autogenerating new id.");
            r.id = genId();
        }
        
        // add an id for sorting if not defined
        if (typeof r.id == "undefined") {
            r.id = genId();
        }
        table.store.addData(r, null, false);
     }
    
    this.onSelect = function(e) {

        var _s = [];
	var data;
	var d = table.store.get();
	for (var i = 0; i < d.length; i++) {
            if (d[i].isSelected) {
	        _s.push(d[i].src.id);
		data = d[i].src;
            }
	}
        // later we may want to support multiple selections 
        jmaki.publish(topic + "/onSelect", { widgetId : wargs.uuid, type : 'onSelect', targetId : _s[0], value : data });

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
        // track the subscribers so we can later remove them
        _widget.subs = [];
        for (var _i=0; _i < subscribe.length; _i++) {
            doSubscribe(subscribe[_i]  + "/clear", _widget.clear);
            doSubscribe(subscribe[_i]  + "/addRow", _widget.addRow);
            doSubscribe(subscribe[_i]  + "/addRows", _widget.addRows);
            doSubscribe(subscribe[_i]  + "/updateRow", _widget.updateRow);
            doSubscribe(subscribe[_i]  + "/removeRow", _widget.removeRow);
            doSubscribe(subscribe[_i]  + "/select", _widget.select);
        }                
    }
}