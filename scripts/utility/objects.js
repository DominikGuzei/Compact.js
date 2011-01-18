define(function() {

	return {
		
		/**
		 * Copies all properties of one object to another
		 * 
		 * @param {Object} destination The object the properties are added to
		 * @param {Object} source The object which properties are copied
		 * @param {Boolean} overwrite Should existing properties be overwritten
		 * on the destination object?
		 * @param {Boolean} byReference Should object values be copied by reference?
		 */
		
		copyProperties: function(source, destination, overwrite, byReference) {
			for (var propertyName in source) {
				if (source.hasOwnProperty(propertyName)) {
					var sourceProperty = byReference ? source[propertyName] : this.deepCopy(source[propertyName]);
					if (overwrite) {
						destination[propertyName] = sourceProperty;
					} else {
						destination[propertyName] = destination[propertyName] || sourceProperty;
					}
				}
			}
		},
		
		/**
		 * Takes a object and appends an object chain 
		 * with the objects included in the chainArray
		 * 
		 * @param {Object} object The context the namespace is applied to
		 * @param {Array} chain The complete classpath split up as array 
		 * 
		 * @returns {Object} The last object in the chain
		 * 
		 */
		
		appendObjectChain: function(object, chain) {
			var next = object[chain[0]] || (object[chain[0]] = {});
			for (var i = 1; i < chain.length; i++) {
				next[chain[i]] || (next[chain[i]] = {});
				object = next;
				next = next[chain[i]];
			}
			return object;
		},
		
		/**
		 * Makes a deep copy of any object or array
		 * 
		 * @param {object} obj the object to make a deep copy from 
		 */

		deepCopy: function(obj) {
			if (typeof obj !== 'object' || obj === null) {
				return obj;
			}
			if(obj instanceof Date) {
				return new Date(obj);
			}
			var c = obj instanceof Array ? [] : {};

			for (var i in obj) {
				if (obj.hasOwnProperty(i)) {
					c[i] = this.deepCopy(obj[i]);
				}
			}

			return c;
		},
		
		/**
		 * Adds a function to the destination object
		 * that is named like a setter (eg: set + PropertyName)
		 * 
		 * @param {Object} destination The Object the setter is appended to
		 * @param {String} propertyName The name of the property the setter
		 * is generated for
		 * @param {Function} setter The setter function that is added 
		 */
		
		addCamelCaseSetter: function(destination, propertyName, setter) {
			var camelCaseName = "set" + propertyName[0].toUpperCase() + propertyName.substring(1);
			destination[camelCaseName] = setter;
		},
		
		/**
		 * Adds a function to the destination object
		 * that is named like a getter (eg: get + PropertyName)
		 * 
		 * @param {Object} destination The Object the getter is appended to
		 * @param {String} propertyName The name of the property the getter
		 * is generated for
		 * @param {Function} getter The getter function that is added 
		 */
		
		addCamelCaseGetter: function(destination, propertyName, getter) {
			var camelCaseName = "get" + propertyName[0].toUpperCase() + propertyName.substring(1);
			destination[camelCaseName] = getter;
		}
		
	};
});


	

	