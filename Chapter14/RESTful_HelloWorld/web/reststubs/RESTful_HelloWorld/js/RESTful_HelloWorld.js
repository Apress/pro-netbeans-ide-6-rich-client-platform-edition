/*
* RESTful_HelloWorld stub
*/

function RESTful_HelloWorld() {}

RESTful_HelloWorld.prototype = {

   uri : 'http://localhost:8080/RESTful_HelloWorld/resources',

   resources : new Array(),
   
   initialized : false,

   getUri : function() {
      return this.uri;
   },

   getResources : function() {
      if(!this.initialized)
          this.init();
      return this.resources;
   },

   init : function() {

      this.initialized = true;
   },

   flush : function(resources_) {
      for(j=0;j<resources_.length;j++) {
        var r = resources_[j];
        r.flush();
      }
   },

   toString : function() {
      var s = '';
      for(j=0;j<this.resources.length;j++) {
        var c = this.resources[j];
        if(j<this.resources.length-1)
            s = s + '{"@uri":"'+c.getUri()+'"},';
        else
            s = s + '{"@uri":"'+c.getUri()+'"}';
      }
      var myObj = 
         '{"resources":'+
         '{'+
         s+
         '}'+
      '}';
      return myObj;
   }

}
