define(function() {

	var Util = {};

	/**
	 * Takes a namespace context object and builds a object
	 * chain that represents the classpath array
	 * 
	 * @param {object} namespace The context the namespace is applied to
	 * @param {array} classpath The complete classpath split up as array 
	 */

	Util.buildNamespace = function(namespace, classpath) {
		var next = namespace[classpath[0]] || (namespace[classpath[0]] = {});
		for (var i = 1; i < classpath.length; i++) {
			next[classpath[i]] || (next[classpath[i]] = {});
			namespace = next;
			next = next[classpath[i]];
		}
		return namespace;
	};

	/**
	 * Creates a getter function for a property on the given object
	 * 
	 * @param {string} propName name of the property
	 * @param {object} prop the property definition object
	 */
	Util.defineGetter = function(obj, propName, prop) {
		if (prop.getter) {
			camelPropName = propName.replace(/\S/, propName[0].toUpperCase());
			obj["get" + camelPropName] = prop.getter;
		}
	};
	/*
	Util.defineGetter = function(obj, propName, prop) {
		camelPropName = propName.replace(/\S/, propName[0].toUpperCase());
		obj["get" + camelPropName] = prop.getter ? prop.getter :
			function() { 
				return this["_" + propName]; 
			};
	}
  */

	/**
	 * Creates a setter function for a property on the given object.
	 * It implements hooks for filtering, validating and before/after
	 * property change handling. This allows to inject behaviour
	 * involved with setting a property on the class.
	 * 
	 * @param {string} propName Name of the property
	 * @param {object} prop Property definition object
	 */

	Util.defineSetter = function(obj, propName, prop) {
		camelPropName = propName.replace(/\S/, propName[0].toUpperCase());
		var setter = prop.setter;

		if (prop.watchable) {
			obj["set" + camelPropName] = function(value) {
				var validated = true;
				this._filterChange && typeof(this._filterChange) == 'function' && (value = this._filterChange(propName, value));
				this._beforeChange && typeof(this._beforeChange) == 'function' && (validated = this._beforeChange(propName, value));

				if (validated) {
					if (setter) {
						setter.call(this, value);
					} else {
						var realPropName = prop.getter ? "_" + propName : propName;
						this[realPropName] = value;
					}
					this._afterChange && typeof(this._afterChange) == 'function' && this._afterChange(propName, value);
				}
			};
		} else if (prop.setter) {
			obj["set" + camelPropName] = setter;
		}
	};

	/**
	 * Takes a properties definition and creates the setter and getter
	 * on the given object.
	 * 
	 * @param {object} properties The definition object passed in .properties() 
	 */

	Util.buildPropertyAccessors = function(obj, properties) {
		var prop = null;
		for (var propString in properties) {
			if (properties.hasOwnProperty(propString)) {
				prop = properties[propString];
				prop.getter && Util.defineGetter(obj, propString, prop);
				(prop.setter || prop.watchable) && Util.defineSetter(obj, propString, prop);
			}
		}
	};

	Util.addProperties = function(obj, properties, overwrite) {
		for (var prop in properties) {
			if (properties.hasOwnProperty(prop)) {
				if (overwrite) {
					obj[prop] = properties[prop];
				} else {
					obj[prop] = obj[prop] == undefined ? properties[prop] : obj[prop];
				}
			}
		}
	};

	/**
	 * Makes a deep copy of any object or array
	 * 
	 * @param {object} obj the object to make a deep copy from 
	 */

	Util.deepCopyObject = function(obj) {
		if (typeof obj !== 'object' || obj === null) {
			return obj;
		}
		if(obj instanceof Date) {
			return new Date(obj);
		}
		var c = obj instanceof Array ? [] : {};

		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				c[i] = Util.deepCopyObject(obj[i]);
			}
		}

		return c;
	};

	/**
	 * Takes two property definition objects and adds them merged
	 * to the given host object, overwriting the defaults where possible
	 * 
	 * @param {object} obj The host object the properties are added to
	 * @param {object} userArgs User arguments passed as object literal
	 * @param {object} properties The property definition object
	 */

	Util.addInstanceProperties = function(obj, important, defaults) {
		for (var prop in defaults) {
			if (defaults.hasOwnProperty(prop)) {
				var instancePropString = prop;
				var defaultProp = Util.deepCopyObject(defaults[prop]);
				var importantProp = Util.deepCopyObject(important[prop]);
				
				if (defaultProp.setter && defaultProp.watchable || defaultProp.getter) {
					instancePropString = "_" + prop;
				}
				obj[instancePropString] = importantProp != undefined ? importantProp : defaultProp.value;
			}
		}
	};

	/**
	 * Assigns all methods declared in the methods definition object
	 * to the given obj. On sub classes it saves
	 * a reference to the overwritten super method in each method. 
	 * 
	 * @param {function} superclass The base class to extend from
	 * @param {object} methods The method definition object
	 */

	Util.addMethods = function(obj, methods, superclass) {

		for (var method in methods) {
			if (methods.hasOwnProperty(method)) {
				obj[method] = (superclass && superclass.prototype[method]) ? (function(name, fn) {
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

	return Util;
});
