define(['compact/model/Model', 'compact/model/Store'], 

function(Model, Store) {
	
	describe("compact/model/Model", function() {
		
		var instance;
		var store;
		beforeEach(function() {
		  instance = new Model();
			store = Store.getInstance();
		});

		afterEach(function() {
		  Store.instance = undefined;
		});
		
		describe("default attributes", function() {
		  
			it("Has an values object with model domain values", function() {
			  expect(instance.attributes).toBeDefined();
			});
			
			it("Has an undefined id at creation", function() {
			  expect(instance.id).toBe(null);
			});
		
		});
		
		describe("get", function() {
		  
			it("Returns the value of the model attribute", function() {
			  instance.attributes.test = "value";
				expect(instance.get("test")).toEqual("value");
			});
		
		});
		
		describe("set", function() {
		  
			it("Sets the value of a model attribute", function() {
			  instance.set("test", "value");
				expect(instance.attributes.test).toEqual("value");
			});
			
			it("Sets all attributes of the model", function() {
			  instance.set({
					test: "value",
					name: "test"
				});
				expect(instance.attributes.test).toEqual("value");
				expect(instance.attributes.name).toEqual("test");
			});
			
			it("Is possible to validate the change of a model attribute", function() {
			  instance.attributes.test = "value";
				instance.addEventValidator("change:test", function(value, errors) {
					errors.push("some error");
				});
				instance.set("test", "changed");
				expect(instance.attributes.test).toEqual("value");
			});
		
			it("Is possible to listen on a change of a attribute", function() {
			  instance.attributes.test = "value";
				var changed;
				instance.addEventListener("changed:test", function(value) {
					changed = value;
				});
				instance.set("test", "changed");
				expect(changed).toEqual("changed");
			});
		
		});
		
		describe("isNew", function() {
		  
			it("Tells if the model was not yet saved to the server", function() {
			  expect(instance.isNew()).toBeTruthy();
				instance.id = 1;
				expect(instance.isNew()).not.toBeTruthy();
			});
		
		});
		
		describe("save", function() {
		
			it("Tells the Store to create the record if it is new", function() {
				var called = false;
				store.addEventListener("create", function(model) {
					expect(model).toBe(instance);
					called = true;
				});
			  instance.save();
				expect(called).toBeTruthy();
			});
			
			it("Tells the Store to update the record if it exists persistently", function() {
				var called = false;
				instance.id = 1;
				store.addEventListener("update", function(model) {
					expect(model).toBe(instance);
					called = true;
				});
			  instance.save();
				expect(called).toBeTruthy();
			});
		
		});
		
		describe("destroy", function() {
		  
			it("Tells the Store to send a out an event to delete the model", function() {
			  var called = false;
				store.addEventListener("destroy", function(model) {
					expect(model).toBe(instance);
					called = true;
				});
			  instance.destroy();
				expect(called).toBeTruthy();
			});
		
		});
		
		describe("toJSON", function() {
		  
			it("Returns the attributes of the model as json string", function() {
			  instance.set({
					name: "value",
					test: { inside: "hello" },
					arr: [1,2,3]
				});
				expect(instance.toJSON()).toEqual('{"name":"value","test":{"inside":"hello"},"arr":[1,2,3]}');
			});
		
		});
		
	});
	
});