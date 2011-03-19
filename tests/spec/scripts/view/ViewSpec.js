define([
  'compact/Class',
  'compact/view/View',
  'compact/lib/jquery',
  'compact/model/Model'
], 

function(Class, View, $, Model) {

  describe("compact/view/View", function() {

    beforeEach(function() {
      this.view = new View();
    });
    
    describe("setModel", function() {
      
      it("changes the model", function() {
        var newModel = new Model();
        this.view.setModel(newModel);
        expect( this.view.model ).toBe(newModel);
      });
      
    });
    
    describe("appendTo", function() {
      
      it("appends the view element to the given element", function() {
        
        var wrapper = $("<div>");
        this.view.appendTo(wrapper);
        expect(wrapper.children().size()).toBe(1);
        
      });
      
    });
    
    describe("remove", function() {
      
      it("removes the view element from the parent element", function() {
        var wrapper = $("<div>");
        this.view.appendTo(wrapper);
        
        this.view.remove();
        expect(wrapper.children().size()).toBe(0);
      });
      
    });
    
    describe("events", function() {
      
      it("binds the event to the view element and calls given function", function() {

        var ViewEvents = Class("ViewEvents").extend(View)
        .properties({
          events: {
            "click" : "test"
          }
        })
        .methods({
          test: jasmine.createSpy()
        })
        .end();
        
        this.view = new ViewEvents();
        this.view.element.trigger("click");
        
        expect(this.view.test).toHaveBeenCalled();
      });
      
      it("delegates the event for specific selectors", function() {
        var ViewDelegates = Class("ViewDelegates").extend(View)
        .properties({
          element: $("<div><p class='test'></p><div class='second'></div></div>"),
          events: {
            "click .test" : "test",
            "click .second" : "test"
          }
        })
        .methods({
          test: jasmine.createSpy()
        })
        .end();
        
        this.view = new ViewDelegates();
        
        this.view.element.trigger("click");
        expect(this.view.test).not.toHaveBeenCalled();
        
        this.view.element.find(".test").trigger("click");
        expect(this.view.test).toHaveBeenCalled();
        
        this.view.element.find(".second").trigger("click");
        expect(this.view.test.callCount).toBe(2);
      });
      
    });

  });

});
