
define(['Class', 'Mixin'], function(Class, Mixin) {
	
	var complexProp = {
		object: {},
		array: [],
		date: new Date()
	}
	
	Class("com.example.Person")
	.properties({
		name: {
			value: "Unknown"
		},
		custom: {
			value: "some",
			getter: function() { return this._custom + "custom"; },
			setter: function(value) { this._custom = value + "changed" },
			watchable: true
		},
		watched: {
			value: "watch",
			watchable: true
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
				expect(person._custom).toEqual("some");
				expect(person._strange).toEqual(undefined);
			});

			it("should add public getter and setter for properties", function() {
			  expect(com.example.Person.prototype["getCustom"]).toBeTypeOf('function');
				expect(com.example.Person.prototype["setCustom"]).toBeTypeOf('function');
				expect(person.getCustom()).toEqual("somecustom");
				person.setCustom("Setter");
				expect(person.getCustom()).toEqual("Setterchangedcustom");
			});

			it("should use custom getter and setter if defined", function() {
			  expect(com.example.Person.prototype["getCustom"]).toBeTypeOf('function');
				expect(com.example.Person.prototype["setCustom"]).toBeTypeOf('function');
				expect(person.getCustom()).toEqual("somecustom");
				person.setCustom("some");
				expect(person.getCustom()).toEqual("somechangedcustom");
			});
			
			it("should make a deep copy of complex properties (objects, arrays)", function() {
			  expect(person.complex).not.toBe(complexProp);
				expect(person.complex.object).not.toBe(complexProp.object);
				expect(person.complex.array).not.toBe(complexProp.array);
				expect(person.complex.date).not.toBe(complexProp.date);
			});

			describe("watchable: true", function() {
				it("should call a 'filter' method before property change and apply the result", function() {
					person._filterChange = function(property, value) {
						expect(property).toEqual("watched");
						expect(value).toEqual("Some Value");
						return "Filtered Value";
					}
					spyOn(person, '_filterChange').andCallThrough();
					person.setWatched("Some Value");
					expect(person._filterChange).toHaveBeenCalled();
					expect(person.watched).toEqual("Filtered Value");
					person._filterChange = undefined;
				});
				
				it("should call a 'before' method to validate the change of a property", function() {
					person._beforeChange = function(property, value) {
						expect(property).toEqual("watched");
						return value == "Right Value" ? true : false;
					}
					spyOn(person, '_beforeChange').andCallThrough();
					person.setWatched("Some Value");
					expect(person._beforeChange).toHaveBeenCalled();
					expect(person.watched).toEqual("watch");
					person.setWatched("Right Value");
					expect(person.watched).toEqual("Right Value");
					person._beforeChange = undefined;
				});

				it("should call an 'after' method to inform about the change", function() {
					person._afterChange = function(property, value) {
						expect(property).toEqual("watched");
						expect(value).toEqual("Changed Value");
					}
					spyOn(person, '_afterChange').andCallThrough();
					person.setWatched("Changed Value");
					expect(person._afterChange).toHaveBeenCalled();
					expect(person.watched).toEqual("Changed Value");
					person._afterChange = undefined;
				});
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