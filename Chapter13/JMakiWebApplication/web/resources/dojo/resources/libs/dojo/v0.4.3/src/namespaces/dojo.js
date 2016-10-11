/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

djd43.provide("djd43.namespaces.dojo");
djd43.require("djd43.ns");

(function(){
	// Mapping of all widget short names to their full package names
	// This is used for widget autoloading - no djd43.require() is necessary.
	// If you use a widget in markup or create one dynamically, then this
	// mapping is used to find and load any dependencies not already loaded.
	// You should use your own namespace for any custom widgets.
	// For extra widgets you use, djd43.declare() may be used to explicitly load them.
	// Experimental and deprecated widgets are not included in this table
	var map = {
		html: {
			"accordioncontainer": "djd43.widget.AccordionContainer",
			"animatedpng": "djd43.widget.AnimatedPng",
			"button": "djd43.widget.Button",
			"chart": "djd43.widget.Chart",
			"checkbox": "djd43.widget.Checkbox",
			"clock": "djd43.widget.Clock",
			"colorpalette": "djd43.widget.ColorPalette",
			"combobox": "djd43.widget.ComboBox",
			"combobutton": "djd43.widget.Button",
			"contentpane": "djd43.widget.ContentPane",
			"currencytextbox": "djd43.widget.CurrencyTextbox",
			"datepicker": "djd43.widget.DatePicker",
			"datetextbox": "djd43.widget.DateTextbox",
			"debugconsole": "djd43.widget.DebugConsole",
			"dialog": "djd43.widget.Dialog",
			"dropdownbutton": "djd43.widget.Button",
			"dropdowndatepicker": "djd43.widget.DropdownDatePicker",
			"dropdowntimepicker": "djd43.widget.DropdownTimePicker",
			"emaillisttextbox": "djd43.widget.InternetTextbox",
			"emailtextbox": "djd43.widget.InternetTextbox",
			"editor": "djd43.widget.Editor",
			"editor2": "djd43.widget.Editor2",
			"filteringtable": "djd43.widget.FilteringTable",
			"fisheyelist": "djd43.widget.FisheyeList",
			"fisheyelistitem": "djd43.widget.FisheyeList",
			"floatingpane": "djd43.widget.FloatingPane",
			"modalfloatingpane": "djd43.widget.FloatingPane",
			"form": "djd43.widget.Form",
			"googlemap": "djd43.widget.GoogleMap",
			"inlineeditbox": "djd43.widget.InlineEditBox",
			"integerspinner": "djd43.widget.Spinner",
			"integertextbox": "djd43.widget.IntegerTextbox",
			"ipaddresstextbox": "djd43.widget.InternetTextbox",
			"layoutcontainer": "djd43.widget.LayoutContainer",
			"linkpane": "djd43.widget.LinkPane",
			"popupmenu2": "djd43.widget.Menu2",
			"menuitem2": "djd43.widget.Menu2",
			"menuseparator2": "djd43.widget.Menu2",
			"menubar2": "djd43.widget.Menu2",
			"menubaritem2": "djd43.widget.Menu2",
			"pagecontainer": "djd43.widget.PageContainer",
			"pagecontroller": "djd43.widget.PageContainer",
			"popupcontainer": "djd43.widget.PopupContainer",
			"progressbar": "djd43.widget.ProgressBar",
			"radiogroup": "djd43.widget.RadioGroup",
			"realnumbertextbox": "djd43.widget.RealNumberTextbox",
			"regexptextbox": "djd43.widget.RegexpTextbox",
			"repeater": "djd43.widget.Repeater", 
			"resizabletextarea": "djd43.widget.ResizableTextarea",
			"richtext": "djd43.widget.RichText",
			"select": "djd43.widget.Select",
			"show": "djd43.widget.Show",
			"showaction": "djd43.widget.ShowAction",
			"showslide": "djd43.widget.ShowSlide",
			"slidervertical": "djd43.widget.Slider",
			"sliderhorizontal": "djd43.widget.Slider",
			"slider":"djd43.widget.Slider",
			"slideshow": "djd43.widget.SlideShow",
			"sortabletable": "djd43.widget.SortableTable",
			"splitcontainer": "djd43.widget.SplitContainer",
			"tabcontainer": "djd43.widget.TabContainer",
			"tabcontroller": "djd43.widget.TabContainer",
			"taskbar": "djd43.widget.TaskBar",
			"textbox": "djd43.widget.Textbox",
			"timepicker": "djd43.widget.TimePicker",
			"timetextbox": "djd43.widget.DateTextbox",
			"titlepane": "djd43.widget.TitlePane",
			"toaster": "djd43.widget.Toaster",
			"toggler": "djd43.widget.Toggler",
			"toolbar": "djd43.widget.Toolbar",
			"toolbarcontainer": "djd43.widget.Toolbar",
			"toolbaritem": "djd43.widget.Toolbar",
			"toolbarbuttongroup": "djd43.widget.Toolbar",
			"toolbarbutton": "djd43.widget.Toolbar",
			"toolbardialog": "djd43.widget.Toolbar",
			"toolbarmenu": "djd43.widget.Toolbar",
			"toolbarseparator": "djd43.widget.Toolbar",
			"toolbarspace": "djd43.widget.Toolbar",
			"toolbarselect": "djd43.widget.Toolbar",
			"toolbarcolordialog": "djd43.widget.Toolbar",
			"tooltip": "djd43.widget.Tooltip",
			"tree": "djd43.widget.Tree",
			"treebasiccontroller": "djd43.widget.TreeBasicController",
			"treecontextmenu": "djd43.widget.TreeContextMenu",
			"treedisablewrapextension": "djd43.widget.TreeDisableWrapExtension",
			"treedociconextension": "djd43.widget.TreeDocIconExtension",
			"treeeditor": "djd43.widget.TreeEditor",
			"treeemphasizeonselect": "djd43.widget.TreeEmphasizeOnSelect",
			"treeexpandtonodeonselect": "djd43.widget.TreeExpandToNodeOnSelect",
			"treelinkextension": "djd43.widget.TreeLinkExtension",
			"treeloadingcontroller": "djd43.widget.TreeLoadingController",
			"treemenuitem": "djd43.widget.TreeContextMenu",
			"treenode": "djd43.widget.TreeNode",
			"treerpccontroller": "djd43.widget.TreeRPCController",
			"treeselector": "djd43.widget.TreeSelector",
			"treetoggleonselect": "djd43.widget.TreeToggleOnSelect",
			"treev3": "djd43.widget.TreeV3",
			"treebasiccontrollerv3": "djd43.widget.TreeBasicControllerV3",
			"treecontextmenuv3": "djd43.widget.TreeContextMenuV3",
			"treedndcontrollerv3": "djd43.widget.TreeDndControllerV3",
			"treeloadingcontrollerv3": "djd43.widget.TreeLoadingControllerV3",
			"treemenuitemv3": "djd43.widget.TreeContextMenuV3",
			"treerpccontrollerv3": "djd43.widget.TreeRpcControllerV3",
			"treeselectorv3": "djd43.widget.TreeSelectorV3",
			"urltextbox": "djd43.widget.InternetTextbox",
			"usphonenumbertextbox": "djd43.widget.UsTextbox",
			"ussocialsecuritynumbertextbox": "djd43.widget.UsTextbox",
			"usstatetextbox": "djd43.widget.UsTextbox",
			"usziptextbox": "djd43.widget.UsTextbox",
			"validationtextbox": "djd43.widget.ValidationTextbox",
			"treeloadingcontroller": "djd43.widget.TreeLoadingController",
			"wizardcontainer": "djd43.widget.Wizard",
			"wizardpane": "djd43.widget.Wizard",
			"yahoomap": "djd43.widget.YahooMap"
		},
		svg: {
			"chart": "djd43.widget.svg.Chart"
		},
		vml: {
			"chart": "djd43.widget.vml.Chart"
		}
	};

	djd43.addDojoNamespaceMapping = function(/*String*/shortName, /*String*/packageName){
	// summary:
	//	Add an entry to the mapping table for the dojo: namespace
	//
	// shortName: the name to be used as the widget's tag name in the dojo: namespace
	// packageName: the path to the Javascript module in dotted package notation
		map[shortName]=packageName;    
	};
	
	function dojoNamespaceResolver(name, domain){
		if(!domain){ domain="html"; }
		if(!map[domain]){ return null; }
		return map[domain][name];    
	}

	djd43.registerNamespaceResolver("djd43", dojoNamespaceResolver);
})();
