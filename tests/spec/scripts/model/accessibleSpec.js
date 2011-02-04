
define(['compact/Class', 'compact/model/Accessible'], 

function(Class, Accessible) {
	
	describe("compact/model/Accessible", function() {
	  
		var accessibleNamespace = {};
		
		Class("Test") .mixin(Accessible)
		.properties({
			test: "test"
		})
		.end(accessibleNamespace);
		
		beforeEach(function() {
		  this.instance = new accessibleNamespace.Test();
		});
		
		describe("default set('key', value)", function() {
			
			it("Changes the value of the property", function() {
			  this.instance.set("test", "changed");
				expect(this.instance.test).toEqual("changed");
			});
			
			it("Creates a new property if key does not exist yet", function() {
			  this.instance.set("created", "value");
				expect(this.instance.created).toEqual("value");
			});
			
			it("is possible to invalidate the change", function() {
			  var called = false;
			  this.instance.addEventValidator("change:test", function(value, errors) {
			    errors.push("I have a problem with this");
			    called = true;
			  });
			  
			  this.instance.set("test", "bla");
			  expect(called).toBeTruthy();
			  
			  expect(this.instance.test).toEqual("test");
			});
			
			it("listens to the invalid change", function() {
			  
			  this.instance.addEventValidator("change:test", function(value, errors) {
			    errors.push("I have a problem with this");
			  });
        
			  var called = false;
			  this.instance.addEventListener("invalid:change:test", function(details) {
			    called = true;
			    expect(details.key).toEqual("test");
			    expect(details.value).toEqual("bla");
			    expect(details.errors[0]).toEqual("I have a problem with this");
			  });
			  
			  this.instance.set("test", "bla");
			  expect(called).toBeTruthy();
			});
		
		});
		
		
		describe("set({ 'key' : value, 'key2: value })", function() {
		  
			it("Should be possible to provide an object with key:value pairs", function() {
			  this.instance.set({
					test: "bla",
					sub: {}
				});
				
				expect(this.instance.test).toEqual("bla");
				expect(this.instance.sub).toEqual({});
			});
			
			it("is possible to invalidate all changes", function() {
			  
			  var called = false;
			  this.instance.addEventValidator("change", function(values, errors) {
			    errors.push("Not changing");
			    called = true;
			  });
			  
			  this.instance.set({
					test: "bla",
					sub: {}
				});
				
				expect(called).toBeTruthy();
				expect(this.instance.test).toEqual("test");
				expect(this.instance.sub).not.toBeDefined();
			});
			
			it("listens to the invalidate event", function() {
			  
			  this.instance.addEventValidator("change", function(values, errors) {
			    errors.push("Not changing");
			  });
			  
			  var called = false;
			  this.instance.addEventListener("invalid:change", function(details) {
			    called = true;
			    expect(details.errors[0]).toEqual("Not changing");
			  });
			  
			  this.instance.set({
					test: "bla",
					sub: {}
				});
				
				expect(called).toBeTruthy();
				expect(this.instance.test).toEqual("test");
				expect(this.instance.sub).not.toBeDefined();
			});
		
		});
		
		
		describe("get('key')", function() {
		
			it("Returns the value of the property", function() {
			  expect(this.instance.get('test')).toEqual("test");
			});
			
			it("throws error when key is not defined on object", function() {
			  expect(this.instance.get).toThrow();
			});
		
		});
		
	});
});