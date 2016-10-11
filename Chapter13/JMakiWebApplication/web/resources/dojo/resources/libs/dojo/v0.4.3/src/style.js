/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.style");
djd43.require("djd43.lang.common");
djd43.kwCompoundRequire({browser:["djd43.html.style"]});
djd43.deprecated("djd43.style", "replaced by djd43.html.style", "0.5");
djd43.lang.mixin(djd43.style, djd43.html);

