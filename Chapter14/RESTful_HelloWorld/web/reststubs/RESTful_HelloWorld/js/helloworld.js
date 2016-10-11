/*
* Support js for HelloWorld
*/

function HelloWorldRemote(uri_) {
    this.uri = uri_;
}

HelloWorldRemote.prototype = {

   getXml : function() {
      return get_(this.uri, 'application/xml');
   },

   putXml : function(content) {
      return put_(this.uri, 'application/xml', content);
   }

}
