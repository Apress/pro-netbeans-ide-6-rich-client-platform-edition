/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

djd43.provide("djd43.docs");
djd43.require("djd43.io.*");
djd43.require("djd43.event.topic");
djd43.require("djd43.rpc.JotService");
djd43.require("djd43.dom");
djd43.require("djd43.uri.Uri");
djd43.require("djd43.Deferred");
djd43.require("djd43.DeferredList");

/*
 * TODO:
 *
 * Package summary needs to compensate for "is"
 * Handle host environments
 * Deal with djd43.widget weirdness
 * Parse parameters
 * Limit function parameters to only the valid ones (Involves packing parameters onto meta during rewriting)
 *
 */

djd43.docs = new function() {
	this._url = djd43.uri.dojoUri("docscripts");
	this._rpc = new djd43.rpc.JotService;
	this._rpc.serviceUrl = djd43.uri.dojoUri("docscripts/jsonrpc.php");
};
djd43.lang.mixin(djd43.docs, {
	_count: 0,
	_callbacks: {function_names: []},
	_cache: {}, // Saves the JSON objects in cache
	require: function(/*String*/ require, /*bool*/ sync) {
		djd43.debug("require(): " + require);
		var parts = require.split("/");
		
		var size = parts.length;
		var deferred = new djd43.Deferred;
		var args = {
			mimetype: "text/json",
			load: function(type, data){
				djd43.debug("require(): loaded for " + require);
				
				if(parts[0] != "function_names") {
					for(var i = 0, part; part = parts[i]; i++){
						data = data[part];
					}
				}
				deferred.callback(data);
			},
			error: function(){
				deferred.errback();
			}
		};

		if(location.protocol == "file:"){
			if(size){
				if(parts[parts.length - 1] == "documentation"){
					parts[parts.length - 1] = "meta";
				}
			
				if(parts[0] == "function_names"){
					args.url = [this._url, "local_json", "function_names"].join("/");
				}else{
					var dirs = parts[0].split(".");
					args.url = [this._url, "local_json", dirs[0]].join("/");
					if(dirs.length > 1){
						args.url = [args.url, dirs[1]].join(".");
					}
				}
			}
		}
		
		djd43.io.bind(args);
		return deferred;
	},
	getFunctionNames: function(){
		return this.require("function_names"); // djd43.Deferred
	},
	unFormat: function(/*String*/ string){
		var fString = string;
		if(string.charAt(string.length - 1) == "_"){
			fString = [string.substring(0, string.length - 1), "*"].join("");
		}
		return fString;
	},
	getMeta: function(/*String*/ pkg, /*String*/ name, /*Function*/ callback, /*String?*/ id){
		// summary: Gets information about a function in regards to its meta data
		if(typeof name == "function"){
			// pId: a
			// pkg: ignore
			id = callback;
			callback = name;
			name = pkg;
			pkg = null;
			djd43.debug("getMeta(" + name + ")");
		}else{
			djd43.debug("getMeta(" + pkg + "/" + name + ")");
		}
		
		if(!id){
			id = "_";
		}
	},
	_withPkg: function(/*String*/ type, /*Object*/ data, /*Object*/ evt, /*Object*/ input, /*String*/ newType){
		djd43.debug("_withPkg(" + evt.name + ") has package: " + data[0]);
		evt.pkg = data[0];
		if("load" == type && evt.pkg){
			evt.type = newType;
		}else{
			if(evt.callbacks && evt.callbacks.length){
				evt.callbacks.shift()("error", {}, evt, evt.input);
			}
		}
	},
	_gotMeta: function(/*String*/ type, /*Object*/ data, /*Object*/ evt){
		djd43.debug("_gotMeta(" + evt.name + ")");

		var cached = djd43.docs._getCache(evt.pkg, evt.name, "meta", "functions", evt.id);
		if(cached.summary){
			data.summary = cached.summary;
		}
		if(evt.callbacks && evt.callbacks.length){
			evt.callbacks.shift()(type, data, evt, evt.input);
		}
	},
	getSrc: function(/*String*/ name, /*Function*/ callback, /*String?*/ id){
		// summary: Gets src file (created by the doc parser)
		djd43.debug("getSrc(" + name + ")");
		if(!id){
			id = "_";
		}
	},
	getDoc: function(/*String*/ name, /*Function*/ callback, /*String?*/ id){
		// summary: Gets external documentation stored on Jot for a given function
		djd43.debug("getDoc(" + name  + ")");

		if(!id){
			id = "_";
		}

		var input = {};

		input.type = "doc";
		input.name = name;
		input.callbacks = [callback];
	},
	_gotDoc: function(/*String*/ type, /*Array*/ data, /*Object*/ evt, /*Object*/ input){
		djd43.debug("_gotDoc(" + evt.type + ")");
		
		evt[evt.type] = data;
		if(evt.expects && evt.expects.doc){
			for(var i = 0, expect; expect = evt.expects.doc[i]; i++){
				if(!(expect in evt)){
					djd43.debug("_gotDoc() waiting for more data");
					return;
				}
			}
		}
		
		var cache = djd43.docs._getCache(evt.pkg, "meta", "functions", evt.name, evt.id, "meta");

		var description = evt.fn.description;
		cache.description = description;
		data = {
			returns: evt.fn.returns,
			id: evt.id,
			variables: []
		}
		if(!cache.parameters){
			cache.parameters = {};
		}
		for(var i = 0, param; param = evt.param[i]; i++){
			var fName = param["DocParamForm/name"];
			if(!cache.parameters[fName]){
				cache.parameters[fName] = {};
			}
			cache.parameters[fName].description = param["DocParamForm/desc"]
		}

		data.description = cache.description;
		data.parameters = cache.parameters;
		
		evt.type = "doc";
	
		if(evt.callbacks && evt.callbacks.length){
			evt.callbacks.shift()("load", data, evt, input);
		}
	},
	getPkgDoc: function(/*String*/ name, /*Function*/ callback){
		// summary: Gets external documentation stored on Jot for a given package
		djd43.debug("getPkgDoc(" + name + ")");
		var input = {};
	},
	getPkgInfo: function(/*String*/ name, /*Function*/ callback){
		// summary: Gets a combination of the metadata and external documentation for a given package
		djd43.debug("getPkgInfo(" + name + ")");

		var input = {
			expects: {
				pkginfo: ["pkgmeta", "pkgdoc"]
			},
			callback: callback
		};
		djd43.docs.getPkgMeta(input, name, djd43.docs._getPkgInfo);
		djd43.docs.getPkgDoc(input, name, djd43.docs._getPkgInfo);
	},
	_getPkgInfo: function(/*String*/ type, /*Object*/ data, /*Object*/ evt){
		djd43.debug("_getPkgInfo() for " + evt.type);
		var input = {};
		var results = {};
		if(typeof key == "object"){
			input = key;
			input[evt.type] = data;
			if(input.expects && input.expects.pkginfo){
				for(var i = 0, expect; expect = input.expects.pkginfo[i]; i++){
					if(!(expect in input)){
						djd43.debug("_getPkgInfo() waiting for more data");
						return;
					}
				}
			}
			results = input.pkgmeta;
			results.description = input.pkgdoc;
		}

		if(input.callback){
			input.callback("load", results, evt);
		}
	},
	getInfo: function(/*String*/ name, /*Function*/ callback){
		djd43.debug("getInfo(" + name + ")");
		var input = {
			expects: {
				"info": ["meta", "doc"]
			},
			callback: callback
		}
		djd43.docs.getMeta(input, name, djd43.docs._getInfo);
		djd43.docs.getDoc(input, name, djd43.docs._getInfo);
	},
	_getInfo: function(/*String*/ type, /*String*/ data, /*Object*/ evt, /*Object*/ input){
		djd43.debug("_getInfo(" + evt.type + ")");
		if(input && input.expects && input.expects.info){
			input[evt.type] = data;
			for(var i = 0, expect; expect = input.expects.info[i]; i++){
				if(!(expect in input)){
					djd43.debug("_getInfo() waiting for more data");
					return;
				}
			}
		}

		if(input.callback){
			input.callback("load", djd43.docs._getCache(evt.pkg, "meta", "functions", evt.name, evt.id, "meta"), evt, input);
		}
	},
	_getMainText: function(/*String*/ text){
		// summary: Grabs the innerHTML from a Jot Rech Text node
		djd43.debug("_getMainText()");
		return text.replace(/^<html[^<]*>/, "").replace(/<\/html>$/, "").replace(/<\w+\s*\/>/g, "");
	},
	getPackageMeta: function(/*Object*/ input){
		djd43.debug("getPackageMeta(): " + input.package);
		return this.require(input.package + "/meta", input.sync);
	},
	getFunctionMeta: function(/*Object*/ input){
		var package = input.package || "";
		var name = input.name;
		var id = input.id || "_";
		djd43.debug("getFunctionMeta(): " + name);

		if(!name) return;

		if(package){
			return this.require(package + "/meta/functions/" + name + "/" + id + "/meta");
		}else{
			this.getFunctionNames();
		}
	},
	getFunctionDocumentation: function(/*Object*/ input){
		var package = input.package || "";
		var name = input.name;
		var id = input.id || "_";
		djd43.debug("getFunctionDocumentation(): " + name);
		
		if(!name) return;
		
		if(package){
			return this.require(package + "/meta/functions/" + name + "/" + id + "/documentation");
		}
	},
	_onDocSearch: function(/*Object*/ input){
		var _this = this;
		var name = input.name.toLowerCase();
		if(!name) return;

		this.getFunctionNames().addCallback(function(data){
			djd43.debug("_onDocSearch(): function names loaded for " + name);

			var output = [];
			var list = [];
			var closure = function(pkg, fn) {
				return function(data){
					djd43.debug("_onDocSearch(): package meta loaded for: " + pkg);
					if(data.functions){
						var functions = data.functions;
						for(var key in functions){
							if(fn == key){
								var ids = functions[key];
								for(var id in ids){
									var fnMeta = ids[id];
									output.push({
										package: pkg,
										name: fn,
										id: id,
										summary: fnMeta.summary
									});
								}
							}
						}
					}
					return output;
				}
			}

			pkgLoop:
			for(var pkg in data){
				if(pkg.toLowerCase() == name){
					name = pkg;
					djd43.debug("_onDocSearch found a package");
					//djd43.docs._onDocSelectPackage(input);
					return;
				}
				for(var i = 0, fn; fn = data[pkg][i]; i++){
					if(fn.toLowerCase().indexOf(name) != -1){
						djd43.debug("_onDocSearch(): Search matched " + fn);
						var meta = _this.getPackageMeta({package: pkg});
						meta.addCallback(closure(pkg, fn));
						list.push(meta);

						// Build a list of all packages that need to be loaded and their loaded state.
						continue pkgLoop;
					}
				}
			}
			
			list = new djd43.DeferredList(list);
			list.addCallback(function(results){
				djd43.debug("_onDocSearch(): All packages loaded");
				_this._printFunctionResults(results[0][1]);
			});
		});
	},
	_onDocSearchFn: function(/*String*/ type, /*Array*/ data, /*Object*/ evt){
		djd43.debug("_onDocSearchFn(" + evt.name + ")");

		var name = evt.name || evt.pkg;

		djd43.debug("_onDocSearchFn found a function");

		evt.pkgs = packages;
		evt.pkg = name;
		evt.loaded = 0;
		for(var i = 0, pkg; pkg = packages[i]; i++){
			djd43.docs.getPkgMeta(evt, pkg, djd43.docs._onDocResults);
		}
	},
	_onPkgResults: function(/*String*/ type, /*Object*/ data, /*Object*/ evt, /*Object*/ input){
		djd43.debug("_onPkgResults(" + evt.type + ")");
		var description = "";
		var path = "";
		var methods = {};
		var requires = {};
		if(input){
			input[evt.type] = data;
			if(input.expects && input.expects.pkgresults){
				for(var i = 0, expect; expect = input.expects.pkgresults[i]; i++){
					if(!(expect in input)){
						djd43.debug("_onPkgResults() waiting for more data");
						return;
					}
				}
			}
			path = input.pkgdoc.path;
			description = input.pkgdoc.description;
			methods = input.pkgmeta.methods;
			requires = input.pkgmeta.requires;
		}
		var pkg = evt.name.replace("_", "*");
		var results = {
			path: path,
			description: description,
			size: 0,
			methods: [],
			pkg: pkg,
			requires: requires
		}
		var rePrivate = /_[^.]+$/;
		for(var method in methods){
			if(!rePrivate.test(method)){
				for(var pId in methods[method]){
					results.methods.push({
						pkg: pkg,
						name: method,
						id: pId,
						summary: methods[method][pId].summary
					})
				}
			}
		}
		results.size = results.methods.length;
		djd43.docs._printPkgResult(results);
	},
	_onDocResults: function(/*String*/ type, /*Object*/ data, /*Object*/ evt, /*Object*/ input){
		djd43.debug("_onDocResults(" + evt.name + "/" + input.pkg + ") " + type);
		++input.loaded;

		if(input.loaded == input.pkgs.length){
			var pkgs = input.pkgs;
			var name = input.pkg;
			var results = {methods: []};
			var rePrivate = /_[^.]+$/;
			data = djd43.docs._cache;

			for(var i = 0, pkg; pkg = pkgs[i]; i++){
				var methods = djd43.docs._getCache(pkg, "meta", "methods");
				for(var fn in methods){
					if(fn.toLowerCase().indexOf(name) == -1){
						continue;
					}
					if(fn != "requires" && !rePrivate.test(fn)){
						for(var pId in methods[fn]){
							var result = {
								pkg: pkg,
								name: fn,
								id: "_",
								summary: ""
							}
							if(methods[fn][pId].summary){
								result.summary = methods[fn][pId].summary;
							}
							results.methods.push(result);
						}
					}
				}
			}

			djd43.debug("Publishing docResults");
			djd43.docs._printFnResults(results);
		}
	},
	_printFunctionResults: function(results){
		djd43.debug("_printFnResults(): called");
		// summary: Call this function to send the /docs/function/results topic
	},
	_printPkgResult: function(results){
		djd43.debug("_printPkgResult(): called");
	},
	_onDocSelectFunction: function(/*Object*/ input){
		// summary: Get doc, meta, and src
		var name = input.name;
		var package = input.package || "";
		var id = input.id || "_";
		djd43.debug("_onDocSelectFunction(" + name + ")");
		if(!name || !package) return false;

		var pkgMeta = this.getPackageMeta({package: package});
		var meta = this.getFunctionMeta({package: package, name: name, id: id});
		var doc = this.getFunctionDocumentation({package: package, name: name, id: id});
		
		var list = new djd43.DeferredList([pkgMeta, meta, doc]);
		list.addCallback(function(results){
			djd43.debug("_onDocSelectFunction() loaded");
			for(var i = 0, result; result = results[i]; i++){
				djd43.debugShallow(result[1]);
			}
		});
		
		return list;
	},
	_onDocSelectPackage: function(/*Object*/ input){
		djd43.debug("_onDocSelectPackage(" + input.name + ")")
		input.expects = {
			"pkgresults": ["pkgmeta", "pkgdoc"]
		};
		djd43.docs.getPkgMeta(input, input.name, djd43.docs._onPkgResults);
		djd43.docs.getPkgDoc(input, input.name, djd43.docs._onPkgResults);
	},
	_onDocSelectResults: function(/*String*/ type, /*Object*/ data, /*Object*/ evt, /*Object*/ input){
		djd43.debug("_onDocSelectResults(" + evt.type + ", " + evt.name + ")");
		if(evt.type == "meta"){
			djd43.docs.getPkgMeta(input, evt.pkg, djd43.docs._onDocSelectResults);
		}
		if(input){
			input[evt.type] = data;
			if(input.expects && input.expects.docresults){
				for(var i = 0, expect; expect = input.expects.docresults[i]; i++){
					if(!(expect in input)){
						djd43.debug("_onDocSelectResults() waiting for more data");
						return;
					}
				}
			}
		}

		djd43.docs._printFunctionDetail(input);
	},
	
	_printFunctionDetail: function(results) {
		// summary: Call this function to send the /docs/function/detail topic event
	},

	selectFunction: function(/*String*/ name, /*String?*/ id){
		// summary: The combined information
	},
	savePackage: function(/*Object*/ callbackObject, /*String*/ callback, /*Object*/ parameters){
		djd43.event.kwConnect({
			srcObj: djd43.docs,
			srcFunc: "_savedPkgRpc",
			targetObj: callbackObject,
			targetFunc: callback,
			once: true
		});
		
		var props = {};
		var cache = djd43.docs._getCache(parameters.pkg, "meta");

		var i = 1;

		if(!cache.path){
			var path = "id";
			props[["pname", i].join("")] = "DocPkgForm/require";
			props[["pvalue", i++].join("")] = parameters.pkg;
		}else{
			var path = cache.path;
		}

		props.form = "//DocPkgForm";
		props.path = ["/WikiHome/DojoDotDoc/", path].join("");

		if(parameters.description){
			props[["pname", i].join("")] = "main/text";
			props[["pvalue", i++].join("")] = parameters.description;
		}
		
		djd43.docs._rpc.callRemote("saveForm",	props).addCallbacks(djd43.docs._pkgRpc, djd43.docs._pkgRpc);
	},
	_pkgRpc: function(data){
		if(data.name){
			djd43.docs._getCache(data["DocPkgForm/require"], "meta").path = data.name;
			djd43.docs._savedPkgRpc("load");
		}else{
			djd43.docs._savedPkgRpc("error");
		}
	},
	_savedPkgRpc: function(type){
	},
	functionPackages: function(/*String*/ name, /*Function*/ callback, /*Object*/ input){
		// summary: Gets the package associated with a function and stores it in the .pkg value of input
		djd43.debug("functionPackages() name: " + name);

		if(!input){
			input = {};
		}
		if(!input.callbacks){
			input.callbacks = [];
		}

		input.type = "function_names";
		input.name = name;
		input.callbacks.unshift(callback);
		input.callbacks.unshift(djd43.docs._functionPackages);
	},
	_functionPackages: function(/*String*/ type, /*Array*/ data, /*Object*/ evt){
		djd43.debug("_functionPackages() name: " + evt.name);
		evt.pkg = '';

		var results = [];
		var data = djd43.docs._cache['function_names'];
		for(var key in data){
			if(djd43.lang.inArray(data[key], evt.name)){
				djd43.debug("_functionPackages() package: " + key);
				results.push(key);
			}
		}

		if(evt.callbacks && evt.callbacks.length){
			evt.callbacks.shift()(type, results, evt, evt.input);
		}
	},
	setUserName: function(/*String*/ name){
		djd43.docs._userName = name;
		if(name && djd43.docs._password){
			djd43.docs._logIn();
		}
	},
	setPassword: function(/*String*/ password){
		djd43.docs._password = password;
		if(password && djd43.docs._userName){
			djd43.docs._logIn();
		}
	},
	_logIn: function(){
		djd43.io.bind({
			url: djd43.docs._rpc.serviceUrl.toString(),
			method: "post",
			mimetype: "text/json",
			content: {
				username: djd43.docs._userName,
				password: djd43.docs._password
			},
			load: function(type, data){
				if(data.error){
					djd43.docs.logInSuccess();
				}else{
					djd43.docs.logInFailure();
				}
			},
			error: function(){
				djd43.docs.logInFailure();
			}
		});
	},
	logInSuccess: function(){},
	logInFailure: function(){},
	_set: function(/*Object*/ base, /*String...*/ keys, /*String*/ value){
		var args = [];
		for(var i = 0, arg; arg = arguments[i]; i++){
			args.push(arg);
		}

		if(args.length < 3) return;
		base = args.shift();
		value = args.pop();
		var key = args.pop();
		for(var i = 0, arg; arg = args[i]; i++){
			if(typeof base[arg] != "object"){
				base[arg] = {};
			}
			base = base[arg];
		}
		base[key] = value;
	},
	_getCache: function(/*String...*/ keys){
		var obj = djd43.docs._cache;
		for(var i = 0; i < arguments.length; i++){
			var arg = arguments[i];
			if(!obj[arg]){
				obj[arg] = {};
			}
			obj = obj[arg];
		}
		return obj;
	}
});

djd43.event.topic.subscribe("/docs/search", djd43.docs, "_onDocSearch");
djd43.event.topic.subscribe("/docs/function/select", djd43.docs, "_onDocSelectFunction");
djd43.event.topic.subscribe("/docs/package/select", djd43.docs, "_onDocSelectPackage");

djd43.event.topic.registerPublisher("/docs/function/results", djd43.docs, "_printFunctionResults");
djd43.event.topic.registerPublisher("/docs/function/detail", djd43.docs, "_printFunctionDetail");
djd43.event.topic.registerPublisher("/docs/package/detail", djd43.docs, "_printPkgResult");
