
define(['compact/Class', 
        'compact/events/observable', 
        'compact/events/filterable'], 

function(Class, observable, filterable) {
	
	describe("events/Filterable", function() {
	  
	  // used to test if the filters are called with the right event
		var filteredEvent = { value: "default" };
		
		// namespace to append the test class to
		var filterNamespace = this;
		
		Class("Test") .mixin(observable, filterable)
		.methods({
			change: function(name) {
				filteredEvent.value = name;
				this.filterEvent("change", filteredEvent);
				return filteredEvent;
			}
		})
		.end(filterNamespace)
		
		// we need an instance of the test class for each spec and add a listener to it
		beforeEach(function() {
		  this.instance = new filterNamespace.Test();
		  this.filter = jasmine.createSpy();
		  this.filterInfo = this.instance.addEventFilter("change", this.filter);
		});
		
		describe("eventFilters", function() {
		  
		  it("has an eventFilters collection for filter callbacks", function() {
		    expect(this.instance.eventFilters).toBeDefined();
		  });
		  
		});
		
		describe("addEventFilter", function() {
		  
		  it("adds the given function as filter for the event", function() {
		    expect(this.instance.eventFilters["change"][0]).toBe(this.filter);
		  });
		  
		  it("returns a filter information object", function() {
		    expect(this.filterInfo).toEqual({
		      collection: "eventFilters",
		      eventName: "change",
		      index: 0
		    });
		  });
		  
		});
		
		describe("removeEventFilter", function() {
		  
		  it("removes the registered callback from the eventFilters collection", function() {
		    this.instance.removeEventFilter(this.filterInfo);
		    expect(this.instance.eventFilters["change"].length).toEqual( 0 );
		  });
		  
		});
		
		describe("filterEvent", function() {
			
			it("should call all registered filters on filterEvent", function() {
				var filter2 = jasmine.createSpy();
				this.instance.addEventFilter("change", filter2 );
				
				this.instance.change("Dominik");
				
				expect ( this.filter ).toHaveBeenCalledWith ( filteredEvent );
				expect ( filter2 ).toHaveBeenCalledWith ( filteredEvent );
			});
			
			it("should be able to change/filter the event data", function() {
				this.instance.addEventFilter ("change", function(eventData) {
					eventData.value = "changed";
				});
				
				expect(this.instance.change("Dominik").value).toEqual("changed");
			});
		});
		
	});
});