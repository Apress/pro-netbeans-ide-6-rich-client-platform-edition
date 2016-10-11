/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
djd43.require("djd43.widget.Tree");

// define the namespaces
jmaki.namespace("jmaki.widgets.dojo.tree");

jmaki.widgets.dojo.tree.Widget = function(wargs) {

    var _widget = this;
    var publish = "/dojo/tree";
    var subscribe = ["/dojo/tree", "/tree"];
    var container;
    
    var counter = 0;
    
    function genId() {
        return wargs.uuid + "_nid_" + counter++;
    }

    var showedModelWarning = false;
    
    function showModelDeprecation() {
        if (!showedModelWarning) {
             jmaki.log("Dojo tree widget uses the incorrect data format. Please see " +
                       "<a href='http://wiki.java.net/bin/view/Projects/jMakiTreeDataModel'>" +
                       "http://wiki.java.net/bin/view/Projects/jMakiTreeDataModel</a> " +
                       "for the proper format.");
             showedModelWarning = true;
        }   
    }
    
    this.findNode = function(nid, root) {

        var returnNode;
        if (typeof root == 'undefined') root = _widget.tree;       
        if (root.nid == nid) {
            returnNode = root;
            return root;
        }
        if (typeof root.children != 'undefined') {
        for (var ts =0; !returnNode && root.children && ts < root.children.length; ts++) {
                returnNode = _widget.findNode(nid, root.children[ts]);
            }
        }
        return returnNode;
    }
    
    this.expandNode = function(e) {
        var nid;
        if (e.message)e = e.message;
        if (e.targetId) nid = e.targetId;
        else nid = e;
        var target = _widget.findNode(nid);
        if (target){
             target.expand();
             // expand all parent treenodes
             while (target = target.parent) {
                 if (target.expand)target.expand();
             } 
         }     
    }
    
    this.collapseNode = function(e) {         
        var nid;
        if (e.message)e = e.message;
        if (e.targetId) nid = e.targetId;
        else nid = e;
        var target = _widget.findNode(nid);
        if (target){
             target.collapse();
        }     
    }
    
    this.addNodes = function(e, n) {
        var ch;
        if (e.message)e = e.message;
        if (e.value) ch = e.value;
        else ch = n;
        var nid;
        if (e.targetId) nid = e.targetId;
        else nid = e;
        var target = _widget.findNode(nid);
        if (!target)target = _widget.tree;
        if (target && ch){       
         _widget.buildTree(ch, target); 
        }      
    }
    
    this.removeChildren = function(e){
        var nid;
        if (e.message)e = e.message;
        if (e.targetId) nid = e.targetId;
        else nid = e;

        var target = _widget.findNode(nid);
        if (target && target.children && target.children.length){       
            for (var i=target.children.length -1;  i >= 0 ; i--) {
                target.removeNode(target.children[i]);
            }
        }         
    }
    
    this.removeNode = function(e) {
        var nid;
        if (e.message)e = e.message;
        if (e.targetId) nid = e.targetId;
        else nid = e;
        var target = _widget.findNode(nid);
        if (target && target.parent)target.parent.removeNode(target);
        else if (target) _widget.tree.removeNode(target);
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
        for (var _i=0; _i < subscribe.length; _i++) {
            doSubscribe(subscribe[_i]  + "/removeNode", _widget.removeNode);
            doSubscribe(subscribe[_i] + "/removeChildren", _widget.removeChildren);
            doSubscribe(subscribe[_i] +"/addNodes", _widget.addNodes);
            doSubscribe(subscribe[_i] + "/expandNode", _widget.expandNode);
            doSubscribe(subscribe[_i]  + "/collapseNode", _widget.collapseNode);
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

    function _addNode(m, parent) {
        var rExpanded = false;
        var rChildren = false;
        if (typeof m.children != 'undefined') rChildren = true;
        if (typeof m.expanded != 'undefined' && m.expanded == true) rExpanded = true;
        var t;
        if (m.label){
            t= m.label;
        } else if (m.title) {
            t = m.title;
            showModelDeprecation();
        }
        var nid;
        if (typeof m.id != 'undefined') nid= m.id;
        else nid = genId();
        var rNode = djd43.widget.createWidget("TreeNode", {title: t, isFolder:rChildren, isExpanded:rExpanded, targetId :nid, nid : nid});

         djd43.event.connect(rNode, 'collapse', function(e){
             var p = {type : 'onCollapse', widgetId : wargs.uuid, label :t,  targetId :nid, topic : publish};
            
             jmaki.publish(publish + "/onCollapse", p);
        });
         djd43.event.connect(rNode, 'expand', function(e){
             var p = {type : 'onExpand', widgetId : wargs.uuid, label : t, targetId : nid, topic : publish};
            
             jmaki.publish(publish + "/onExpand", p);
        });        
        // wire in onclick handler
        m.nid = nid;
        if (!rChildren || m.action) { 
    
           djd43.event.connect(rNode, 'onTitleClick', function(e){
              var tar = m;
              processActions(tar, tar.nid, 'onClick');
           });
        }

       if (typeof parent == 'undefined') {
            _widget.tree.addChild(rNode);
       } else {
            parent.addChild(rNode);
        }
      return rNode;  
    }

    
    // now build the tree programtically
    this.buildTree = function(root, parent) {

        var rNode = _addNode(root,parent);
       
        for (var t=0; root.children && t < root.children.length; t++) {
            var n = root.children[t];
            var lNode = _addNode(n,rNode);
           
            //  recursively call this function to add children
            if (typeof n.children != 'undefined') {
                for (var ts =0; n.children && ts < n.children.length; ts++) {
                    _widget.buildTree(n.children[ts], lNode);
                }
            }
            
        }
   }
   
    container = document.getElementById(wargs.uuid);
    _widget.tree = djd43.widget.createWidget("Tree", {widgetid : wargs.uuid + "_tree"});
    var ph = document.getElementById(wargs.uuid + "_tree");
    container.replaceChild(_widget.tree.domNode,ph);    
    
    if (wargs.args && wargs.args.publish) {
       publish = wargs.args.publish;
	jmaki.log("Dojo tree: widget uses deprecated publish property. Use publish instead.");
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
    // use the default tree found in the widget.json if none is provided
    if (!wargs.value) {
        var callback;
        var _s;
        // default to the service in the widget.json if a value has not been st
        // and if there is no service
        if (!wargs.service) {
           _s = wargs.widgetDir + "/widget.json";
            callback = function(req) {
                if (req.responseText =="") {
                    container.innerHTML = "Error loading widget data. No data."
                    return;
                }                 
                var obj = eval("(" + req.responseText + ")");
                _widget.buildTree(obj.value.defaultValue.root);
            }
        } else {
           _s = wargs.service;
           callback = function(req) {
                if (req.responseText =="") {
                    container.innerHTML = "Error loading widget data. No data."
                    return;
                }               
                var jTree = eval("(" + req.responseText + ")");
                if (!jTree.root){
                    showModelDeprecation();
                    return;
                }
                var root = jTree.root;
                _widget.buildTree(root);
            }        
        }
        ajax = jmaki.doAjax({url : _s,
                           callback : callback,
                           onerror : function() {
                container.innerHTML = "Unable to load widget data.";
            }
                           });
    } else if (wargs.value) {
	 if (!wargs.value.root){
            showModelDeprecation();
            return;
        }
        if (!wargs.value.root){
            showModelDeprecation();
            return;
        }
      _widget.buildTree(wargs.value.root);
    }
}
