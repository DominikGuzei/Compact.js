===== Class.js =====
This library combines best practices and experience with object oriented javascript to provide a compact base to build class hierarchies and modular components. It helps you keep your code DRY and readable by following conventions and doing magic in the background, see yourself:

---- Class Definition -----

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

		.end();
		
----- Inheritance -----

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

		.end();
		
----- Readable Instanciation -----

		var dominik = new com.example.Student({
			name: "Dominik",
			number: 1
		});