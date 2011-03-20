Introduction
==========
-------------
**Compact.js** combines best practices and experience with object oriented javascript to provide a compact base to build **class hierarchies** and **modular components**. It helps you keep your code **DRY** and readable by **following conventions** and doing some magic in the background.

Built on the shoulders of giants
-------------------------
It takes the best approaches and code found in other open source javascript projects and combines them into a modular framework based on **[Require.js](http://requirejs.org/)** that handles all **dependency management** and offers plugins for **i18n** and other sweet stuff.

The Core
=========
-----------
The whole framework is built around a lightweight (1k) core that enables you to write classes and mixins in an clean and lean way. It borrows the idea of function chaining to construct your own awesome modules, see yourself:

Class:
----------------
**Syntax: Class( namespace:String ).end( optionalContext:Object )**

Class is a function that returns an "chainable class builder" that collects the information of your class and returns it when .end() is called.

**Create a basic (useless) class and append it to the global window:**

    Class("my.awesome.TestClass").end(window);
    var instance = new my.awesome.TestClass(); // instanciable via the complete namespace

**You can always refuse to build global namespaces if you omit the context in .end():**

    var TestClass = Class("TestClass").end();
    var instance = new TestClass(); // instanciable like this

-------
###Properties: **.properties( propertiesDefinition:Object )**
Before calling .end() on the "chainable class builder" you can also specify the properties you plan to use in your class with default values

**Build a class that has two properties and their default values defined**
  
    Class("PropertyClass")
    
    .properties({
      name: "Compact",
      collection: []
    });
    
    .end(window);
    
    // This will apply the name property of the argument to the
    // name property of the instance and take the default value
    // for the collection (empty array);
    
    var instance = new PropertyClass({ name: "Changed" }); 
    
    // You can also omit the argument object and leave all the defaults:
    
    var instance = new PropertyClass();
    
    // Note that you can not assign new properties to the instance 
    // via the argument object. This would be useless:
    
    var instance = new PropertyClass({ newProp: "test" });

--------
###Constructor: **.initialize( constructor:Function )**
By default you don't need to define a constructor and often you can omit it because the properties are applied for you in the background.
But there are also cases where you need to do special initialization or want to be able to access all properties that where handed to your
class constructor by the user.

**Building a class with a custom initializer**

    Class("InitializerClass") 
    
    .properties ({
      name: "default"
    }) 
     
    .initialize (function( userArguments ){
      this.name; // "default" -> is applied automaticlly by the framework
      this.specialProp; // undefined
      userArguments.specialProp // "value"
    })
    
    .end(window);
    
    // Pass a special initialization property that is not defined as default
    var instance = new InitializerClass({ specialProp: "value" });

--------    
###Methods: **.methods( methodsDefinition:Object )**
Like properties it is possible to define methods for your classes.

**Building a class that defines a method**

    Class("ClassWithMethod")
    
    .properties({
      name: "Compact"
    })
    
    .methods({
      getName: function() { return this.name }
    })
    
    .end(window);

    // retrieve the name via the method
    var instance = new ClassWithMethod();
    instance.getName(); // "Compact"


###Statics: **.statics( staticPropertiesAndMethods:Object )**
These methods and properties are assigned statically to your class, comparable to class methods in other languages. All functions that are
declared in the .statics definition have "this" pointing to the class constructor, so that all static properties or methods can be
accessed via this.property / this.method().

**Building a singleton with a statics**

    Class("Singleton")
    
    .properties({
      name: "Compact"
    })
    
    .statics({
      instance: null,
      getInstance: function() {
        if(!this.instance) this.instance = new this(); // this points to the class constructor
        return this.instance;
      }
    })
    
    .end(window);

    // retrieve the one and only instance
    var instance = Singleton.getInstance();
    instance.name; // "Compact"
    
-----------------    
Inheritance
-----------------
The class builder also enables you to build class hierarchies extremely comfortable:

    Class("SuperClass")
    
    .properties({
      name: "SuperClass"
    })
    
    .methods({
      sayHello: function() { console.log("from " + this.name); }
    })
    
    .end(window);


    Class("SubClass") .extend( SuperClass )
    
    .properties({
      greeting: "hello"
    })
    
    .methods({
      sayHello: function() {
        console.log(this.greeting);
        this.superMethod(); // always points to the same method on the super class
      }
    })
    
    .end(window);
    
    // say hello from both classes:
    var instance = new SubClass();
    instance.sayHello(); // "hello from SuperClass"

###Rules:
- Properties from sub class overwrite those from its super class
- methods from sub class overwrite those from super class but have a special reference to them (this.superMethod)
- inheritance just means aggregating the prototype of the subclasses with the methods from the super classes

----------    
Mixins
-----------------
**Syntax: Mixin( namespace:String ).end( optionalContext:Object )**

Add modular behaviour that should be separated from the class hierarchy:

    Mixin("Module")
    
    .methods({
      sayHello: function() { return "hello" },
      saySomethingElse: function() { return "mixed in method" }
    })
    
    .end(window);
  
  
  
    Class("ClassWithAddedBehaviour") .mixin(Module)
    
    .methods({
      sayHello: function() { return "hello world" },
      sayGoodbye: function() { return "goodbye" }
    })
    
    .end(window);


In this example the class would be augmented with the "saySomethingElse" method from the mixin but would not take the "sayHello" method
because it defines it itself.

###How to use mixins:
Mixin has exactly the same syntax like Class but does not offer .statics, .initialize or .extend
You can also augment mixins with other mixins through the .mixin method.

Further Documentation
---------
This was just the introduction to Compact.js, to fully understand the library you should read the tests - there you will find many more examples