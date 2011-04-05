define([
  'compact/model/BindingsManager', 
  'compact/model/Model',
  'compact/lib/jquery'
], 

function(BindingsManager, Model, $) {

  describe("compact/model/BindingsManager", function() {

    beforeEach( function() {
      this.manager = BindingsManager.getInstance();
    });

    afterEach( function() {
      BindingsManager.instance = undefined;
    });

    describe("getInstance", function() {

      it("Returns the single instance of BindingsManager singleton", function() {
        expect(this.manager).toBe(BindingsManager.instance);
        expect(this.manager instanceof BindingsManager).toBeTruthy();
      });

    });
    
    describe("registerBinding", function() {
      
      it("adds a named binding configuration", function() {
        
        var bindingConfig = {};
        this.manager.registerBinding("test", bindingConfig);
        
        expect(this.manager.bindings.test).toBe(bindingConfig);
        
      });
      
    });
    
    describe("bind and unbind", function() {
      
      beforeEach(function() {
        this.model = new Model({
          name: "default"
        });
        
        this.textBinding = {
          setup: function(element, value, model, property) {
            $(element).html(value);
          },
          
          update: function(element, value, model, property) {
            $(element).html(value);
          }
        };
        
        this.element = $("<p>");
        
        this.manager.registerBinding("text", this.textBinding);
      });
      
      describe("bind", function() {
        
        it("updates the element view at bind time", function() {
        
          expect(this.element.html()).toEqual("");
          this.manager.bind("text", this.model, "name",  this.element);
          expect(this.element.html()).toEqual(this.model.get("name"));
          
        });
        
        it("updates the element on subsequent model property changes", function() {
          
          this.manager.bind("text", this.model, "name",  this.element);
          this.model.set("name", "changed");
          expect(this.element.html()).toEqual("changed");
          
        });
        
        it("allows to bind multiple elements to one model", function() {
          
          var secondElement = $("<div>");
          this.manager.bind("text", this.model, "name",  this.element);
          this.manager.bind("text", this.model, "name",  secondElement);
          
          this.model.set("name", "changed");
          expect(this.element.html()).toEqual("changed");
          expect(secondElement.html()).toEqual("changed");
          
        });
        
      });
      
    });

  });

});