(function(context) {
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
		
		var buildProperties = function(userArgs, properties) {
			var self = this;
			for(var prop in properties) if(properties.hasOwnProperty(prop)) {
					
				if(this["_" +prop] == undefined) {
					
					this["_"+prop] = userArgs[prop] || (properties[prop].value != undefined ? properties[prop].value : undefined);
					
					namespace[classname].prototype.__defineGetter__(prop, function() {
						var value = properties[prop].getter ? properties[prop].getter.call(self) : self["_" + prop];
						return value;
					});

					namespace[classname].prototype.__defineSetter__(prop, function(value) {
						
						if(properties[prop].setter) {
							properties[prop].setter.apply(self, arguments);
						} else {
							self["_" + prop] = value;
						}
					});
				}
			}
		}
		
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
			
			end: function() {
				var builder = this;

				var klass = namespace[classname] = function() {
					var userArgs = arguments[0] || {};
					if(builder.superclass) {
						namespace[classname].prototype.__proto__ = builder.superclass.prototype;
					}
					builder.superclass && builder.superclass.apply(this, arguments);
					buildProperties.call(this, userArgs, builder.classProperties);
					builder.classConstructor.call(this);
				}
				klass.constructor = klass;
				buildMethods.call(klass, this.superclass, this.classMethods);
			}
			
		}; // end return
		
	}
	context.Class = Class;
})(window);