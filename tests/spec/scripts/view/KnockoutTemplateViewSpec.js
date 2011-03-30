define([
  'compact/view/KnockoutTemplateView',
  'compact/lib/jquery',
  'compact/model/Model',
  'compact/Module'
], 

function(KnockoutTemplateView, $, Model, Module) {

  describe("compact/view/KnockoutTemplateView", function() {

    beforeEach(function() {
      this.view = new KnockoutTemplateView({
        template: '<p class="name" data-bind="text: name"></p><p class="age" data-bind="text: age"></p>'
      });
    });
    
    describe("setModel", function() {
      
      beforeEach(function() {
        this.testModel = new Model({
            name: "compact",
            age: "young"
          });
        this.view.setModel(this.testModel);
        
      });
      
      it("Changes the model to new model", function() {
        expect(this.view.model).toBe(this.testModel);
      });
      
      it("Creates a knockout viewModel that mirrors the model's data", function() {
        expect(this.view.viewModel.name()).toEqual(this.view.model.get("name"));
        expect(this.view.viewModel.age()).toEqual(this.view.model.get("age"));
      });
      
      it("Connects the model with the viewModel with listeners", function() {
        this.view.model.set("name", "changed");
        expect(this.view.viewModel.name()).toEqual("changed");
        
        this.view.viewModel.age("old");
        expect(this.view.model.get("age")).toEqual("old");
      });
      
      it("Applies knockout.js bindings between viewModel and template", function() {
        expect(this.view.element.find(".name").html()).toEqual("compact");
        
        this.view.appendTo($("body"));
        
        this.view.model.set("name", "changed");
        expect(this.view.element.find(".name").html()).toEqual("changed");
        
        this.view.remove();
      });
      
      it("Saves all created bindings for later removement", function() {
        expect(this.view._knockoutSubscriptions.length).toEqual(2);
        expect(this.view._modelListeners.length).toEqual(2);
      });
      
      it("Removes the bindings of previous model", function() {
        var oldModel = this.view.model;
        this.view.setModel(new Model());
        
        expect(this.view._knockoutSubscriptions.length).toEqual(0);
        expect(this.view._modelListeners.length).toEqual(0);
        
        expect(oldModel.eventListeners()["accessible:changed:name"].length).toEqual(0);
        expect(oldModel.eventListeners()["accessible:changed:age"].length).toEqual(0);
      });
      
    });

  });

});
