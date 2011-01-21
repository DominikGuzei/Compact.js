
define(['compact/Mixin'], function(Mixin) {
	
	describe("compact/Mixin", function() {	
		
		describe("Mixin()", function() {
		  it("should provide a namespace object for the Mixin", function() {
				Mixin("com.example.Test").end(this);
				expect(this.com.example.Test).toBeTypeOf('object');
			});
		});
		
		describe("properties", function() {
		  
			var test = {
				value: "test",
				setter: function() {},
				getter: function() {},
				watchable: true
			}
			
			var name = {
				value: "name"
			}
		
			Mixin("properties.Mixin")
			.properties({
				test: test,
				name: name
			})
			.end(window);
			
			it("should add all property definitions to the __properties__ object of the mixin", function() {
				expect(properties.Mixin.__properties__).toBeDefined();
				expect(properties.Mixin.__properties__.test).toEqual(test);
				expect(properties.Mixin.__properties__.name).toEqual(name);
			});
			
		}); // end properties
		
		describe("methods", function() {
		  
			var firstFn = function() {};
			var secondFn = function() {};
			
			Mixin("methods.Mixin")
			.methods({
				first: firstFn,
				second: secondFn
			})
			.end(window);
		
			it("should add all methods to the __methods__ property of the mixin", function() {
			  expect(methods.Mixin.__methods__).toBeDefined();
				expect(methods.Mixin.__methods__.first).toEqual(firstFn);
				expect(methods.Mixin.__methods__.second).toEqual(secondFn);
			});
		
		});
		
		describe("mixin", function() {
		  
			var first = {};
			var second = {};
			var firstOverwrite = {};
			
			var firstFn = function() {};
			var secondFn = function() {};
			var firstOverwriteFn = function() {};
			
			Mixin("mixin.Mixin1")
			.properties({
				first: first,
				stay: first
			})
			.methods({
				first: firstFn,
				stay: firstFn
			})
			.end(window);
			
			Mixin("mixin.Mixin2")
			.properties({
				second: second
			})
			.methods({
				second: secondFn
			})
			.end(window);
		
			Mixin("mixin.Mixed").mixin(mixin.Mixin1, mixin.Mixin2)
			.properties({
				first: firstOverwrite
			})
			.methods({
				first: firstOverwriteFn
			})
			.end(window);
		
			it("should add the mixed in properties and then add/overwrite with own properties", function() {
				expect(mixin.Mixed.__properties__.stay).toEqual(first);
			  expect(mixin.Mixed.__properties__.first).toEqual(firstOverwrite);
				expect(mixin.Mixed.__properties__.second).toEqual(second);
			});
		
			it("should first add the mixed in methods and then add/override its own methods", function() {
			  expect(mixin.Mixed.__methods__.stay).toEqual(firstFn);
			  expect(mixin.Mixed.__methods__.first).toEqual(firstOverwriteFn);
				expect(mixin.Mixed.__methods__.second).toEqual(secondFn);
			});
		
		});
		
	}); // end Mixin
	
});