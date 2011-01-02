define(function() {
	
	var Class = function(_classpath) {
		
		var classpath; // the full class path as array of strings
		var namespace; // reference to the last namespace object before class
		var classname; // name of the class as string
		
		/**
		 * Creates a getter function for a property on the prototype to
		 * minimize the glue code you have to write for your class
		 * 
		 * @param {string} propName name of the property
		 * @param {object} prop the property definition object
		 */
		var defineGetter = function(propName, prop) {
			camelPropName = propName.replace(/\S/, propName[0].toUpperCase());
			namespace[classname].prototype["get" + camelPropName] = prop.getter ? prop.getter :
				function() { 
					return this["_" + propName]; 
				};
		}
		
		/**
		 * Creates a setter function for a property on the prototype.
		 * It implements hooks for filtering, validating and before/after
		 * property change handling. This allows to inject behaviour
		 * involved with setting a property on the class.
		 * 
		 * @param {string} propName Name of the property
		 * @param {object} prop Property definition object
		 */
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
		
		/**
		 * Takes a properties definition and creates the property as
		 * pseudo private var on the prototype (_var) and defines getters
		 * and setters for the property.
		 * 
		 * @param {object} properties The definition object passed in .properties() 
		 */
		var buildProperties = function(properties) {
			for(var prop in properties) if(properties.hasOwnProperty(prop)) {
					
				if(namespace[classname].prototype["_" +prop] == undefined) {
					namespace[classname].prototype["_"+prop] = (properties[prop].value != undefined ? properties[prop].value : undefined);
					defineGetter(prop, properties[prop]);
					defineSetter(prop, properties[prop]);
				}
			}
		};
		
		/**
		 * Takes the argument object passed on instanciation and
		 * overwrites the default values with user arguments
		 * 
		 * @param {object} userArgs User arguments passed as object literal
		 * @param {object} properties The property definition object
		 */
		var applyDefaultValues = function(userArgs, properties) {
			for(var prop in userArgs) if(userArgs.hasOwnProperty(prop)) {
				if(properties[prop]) {
					this["_"+prop] = userArgs[prop];
				}
			}
		};
		
		/**
		 * Assigns all methods declared in the .methods() call
		 * to the prototype of the class. On sub classes it saves
		 * a reference to the overwritten super method in each method. 
		 * 
		 * @param {function} superclass The base class to extend from
		 * @param {object} methods The method definition object
		 */
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
		
		/**
		 * Return a chainable builder object that saves the
		 * given input and composes the class at the .end() 
		 */
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
			
			/**
			 * Construct the class with all given information passed in
			 * by the other calls.
			 * 
			 * @param {object} context The object the namespace is applied to
			 */
			end: function(context) {
				var builder = this;
				
				// Construct the namespace for the class
				classpath = _classpath.split(".");
				namespace = context;
				classname = classpath[classpath.length - 1];

				var next = namespace[classpath[0]] || (namespace[classpath[0]] = {});
				for (var i=1; i < classpath.length; i++) {
					next[classpath[i]] || (next[classpath[i]] = {});
					namespace = next;
					next = next[classpath[i]];
				}
				
				// Define a class constructor if it is not a mixin
				if(this.classConstructor) {
					var klass = namespace[classname] = function() {
						var userArgs = arguments[0] || {};
						builder.superclass && builder.superclass.apply(this, arguments);
						applyDefaultValues.call(this, userArgs, builder.classProperties);
						builder.classConstructor.call(this);
					}
					klass.constructor = klass;
				}
				
				// copy the superclass prototype to the class prototype
				if(builder.superclass) {
					namespace[classname].prototype.__proto__ = builder.superclass.prototype;
				}
				
				// copy all mixins prototype methods to the class prototype
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
	
