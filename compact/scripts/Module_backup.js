define([
  'compact/object/copy',
  'compact/object/chain',
  'compact/function/bind'
], 

function(copy, chain, bind) {

  /**
   * Takes a fully qualified java-like module path and returns
   * an anonymous specification builder object that is used to describe
   * the parts that are used to build the javascript module.
   *
   * @param {String} modulePathString The fully qualified module path
   * @returns {Object} #anonymous The specification object used to
   * specify and build the module in the given context.
   */

  var Module = function(modulePathString) {

    return {
      /**
       * The superModule of the module to create
       * @type {Function}
       */
      superModule: null,

      /**
       * The properties function that can be defined for
       * setting up default values for your properties
       * @type {Function}
       */
      assignDefaultProperties: function() {},
      
      assignUserArguments: false,
      
      /**
       * The initialize function that can be defined for
       * custom setup. Is called automatically on instanciation.
       * @type {Function}
       */
      initializer: function() { this.$superInitialize.call(this, arguments); },

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
       * Sets the superModule for the module to create on the
       * specification builder
       *
       * @param {Function} superModule
       * @returns {Object} #anonymous The specification-builder object
       */
      extend: function(superModule) {
        this.superModule = superModule;
        return this;
      },

      /**
       * Sets the initializer function for the module
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
       * Sets the properties for the module on the specification builder
       *
       * @param {Object} properties
       * @returns {Object} #anonymous The specification-builder object
       */
      properties: function(assignDefaultProperties) {
        this.assignDefaultProperties = assignDefaultProperties;
        return this;
      },
      
      massAssign: function() {
        this.assignUserArguments = true;
        return this;
      },

      /**
       * Sets the methods for the module on the specification builder
       *
       * @param {Object} methods
       * @returns {Object} #anonymous The specification-builder object
       */
      methods: function(methodsDefinition) {
        this.methodsDefinition = methodsDefinition;
        return this;
      },

      /**
       * Sets the static methods/properties for the module
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
       * and methods are added to this module.
       * @param {Object} arguments Arbitrary number of mixins
       */
      mixin: function() {
        this.mixins = arguments;
        return this;
      },

      /**
       * Constructs the module with all given information
       * of the specification-builder object. The module path
       * is appended to the context object.
       *
       * @param {object} context The object the module path is appended to
       */
      end: function(context) {
        var moduleSpecification = this;
        var moduleInfo = constructModulePath(modulePathString, context);
        
        var moduleToCreate = buildModuleConstructor(moduleInfo.namespace, moduleInfo.name, moduleSpecification);

        // copy the superModule prototype to the module prototype
        if(moduleSpecification.superModule) {
          function temporarySupermodule() {
          };

          temporarySupermodule.prototype = moduleSpecification.superModule.prototype;
          moduleToCreate.prototype = new temporarySupermodule();
        }
        moduleToCreate.prototype.constructor = moduleToCreate;

        if(moduleSpecification.mixins) {
          addMixinDefinitions(moduleSpecification);
        }

        addPrototypeMethods(moduleToCreate.prototype, moduleSpecification.methodsDefinition, moduleSpecification.superModule);
        copy(moduleSpecification.staticsDefinition, moduleToCreate, true, true, moduleToCreate);

        moduleToCreate.__specification__ = moduleSpecification;
        return moduleToCreate;
      }

    }; // end return
  };

  function constructModulePath(modulePathString, context) {
    // Construct the namespace for the module

    var modulePathArray = modulePathString.split("."); // the full module path as array of strings
    var modulename = modulePathArray[modulePathArray.length - 1]; // name of the module as string
    var namespace = chain(context || {}, modulePathArray);

    return {
      namespace: namespace,
      name: modulename
    };
  }

  function buildModuleConstructor(namespace, modulename, moduleSpecification) {
    // define a module constructor that automatically calls
    // all constructors in the module hierarchy with the argument object
    var moduleConstructor = namespace[modulename] = function() {
      
      // assign all mixin defaults
      if(moduleSpecification.mixins) {
        for(var i=0; i < moduleSpecification.mixins.length; i++) {
          moduleSpecification.mixins[i].apply(this, arguments);
        }
      }
      
      // easy possibility to do mass configuration / assignment of user arguments
      this.$assignParams = function() {
        var userArgs = arguments[0] || {};
        copy(userArgs, this, true, true, this);
      };
      
      // add reference to super initializer
      if(moduleSpecification.superModule) {
        var args = arguments;
        this.$superInitialize = function() {
          moduleSpecification.superModule.apply(this, arguments); 
        };
      }
      
      // add reference to own module constructor
      this.Module = namespace[modulename];
      
      moduleSpecification.initializer.apply(this, arguments);
      
      // delete convenience references
      delete this.$superInitialize;
      delete this.$assignParams;
    };

    return moduleConstructor;
  }

  

  function addMixinDefinitions(moduleSpecification) {
    for(var i=0; i < moduleSpecification.mixins.length; i++) {
      copy( 
        moduleSpecification.mixins[i].__specification__.methodsDefinition, 
        moduleSpecification.methodsDefinition, 
        false, true
      );
    }
  }

  /**
   * Assigns all methods declared in the methods definition object
   * to the given obj. On sub modulees it saves
   * a reference to the overwritten super method in each method.
   *
   * @param {Object} destination The Object all methods are added to
   * @param {function} superModule The base module to extend from
   * @param {object} methods The method definition object
   */

  function addPrototypeMethods(destination, methods, superModule) {

    for (var methodName in methods) {
      if (methods.hasOwnProperty(methodName)) {
        destination[methodName] = (superModule && superModule.prototype[methodName]) ?

        (function(methodName, methodOfThisModule) {

          return function() {
            // add a reference to the same method on the super module
            this.superMethod = superModule.prototype[methodName];
            // apply the current context with arguments and superMethod reference
            var returnValue = methodOfThisModule.apply(this, arguments);
            // we dont need the reference anymore, so delete it.
            delete this.superMethod;
            // return the result of the applied method
            return returnValue;
          };

        })(methodName, methods[methodName])

        : methods[methodName];
      }
    }
  }

  return Module;

});

