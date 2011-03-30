define([
  'compact/Module',
  'compact/view/ListView',
  'compact/view/TemplateView',
  'compact/lib/jquery',
  'compact/model/Model',
  'compact/model/Collection'
], 

function(Module, ListView, TemplateView, $, Model, Collection) {

  describe("compact/view/ListView", function() {
    
    var TestView = Module("TestView") .extend(TemplateView)
    .initialize(function() {
      this.superMethod({
        template: "<p>${name}</p>"
      });
    })
    .end();
    
    beforeEach(function() {
      this.listView = new ListView({
        collection: new Collection([
            new Model({ data: { name: "model1" } }),
            new Model({ data: { name: "model2" } }),
            new Model({ data: { name: "model3" } })
          ]),
        viewItemType: TestView
      });
    });

    describe("setCollection", function() {
      
      it("Swaps the old collection with the given one", function() {
        var collection = new Collection();
        this.listView.setCollection(collection);
        expect(this.listView.collection).toBe(collection);
      });

    });
    
    describe("setItemType", function() {
      
      it("sets the itemModule property to the assigned value", function() {
        var ItemModule = Module("ItemModule").end();
        this.listView.setViewItemType(ItemModule);
        expect(this.listView.viewItemType).toBe(ItemModule);
      });
      
      it("Rerenders the whole list with the given item module", function() {
        
        var parent = $("<div>");
        this.listView.appendTo(parent);
        
        var OtherView = Module("OtherView") .extend(TemplateView)
        .initialize(function() {
          this.superMethod({
            template: "<div class='other'>${name}</div>"
          });
        })
        .end();
        
        this.listView.setViewItemType(OtherView);
        this.listView.render();
        expect($(parent).find(".other").length).toBe(3);
      });
      
    });
    
    describe("render", function() {
      
      it("renders all collection items with the current item class as children of the list element", function() {
        var parent = $("<div>");
        this.listView.appendTo(parent);
        expect($(parent).find("div p").length).toBe(3);
      });
      
    });

  });
});
