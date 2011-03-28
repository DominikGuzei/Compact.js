define([
  'compact/Module', 
], 

function(Module) {

  describe("compact/Module", function() {

    describe("Module().end()", function() {
      
      it("builds a namespace chain", function() {
        Module("com.example.Test").end(window);
        expect(com.example.Test).toBeTypeOf('function');
      });

      it("does not polute the global namespace when no baseNamespace is given to .end()", function(){
        Module("example").end();
        expect( window.example ).not.toBeDefined();
      });

      it("returns the created class when .end() is called", function() {
        expect( Module("example").end() ).toBeTypeOf('function');
      });
      
      it("adds this.Module to every instance which points to its Module constructor", function() {
        var Person = Module("Person").end();
        var person = new Person();
        expect(person.Module).toBe(Person);
      });
      
    });
    
    describe(".initialize()", function() {
      
      it("has a default initializer applied", function() {
        var WithoutInit = Module("WithoutInit").end();
        expect(function() { new WithoutInit(); }).not.toThrow();
      });
      
      it("calls the initialize function on instanciation", function() {
        var init = jasmine.createSpy();
      
        var WithInit = Module("WithInit")
        .initialize(init)
        .end();
        
        expect(init).not.toHaveBeenCalled();
        new WithInit();
        expect(init).toHaveBeenCalled();
      });

    });
    
    describe(".methods()", function() {

      it("adds methods to the prototype of the module", function() {
        
        var hello = function() {};
        var world = function() {};
        
        var Test = Module("Test")
        .methods({
          hello: hello,
          world: world
        })
        .end();
        
        expect(Test.prototype.hello).toBe(hello);
        expect(Test.prototype.world).toBe(world);
      });

    });
    
    describe(".statics()", function() {
      
      var Static = Module("Static")
      .statics({
        instance: null,
        getInstance: function() {
          if(!this.instance)
            this.instance = new this();
          return this.instance;
        }
      })
      .end();

      it("Adds static properties and methods to the module constructor", function() {
        expect(Static.instance).toEqual(null);
        var instance = Static.getInstance();
        expect(Static.instance).toBe(instance);
      });

    });
    
    describe(".extend()", function() {
      
      it("defines the module as instance of both modules", function() {
        var Super = Module("Super").end();
        var Sub = Module("Sub").extend(Super).end();
        
        var sub = new Sub();
        
        expect(sub instanceof Super && sub instanceof Sub).toBeTruthy();
      });

      it("calls the initializer of the super class by default", function() {
        var superInit = jasmine.createSpy();
      
        var Super = Module("Super")
        .initialize(superInit)
        .end();

        var Sub = Module("Sub").extend(Super).end();
        
        new Sub("hallo");
        expect(superInit).toHaveBeenCalledWith("hallo");
      });
      
      it("can call the super initializer manually through this.superMethod", function() {
        var superInit = jasmine.createSpy();
      
        var Super = Module("Super")
        .initialize(superInit)
        .end();

        var Sub = Module("Sub").extend(Super)
        .initialize(function() {
          this.superMethod.apply(this,arguments);
        })
        .end();
        
        var test = new Sub("hallo");
        expect(superInit).toHaveBeenCalledWith("hallo");
      });
      
      it("does not call the super initializer if not done manually", function() {
        var superInit = jasmine.createSpy();
      
        var Super = Module("Super")
        .initialize(superInit)
        .end();

        var Sub = Module("Sub").extend(Super)
        .initialize(function() {
          // not calling super initializer
        })
        .end();
        
        var test = new Sub("hallo");
        expect(superInit).not.toHaveBeenCalled();
      });
      
    });
    
    describe(".mixin()", function() {
      
      var First = Module("First")
      .initialize(function() {
        this.first = "first";
        this.main = "first";
      })
      .methods({
        sayHello: function() {
          return "hello"
        },

        saySomethingElse: function() {
          return "mixed in method"
        }

      })
      .end();

      var Second = Module("Second")
      .initialize(function() {
        this.second = "second";
      })
      .methods({
        sayHello: function() {
          return "hello world"
        },

        sayGoodbye: function() {
          return "goodbye"
        }
      })
      .end();

      var Third = Module("Third")
      .mixin(Second)
      .initialize(function() {
        this.third = "third";
      })
      .end();

      var Mixed = Module("Mixed").mixin(First, Third) 
      .initialize(function() {
        this.main = "main";
      })
      .end();

      it("adds mixin methods to prototype of the module", function() {
        expect(Mixed.prototype.saySomethingElse).toBeTypeOf('function');
        expect(Mixed.prototype.sayHello).toBeTypeOf('function');
      });
      
      it("calls the initializer for each mixin on construction", function() {
        var instance = new Mixed();
        expect(instance.first).toEqual("first");
        expect(instance.second).toEqual("second");
        expect(instance.third).toEqual("third");
        expect(instance.main).toEqual("main");
      });
      
      it("adds all mixins of extended class", function() {
        
        var Sub = Module("Sub").extend(Mixed)
        .initialize(function() {
          this.superMethod.call(this);
          this.main = "sub";
        })
        .end();
        var instance = new Sub();
        expect(instance.first).toEqual("first");
        expect(instance.second).toEqual("second");
        expect(instance.third).toEqual("third");
        expect(instance.main).toEqual("sub");
      });

    });
    
  });
});