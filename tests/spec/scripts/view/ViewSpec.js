define([
  'compact/view/View',
  'compact/lib/jquery',
  'compact/model/Model',
  'compact/Class'
], 

function(View, $, Model, Class) {

  describe("compact/view/View", function() {

    beforeEach(function() {
      this.view = new View();
    });
    
    describe("element", function() {
      
      it("Has an empty div, not appended to the document as default wrapper element", function() {
        expect( this.view.element.is("div") ).toBe(true);
        expect( $(document.body).find( this.view.element ).size() ).toBe(0);
      });
      
    });
    
    describe("setTemplate", function() {
      
      it("compiles the given template string as jquery tmpl", function() {
        expect( $.tmpl(this.view.template).is("p") ).toBe(false);
        this.view.setTemplate("<p></p>");
        expect( $.tmpl(this.view.template).is("p") ).toBe(true);
      });
      
    });
    
    describe("model", function() {
      
      it("registers global change listener on the model to update the template", function() {
        this.view.setTemplate("<p>${name}</p>");
        this.view.render();
        expect( this.view.element.html() ).toEqual("<p></p>");
        
        this.view.model.set("name", "Compact");
        expect( this.view.element.html() ).toEqual("<p>Compact</p>");
      });
      
    });
    
    describe("setModel", function() {
      
      beforeEach(function() {
        this.view.setTemplate("<p>${name}</p>")
        this.oldModel = this.view.model;
        this.newModel = new Model({ attributes: { name: "new" } });
        this.view.setModel(this.newModel);
      });
      
      it("changes the model and registeres a global change event", function() {
        expect( this.view.element.html() ).toEqual("<p>new</p>");
        this.newModel.set("name", "changed");
        expect( this.view.element.html() ).toEqual("<p>changed</p>");
      });
      
      it("unregisters model change events from previous model", function() {
        this.oldModel.set("name", "changed");
        expect( this.view.element.html() ).toEqual("<p>new</p>");
      });
      
    });
    
    describe("render", function() {
      
      it("renders the template with the current model", function() {
        this.view.setTemplate("<p>${name}</p>");
        this.view.model = new Model({
          attributes: { name: "Compact" }
        });
        expect( this.view.element.children().size() ).toBe(0);
        this.view.render();
        expect( this.view.element.html() ).toEqual("<p>Compact</p>");
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
          events: {
            "click .test" : "test",
            "click .second" : "test"
          },
          template: "<p class='test'></p><div class='second'></div>"
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
