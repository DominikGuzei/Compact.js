define(['Util'], function(Util) {
	
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

				namespace = Util.buildNamespace(namespace, classpath);
				
				// Define a class constructor if it is not a mixin
				var klass = namespace[classname] = function() {
					var userArgs = arguments[0] || {};
					builder.superclass && builder.superclass.apply(this, arguments);
					Util.addInstanceProperties(this, userArgs, builder.classProperties);
					builder.classConstructor.call(this);
				};
				
				klass.constructor = klass;
				
				// copy the superclass prototype to the class prototype
				if(builder.superclass) {
					namespace[classname].prototype.__proto__ = builder.superclass.prototype;
				}
				
				if(builder.mixinClasses) {
					for(var i=0; i < builder.mixinClasses.length; i++) {
						Util.addProperties(this.classProperties, this.mixinClasses[i].__properties__, false);
						Util.addProperties(this.classMethods, this.mixinClasses[i].__methods__, false);
					}
				}
				
				Util.buildPropertyAccessors(klass.prototype, builder.classProperties);
				Util.addMethods(klass.prototype, this.classMethods, this.superclass);
			}
			
		}; // end return
	};
	
	return Class;
});
	
