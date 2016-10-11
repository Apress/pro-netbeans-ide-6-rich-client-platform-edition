/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
// define the namespaces
if (!jmaki.widgets.scriptaculous) {
	jmaki.widgets.scriptaculous = {};
}
jmaki.widgets.scriptaculous.inplace = {};

jmaki.widgets.scriptaculous.inplace.Widget = function(wargs) {
    var wInstance = this;
	
  var service; 
  if (!wargs.service) {
        jmaki.log("You did need to provide a service for the completer to use. Defaulting to an _inplace.html file in the widget directory."); 
     service =  wargs.widgetDir + "/_inplace.html";
  } else service = wargs.service;

  this.wrapper = new Ajax.InPlaceEditor(wargs.uuid, service, 
  { ajaxOptions: 
        {method: 'post'}, 
        widget: wargs,
        callback: function(form, value) {
	    var result = null;
	  wInstance.wrapper.value = value;
	  jmaki.publish("/scriptaculous/inplace/valueUpdate", 
			{target:wInstance, wargs:wargs, value : value});
	  if (null != wargs.outResult) {
	      result = wargs.outResult;
	  }
	  else {
	      result = Form.serialize(form);
	      if (!wargs.service) wInstance.wrapper.element.innerHTML = value;
	  }
	  return result;
      }, 
      onComplete: function(transport, element) {
            element.innerHTML = wInstance.wrapper.value;
	    if (null == transport || null == element) {
		return;
	    }
	    jmaki.publish("/scriptaculous/inplace/response", 
			  {target:wInstance, wargs:wargs, transport:transport, 
			   element:element});
      }

  });
}
