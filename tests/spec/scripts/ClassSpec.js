
define(['Class', 'Mixin'], function(Class, Mixin) {
	
	var complexProp = {
		object: {},
		array: [],
		date: new Date()
	};
	
	Class("com.example.Person")
	.properties({
		name: {
			value: "Unknown"
		},
		custom: {
			value: "some",
		},
		watched: {
			value: "watch"
		},
		strange: {},
		complex: {
			value: complexProp
		}
	})
	.end(window);
	
	
	describe("Class", function() {	
		
		describe("Class()", function() {
		  it("should provide a namespace", function() {
				Class("com.example.Test").end(window);
				expect(com.example.Test).toBeTypeOf('function');
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
				sayHello: function() { return "hello"; }
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
					expect(this.defaultVar).toEqual("somevalue");
					expect(this.userChanged).toEqual("uservalue");
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
			Class("statics.Class")
			.statics({
				prop: "property",
				fn: function() { return "function" }
			})
			.end(test);
			
			it("Adds static properties and methods to the class", function() {
			  expect(test.statics.Class.prop).toEqual("property");
				expect(test.statics.Class.fn()).toEqual("function");
			});
		});
		

		describe(".mixin()", function() {
			Mixin("test.mixin.Mixin")
			.methods({
				sayHello: function() { return "hello" },
				saySomethingElse: function() { return "mixed in method" }
			})
			.end(window);

		  Mixin("test.mixin.Test")
			.methods({
				sayHello: function() { return "hello world" },
				sayGoodbye: function() { return "goodbye" }
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