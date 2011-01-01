
	Class("com.example.Person")	

	.properties ({
		name: {
			value: "Unbekannt",
			getter: function() {
				return this._name;
			},
			setter: function(value) {
				this._name = value;
			}
		}
	})	
	
	.initialize (function(){
		console.log("Init Person " + this.name);
	})
	
	.methods ({
		sayHello: function() {
			console.log("Hi I am a Person with name " + this.name);
		}
	})

	.end();

