define([
  'compact/Class',
  'compact/view/TemplateView',
  'compact/model/Model',
  'compact/lib/jquery',
  'compact/lib/jquery-tmpl'
], 

function(Class, TemplateView, Model, $) {

  describe("compact/view/TemplateView", function() {

    beforeEach(function() {
      this.view = new TemplateView({
        model: new Model()
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
        this.newModel = new Model({ data: { name: "new" } });
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
          data: { name: "Compact" }
        });
        this.view.render();
        expect( this.view.element.html() ).toEqual("<p>Compact</p>");
      });
      
    });

  });

});
