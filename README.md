
**Compact.js** combines best practices and experience with object oriented javascript to provide a compact base to build **class hierarchies** and **modular components**.

Built with Performance in Mind
-------------------------
The whole library is built on **[Require.js](http://requirejs.org/)** and uses the concept of non-global modules which [shows to be up to 98% faster](http://jsperf.com/global-namespace-chain-vs-string-based-local-modules) than traditional modular JavaScript that is used in most other frameworks.

The Core
=========
-----------
The whole framework is built around a lightweight (1k) core ***[compact/Module](https://github.com/DominikGuzei/Compact.js/blob/master/compact/scripts/Module.js)*** that enables you to write classes and mixins in an clean and lean way. It borrows the idea of function chaining to construct your own awesome modules, see yourself:

Module:
----------------

**Create a basic (useless) class and append it to the global window:**

    Module("my.awesome.TestModule").end(window);
    var instance = new my.awesome.TestModule(); // instanciable via the complete namespace

**You can always refuse to build global namespaces if you omit the context in .end():**

    var TestModule = Module("TestModule").end();
    var instance = new TestModule(); // instanciable like this

**Syntax: Module( namespace:String ).end( optionalContext:Object )**

Module is a function that returns an "chainable class builder" that collects the information of your class and returns it when .end() is called.

--------
###Constructor: **.initialize( constructor:Function )**
By default you don't need to define a constructor but you can use it to initialize properties.

**Building a class with a custom initializer**

    var InitializeModule = Module("InitializerModule") 
     
    .initialize (function( name ){
      this.name = name || "Default";
    })
    
    .end();
    
    // Pass a custom name property to constructor
    var instance = new InitializerModule( "custom" );

--------    
###Methods: **.methods( methodsDefinition:Object )**
Define (prototype) methods for your classes.

**Building a class that defines a method**

    var ModuleWithMethod = Module("ModuleWithMethod")
    
    .initialize (function( name ){
      this.name = name || "Default";
    })
    
    .methods({
      getName: function() { return this.name }
    })
    
    .end();

    var instance = new ModuleWithMethod( "Compact" );
    instance.getName(); // "Compact"

----------
###Statics: **.statics( staticPropertiesAndMethods:Object )**
These methods and properties are assigned statically to your class, comparable to class methods in other languages.

**Building a singleton with a statics**

    var Singleton = Module("Singleton")
    
    .initialize (function( name ){
      this.name = name || "Default";
    })
    
    .statics({
      instance: null,
      getInstance: function() {
        if(!Singleton.instance) {
          Singleton.instance = new Singleton();
        }
        return Singleton.instance;
      }
    })
    
    .end();

    var instance = Singleton.getInstance();
    instance.name; // "Default"
    
-----------------    
Inheritance
-----------------
The class builder also enables you to build class hierarchies extremely comfortable:

    Module("SuperModule")
    
    .initialize (function( name ){
      this.name = name || "SuperModule";
    })
    
    .methods({
      sayHello: function() { return "from " + this.name; }
    })
    
    .end(window);


    Module("SubModule") .extend( SuperModule )
    
    .initialize (function( greeting ){
      this.superMethod(); // call the super constructor
      this.greeting = greeting || "hello ";
    })
    
    .methods({
      sayHello: function() {
        // this.superMethod() always points to the same method on the super class
        return this.greeting + this.superMethod();
      }
    })
    
    .end(window);
    
    var instance = new SubModule();
    instance.sayHello(); // "hello from SuperModule"

###Rules:
- methods from sub class overwrite those from super class but have a special reference to them (this.superMethod)
- inheritance just means aggregating the prototype of the subclasses with the methods from the super classes

----------    
Mixins
-----------------
**Syntax: .mixin( FirstModule, SecondModule )**

Add modular behaviour that should be separated from the class hierarchy:

    Module("Mixin")
    
    .methods({
      sayHello: function() { return "hello" },
      saySomethingElse: function() { return "mixed in method" }
    })
    
    .end(window);

  
    Module("ModuleWithAddedBehaviour") .mixin( Mixin )
    
    .methods({
      sayHello: function() { return "hello world" },
      sayGoodbye: function() { return "goodbye" }
    })
    
    .end(window);


In this example the class would be augmented with the "saySomethingElse" method from the mixin but would not take the "sayHello" method
because it defines it itself.

###How to use mixins:
Mixins are Modules that are not directly in included into the inheritance chain and thus their constructor cannot be called from the mixed module. 
You can also augment mixins with other mixins through the .mixin method.

Further Documentation
---------
This was just the introduction to Compact.js, to fully understand the library you should read the tests - there you will find many more examples
