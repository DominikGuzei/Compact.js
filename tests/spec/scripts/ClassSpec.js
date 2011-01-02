
define(['Class'], function(Class) {
	
	Class("com.example.Person")
	.properties({
		name: {
			value: "Unknown"
		},
		custom: {
			value: "some",
			getter: function() { return this._custom + "custom"; },
			setter: function(value) { this._custom = value + "changed" }
		},
		strange: {}
	})
	.end(window);
	
	
	describe("Class", function() {	
		it("should provide a namespace", function() {
			Class("com.example.Test").end(window);
			expect(com.example.Test).toBeDefined();
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
			sayHello: function() { return "hello" }
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
				defaultVar: {
					value: "somevalue"
				},
				userChanged: {
					value: "defaultvalue"
				}
			})
			.initialize(function() {
				expect(this.getDefaultVar()).toEqual("somevalue");
				expect(this.getUserChanged()).toEqual("uservalue");
			})
			.end(window);
			
			var property = new test.initialize.Properties({
				userChanged: "uservalue"
			});
		});
	
	});
	
	
	
	describe(".properties()", function() {
		
		var person;
		beforeEach(function() {
			person = new com.example.Person({
				name: "Dominik"
			});
		});
		
		it("should add private properties to prototype", function() {
			expect(com.example.Person.prototype._name).toBeDefined();
			expect(com.example.Person.prototype._name).toEqual("Unknown");
		});
		
		it("should apply user arguments / leave the default / set to undefined", function() {
		  expect(person._name).toEqual("Dominik");
			expect(person._custom).toEqual("some");
			expect(person._strange).toEqual(undefined);
		});
		
		it("should add public getter and setter for properties", function() {
		  expect(com.example.Person.prototype["getName"]).toBeTypeOf('function');
			expect(com.example.Person.prototype["setName"]).toBeTypeOf('function');
			expect(person.getName()).toEqual("Dominik");
			person.setName("Setter");
			expect(person.getName()).toEqual("Setter");
		});
		
		it("should use custom getter and setter if defined", function() {
		  expect(com.example.Person.prototype["getCustom"]).toBeTypeOf('function');
			expect(com.example.Person.prototype["setCustom"]).toBeTypeOf('function');
			expect(person.getCustom()).toEqual("somecustom");
			person.setCustom("some");
			expect(person.getCustom()).toEqual("somechangedcustom");
		});
		
		it("should also add getter and setter for undefined values", function() {
		  expect(com.example.Person.prototype["getStrange"]).toBeTypeOf('function');
			expect(com.example.Person.prototype["setStrange"]).toBeTypeOf('function');
			expect(person.getStrange()).toEqual(undefined);
			person.setStrange("defined");
			expect(person.getStrange()).toEqual("defined");
		});
		
		it("should call a 'filter' method before property change and apply the result", function() {
			person._filterChange = function(property, value) {
				expect(property).toEqual("name");
				expect(value).toEqual("Some Value");
				return "Filtered Value";
			}
			spyOn(person, '_filterChange').andCallThrough();
			person.setName("Some Value");
			expect(person._filterChange).toHaveBeenCalled();
			expect(person.getName()).toEqual("Filtered Value");
			person._filterChange = undefined;
		});
		
		it("should call a 'before' method to validate the change of a property", function() {
			person._beforeChange = function(property, value) {
				expect(property).toEqual("name");
				return value == "Right Value" ? true : false;
			}
			spyOn(person, '_beforeChange').andCallThrough();
			person.setName("Some Value");
			expect(person._beforeChange).toHaveBeenCalled();
			expect(person.getName()).toEqual("Dominik");
			person.setName("Right Value");
			expect(person.getName()).toEqual("Right Value");
			person._beforeChange = undefined;
		});
		
		it("should call an 'after' method to inform about the change", function() {
			person._afterChange = function(property, value) {
				expect(property).toEqual("name");
				expect(value).toEqual("Changed Value");
			}
			spyOn(person, '_afterChange').andCallThrough();
			person.setName("Changed Value");
			expect(person._afterChange).toHaveBeenCalled();
			expect(person.getName()).toEqual("Changed Value");
			person._afterChange = undefined;
		});
	});
	
	describe(".mixin()", function() {
		Class("test.mixin.Mixin")
		.methods({
			sayHello: function() { return "hello" },
			saySomethingElse: function() { return "mixed in method" }
		})
		.end(window);
		
	  Class("test.mixin.Test")
		.methods({
			sayHello: function() { return "hello world" },
			sayGoodbye: function() { return "goodbye" }
		})
		.mixin(test.mixin.Mixin)
		.end(window);
		
		it("should add mixin methods to prototype of class", function() {
		  expect(test.mixin.Test.prototype.saySomethingElse).toBeTypeOf('function');
			expect(test.mixin.Test.prototype.sayHello).toBeTypeOf('function');
			expect(test.mixin.Test.prototype.saySomethingElse()).toEqual("mixed in method");
		});
		
		it("should overwrite mixin methods with own methods", function() {
		  expect(test.mixin.Test.prototype.sayHello()).toEqual("hello world");
		});
	});
	
});