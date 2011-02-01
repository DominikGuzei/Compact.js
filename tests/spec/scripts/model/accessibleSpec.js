
define(['compact/Class', 'compact/model/accessible'], 

function(Class, accessible) {
	
	describe("compact/model/accessible", function() {
	  
		var accessibleNamespace = {};
		
		Class("Test") .mixin(accessible)
		.properties({
			test: "test"
		})
		.end(accessibleNamespace);
		
		var instance;
		beforeEach(function() {
		  instance = new accessibleNamespace.Test();
		});
		
		describe("default set('key', value)", function() {
			
			it("Changes the value of the property", function() {
			  instance.set("test", "changed");
				expect(instance.test).toEqual("changed");
			});
			
			it("Creates a new property if key does not exist yet", function() {
			  instance.set("created", "value");
				expect(instance.created).toEqual("value");
			});
		
		});
		
		describe("set({ 'key' : value, 'key2: value })", function() {
		  
			it("Should be possible to provide an object with key:value pairs", function() {
			  instance.set({
					test: "bla",
					sub: {}
				});
				
				expect(instance.test).toEqual("bla");
				expect(instance.sub).toEqual({});
			});
		
		});
		
		describe("get('key')", function() {
		
			it("Returns the value of the property", function() {
			  expect(instance.get('test')).toEqual("test");
			});
			
			it("throws error when key is not defined on object", function() {
			  expect(instance.get).toThrow();
			});
		
		});
		
	});
});