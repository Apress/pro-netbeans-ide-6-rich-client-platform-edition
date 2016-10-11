// define the namespaces
if (!jmaki.widgets.spry) {
	jmaki.widgets.spry = {};
}
jmaki.widgets.spry.accordionXML = {};

jmaki.widgets.spry.accordionXML.Widget = function(wargs) {
    var self = this;
    this.uuid = wargs.uuid;
    this.ds = new Spry.Data.XMLDataSet(wargs.service, wargs.args.xpath);
    var observer = { onPostUpdate: function(notifier, data) {var impl = new Spry.Widget.Accordion(self.uuid); impl.attachBehaviors();} };
    Spry.Data.Region.addObserver(self.uuid, observer);

    this.postLoad = function() {
        Spry.Data.initRegions(document.getElementById(wargs.uuid));
   }
}