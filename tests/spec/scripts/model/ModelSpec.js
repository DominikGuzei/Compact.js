define(['model/Model'], function(Model) {
	
	describe("model/Model", function() {
		
		var instance;
		beforeEach(function() {
		  instance = new Model();
		});
		
		describe("default attributes", function() {
		  
			it("Has an values object with model domain values", function() {
			  expect(instance.attributes).toBeDefined();
			});
			
			it("Has an undefined id at creation", function() {
			  expect(instance.id).toBe(null);
			});
			
			it("Has an undefined clientId at creation", function() {
			  expect(instance.clientId).toBe(null);
			});
		
		});
		
		describe("get", function() {
		  
			it("Returns the value of the model property", function() {
			  instance.attributes.test = "value";
				expect(instance.get("test")).toEqual("value");
			});
		
		});
		
		describe("set", function() {
		  
			it("Sets the value of a model property", function() {
			  instance.set("test", "value");
				expect(instance.attributes.test).toEqual("value");
			});
			
			it("Sets all properties of an object literal", function() {
			  instance.set({
					test: "value",
					name: "test"
				});
				expect(instance.attributes.test).toEqual("value");
				expect(instance.attributes.name).toEqual("test");
			});
			
			it("Is possible to validate the change of a model property", function() {
			  instance.attributes.test = "value";
				instance.validate("change:test", function(value) {
					return false;
				});
				instance.set("test", "changed");
				expect(instance.attributes.test).toEqual("value");
			});
		
		});
		
	});
	
});