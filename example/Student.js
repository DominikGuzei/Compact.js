	
	// Prototype inheritance
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