/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
// define the namespaces
jmaki.namespace("jmaki.widgets.dojo.etable") ;

/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

djd43.require("djd43.date.format");
djd43.require("djd43.collections.Store");
djd43.require("djd43.html.*");
djd43.require("djd43.html.util");
djd43.require("djd43.html.style");
djd43.require("djd43.html.selection");
djd43.require("djd43.event.*");
djd43.require("djd43.widget.*");
djd43.require("djd43.widget.HtmlWidget");

djd43.widget.defineWidget(
	"djd43.EditableFilteringTable", 
	djd43.widget.HtmlWidget, 
	function(){
		//	summary
		//	Initializes all properties for the widget.
		this.store=new djd43.collections.Store();

		//declare per instance changeable widget properties
		this.valueField="Id";
		this.multiple=false;
		this.maxSelect=0;
		this.maxSortable=1;  // how many columns can be sorted at once.
		this.minRows=0;
		this.defaultDateFormat = "%D";
		this.isInitialized=false;
		this.alternateRows=false;

		this.columns=[];
		this.sortInformation=[{
			index:0,
			direction:0
		}];

		// CSS definitions
		this.headClass="";
		this.tbodyClass="";
		this.headerClass="";
		this.headerUpClass="selectedUp";
		this.headerDownClass="selectedDown";
		this.rowClass="";
		this.rowAlternateClass="alt";
		this.rowSelectedClass="selected";
		this.columnSelected="sorted-column";
	},
{
	//	dojo widget properties
	isContainer: false,
	templatePath: null,
	templateCssPath: null,

	//	methods.
	getTypeFromString: function(/* string */s){
		//	summary
		//	Gets a function based on the passed string.
		var parts = s.split("."), i = 0, obj = dj_global; 
		do{ 
			obj = obj[parts[i++]]; 
		} while (i < parts.length && obj); 
		return (obj != dj_global) ? obj : null;	//	function
	},

	//	custom data access.
	getByRow: function(/*HTMLTableRow*/row){
		//	summary
		//	Returns the data object based on the passed row.
		return this.store.getByKey(djd43.html.getAttribute(row, "value"));	//	object
	},
	getDataByRow: function(/*HTMLTableRow*/row){
		//	summary
		//	Returns the source data object based on the passed row.
		return this.store.getDataByKey(djd43.html.getAttribute(row, "value")); // object
	},

	getRow: function(/* Object */ obj){
		//	summary
		//	Finds the row in the table based on the passed data object.
		var rows = this.domNode.tBodies[0].rows;
		for(var i=0; i<rows.length; i++){
			if(this.store.getDataByKey(djd43.html.getAttribute(rows[i], "value")) == obj){
				return rows[i];	//	HTMLTableRow
			}
		}
		return null;	//	HTMLTableRow
	},
	getColumnIndex: function(/* string */fieldPath){
		//	summary
		//	Returns index of the column that represents the passed field path.
		for(var i=0; i<this.columns.length; i++){
			if(this.columns[i].getField() == fieldPath){
				return i;	//	integer
			}
		}
		return -1;	//	integer
	},

	getSelectedData: function(){
		//	summary
		//	returns all objects that are selected.
		var data=this.store.get();
		var a=[];
		for(var i=0; i<data.length; i++){
			if(data[i].isSelected){
				a.push(data[i].src);
			}
		}
		if(this.multiple){
			return a;		//	array
		} else {
			return a[0];	//	object
		}
	},
	
	isSelected: function(/* object */obj){
		//	summary
		//	Returns whether the passed object is currently selected.
		var data = this.store.get();
		for(var i=0; i<data.length; i++){
			if(data[i].src == obj){
				return true;	//	boolean
			}
		}
		return false;	//	boolean
	},
	isValueSelected: function(/* string */val){
		//	summary
		//	Returns the object represented by key "val" is selected.
		var v = this.store.getByKey(val);
		if(v){
			return v.isSelected;	//	boolean
		}
		return false;	//	boolean
	},
	isIndexSelected: function(/* number */idx){
		//	summary
		//	Returns the object represented by integer "idx" is selected.
		var v = this.store.getByIndex(idx);
		if(v){
			return v.isSelected;	//	boolean
		}
		return false;	//	boolean
	},
	isRowSelected: function(/* HTMLTableRow */row){
		//	summary
		//	Returns if the passed row is selected.
		var v = this.getByRow(row);
		if(v){
			return v.isSelected;	//	boolean
		}
		return false;	//	boolean
	},

	reset: function(){
		//	summary
		//	Resets the widget to its initial internal state.
		this.store.clearData();
		this.columns = [];
		this.sortInformation = [ {index:0, direction:0} ];
		this.resetSelections();
		this.isInitialized = false;
		this.onReset();
	},
	resetSelections: function(){
		//	summary
		//	Unselects all data objects.
		this.store.forEach(function(element){
			element.isSelected = false;
		});
	},
	onReset:function(){ 
		//	summary
		//	Stub for onReset event.
	},

	//	selection and toggle functions
	select: function(/*object*/ obj){
		//	summary
		//	selects the passed object.
		var data = this.store.get();
		for(var i=0; i<data.length; i++){
			if(data[i].src == obj){
				data[i].isSelected = true;
				break;
			}
		}
		this.onDataSelect(obj);
	},
	selectByValue: function(/*string*/ val){
		//	summary
		//	selects the object represented by key "val".
		this.select(this.store.getDataByKey(val));
	},
	selectByIndex: function(/*number*/ idx){
		//	summary
		//	selects the object represented at index "idx".
		this.select(this.store.getDataByIndex(idx));
	},
	selectByRow: function(/*HTMLTableRow*/ row){
		//	summary
		//	selects the object represented by HTMLTableRow row.
		this.select(this.getDataByRow(row));
	},
	selectAll: function(){
		//	summary
		//	selects all objects.
		this.store.forEach(function(element){
			element.isSelected = true;
		});
	},
	onDataSelect: function(/* object */obj){ 
		//	summary
		//	Stub for onDataSelect event.
	},

	toggleSelection: function(/*object*/obj){
		//	summary
		//	Flips the selection state of passed obj.
		var data = this.store.get();
		for(var i=0; i<data.length; i++){
			if(data[i].src == obj){
				data[i].isSelected = !data[i].isSelected;
				break;
			}
		}
		this.onDataToggle(obj);
	},
	toggleSelectionByValue: function(/*string*/val){
		//	summary
		//	Flips the selection state of object represented by val.
		this.toggleSelection(this.store.getDataByKey(val));
	},
	toggleSelectionByIndex: function(/*number*/idx){
		//	summary
		//	Flips the selection state of object at index idx.
		this.toggleSelection(this.store.getDataByIndex(idx));
	},
	toggleSelectionByRow: function(/*HTMLTableRow*/row){
		//	summary
		//	Flips the selection state of object represented by row.
		this.toggleSelection(this.getDataByRow(row));
	},
	toggleAll: function(){
		//	summary
		//	Flips the selection state of all objects.
		this.store.forEach(function(element){
			element.isSelected = !element.isSelected;
		});
	},
	onDataToggle: function(/* object */obj){ 
		//	summary
		//	Stub for onDataToggle event.
	},

	//	parsing functions, from HTML to metadata/SimpleStore
	_meta:{
		field:null,
		format:null,
		filterer:null,
		noSort:false,
		sortType:"String",
		dataType:String,
		sortFunction:null,
		filterFunction:null,
		label:null,
		align:"left",
		valign:"middle",
		getField:function(){ 
			return this.field || this.label; 
		},
		getType:function(){ 
			return this.dataType; 
		}
	},
	createMetaData: function(/* object */obj){
		//	summary
		//	Take a JSON-type structure and make it into a ducktyped metadata object.
		for(var p in this._meta){
			//	rudimentary mixin
			if(!obj[p]){
				obj[p] = this._meta[p];
			}
		}
		if(!obj.label){
			obj.label=obj.field;
		}
		if(!obj.filterFunction){
			obj.filterFunction=this._defaultFilter;
		}
		return obj;	//	object
	},
	parseMetadata: function(/* HTMLTableHead */head){
		//	summary
		//	Parses the passed HTMLTableHead element to create meta data.
		this.columns=[];
		this.sortInformation=[];
		var row = head.getElementsByTagName("tr")[0];
		var cells = row.getElementsByTagName("td");
		if (cells.length == 0){
			cells = row.getElementsByTagName("th");
		}
		for(var i=0; i<cells.length; i++){
			var o = this.createMetaData({ });
			
			//	presentation attributes
			if(djd43.html.hasAttribute(cells[i], "align")){
				o.align = djd43.html.getAttribute(cells[i],"align");
			}
			if(djd43.html.hasAttribute(cells[i], "valign")){
				o.valign = djd43.html.getAttribute(cells[i],"valign");
			}
			if(djd43.html.hasAttribute(cells[i], "nosort")){
				o.noSort = (djd43.html.getAttribute(cells[i],"nosort")=="true");
			}
			if(djd43.html.hasAttribute(cells[i], "sortusing")){
				var trans = djd43.html.getAttribute(cells[i],"sortusing");
				var f = this.getTypeFromString(trans);
				if (f != null && f != window && typeof(f)=="function"){
					o.sortFunction=f;
				}
			}
			o.label = djd43.html.renderedTextContent(cells[i]);
			if(djd43.html.hasAttribute(cells[i], "field")){
				o.field=djd43.html.getAttribute(cells[i],"field");
			} else if(o.label.length > 0){
				o.field=o.label;
			} else {
				o.field = "field" + i;
			}
			if(djd43.html.hasAttribute(cells[i], "format")){
				o.format=djd43.html.getAttribute(cells[i],"format");
			}
			if(djd43.html.hasAttribute(cells[i], "dataType")){
				var sortType = djd43.html.getAttribute(cells[i],"dataType");
				if(sortType.toLowerCase()=="html" || sortType.toLowerCase()=="markup"){
					o.sortType = "__markup__";	//	always convert to "__markup__"
				}else{
					var type = this.getTypeFromString(sortType);
					if(type){
						o.sortType = sortType;
						o.dataType = type;
					}
				}
			}

			//	TODO: set up filtering mechanisms here.
			if(djd43.html.hasAttribute(cells[i], "filterusing")){
				var trans = djd43.html.getAttribute(cells[i],"filterusing");
				var f = this.getTypeFromString(trans);
				if (f != null && f != window && typeof(f)=="function"){
					o.filterFunction=f;
				}
			}
			
			this.columns.push(o);

			//	check to see if there's a default sort, and set the properties necessary
			if(djd43.html.hasAttribute(cells[i], "sort")){
				var info = {
					index:i,
					direction:0
				};
				var dir = djd43.html.getAttribute(cells[i], "sort");
				if(!isNaN(parseInt(dir))){
					dir = parseInt(dir);
					info.direction = (dir != 0) ? 1 : 0;
				}else{
					info.direction = (dir.toLowerCase() == "desc") ? 1 : 0;
				}
				this.sortInformation.push(info);
			}
		}
		if(this.sortInformation.length == 0){
			this.sortInformation.push({
				index:0,
				direction:0
			});
		} else if (this.sortInformation.length > this.maxSortable){
			this.sortInformation.length = this.maxSortable;
		}
	},
	parseData: function(/* HTMLTableBody */body){
		//	summary
		//	Parse HTML data into native JSON structure for the store.
		if(body.rows.length == 0 && this.columns.length == 0){
			return;	//	there's no data, ignore me.
		}

		//	create a data constructor based on what we've got for the fields.
		var _widget=this;
		this["__selected__"] = [];
		var arr = this.store.getFromHtml(this.columns, body, function(obj, row){
			obj[_widget.valueField] = djd43.html.getAttribute(row, "value");
			if(djd43.html.getAttribute(row, "selected")=="true"){
				_widget["__selected__"].push(obj);
			}
		});
		this.store.setData(arr);
		for(var i=0; i<this["__selected__"].length; i++){
			this.select(this["__selected__"][i]);
		}
		this.renderSelections();

		delete this["__selected__"];

		//	say that we are already initialized so that we don't kill anything
		this.isInitialized=true;
	},

	//	standard events
	onSelect: function(/* HTMLEvent */e){
 
		//	summary
		//	Handles the onclick event of any element.
		var row = djd43.html.getParentByType(e.target,"tr");
		if(djd43.html.hasAttribute(row,"emptyRow")){
			return;
		}
		var body = djd43.html.getParentByType(row,"tbody");
		if(this.multiple){
			if(e.shiftKey){
				var startRow;
				var rows=body.rows;
				for(var i=0;i<rows.length;i++){
					if(rows[i]==row){
						break;
					}
					if(this.isRowSelected(rows[i])){
						startRow=rows[i];
					}
				}
				if(!startRow){
					startRow = row;
					for(; i<rows.length; i++){
						if(this.isRowSelected(rows[i])){
							row = rows[i];
							break;
						}
					}
				}
				this.resetSelections();
				if(startRow == row){
					this.toggleSelectionByRow(row);
				} else {
					var doSelect = false;
					for(var i=0; i<rows.length; i++){
						if(rows[i] == startRow){
							doSelect=true;
						}
						if(doSelect){
							this.selectByRow(rows[i]);
						}
						if(rows[i] == row){
							doSelect = false;
						}
					}
				}
			} else {
				this.toggleSelectionByRow(row);
			}
		} else {
			this.resetSelections();
			this.toggleSelectionByRow(row);
		}
		this.renderSelections();
	},
	onSort: function(/* HTMLEvent */e){
            //	summary
		//	Sort the table based on the column selected.
		var oldIndex=this.sortIndex;
		var oldDirection=this.sortDirection;
		
		var source=e.target;
		var row=djd43.html.getParentByType(source,"tr");
		var cellTag="td";
		if(row.getElementsByTagName(cellTag).length==0){
			cellTag="th";
		}

		var headers=row.getElementsByTagName(cellTag);
		var header=djd43.html.getParentByType(source,cellTag);
		
		for(var i=0; i<headers.length; i++){
			djd43.html.setClass(headers[i], this.headerClass);
			if(headers[i]==header){
				if(this.sortInformation[0].index != i){
					this.sortInformation.unshift({ 
						index:i, 
						direction:0
					});
				} else {
					this.sortInformation[0] = {
						index:i,
						direction:(~this.sortInformation[0].direction)&1
					};
				}
			}
		}

		this.sortInformation.length = Math.min(this.sortInformation.length, this.maxSortable);
		for(var i=0; i<this.sortInformation.length; i++){
			var idx=this.sortInformation[i].index;
			var dir=(~this.sortInformation[i].direction)&1;
			djd43.html.setClass(headers[idx], dir==0?this.headerDownClass:this.headerUpClass);
		}
		this.render();
	},
	onFilter: function(){
		//	summary
		//	show or hide rows based on the parameters of the passed filter.
	},

	//	Filtering methods
	_defaultFilter: function(/* Object */obj){
		//	summary
		//	Always return true as the result of the default filter.
		return true;
	},
	setFilter: function(/* string */field, /* function */fn){
		//	summary
		//	set a filtering function on the passed field.
		for(var i=0; i<this.columns.length; i++){
			if(this.columns[i].getField() == field){
				this.columns[i].filterFunction=fn;
				break;
			}
		}
		this.applyFilters();
	},
	setFilterByIndex: function(/* number */idx, /* function */fn){
		//	summary
		//	set a filtering function on the passed column index.
		this.columns[idx].filterFunction=fn;
		this.applyFilters();
	},
	clearFilter: function(/* string */field){
		//	summary
		//	clear a filtering function on the passed field.
		for(var i=0; i<this.columns.length; i++){
			if(this.columns[i].getField() == field){
				this.columns[i].filterFunction=this._defaultFilter;
				break;
			}
		}
		this.applyFilters();
	}, 
	clearFilterByIndex: function(/* number */idx){
		//	summary
		//	clear a filtering function on the passed column index.
		this.columns[idx].filterFunction=this._defaultFilter;
		this.applyFilters();
	}, 
	clearFilters: function(){
		//	summary
		//	clears all filters.
		for(var i=0; i<this.columns.length; i++){
			this.columns[i].filterFunction=this._defaultFilter;
		}
		//	we'll do the clear manually, it will be faster.
		var rows=this.domNode.tBodies[0].rows;
		for(var i=0; i<rows.length; i++){
			rows[i].style.display="";
			if(this.alternateRows){
				djd43.html[((i % 2 == 1)?"addClass":"removeClass")](rows[i], this.rowAlternateClass);
			}
		}
		this.onFilter();
	},
	applyFilters: function(){
		//	summary
		//	apply all filters to the table.
		var alt=0;
		var rows=this.domNode.tBodies[0].rows;
		for(var i=0; i<rows.length; i++){
			var b=true;
			var row=rows[i];
			for(var j=0; j<this.columns.length; j++){
				var value = this.store.getField(this.getDataByRow(row), this.columns[j].getField());
				if(this.columns[j].getType() == Date && value != null && !value.getYear){
					value = new Date(value);
				}
				if(!this.columns[j].filterFunction(value)){
					b=false;
					break;
				}
			}
			row.style.display=(b?"":"none");
			if(b && this.alternateRows){
				djd43.html[((alt++ % 2 == 1)?"addClass":"removeClass")](row, this.rowAlternateClass);
			}
		}
		this.onFilter();
	},

	//	sorting functionality
	createSorter: function(/* array */info){
		//	summary
		//	creates a custom function to be used for sorting.
		var _widget=this;
		var sortFunctions=[];	//	our function stack.
	
		function createSortFunction(fieldIndex, dir){
			var meta=_widget.columns[fieldIndex];
			var field=meta.getField();
			return function(rowA, rowB){
				if(djd43.html.hasAttribute(rowA,"emptyRow") || djd43.html.hasAttribute(rowB,"emptyRow")){
					return -1;
				}
				//	TODO: check for markup and compare by rendered text.
				var a = _widget.store.getField(_widget.getDataByRow(rowA), field);
				var b = _widget.store.getField(_widget.getDataByRow(rowB), field);
				var ret = 0;
				if(a > b) ret = 1;
				if(a < b) ret = -1;
				return dir * ret;
			}
		}

		var current=0;
		var max = Math.min(info.length, this.maxSortable, this.columns.length);
		while(current < max){
			var direction = (info[current].direction == 0) ? 1 : -1;
			sortFunctions.push(
				createSortFunction(info[current].index, direction)
			);
			current++;
		}

		return function(rowA, rowB){
			var idx=0;
			while(idx < sortFunctions.length){
				var ret = sortFunctions[idx++](rowA, rowB);
				if(ret != 0) return ret;
			}
			//	if we got here then we must be equal.
			return 0; 	
		};	//	function
	},

	//	rendering
	createRow: function(/* object */obj){
		//	summary
		//	Create an HTML row based on the passed object
		var row=document.createElement("tr");
		djd43.html.disableSelection(row);
		if(obj.key != null){
			row.setAttribute("value", obj.key);
		}
                
		for(var j=0; j<this.columns.length; j++){
			var cell=document.createElement("td");
			cell.setAttribute("align", this.columns[j].align);
			cell.setAttribute("valign", this.columns[j].valign);
			djd43.html.disableSelection(cell);
			var val = this.store.getField(obj.src, this.columns[j].getField());
			if(typeof(val)=="undefined"){
				val="";
			}
			this.fillCell(cell, this.columns[j], val, true, j, obj.key );
			row.appendChild(cell);
		}
                
		return row;	//	HTMLTableRow
	},
	fillCell: function(/* HTMLTableCell */cell, /* object */meta, /* object */val, /*editable*/editable, row, column){
		//	summary
		//	Fill the passed cell with value, based on the passed meta object.
            var _val = ""; 
            if(meta.sortType=="__markup__"){
			_val =val;
		} else {
			if(meta.getType()==Date) {
				val=new Date(val);
				if(!isNaN(val)){
					var format = this.defaultDateFormat;
					if(meta.format){
						format = meta.format;
					}
					_val = djd43.date.strftime(val, format);
				} else {
					_val = val;
				}
			} else if ("Number number int Integer float Float".indexOf(meta.getType())>-1){
				//	TODO: number formatting
				if(val.length == 0){
					val="0";
				}
				var n = parseFloat(val, 10) + "";
				//	TODO: numeric formatting + rounding :)
				if(n.indexOf(".")>-1){
					n = djd43.math.round(parseFloat(val,10),2);
				}
				_val = n;
			} else {
	        	_val = val;
			}
            //ADDED by gmurray
            var _d = document.createElement("div");
            cell.id = "_cell_" + row + "_" + column;
            var formElement = document.createElement("form");
            formElement.className = "eTableEditForm";
            formElement.onsubmit = function() {
                return false;
            }
            djd43.event.connect(formElement, "onsubmit", this, "updateCell");
            var inputElement = document.createElement("input");
            inputElement.setAttribute("type", "text");
            inputElement.className = "eTableEditable";
            inputElement.value = _val;
            
            formElement.appendChild(inputElement);
            _d.className = "etableEditCell";
            _d.innerHTML = _val;
            cell.appendChild(_d);
            formElement.style.display = "none";
            cell.appendChild(formElement);
            djd43.event.connect(cell, "ondblclick", this, "makeCellEditable");
		}
	},
        makeCellEditable : function(e) {
            var cell = (typeof window.event == 'undefined') ? e.target : window.event.srcElement;
            if (cell.nodeName.toLowerCase().indexOf("div") != -1) {
                var _bw = cell.clientWidth;
                var _bh = cell.clientHeight;
                cell = cell.parentNode;
                //remove the onclick listener
                djd43.event.disconnect(cell, "ondblclick",this, "makeCellEditable");
                var div = cell.childNodes[0];
                div.style.display = "none";
                var form = cell.childNodes[1];
                //cell.style.height =  _bh + "px";
                form.style.display = "";
                form.style.height =   "0px";
                cell.style.width = _bw + "px";
                //form.select(); 
                form.firstChild.focus();
            }
        },
                
        updateCell: function(e){
            var form = (typeof window.event == 'undefined') ? e.target : window.event.srcElement;
            if (form.nodeName.toLowerCase().indexOf("form") == -1) {
                form = form.parentNode;
            }
            var value = form.firstChild.value;
            var cell = form.parentNode;
            form.style.display = "none";
            var d = cell.firstChild;
            d.innerHTML = value;
            d.style.display = "";
            // get the row key and column and call onAddRow
            var id = cell.id.split("_cell_")[1];
            var sp = id.split("_");
            this.onCellUpdate(sp[0], sp[1], value);
            // add event back
            djd43.event.connect(cell, "ondblclick", this, "makeCellEditable");
            return false;
        },
    onCellUpdate: function(col,row, value) {
        },
	prefill: function(){
		//	summary
		//	if there's no data in the table, then prefill it with this.minRows.
		this.isInitialized = false;
		var body = this.domNode.tBodies[0];
		while (body.childNodes.length > 0){
			body.removeChild(body.childNodes[0]);
		}
		
		if(this.minRows>0){
			for(var i=0; i < this.minRows; i++){
				var row = document.createElement("tr");
				if(this.alternateRows){
					djd43.html[((i % 2 == 1)?"addClass":"removeClass")](row, this.rowAlternateClass);
				}
				row.setAttribute("emptyRow","true");
				for(var j=0; j<this.columns.length; j++){
					var cell = document.createElement("td");
					cell.innerHTML = "&nbsp;";
					row.appendChild(cell);
				}
				body.appendChild(row);
			}
		}
	},
	init: function(){
		//	summary
		//	initializes the table of data
		this.isInitialized=false;

		//	if there is no thead, create it now.
		var head=this.domNode.getElementsByTagName("thead")[0];
		if(head.getElementsByTagName("tr").length == 0){
			//	render the column code.
			var row=document.createElement("tr");
			for(var i=0; i<this.columns.length; i++){
				var cell=document.createElement("td");
				cell.setAttribute("align", this.columns[i].align);
				cell.setAttribute("valign", this.columns[i].valign);
				djd43.html.disableSelection(cell);
				cell.innerHTML=this.columns[i].label;
				row.appendChild(cell);

				//	attach the events.
				if(!this.columns[i].noSort){
					djd43.event.connect(cell, "onclick", this, "onSort");
				}
			}
			djd43.html.prependChild(row, head);
		}
		
		if(this.store.get().length == 0){
			return false;
		}

		var idx=this.domNode.tBodies[0].rows.length;
		if(!idx || idx==0 || this.domNode.tBodies[0].rows[0].getAttribute("emptyRow")=="true"){
			idx = 0;
			var body = this.domNode.tBodies[0];
			while(body.childNodes.length>0){
				body.removeChild(body.childNodes[0]);
			}

			var data = this.store.get();
			for(var i=0; i<data.length; i++){
				var row = this.createRow(data[i]);
				djd43.event.connect(row, "onclick", this, "onSelect");
				body.appendChild(row);
				idx++;
			}
		}

		//	add empty rows
		if(this.minRows > 0 && idx < this.minRows){
			idx = this.minRows - idx;
			for(var i=0; i<idx; i++){
				row=document.createElement("tr");
				row.setAttribute("emptyRow","true");
				for(var j=0; j<this.columns.length; j++){
					cell=document.createElement("td");
					cell.innerHTML="&nbsp;";
					row.appendChild(cell);
				}
				body.appendChild(row);
			}
		}

		//	last but not least, show any columns that have sorting already on them.
		var row=this.domNode.getElementsByTagName("thead")[0].rows[0];
		var cellTag="td";
		if(row.getElementsByTagName(cellTag).length==0) cellTag="th";
		var headers=row.getElementsByTagName(cellTag);
		for(var i=0; i<headers.length; i++){
			djd43.html.setClass(headers[i], this.headerClass);
		}
		for(var i=0; i<this.sortInformation.length; i++){
			var idx=this.sortInformation[i].index;
			var dir=(~this.sortInformation[i].direction)&1;
			djd43.html.setClass(headers[idx], dir==0?this.headerDownClass:this.headerUpClass);
		}

		this.isInitialized=true;
		return this.isInitialized;
	},
	render: function(){
		//	summary
		//	Renders the actual table data.

	/*	The method that should be called once underlying changes
	 *	are made, including sorting, filtering, data changes.
	 *	Rendering the selections themselves are a different method,
	 *	which render() will call as the last step.
	 ****************************************************************/
		if(!this.isInitialized){
			var b = this.init();
			if(!b){
				this.prefill();
				return;
			}
		}
		
		//	do the sort
		var rows=[];
		var body=this.domNode.tBodies[0];
		var emptyRowIdx=-1;
		for(var i=0; i<body.rows.length; i++){
			rows.push(body.rows[i]);
		}

		//	build the sorting function, and do the sorting.
		var sortFunction = this.createSorter(this.sortInformation);
		if(sortFunction){
			rows.sort(sortFunction);
		}

		//	append the rows without killing them, this should help with the HTML problems.
		for(var i=0; i<rows.length; i++){
			if(this.alternateRows){
				djd43.html[((i%2==1)?"addClass":"removeClass")](rows[i], this.rowAlternateClass);
			}
			djd43.html[(this.isRowSelected(body.rows[i])?"addClass":"removeClass")](body.rows[i], this.rowSelectedClass);
			body.appendChild(rows[i]);
		}
	},
	renderSelections: function(){
		//	summary
		//	Render all selected objects using CSS.
		var body=this.domNode.tBodies[0];
		for(var i=0; i<body.rows.length; i++){
			djd43.html[(this.isRowSelected(body.rows[i])?"addClass":"removeClass")](body.rows[i], this.rowSelectedClass);
		}
	},

	//	widget lifetime handlers
	initialize: function(){ 
		//	summary
		//	Initializes the widget.
		var _widget=this;
		//	connect up binding listeners here.
		djd43.event.connect(this.store, "onSetData", function(){                 
			_widget.store.forEach(function(element){
				element.isSelected = false;
			});
			_widget.isInitialized=false;
			var body = _widget.domNode.tBodies[0];
			if(body){
				while(body.childNodes.length>0){
					body.removeChild(body.childNodes[0]);
				}
			}
			_widget.render();
		});
		djd43.event.connect(this.store, "onClearData", function(){
			_widget.render();
		});
		djd43.event.connect(this.store, "onAddData", function(addedObject){
			var row=_widget.createRow(addedObject);
			djd43.event.connect(row, "onclick", _widget, "onSelect");
			_widget.domNode.tBodies[0].appendChild(row);
			_widget.render();
		});
		djd43.event.connect(this.store, "onAddDataRange", function(arr){
			for(var i=0; i<arr.length; i++){
				arr[i].isSelected=false;
				var row=_widget.createRow(arr[i]);
				djd43.event.connect(row, "onclick", _widget, "onSelect");
				_widget.domNode.tBodies[0].appendChild(row);
			};
			_widget.render();
		});
		djd43.event.connect(this.store, "onRemoveData", function(removedObject){
			var rows = _widget.domNode.tBodies[0].rows;
			for(var i=0; i<rows.length; i++){
				if(_widget.getDataByRow(rows[i]) == removedObject.src){
					rows[i].parentNode.removeChild(rows[i]);
					break;
				}
			}
			_widget.render();
		});
		djd43.event.connect(this.store, "onUpdateField", function(obj, fieldPath, val){
			var row = _widget.getRow(obj);
			var idx = _widget.getColumnIndex(fieldPath);
			if(row && row.cells[idx] && _widget.columns[idx]){
				_widget.fillCell(row.cells[idx], _widget.columns[idx], val);
			}
		});
	},
	postCreate: function(){
		//	summary
		//	finish widget initialization.
		this.store.keyField = this.valueField;

		if(this.domNode){
			//	start by making sure domNode is a table element;
			if(this.domNode.nodeName.toLowerCase() != "table"){
			}

			//	see if there is columns set up already
			if(this.domNode.getElementsByTagName("thead")[0]){
				var head=this.domNode.getElementsByTagName("thead")[0];
				if(this.headClass.length > 0){
					head.className = this.headClass;
				}
				djd43.html.disableSelection(this.domNode);
				this.parseMetadata(head);

				var header="td";
				if(head.getElementsByTagName(header).length==0){
					header="th";
				}
				var headers = head.getElementsByTagName(header);
				for(var i=0; i<headers.length; i++){
					if(!this.columns[i].noSort){
						djd43.event.connect(headers[i], "onclick", this, "onSort");
					}
				}
			} else {
				this.domNode.appendChild(document.createElement("thead"));
			}

			// if the table doesn't have a tbody already, add one and grab a reference to it
			if (this.domNode.tBodies.length < 1) {
				var body = document.createElement("tbody");
				this.domNode.appendChild(body);
			} else {
				var body = this.domNode.tBodies[0];
			}

			if (this.tbodyClass.length > 0){
				body.className = this.tbodyClass;
			}
			this.parseData(body);
		}
	}
        });

jmaki.widgets.dojo.etable.Widget = function(wargs) {
    var _widget = this;
    var columns = [];

    var uuid = wargs.uuid;
    var topic = "/dojo/etable";
    var subscribe = ["/dojo/etable", "/table"];
    var filter = "jmaki.filters.tableModelFilter";
    var counter = 0;
    var container = document.getElementById(uuid);
    var table;

    var showedModelWarning = false;
    
    function showModelDeprecation() {
        if (!showedModelWarning) {
             jmaki.log("Dojo etable widget uses the incorrect data format. " +
                       "Please see <a href='http://wiki.java.net/bin/view/Projects/jMakiTableDataModel'>" +
                       "http://wiki.java.net/bin/view/Projects/jMakiTableDataModel</a> for the proper format.");
             showedModelWarning = true;
        }   
    }
    
    function genId() {
        return wargs.uuid + "_nid_" + counter++;
    }
         
    if (wargs.args) {
        if (wargs.args.topic) {
            topic = wargs.args.topic;
	    jmaki.log("Dojo etable: widget uses deprecated topic property. Use publish instead. ");
        }
        if (wargs.args.filter) {
           filter = wargs.args.filter;
        }        
    }
    if (wargs.publish ) {
	topic = wargs.publish;
     }
     
    if (wargs.subscribe){
        if (typeof wargs.subscribe == "string") {
            subscribe = [];
            subscribe.push(wargs.subscribe);
        } else {
            subscribe = wargs.subscribe;
        }
    }
    
    // initialize the widget
    this.init = function() {   
        // backwards compatibility
        if (typeof columns[0] != 'object') { 
            showedModelWarning();
        } else if (_widget.rows.length > 0 && _widget.rows[0] instanceof Array) {
            showedModelWarning();
        }           
        table = djd43.widget.createWidget("EditableFilteringTable",{valueField: "id"},container);
         
        // provide generic column names if they were not provided.
        for (var l = 0; l < columns.length; l++) {
            var c = columns[l];
            if (!c.id)c.id = l + "" ;              
            c.field =  c.id;
            if (c.title)  c.label = c.title;
            c.dataType = "String";
        }
        
        for (var x = 0; x < columns.length; x++) {
            table.columns.push(table.createMetaData(columns[x]));
        }
        
        var data = [];

        // add an Id for everything as it is needed for sorting
        for (var i=0; i < _widget.rows.length; i++) {
            var nRow;
 
            if (!(_widget.rows[i] instanceof Array)) {
              nRow = _widget.rows[i];
            } else {
               nRow = {};
               for (var cl = 0; cl < columns.length; cl++) { 
                   nRow[columns[cl].id] = _widget.rows[i][cl];
                }
            }
            if (typeof _widget.rows[i].id == "undefined") {          
                nRow.id = genId();
            } else {
                nRow.id = _widget.rows[i].id;
            }
            data.push(nRow);
        }
        table.store.setData(data);
        djd43.event.connect(table, "onSelect", _widget, "onSelect");
        djd43.event.connect(table, "onCellUpdate", _widget, "onCellUpdate");        
    }

   
      // set columns from the widget arguments if provided.
    if (wargs.args && wargs.args.columns) {
        columns = wargs.args.columns;     
    }
    
    // pull in the arguments
    if (wargs.value) {
        // convert value if a jmakiRSS type
        if (wargs.value.dataType == 'jmakiRSS') {
           wargs.value = jmaki.filter(wargs.value, filter);
        }
        if (wargs.value.rows){
            _widget.rows = wargs.value.rows;
        } else if (wargs.value instanceof  Array) {
            _widget.rows = wargs.value;
        }
        if (wargs.value.columns) {
            columns = wargs.value.columns;
        }
        _widget.init();
        
    } else if (wargs.service) {
        djd43.io.bind({
            url: wargs.service,
            method: "get",
            mimetype: "text/json",
            load: function (type,data,evt) {
                if (data == false) {
                    container.innerHTML = "Data format error loading data from " + wargs.service;
                } else {
                    // convert value if a jmakiRSS type
                    if (data.dataType == 'jmakiRSS') {
                        data = jmaki.filter(data, filter);
                    }
                    if (data.rows) {
                        _widget.rows = data.rows;                   
                    }
                    if (data.columns) {
                       columns = data.columns;
                    }
                    _widget.init();
                }
            }
        });
    } else {
        djd43.io.bind({
            url: wargs.widgetDir + "/widget.json",
            method: "get",
            mimetype: "text/json",
            load: function (type,data,evt) {
                if (data == false) {
                    container.innerHTML = "Data format error loading data widget.json file.";
                } else {
                    var _d;
                    // convert value if a jmakiRSS type
                    if (data.dataType == 'jmakiRSS') {
                        _d = jmaki.filter(data, filter);
                    } else {
                        if (data.value.defaultValue) _d = data.value.defaultValue;
                    }
                    if (_d.rows) {
                        _widget.rows = _d.rows;                   
                    }
                    if (_d.columns) {
                       columns = _d.columns;                        
                    }
                    _widget.init();
                }
            }
        });
    }
    
    this.clearFilters = function(){
        table.clearFilters();
    };
    
    this.clear = function() {
        table.store.setData([]);        
        table.store.clearData();
        counter = 0;
    };
    
    this.addRows = function(b){
        if (b.message)b = b.message;
        for (var i=0; i < b.value.length; i++) {
            _widget.addRow({ value : b.value[i]}, false);
        }
    };
 
    this.removeRow = function(b){
        var index;
        if (b.message)b = b.message;
        if (b.targetId) {
           index = b.targetId;
        } else {
            index = b;
        }    
        if (index && table.store.getDataByKey(index)) {
            table.store.removeDataByKey(index);
        }
    };
    
    this.updateRow = function(b, d) {
        var index;
        var data;
        if (d) data = d;
        if (b.message) {
            b = b.message;
        }
        if (b.value) {
            data = b.value;    
        }
        if (b.targetId) {
           index = b.targetId;
        } else {
            index = b;
        }
        if (typeof index != 'undefined' && table.store.getDataByKey(index)) {
            var s = table.store.getDataByKey(index);
            if (s) {
                var r = table.getRow(s);
                for (var i in data) {
                  s[i] = data[i];    
                }
                // update the table cells to match the model
              	for (var j = 0; j < table.columns.length; j++) {
                    // update the visible
		    r.childNodes[j].childNodes[0].innerHTML = data[table.columns[j].id];
                    // update the input element
                    r.childNodes[j].childNodes[1].childNodes[0].value = data[table.columns[j].id];
                } 
            } 
        }
    };
    
    this.select = function(b){
        var index;
        if (b.message)b = b.message;
        if (b.targetId) {
           index = b.targetId;
        } else {
            index = b;
        }    
        if (index && table.store.getDataByKey(index)) {
            var s = table.store.getDataByKey(index);
            if (s) {
                var r = table.getRow(s);
                r.isSelected = true;         
                table.resetSelections();
                table.toggleSelectionByRow(r); 
                table.renderSelections();
                jmaki.publish(topic + "/onSelect", { widgetId : wargs.uuid, type : 'onSelect', targetId : index });
            }
        }
    };  
    
    this.addRow = function(b){
        var r;
        if (b.message)b = b.message;
        if (b.value) {
            r = b.value;
        } else {
            r = b;
        }
        var targetId;
        if (r.id) targetId = r.id;
        
        if (table.store.getDataByKey(targetId)) {
            jmaki.log(wargs.uuid  + " : Warning. Attempt to add record to dojo.etable with duplicate row id: " + targetId + ". Autogenerating new id.");
            r.id = genId();
        }
        
        // add an id for sorting if not defined
        if (typeof r.id == "undefined") {  
            r.id = genId();
        }
        table.store.addData(r, null, false);
     }
    
    this.onSelect = function(e) {

        var _s = [];
	var d = table.store.get();
	for (var i = 0; i < d.length; i++) {
            if (d[i].isSelected) {
	        _s.push(d[i].src.id);
            }
	}     
        // later we may want to support multiple selections
        jmaki.publish(topic + "/onSelect", { widgetId : wargs.uuid, type : 'onSelect', targetId : _s[0] });

    }

    this.clearFilters = function(){
        table.clearFilters();
    }
  
    this.onCellUpdate = function(column,row,value){
        jmaki.publish(topic + "/onCellEdit", {widgetId : wargs.uuid, topic : topic, type : 'onCellEdit', column:column, row: row, value: value});
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
        // track the subscribers so we can later remove them
        _widget.subs = [];
        for (var _i=0; _i < subscribe.length; _i++) {
            doSubscribe(subscribe[_i]  + "/clear", _widget.clear);
            doSubscribe(subscribe[_i]  + "/addRow", _widget.addRow);
            doSubscribe(subscribe[_i]  + "/addRows", _widget.addRows);
            doSubscribe(subscribe[_i]  + "/updateRow", _widget.updateRow);
            doSubscribe(subscribe[_i]  + "/removeRow", _widget.removeRow);
            doSubscribe(subscribe[_i]  + "/select", _widget.select);
        }                
    }
}