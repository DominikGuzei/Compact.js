
define([
  'compact/Module', 
  'compact/event/Observable', 
  'compact/event/Validatable'
], 

function(Module, Observable, Validatable) {
	
	describe("compact/event/Validatable", function() {
		
		// used to test if the validators are called with the right event
		var validatedEvent = { value: "default" };
		
		// namespace to append the test class to
		var validatableNamespace = this;
		
		Module("Test") .mixin(Observable, Validatable)
		.initialize(function(){
		  this.name = "default"
		})
		.methods({
			setName: function(name) {
				validatedEvent.value = name;
				var results = this.validateEvent("change:name", validatedEvent);
				
				if(results.isValid) {
				  this.name = name;
				} else {
				  throw results.errors;
				}
			}
		})
		.end(validatableNamespace)
		
		// we need an instance of the test class for each spec and add a listener to it
		beforeEach(function() {
		  this.instance = new validatableNamespace.Test();
		  this.validator = jasmine.createSpy();
		  this.validatorInfo = this.instance.addEventValidator("change:name", this.validator);
		});
		
		describe("addEventValidator", function() {
		  
		  it("adds the given function as validator for the event", function() {
		    expect(this.instance.eventValidators()["change:name"][0].callback).toBe(this.validator);
		  });
		  
		  it("returns a filter information object", function() {
		    expect(this.validatorInfo).toEqual({
		      collection: "eventValidators",
		      eventName: "change:name",
		      index: 0
		    });
		  });
		  
		});
		
		describe("removeEventFilter", function() {
		  
		  it("removes the registered callback from the eventFilters collection", function() {
		    this.instance.removeEventValidator(this.validatorInfo);
		    expect(this.instance.eventValidators()["change:name"].length).toEqual( 0 );
		  });
		  
		});
		
		describe("validateEvent", function() {
			
			it("should call all registered validators on filterEvent", function() {
				var validator2 = jasmine.createSpy();
				this.instance.addEventValidator("change:name", validator2 );
				
				this.instance.setName("Dominik");
				
				expect ( this.validator ).toHaveBeenCalledWith ( validatedEvent, [] );
				expect ( validator2 ).toHaveBeenCalledWith ( validatedEvent, [] );
			});
			
			it("should be able to invalidate the event data", function() {
				
				var errorsToThrow;
				this.instance.addEventValidator ("change:name", function(eventData, errors) {
			  	if(eventData.value == "Dominik") {
  				  errors.push("Wrong Name");
  				  errorsToThrow = errors;
  				}
			  });
			  var subject = this.instance;
			  expect( function() { subject.setName("Dominik") } ).toThrow( errorsToThrow );
			});
		});
		
	});
});