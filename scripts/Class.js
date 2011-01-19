define(['utility/objects'], function(utility) {
	
	var Class = function(_classpath) {
		
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
			
			statics: function(statics) {
				this.statics = statics;
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
				var classpath = _classpath.split("."); // the full class path as array of strings
				var namespace = context; // reference to the last namespace object before class
				var classname = classpath[classpath.length - 1]; // name of the class as string

				namespace = utility.appendObjectChain(namespace, classpath);
				
				// Define a class constructor if it is not a mixin
				var klass = namespace[classname] = function() {
					var userArgs = arguments[0] || {};
					builder.superclass && builder.superclass.apply(this, arguments);
					addInstanceProperties(this, userArgs, builder.classProperties);
					builder.classConstructor.call(this);
				};
				
				klass.constructor = klass;
				
				// copy the superclass prototype to the class prototype
				if(builder.superclass) {
					namespace[classname].prototype.__proto__ = builder.superclass.prototype;
				}
				
				if(builder.mixinClasses) {
					for(var i=0; i < builder.mixinClasses.length; i++) {
						utility.copyProperties(this.mixinClasses[i].__properties__, this.classProperties, false, true);
						utility.copyProperties(this.mixinClasses[i].__methods__, this.classMethods, false, true);
					}
				}
				
				addPrototypeMethods(klass.prototype, this.classMethods, this.superclass);
				utility.copyProperties(this.statics, klass, true, true);
			}
			
		}; // end return
	};
	
	/**
	 * Assigns all methods declared in the methods definition object
	 * to the given obj. On sub classes it saves
	 * a reference to the overwritten super method in each method. 
	 * 
	 * @param {Object} destination The Object all methods are added to
	 * @param {function} superclass The base class to extend from
	 * @param {object} methods The method definition object
	 */

	addPrototypeMethods = function(destination, methods, superclass) {

		for (var method in methods) {
			if (methods.hasOwnProperty(method)) {
				destination[method] = (superclass && superclass.prototype[method]) ? (function(name, fn) {
					return function() {
						// add a reference to the same method on the super class
						this.superMethod = superclass.prototype[name];
						// apply the current context with arguments and superMethod reference
						var ret = fn.apply(this, arguments);
						// we dont need the reference anymore, so delete it.
						delete this.superMethod;
						// return the result of the applied method
						return ret;
					};
				})(method, methods[method]) : methods[method];
			}
		}
	};
	
	/**
	 * Takes two property definition objects and adds them merged
	 * to the given host object, overwriting the defaults where possible
	 * 
	 * @param {object} obj The host object the properties are added to
	 * @param {object} userArgs User arguments passed as object literal
	 * @param {object} properties The property definition object
	 */

	addInstanceProperties = function(destination, preferred, defaults) {
		for (var prop in defaults) {
			if (defaults.hasOwnProperty(prop)) {
				var instancePropString = prop;
				var defaultProp = utility.deepCopy(defaults[prop]);
				var preferredProp = utility.deepCopy(preferred[prop]);

				destination[instancePropString] = preferredProp != undefined ? preferredProp : defaultProp;
			}
		}
	};
		
	return Class;

});
	
