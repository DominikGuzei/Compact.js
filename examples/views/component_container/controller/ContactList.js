
define([
 'compact/Module',
 'compact/model/Collection',
 'compact/controller/ComponentContainer',
 'model/Contact',
 'controller/ContactView',
 'compact/view/Template!view/ContactList',
],

function(Module, Collection, ComponentContainer, Contact, ContactView, contactListTemplate) {
  
  return Module("ContactView") .extend(ComponentContainer)
  
  .initialize(function(collection) {
    
    this.superMethod({
      collection: collection || new Collection(),
      states: {
        view: {
          template: contactListTemplate,
          events: {
            "click .addButton" : "addButtonClicked"
          },
          isDefault: true
        }
      },
      containerElement: "ul.list",
      itemType: ContactView
    });
    
    this.itemModel = Contact;
    this.currentEditItem = null;
  })
  
  .methods({
    
    setup: function() {
      this.addEventListener("addItem", this.itemAdded, this);
      this.addEventListener("add", this.setupItemListeners, this);
      this.superMethod();
    },
    
    addButtonClicked: function() {
      this.collection.add(new this.itemModel());
    },
    
    itemAdded: function(item, index) {
      item.setState(item.states.edit);
    },
    
    setupItemListeners: function(item) {
      item.addEventListener("stateChanged", this.onItemStateChanged, this);
    },
    
    onItemStateChanged: function(oldState, newState, item) {
      if(newState === item.states.edit) {
        this.currentEditItem && this.currentEditItem.setState(this.currentEditItem.states.view, true);
        this.currentEditItem = item;
      } else {
        if(item === this.currentEditItem) {
          this.currentEditItem = null;
        }
      }
    }
    
  })
  
  .end();
  
});
