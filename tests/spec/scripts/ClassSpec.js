define([
  'compact/Class', 
  'compact/Mixin'
], 

function(Class, Mixin) {

  var complexProp = {
    object: {},
    array: [],
    date: new Date()
  };

  Class("com.example.Person")
  .properties({
    name: "unknown",
    custom: "some",
    watched: "watch",
    strange: undefined,
    complex: complexProp
  })
  .end(window);

  describe("compact/utility/class/Class", function() {

    describe("Class()", function() {
      it("should provide a namespace", function() {
        Class("com.example.Test").end(window);
        expect(com.example.Test).toBeTypeOf('function');
      });

      it("returns the created class when .end() is called", function() {
        expect( Class("example").end() ).toBeTypeOf('function');
        expect( window.example ).not.toBeDefined();
      });

    });

    describe(".extend()", function() {
      Class("test.extend.Super")
      .end(window);

      Class("test.extend.Sub").extend(test.extend.Super)
      .end(window);

      it("should be instance of both classes", function() {
        var sub = new test.extend.Sub();

        expect(sub instanceof test.extend.Super && sub instanceof test.extend.Sub).toBeTruthy();
      });

    });

    describe(".methods()", function() {
      Class("test.methods.Super")
      .methods({
        sayHello: function() {
          return "hello";
        }

      })
      .end(window);

      Class("test.methods.Sub").extend(test.methods.Super)
      .methods({
        sayHello: function() {
          return this.superMethod() + " world";
        }

      })
      .end(window);

      it("should add methods to the prototype of the class", function() {
        expect(test.methods.Super.prototype.sayHello).toBeTypeOf('function');
        expect(test.methods.Sub.prototype.sayHello).toBeTypeOf('function');
      });

      it("should reference the super class method in the sub class", function() {
        var sub = new test.methods.Sub();
        expect(sub.sayHello()).toEqual("hello world");
      });

    });

    describe(".initialize()", function() {
      var init = jasmine.createSpy();
      Class("test.initialize.Super")
      .initialize(init)
      .end(window);

      var initSub = jasmine.createSpy();
      Class("test.initialize.Sub").extend(test.initialize.Super)
      .initialize(initSub)
      .end(window);

      it("should call the initialize function on instanciation", function() {
        expect(init).not.toHaveBeenCalled();
        var initTest = new test.initialize.Super();
        expect(init).toHaveBeenCalled();
      });

      it("should call the initialize function on the super class automatically", function() {
        expect(initSub).not.toHaveBeenCalled();
        var initTest = new test.initialize.Sub();
        expect(initSub).toHaveBeenCalled();
      });

      it("should have default and user arguments applied on initialize", function() {

        Class("test.initialize.Properties")
        .properties({
          defaultVar: "somevalue",
          userChanged: "defaultvalue"
        })
        .initialize( function() {
          expect(this.defaultVar).toEqual("somevalue");
          expect(this.userChanged).toEqual("uservalue");
        })
        .end(window);
        
        var property = new test.initialize.Properties({
          userChanged: "uservalue"
        });
      });
      
      it("hands the complete user argument object to the initializer", function() {
        var MyClass = Class("TestClass")
        .properties({
          defaultVar: "somevalue",
        })
        .initialize( function(userArguments) {
          expect(userArguments.defaultVar).toEqual("changed");
          expect(userArguments.extraValue).toEqual("extraValue");
        })
        .end();
        
        new MyClass({
          defaultVar: "changed",
          extraValue: "extraValue"
        });
      });

    });

    describe(".properties()", function() {

      var person;
      beforeEach( function() {
        person = new com.example.Person({
          name: "Dominik"
        });
      });

      it("should apply user arguments / leave the default / set to undefined", function() {
        expect(person.name).toEqual("Dominik");
        expect(person.custom).toEqual("some");
        expect(person.strange).toEqual(undefined);
      });

      it("should make a deep copy of complex properties (objects, arrays)", function() {
        expect(person.complex).not.toBe(complexProp);
        expect(person.complex.object).not.toBe(complexProp.object);
        expect(person.complex.array).not.toBe(complexProp.array);
        expect(person.complex.date).not.toBe(complexProp.date);
      });

    });

    describe(".statics()", function() {
      var test = {};
      Class("Statics")
      .statics({
        instance: null,
        getInstance: function() {
          if(!this.instance)
            this.instance = new this();
          return this.instance;
        }

      })
      .end(test);

      it("Adds static properties and methods to the class", function() {
        expect(test.Statics.instance).toEqual(null);
        var instance = test.Statics.getInstance();
        expect(test.Statics.getInstance()).toBe(instance);
      });

    });

    describe(".mixin()", function() {
      Mixin("test.mixin.Mixin")
      .methods({
        sayHello: function() {
          return "hello"
        },

        saySomethingElse: function() {
          return "mixed in method"
        }

      })
      .end(window);

      Mixin("test.mixin.Test")
      .methods({
        sayHello: function() {
          return "hello world"
        },

        sayGoodbye: function() {
          return "goodbye"
        }

      })
      .end(window);

      Class("test.mixin.Mixed")
      .mixin(test.mixin.Mixin, test.mixin.Test)
      .end(window);

      it("should add mixin methods to prototype of class", function() {
        expect(test.mixin.Mixed.prototype.saySomethingElse).toBeTypeOf('function');
        expect(test.mixin.Mixed.prototype.sayHello).toBeTypeOf('function');
      });

    });

  }); // end Class

});