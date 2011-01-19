
define(['Class', 'events/PropertyChangeDispatcher'], function(Class, PropertyChangeDispatcher) {
	
	describe("PropertyChangeDispatcher", function() {
	  
		var events = {};
		
		Class("properties.Changer") .extend(PropertyChangeDispatcher)
		.properties({
			test: "test"
		})
		.end(events);
		
		var instance;
		beforeEach(function() {
		  instance = new events.properties.Changer();
		});
		
		describe("set('key', value)", function() {
		  
			it("Adds set method to the class prototype", function() {
			  expect(events.properties.Changer.prototype.set).toBeTypeOf('function');
			});
			
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
		  
			it("Adds get method to the class prototype", function() {
			  expect(events.properties.Changer.prototype.get).toBeTypeOf('function');
			});
		
			it("Returns the value of the property", function() {
			  expect(instance.get('test')).toEqual("test");
			});
			
			it("throws error when key is not defined on object", function() {
			  expect(instance.get).toThrow();
			});
		
		});
		
		describe("_beforeFilter", function() {
			
			it("Calls filters registered as propertyName + 'Change'", function() {
			  var klass = function() {};
				klass.listener1 = function(value) {
					expect(value).toEqual("new value");
					return value;
				};
				klass.listener2 = function(value) {
					expect(value).toEqual("new value");
					return value;
				};
				spyOn(klass, 'listener1').andCallThrough();
				spyOn(klass, 'listener2').andCallThrough();
				
				instance.filter("change:test", klass.listener1);
				instance.filter("change:test", klass.listener2);
			
				instance.set("test", "new value");
				
				expect(klass.listener1).toHaveBeenCalled();
				expect(klass.listener2).toHaveBeenCalled();
				expect(instance.test).toEqual("new value");
			});
			
			it("Allows to change the value in a filter", function() {
			  var spy = function() {};
				spy.listener = function(value) {
					expect(value).toEqual("new value");
					value = "filtered value";
					return value;
				};
				
				spyOn(spy, 'listener').andCallThrough();
				
				instance.filter("change:test", spy.listener);
				instance.set("test", "new value");
				
				expect(spy.listener).toHaveBeenCalled();
				expect(instance.test).toEqual("filtered value");
			});
		
		});
		
		describe("_beforeChange", function() {
		  
			it("Calls validate listeners on property changes", function(){
				var klass = function() {};
				klass.listener1 = function(value) {
					expect(value).toEqual("new value");
					return true;
				};
				klass.listener2 = function(value) {
					expect(value).toEqual("new value");
					return true;
				};
				spyOn(klass, 'listener1').andCallThrough();
				spyOn(klass, 'listener2').andCallThrough();
				
				instance.validate("change:test", klass.listener1);
				instance.validate("change:test", klass.listener2);
			
				instance.set("test", "new value");
				
				expect(klass.listener1).toHaveBeenCalled();
				expect(klass.listener2).toHaveBeenCalled();
				expect(instance.test).toEqual("new value");
			});
		
			it("Makes it possible to validate a property change", function() {
			  var spy = function() {};
				spy.validator = function(value) {
					expect(value).toEqual("new value");
					return false; // return: 'not valid'
				};
				
				spyOn(spy, 'validator').andCallThrough();
				
				instance.validate("change:test", spy.validator);
				instance.set("test", "new value");
				
				expect(spy.validator).toHaveBeenCalled();
				expect(instance.test).toEqual("test");
			});
		
		});
		
		describe("_afterChange", function() {
		  
			it("Calls 'after' listeners on property changes", function(){
				var klass = function() {};
				klass.listener1 = function(value) {
					expect(value).toEqual("new value");
				};
				klass.listener2 = function(value) {
					expect(value).toEqual("new value");
				};
				spyOn(klass, 'listener1').andCallThrough();
				spyOn(klass, 'listener2').andCallThrough();
				
				instance.after("change:test", klass.listener1);
				instance.after("change:test", klass.listener2);
			
				instance.set("test", "new value");
				
				expect(klass.listener1).toHaveBeenCalled();
				expect(klass.listener2).toHaveBeenCalled();
				expect(instance.test).toEqual("new value");
			});
		
		});
		
	});
});