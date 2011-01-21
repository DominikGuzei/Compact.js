/**
 * This gracefully taken from the Underscore.js library
 * http://documentcloud.github.com/underscore/
 */

define(function() {
	
	return {
		
			// Is a given value a DOM element?
		  isElement: function(obj) {
		    return !!(obj && obj.nodeType == 1);
		  },

		  // Is a given value an array?
		  isArray: function(obj) {
		    return toString.call(obj) === '[object Array]';
		  },

		  // Is a given variable an arguments object?
		  isArguments: function(obj) {
		    return !!(obj && hasOwnProperty.call(obj, 'callee'));
		  },

		  // Is a given value a function?
		  isFunction: function(obj) {
		    return !!(obj && obj.constructor && obj.call && obj.apply);
		  },

		  // Is a given value a string?
		  isString: function(obj) {
		    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
		  },

		  // Is a given value a number?
		  isNumber: function(obj) {
		    return !!(obj === 0 || (obj && obj.toExponential && obj.toFixed));
		  },

		  // Is the given value `NaN`? `NaN` happens to be the only value in JavaScript
		  // that does not equal itself.
		  isNaN: function(obj) {
		    return obj !== obj;
		  },

		  // Is a given value a boolean?
		  isBoolean: function(obj) {
		    return obj === true || obj === false;
		  },

		  // Is a given value a date?
		  isDate: function(obj) {
		    return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear);
		  },

		  // Is the given value a regular expression?
		  isRegExp: function(obj) {
		    return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
		  },

		  // Is a given value equal to null?
		  isNull: function(obj) {
		    return obj === null;
		  },

		  // Is a given variable undefined?
		  isUndefined: function(obj) {
		    return obj === void 0;
		  },
		
	}
	
});