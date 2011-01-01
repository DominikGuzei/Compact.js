
	Class("com.example.Student").extend(com.example.Person)
	
	.properties({
		number: {
			value: 0
		}
	})
	
	.initialize(function(){
		console.log("Init Student", this.name, this.number);
	})
	
	.methods({
		sayHello: function() {
			this.superMethod();
			console.log("and I study at university with number " + this.number);
		}
	})
	
	.end();