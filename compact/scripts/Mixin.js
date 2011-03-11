define(['compact/object/copy', 'compact/object/chain'], 

function(copy, chain) {
	
	/**
	 * Takes a fully qualified java-like class path and returns the mixin
	 * specification builder that is used to add properties and methods 
	 * as well as those of other mixins created the same way.
	 * 
	 * @param {String} mixinClassPathString The fully qualified class path
	 * @returns {Object} The specification-builder
	 */
	
	var Mixin = function(classPathString) {
		
		return {

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
				 * Sets the properties for the class on the specification builder
				 * 
				 * @param {Object} properties
				 * @returns {Object} #anonymous The specification-builder object 
				 */
				properties: function(properties) {
					this.propertiesDefinition = properties;
					return this;
				},

				/**
				 * Sets the methods for the class on the specification builder
				 * 
				 * @param {Object} methods
				 * @returns {Object} #anonymous The specification-builder object 
				 */
				methods: function(methods) {
					this.methodsDefinition = methods;
					return this;
				},

				mixin: function() {
					this.mixins = arguments;
					return this;
				},

				/**
				 * Construct the mixin with all given information passed in
				 * by the other calls.
				 * 
				 * @param {object} context The object the namespace is applied to
				 */
				end: function(context) {

					// Construct the namespace for the class
					var classPathArray = classPathString.split("."); // the full class path as array of strings
					var mixinName = classPathArray[classPathArray.length - 1]; // name of the class as string
					var namespace = chain(context || {}, classPathArray);
					
					var mixin = namespace[mixinName];
					
					mixin.__mixin__ = true;
					mixin.__properties__ = {};
					mixin.__methods__ = {};

					// add all methods from other mixins to own methods
					if(this.mixins) {
						for(var i=0; i < this.mixins.length; i++) {
							copy(this.mixins[i].__properties__, mixin.__properties__, true, true);
							copy(this.mixins[i].__methods__, mixin.__methods__, true, true);
						}
					}

					copy(this.propertiesDefinition, mixin.__properties__,  true, true);
					copy(this.methodsDefinition, mixin.__methods__, true, true);
					
					return mixin;
				}

		}; // end mixinBuilder
		
	}; // end Mixin
	
	return Mixin;
});