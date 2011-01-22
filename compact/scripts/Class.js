define(['compact/utility/object/copyProperties', 
				'compact/utility/object/appendObjectChain',
				'compact/utility/object/deepCopy'], 

function(copyProperties, appendObjectChain, deepCopy) {
	
	/**
	 * Takes a fully qualified java-like class path and returns 
	 * an anonymous specification builder object that is used to describe 
	 * the parts that are used to build the javascript class.
	 * 
	 * @param {String} classPathString The fully qualified class path
	 * @returns {Object} #anonymous The specification object used to
	 * specify and build the class in the given context.
	 */
	
	var Class = function(classPathString) {
		
		return {
			/**
			 * The superclass of the class to create 
			 * @type {Function}
			 */
			superclass: null,
			
			/**
			 * The initialize function that can be defined for 
			 * custom setup. Is called automatically on instanciation.
			 * @type {Function}
			 */
			initializer: function() {},
			
			/**
			 * The specification of class properties to add 
			 * with their default values assigned.
			 * e.g.: { propertyName: "value", property2:... }
			 * @type {Object} 
			 */
			propertiesDefinition: {},
			
			/**
			 * The specification of methods to add
			 * e.g: { method1: function() { return this.value }, method2: ... }
			 * @type {Object} 
			 */
			methodsDefinition: {},
			
			/**
			 * The specification of static properties and/or methods
			 * e.g: { staticMethod: function() {}, staticProp: "value", ... }
			 * @type {Object} 
			 */
			staticsDefinition: {},
			
			/**
			 * Sets the superclass for the class to create on the 
			 * specification builder
			 * 
			 * @param {Function} superclass
			 * @returns {Object} #anonymous The specification-builder object 
			 */ 
			extend: function(superclass) {
				this.superclass = superclass;
				return this;
			},
			
			/**
			 * Sets the initializer function for the class 
			 * on the specification builder
			 * 
			 * @param {Function} initializer
			 * @returns {Object} #anonymous The specification-builder object 
			 */
			initialize: function(initializer) {
				this.initializer = initializer;
				return this;
			},
			
			/**
			 * Sets the properties for the class on the specification builder
			 * 
			 * @param {Object} properties
			 * @returns {Object} #anonymous The specification-builder object 
			 */
			properties: function(propertiesDefinition) {
				this.propertiesDefinition = propertiesDefinition;
				return this;
			},
			
			/**
			 * Sets the methods for the class on the specification builder
			 * 
			 * @param {Object} methods
			 * @returns {Object} #anonymous The specification-builder object 
			 */
			methods: function(methodsDefinition) {
				this.methodsDefinition = methodsDefinition;
				return this;
			},
			
			/**
			 * Sets the static methods/properties for the class 
			 * on the specification builder
			 * 
			 * @param {Object} statics The static methods/properties
			 * @returns {Object} #anonymous The specification-builder object 
			 */
			statics: function(staticsDefinition) {
				this.staticsDefinition = staticsDefinition;
				return this;
			},
			
			/**
			 * Takes an abitrary number of mixins which properties
			 * and methods are added to this class.
			 * @param {Object, Object, ..} arguments Arbitrary number of mixins
			 */
			mixin: function() {
				this.mixins = arguments;
				return this;
			},
			
			/**
			 * Constructs the class with all given information 
			 * of the specification-builder object. The class path
			 * is appended to the context object.
			 * 
			 * @param {object} context The object the class path is appended to
			 */
			end: function(context) {
				var classSpecification = this;
				
				// Construct the namespace for the class
				var classPathArray = classPathString.split("."); // the full class path as array of strings
				var namespace = context; // reference to the last namespace object before class
				var classname = classPathArray[classPathArray.length - 1]; // name of the class as string

				namespace = appendObjectChain(namespace, classPathArray);
				
				// define a class constructor that automatically calls
				// all constructors in the class hierarchy with the argument object
				var classToCreate = namespace[classname] = function() {
					var userArgs = arguments[0] || {};
					classSpecification.superclass && classSpecification.superclass.apply(this, arguments);
					addInstanceProperties(this, userArgs, classSpecification.propertiesDefinition);
					classSpecification.initializer.call(this);
				};
				
				classToCreate.constructor = classToCreate;
				
				// copy the superclass prototype to the class prototype
				if(classSpecification.superclass) {
					classToCreate.prototype.__proto__ = classSpecification.superclass.prototype;
				}
				
				if(classSpecification.mixins) {
					for(var i=0; i < classSpecification.mixins.length; i++) {
						copyProperties(classSpecification.mixins[i].__properties__, classSpecification.propertiesDefinition, false, true);
						copyProperties(classSpecification.mixins[i].__methods__, classSpecification.methodsDefinition, false, true);
					}
				}
				
				addPrototypeMethods(classToCreate.prototype, classSpecification.methodsDefinition, classSpecification.superclass);
				copyProperties(classSpecification.staticsDefinition, classToCreate, true, true);
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
				var defaultProp = deepCopy(defaults[prop]);
				var preferredProp = deepCopy(preferred[prop]);

				destination[instancePropString] = preferredProp != undefined ? preferredProp : defaultProp;
			}
		}
	};
		
	return Class;

});
	
