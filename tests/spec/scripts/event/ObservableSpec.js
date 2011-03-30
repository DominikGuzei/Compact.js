define([
  'compact/Module', 
  'compact/event/Observable'
], 

function(Module, Observable) {

  describe("compact/event/Observable", function() {

    // used to test if the listeners are called with the right event
    var dispatchedEvent = { value: "default" };

    var ObservableModule = Module("Test") .mixin(Observable)
    .methods({
      change: function(name) {
        dispatchedEvent.value = name;
        this.dispatchEvent("change", dispatchedEvent);
        return dispatchedEvent;
      }

    })
    .end()

    // we need an instance of the test class for each spec and add a listener to it
    beforeEach( function() {
      this.instance = new ObservableModule();
      this.listener = jasmine.createSpy();
      this.listenerInfo = this.instance.addEventListener("change", this.listener);
    });

    describe("eventListeners", function() {

      it("has an eventListeners collection for event callbacks", function() {
        expect(this.instance.eventListeners).toBeTypeOf('function');
      });

    });

    describe("addEventListener", function() {

      it("adds the given function as callback for the event", function() {
        expect(this.instance.eventListeners()["change"][0].callback).toBe(this.listener);
      });

      it("returns a listener information object", function() {
        expect(this.listenerInfo).toEqual({
          collection: "eventListeners",
          eventName: "change",
          index: 0
        });
      });
      
      it("adds a context object which the listener should be applied to", function() {
        var instance = this.instance;
        
        var Test = function() {
          this.spy = jasmine.createSpy();
          this.test = function(value) {
            this.spy(value);
          };
          instance.addEventListener("test", this.test, this);
        }
        
        var test = new Test();
        instance.dispatchEvent("test", "value");
        
        expect(test.spy).toHaveBeenCalledWith("value");
      });

    });

    describe("removeEventListener", function() {

      it("removes the registered callback from the observable event", function() {
        this.instance.removeEventListener(this.listenerInfo);
        expect(this.instance.eventListeners()["change"].length).toEqual( 0 );
      });
      
      it("can also be removed without the event name and function", function() {
        this.instance.removeEventListener(this.listenerInfo.eventName, this.listener);
        expect(this.instance.eventListeners()["change"].length).toEqual( 0 );
      });

    });
    
    describe("removeEventListenersWithContext", function() {
      
      it("removes all event listeners that were registered with a specific context", function() {
        var instance = this.instance;
        
        var Test = function() {
          this.test = function() {}
          this.remove = function() {
            instance.removeEventListenersWithContext(this);
          }
          instance.addEventListener("test", this.test, this);
        }
        
        var test = new Test();
        test.remove();
        expect(this.instance.eventListeners()["test"].length).toBe(0);
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