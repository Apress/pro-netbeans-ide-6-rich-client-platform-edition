/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.a11y");
djd43.require("djd43.uri.*");
djd43.require("djd43.html.common");
djd43.a11y = {imgPath:djd43.uri.moduleUri("djd43.widget", "templates/images"), doAccessibleCheck:true, accessible:null, checkAccessible:function () {
	if (this.accessible === null) {
		this.accessible = false;
		if (this.doAccessibleCheck == true) {
			this.accessible = this.testAccessible();
		}
	}
	return this.accessible;
}, testAccessible:function () {
	this.accessible = false;
	if (djd43.render.html.ie || djd43.render.html.mozilla) {
		var div = document.createElement("div");
		div.style.backgroundImage = "url(\"" + this.imgPath + "/tab_close.gif\")";
		djd43.body().appendChild(div);
		var bkImg = null;
		if (window.getComputedStyle) {
			var cStyle = getComputedStyle(div, "");
			bkImg = cStyle.getPropertyValue("background-image");
		} else {
			bkImg = div.currentStyle.backgroundImage;
		}
		var bUseImgElem = false;
		if (bkImg != null && (bkImg == "none" || bkImg == "url(invalid-url:)")) {
			this.accessible = true;
		}
		djd43.body().removeChild(div);
	}
	return this.accessible;
}, setCheckAccessible:function (bTest) {
	this.doAccessibleCheck = bTest;
}, setAccessibleMode:function () {
	if (this.accessible === null) {
		if (this.checkAccessible()) {
			djd43.render.html.prefixes.unshift("a11y");
		}
	}
	return this.accessible;
}};

