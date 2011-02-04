
define(['compact/Class', 'compact/events/Observable'], 

function(Class, Observable) {
	
	describe("events/Observable", function() {
		
		// used to test if the listeners are called with the right event
		var dispatchedEvent = { value: "default" };
		
		// namespace to append the test class to
		var observableNamespace = this;
		
		Class("Test") .mixin(Observable)
		.methods({
			change: function(name) {
				dispatchedEvent.value = name;
				this.dispatchEvent("change", dispatchedEvent);
				return dispatchedEvent;
			}
		})
		.end(observableNamespace)
		
		// we need an instance of the test class for each spec and add a listener to it
		beforeEach(function() {
		  this.instance = new observableNamespace.Test();
		  this.listener = jasmine.createSpy();
		  this.listenerInfo = this.instance.addEventListener("change", this.listener);
		});
		
		describe("eventListeners", function() {
		  
		  it("has an eventListeners collection for event callbacks", function() {
		    expect(this.instance.eventListeners).toBeDefined();
		  });
		  
		});
		
		describe("addEventListener", function() {
		  
		  it("adds the given function as callback for the event", function() {
		    expect(this.instance.eventListeners["change"][0]).toBe(this.listener);
		  });
		  
		  it("returns a listener information object", function() {
		    expect(this.listenerInfo).toEqual({
		      collection: "eventListeners",
		      eventName: "change",
		      index: 0
		    });
		  });
		  
		});
		
		describe("removeEventListener", function() {
		  
		  it("removes the registered callback from the observable event", function() {
		    this.instance.removeEventListener(this.listenerInfo);
		    expect(this.instance.eventListeners["change"].length).toEqual( 0 );
		  });
		  
		});
		
		describe("dispatchEvent", function() {

			it("should call all registered callbacks for the event", function() {
				var listener2 = jasmine.createSpy();
				this.instance.addEventListener("change", listener2);
        
				expect(this.instance.change("Dominik").value).toEqual("Dominik");
				
				expect(this.listener).toHaveBeenCalledWith(dispatchedEvent);
				expect(listener2).toHaveBeenCalledWith(dispatchedEvent);
			});
			
		});
		
	});
});