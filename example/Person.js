	
	// Easy namespacing for your classes
	Class("com.example.Person") 

	.properties ({
		name: { 
			value: "Unknown", // default value
			getter: function() { 
				return this._name;
			},
			setter: function(value) {
				this._name = value;
			}
		}
	})	
	
	// You don't need to call the super class constructor, 
	// this is done automatically in the background
	.initialize (function(){
		console.log("Constructor of Person " + this.name);
	})
	
	.methods ({
		sayHello: function() {
			console.log("Hi I am a Person with name " + this.name);
		}
	})

	.end();

