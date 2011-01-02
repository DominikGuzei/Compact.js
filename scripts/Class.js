define(function() {
	
	var Class = function(_classpath) {
		var classpath = _classpath.split(".");
		var namespace = window;
		var classname = classpath[classpath.length - 1];
		
		// build the namespace for the class
		var next = window[classpath[0]] || (window[classpath[0]] = {});
		for (var i=1; i < classpath.length; i++) {
			next[classpath[i]] || (next[classpath[i]] = {});
			namespace = next;
			next = next[classpath[i]];
		}
		
		var defineGetter = function(propName, prop) {
			camelPropName = propName.replace(/\S/, propName[0].toUpperCase());
			namespace[classname].prototype["get" + camelPropName] = prop.getter ? prop.getter :
				function() { 
					return this["_" + propName]; 
				};
		}
		
		var defineSetter = function(propName, prop) {
			camelPropName = propName.replace(/\S/, propName[0].toUpperCase());
			
			namespace[classname].prototype["set"+camelPropName] = function(value) {
				var validated = true;
				
				this._filterChange && typeof(this._filterChange) == 'function' && (value = this._filterChange(propName, value));
				this._beforeChange && typeof(this._beforeChange) == 'function' && (validated = this._beforeChange(propName, value));
				
				if(validated) {	
					if(prop.setter) {
						prop.setter.call(this, value);
					}	else {
						this["_" + propName] = value;
					}
					this._afterChange && typeof(this._afterChange) == 'function' && this._afterChange(propName, value);
				}
			};
		}
		
		var buildProperties = function(properties) {
			for(var prop in properties) if(properties.hasOwnProperty(prop)) {
					
				if(namespace[classname].prototype["_" +prop] == undefined) {
					namespace[classname].prototype["_"+prop] = (properties[prop].value != undefined ? properties[prop].value : undefined);
					defineGetter(prop, properties[prop]);
					defineSetter(prop, properties[prop]);
				}
			}
		};
		
		var applyDefaultValues = function(userArgs, properties) {
			for(var prop in properties) if(properties.hasOwnProperty(prop)) {
				this["_"+prop] = userArgs[prop] || (properties[prop].value != undefined ? properties[prop].value : undefined);
			}
		};
		
		var buildMethods = function(superclass, methods) {
			
			for(var method in methods) if(methods.hasOwnProperty(method)) {
				namespace[classname].prototype[method] = (superclass && superclass.prototype[method]) ?
					(function(name, fn) {
						return function() {
	            // add a reference to the same method on the super class
	            this.superMethod = superclass.prototype[name];
	            // apply the current context with arguments and superMethod reference
	            var ret = fn.apply(this, arguments);
							// we dont need the reference anymore, so delete it.
							delete this.superMethod;
							// return the result of the applied method
	            return ret;
						}
					})(method, methods[method])
					:
					methods[method];
			}
			
		}
		
		// return an anonymous object that
		// manages how to construct the class
		return {
			superclass: null,
			classConstructor: function() {},
			classProperties: {},
			classMethods: {},
			 
			extend: function(superclass) {
				this.superclass = superclass;
				return this;
			},
			
			initialize: function(init) {
				this.classConstructor = init;
				return this;
			},
			
			properties: function(properties) {
				this.classProperties = properties;
				return this;
			},
			
			methods: function(methods) {
				this.classMethods = methods;
				return this;
			},
			
			mixin: function() {
				this.mixinClasses = arguments;
				return this;
			},
			
			end: function() {
				var builder = this;
				
				if(this.classConstructor) {
					var klass = namespace[classname] = function() {
						var userArgs = arguments[0] || {};
						builder.superclass && builder.superclass.apply(this, arguments);
						applyDefaultValues.call(this, userArgs, builder.classProperties);
						builder.classConstructor.call(this);
					}
				
					klass.constructor = klass;
				}
				
				if(builder.superclass) {
					namespace[classname].prototype.__proto__ = builder.superclass.prototype;
				}
				
				if(builder.mixinClasses) {
					for(var i=0; i < builder.mixinClasses.length; i++) {
						var mixin = builder.mixinClasses[i].prototype;
						for(var prop in mixin) if(mixin.hasOwnProperty(prop)) {
							namespace[classname].prototype[prop] = mixin[prop];
						}
					}
				}
				
				buildProperties(builder.classProperties);
				buildMethods.call(klass, this.superclass, this.classMethods);
			}
			
		}; // end return
	}
	
	return Class;
});
	
