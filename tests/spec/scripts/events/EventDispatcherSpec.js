
define(['Class', 'events/EventDispatcher'], function(Class, EventDispatcher) {
	
	describe("EventDispatcher", function() {
	  
		describe("filter", function() {
			var filter = this;
		  Class("Filtered").mixin(EventDispatcher)
			.methods({
				greet: function(name) {
					var e = { value: name };
					e = this.filterEvent("greet", e);
					return e;
				}
			})
			.end(filter);
			
			it("should call all registered filters on filterEvent", function() {
				var instance = new filter.Filtered();
				var first = jasmine.createSpy();
				var second = jasmine.createSpy();
				instance.filter("greet", first);
				instance.filter("greet", second);
				instance.greet("Dominik");
				expect(first).toHaveBeenCalled();
				expect(second).toHaveBeenCalled();
			});
			
			it("should be able to change the event value", function() {
				var instance = new filter.Filtered();
				instance.filter("greet", function(e) {
					e.value = "changed";
					return e;
				});
				expect(instance.greet("Dominik").value).toEqual("changed");
			});
		});
		
		describe("validate", function() {
		  var validate = this;
			Class("Validated").mixin(EventDispatcher)
			.methods({
				change: function(name) {
					var e = { value: name };
					if(this.validateEvent("change", e)) {
						return true;
					};
					return false;
				}
			})
			.end(validate);
			
			it("should call all registered validations on validateEvent", function() {
				var instance = new validate.Validated();
				var first = jasmine.createSpy();
				var second = jasmine.createSpy();
				instance.validate("change", first);
				instance.validate("change", second);
				instance.change("Dominik");
				expect(first).toHaveBeenCalled();
				expect(second).toHaveBeenCalled();
			});
			
			it("should be able to validate the execution of the event", function() {
				var instance = new validate.Validated();
				instance.validate("change", function(e) {
					return false;
				});
				var instance2 = new validate.Validated();
				instance2.validate("change", function(e) {
					return true;
				});
				expect(instance.change("Dominik")).not.toBeTruthy();
				expect(instance2.change("Dominik")).toBeTruthy();
			});
		});
		
		describe("on", function() {
		  var on = this;
			Class("Test").mixin(EventDispatcher)
			.methods({
				change: function(name) {
					var e = { value: name };
					this.onEvent("change", e);
					return (e.value = "changed");
				}
			})
			.end(on);
			
			it("should call all registered on events", function() {
				var instance = new on.Test();
				var first = jasmine.createSpy();
				var second = jasmine.createSpy();
				instance.on("change", first);
				instance.on("change", second);
				instance.on("change", function(e) {
					expect(e.value).toEqual("Dominik");
				});
				expect(instance.change("Dominik")).toEqual("changed");
				
				expect(first).toHaveBeenCalled();
				expect(second).toHaveBeenCalled();
			});
		});
		
		describe("after", function() {
		  var after = this;
			Class("Test").mixin(EventDispatcher)
			.methods({
				change: function(name) {
					var e = { value: name };
					e.value = "changed";
					this.afterEvent("change", e);
					return e;
				}
			})
			.end(after);
			
			it("should call all registered on events", function() {
				var instance = new after.Test();
				var first = jasmine.createSpy();
				var second = jasmine.createSpy();
				instance.after("change", first);
				instance.after("change", second);
				instance.after("change", function(e) {
					expect(e.value).toEqual("changed");
				});
				expect(instance.change("Dominik").value).toEqual("changed");
				
				expect(first).toHaveBeenCalled();
				expect(second).toHaveBeenCalled();
			});
		});
		
	});
});