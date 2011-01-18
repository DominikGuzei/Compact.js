
define(['Class', 'events/PropertyChangeDispatcher'], function(Class, PropertyChangeDispatcher) {
	
	describe("PropertyChangeDispatcher", function() {
	  
		var events = {};
		
		Class("properties.Changer") .mixin(PropertyChangeDispatcher)
		.properties({
			test: {
				value: "test",
				watchable: true
			}
		})
		.end(events);
		
		describe("_beforeFilter", function() {
		  
			var instance;
			beforeEach(function() {
			  instance = new events.properties.Changer();
			});
			
			it("Calls filters registered as propertyName + 'Change'", function() {
			  var klass = function() {};
				klass.listener1 = function(eventData) {
					expect(eventData.test).toEqual("new value");
					return eventData;
				};
				klass.listener2 = function(eventData) {
					expect(eventData.test).toEqual("new value");
					return eventData;
				};
				spyOn(klass, 'listener1').andCallThrough();
				spyOn(klass, 'listener2').andCallThrough();
				
				instance.filter("testChange", klass.listener1);
				instance.filter("testChange", klass.listener2);
			
				instance.setTest("new value");
				
				expect(klass.listener1).toHaveBeenCalled();
				expect(klass.listener2).toHaveBeenCalled();
				expect(instance.test).toEqual("new value");
			});
			
			it("Allows to change the value in a filter", function() {
			  var spy = function() {};
				spy.listener = function(eventData) {
					expect(eventData.test).toEqual("new value");
					eventData.test = "filtered value";
					return eventData;
				}
				
				spyOn(spy, 'listener').andCallThrough();
				
				instance.filter("testChange", spy.listener);
				instance.setTest("new value");
				
				expect(spy.listener).toHaveBeenCalled();
				expect(instance.test).toEqual("filtered value");
			});
		
		});
		
	});
});