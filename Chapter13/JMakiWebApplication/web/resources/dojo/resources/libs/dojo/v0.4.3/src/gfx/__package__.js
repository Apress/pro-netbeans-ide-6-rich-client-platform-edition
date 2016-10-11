/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.kwCompoundRequire({common:["djd43.gfx.color", "djd43.gfx.matrix", "djd43.gfx.common"]});
djd43.requireIf(djd43.render.svg.capable, "djd43.gfx.svg");
djd43.requireIf(djd43.render.vml.capable, "djd43.gfx.vml");
djd43.provide("djd43.gfx.*");

