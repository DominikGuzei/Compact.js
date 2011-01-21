define(['compact/utility/object/copyProperties', 'compact/utility/object/appendObjectChain'], 

function(copyProperties, appendObjectChain) {
	
	var Mixin = function(_mixinpath) {
		
		/**
		 * Return a chainable builder object that saves the
		 * given input and composes the class at the .end() 
		 */
		
		return {
			
			mixinProperties: {},
			mixinMethods: {},
			
			properties: function(properties) {
				this.mixinProperties = properties;
				return this;
			},
			
			methods: function(methods) {
				this.mixinMethods = methods;
				return this;
			},
			
			mixin: function() {
				this.mixinClasses = arguments;
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
				var mixinpath = _mixinpath.split("."); // the full class path as array of strings
				var namespace = context; // reference to the last namespace object before class
				var mixinname = mixinpath[mixinpath.length - 1]; // name of the class as string

				namespace = appendObjectChain(namespace, mixinpath);
				var mixin = namespace[mixinname];
				mixin.__mixin__ = true;
				mixin.__properties__ = {};
				mixin.__methods__ = {};
				
				// add all methods from other mixins to own methods
				if(this.mixinClasses) {
					for(var i=0; i < this.mixinClasses.length; i++) {
						copyProperties(this.mixinClasses[i].__properties__, mixin.__properties__, true, true);
						copyProperties(this.mixinClasses[i].__methods__, mixin.__methods__, true, true);
					}
				}
				
				copyProperties(this.mixinProperties, mixin.__properties__,  true, true);
				copyProperties(this.mixinMethods, mixin.__methods__, true, true);
				
			}
			
		}; // end return
	}; // end Mixin
	
	return Mixin;
});