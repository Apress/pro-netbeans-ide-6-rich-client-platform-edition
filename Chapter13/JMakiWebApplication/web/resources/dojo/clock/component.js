/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
djd43.require("djd43.widget.Clock");

// define the namespaces
jmaki.namespace("jmaki.widgets.dojo.clock");

jmaki.widgets.dojo.clock.Widget = function(wargs) {
    
    var self = this;
    var wLabel = "";
    var wLabelColor = "#fff";
    var wTopLabelColor = "#efefef";
    var wHandColor="#788598";
    var wHandStroke="#6f7b8c";
    var wSecondHandColor=[201, 4, 5, 0.8];
    var wTimeZoneOffset=0;
    var showAMPM = true;

    var clockImage = wargs.widgetDir + "/images/clock-black.png";

    if (typeof wargs.args != 'undefined') {
        if (typeof wargs.args.clockType != 'undefined') {
           if (wargs.args.clockType == 'black') {
               clockImage = wargs.widgetDir + "/images/clock-black.png";
           } else if (wargs.args.clockType == 'blackTexture') {
                clockImage = wargs.widgetDir + "/images/clock-black-texture.png";
           } else if (wargs.args.clockType == 'gray') {
                clockImage = wargs.widgetDir + "/images/clock-gray-gradient.png";
           } else if (wargs.args.clockType == 'grayPlastic') {
                clockImage = wargs.widgetDir + "/images/clock-gray-plastic.png";
           } else if (wargs.args.clockType == 'plain') {
                clockImage = wargs.widgetDir + "/images/clock-plain.png";
           }
        }
        if (typeof wargs.args.label != 'undefined') {
            wLabel = wargs.args.label;
        }
        if (typeof wargs.args.labelColor != 'undefined') {
            wLabelColor = wargs.args.labelColor;
        }
        if (typeof wargs.args.topLabelColor != 'undefined') {
            wTopLabelColor = wargs.args.topLabelColor;
        }
        if (typeof wargs.args.handColor != 'undefined') {
            wHandColor = wargs.args.handColor;
        }
        if (typeof wargs.args.handBorderColor != 'undefined') {
            wHandStroke = wargs.args.handBorderColor;
        }
        if (typeof wargs.args.secondHandColor != 'undefined') {
            wSecondHandColor = wargs.args.secondHandColor;
        }
        if (typeof wargs.args.timeZoneOffset != 'undefined') {
            wTimeZoneOffset = wargs.args.timeZoneOffset;
        }
        if (typeof wargs.args.showAMPM != 'undefined') {
            showAMPM = wargs.args.showAMPM;
        }        
    }
    var mixins = {
        image: clockImage,
        timeZoneOffset:wTimeZoneOffset,
        label:wLabel,
        labelColor:wLabelColor,
        topLabelColor: wTopLabelColor,
        handColor:wHandColor,
        handStroke: wHandStroke,
        secondHandColor: wSecondHandColor,
        showAMPM : showAMPM

       }
       var _container = document.getElementById(wargs.uuid);
       if (!djd43.gfx.createSurface) {
           _container.innerHTML = "<div style='color:red'>This widget requres a browser that supports SVG / VML.</div>";
           return;
       }
       if (!_container) {
            var _t = setInterval(function() {
                if (document.getElementById(wargs.uuid)) {
                    clearInterval(_t);
                    _container = document.getElementById(wargs.uuid);
                    self.wrapper = djd43.widget.createWidget("Clock",mixins, _container);                
                }
            }, 25);
        } else {
            self.wrapper = djd43.widget.createWidget("Clock",mixins, _container); 
        }
}
