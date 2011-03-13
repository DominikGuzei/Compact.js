
define([
  'compact/Class', 
  'compact/collection/Accessible'
], 

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
		
		describe("beforeChange", function() {
		  
		  it("returns a string representing the scope of an event that is dispatched before a change", function() {
		    expect(this.instance.beforeChange("test")).toEqual("accessible:change:test");
		  });
		  
		});
		
		describe("afterChange", function() {
      
      it("returns a string representing the scope of an event that is dispatched after a change", function() {
        expect(this.instance.afterChange("test")).toEqual("accessible:changed:test");
      });
      
    });
    
    describe("invalidChange", function() {
      
      it("returns a string representing the scope of an event that was invalidated", function() {
        expect(this.instance.invalidChange("test")).toEqual("accessible:invalid:test");
      });
      
    });
		
		describe("set('key', value)", function() {
			
			it("Changes the value of the property", function() {
			  this.instance.set("test", "changed");
				expect(this.instance.test).toEqual("changed");
			});
			
			it("Creates a new property if key does not exist yet", function() {
			  this.instance.set("created", "value");
				expect(this.instance.created).toEqual("value");
			});
			
			it("invalidates the change", function() {
			  var called = false;
			  this.instance.addEventValidator(this.instance.beforeChange("test"), function(value, errors) {
			    errors.push("I have a problem with this");
			    called = true;
			  });
			  
			  this.instance.set("test", "bla");
			  expect(called).toBeTruthy();
			  
			  expect(this.instance.test).toEqual("test");
			});
			
			it("listens to the invalid change", function() {
			  
			  this.instance.addEventValidator(this.instance.beforeChange("test"), function(value, errors) {
			    errors.push("I have a problem with this");
			  });
        
			  var called = false;
			  this.instance.addEventListener(this.instance.invalidChange("test"), function(details) {
			    called = true;
			    expect(details.key).toEqual("test");
			    expect(details.value).toEqual("bla");
			    expect(details.errors[0]).toEqual("I have a problem with this");
			  });
			  
			  this.instance.set("test", "bla");
			  expect(called).toBeTruthy();
			});
		
		  it("dispatches an event after the value changed", function() {
		    
		    var testCallbackSpy = jasmine.createSpy();
		    this.instance.addEventListener(this.instance.afterChange("test"), testCallbackSpy);
		    this.instance.set("test", "blub");
		    expect(testCallbackSpy).toHaveBeenCalledWith("blub");
		    
		  });
		  
		  it("dispatches an global afterChange event", function() {
		    var testCallbackSpy = jasmine.createSpy();
        this.instance.addEventListener(this.instance.afterChange(), testCallbackSpy);
        this.instance.set("test", "blub");
        expect(testCallbackSpy).toHaveBeenCalledWith(this.instance);
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
			  this.instance.addEventValidator(this.instance.beforeChange(), function(values, errors) {
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
			  
			  this.instance.addEventValidator(this.instance.beforeChange(), function(values, errors) {
			    errors.push("Not changing");
			  });
			  
			  var called = false;
			  this.instance.addEventListener(this.instance.invalidChange(), function(details) {
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
		  
		  it("dispatches exactly one global afterChange event", function() {
        var testCallbackSpy = jasmine.createSpy();
        var changedProps = {
          test: "bla",
          sub: {}
        };
        this.instance.addEventListener(this.instance.afterChange(), testCallbackSpy);
        this.instance.set(changedProps);
        expect(testCallbackSpy).toHaveBeenCalledWith(changedProps);
        expect(testCallbackSpy.callCount).toBe(1);
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
		
		describe("_accessibleCollection", function() {
		  
		  var local = {};
		  Class("Test") .mixin(Accessible)
      .properties({
        attributes: {}
      })
      .methods({
        _accessibleCollection: function() {
          return this.attributes;
        }
      })
      .end(local);
		  
		  it("can define the collection, accessible works on", function() {
		    var accessible = new local.Test();
		    expect(accessible.attributes.test).not.toBeDefined();
		    accessible.set("test", "value");
		    expect(accessible.attributes.test).toEqual("value");
		  });
		  
		});
		
	});
});