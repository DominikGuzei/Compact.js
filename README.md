This library combines best practices and experience with object oriented javascript to provide a compact base to build class hierarchies and modular components. It helps you keep your code DRY and readable by following conventions and doing magic in the background, see yourself:

Class Definition
-----------------

		Class("com.example.Person") 

		.properties ({
			name: { 
				value: "Unbekannt", // default value
				getter: function() { 
					return this._name;
				},
				setter: function(value) {
					this._name = value;
				}
			}
		})	

		.initialize (function(){
			console.log("Constructor of Person " + this.name);
		})

		.methods ({
			sayHello: function() {
				console.log("Hi I am a Person with name " + this.name);
			}
		})

		.end(window); // add the namespace to any object!
		
Inheritance
-----------------

		Class("com.example.Student").extend(com.example.Person)

		.properties({
			number: {
				value: 0
			}
		})

		// You don't need to call the super class constructor
		// this is done automatically in the background
		.initialize(function(){
			console.log("Constructor of Student", this.name, this.number);
		})

		.methods({
			sayHello: function() {
				this.superMethod(); // call the same method on the super class
				console.log("and I study at university with number " + this.number);
			}
		})

		.end(window);
		
Readable Instanciation 
----------------------
The argument object you pass to your constructor is handed down to all
class constructors in the hierarchy. So you don't have to write the boring
setup glue code in your constructors but do important stuff.

		var dominik = new com.example.Student({
			name: "Dominik",
			number: 1
		});
		
Getter and Setter Automagic
-----------------------------
All properties are accessible via getter and setter methods automatically,
you can also pass your own getter and setter functions for full control.


		.properties({
			name: { 
				value: "Unbekannt", // default value
				getter: function() { 
					return this._name;
				},
				setter: function(value) {
					this._name = typeof(value) == 'string' ? value : this._name; // simple validation
				}
			},
			
			number: { // you dont need to define getter or setter
				value: 0
			}
		})

the getter and setter are methods with names like: 'set' + property
		
		instance.getNumber();
		instance.setNumber(5);
		
		instance.getName();
		instance.setName("Dominik");
		instance.setName(0); // wont change anything because of custom setter
		
Mixins
-----------------
Add functionality to your classes without spoiling the class hierarchy:

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
		
This adds the methods of test.mixin.Mixin to the prototype of test.mixin.Test, but if you define a method with the same name in your class, the mixin method is overwritten.

		test.mixin.Test.prototype.sayHello(); // returns "hello world"