

define([
  'compact/Module',
  'compact/controller/Component',
  'compact/model/Collection',
  'compact/collection/Collectable',
  'compact/lib/jquery'
],

function(Module, Component, Collection, Collectable) {
  
  return Module("ComponentContainer") .extend(Component) .mixin(Collectable)
  
  .initialize(function(config) {
    config = config || {};
    
    config.states = config.states || {
      defaultState: {
        template: "<ul>",
        isDefault: true
      }
    };
    
    this.itemType = config.itemType || Component;
    this.collection = config.collection || new Collection();
    this.containerElement = config.containerElement || null;
    this.superMethod(config);
    
  })
  
  .methods({
    
    setup: function() {
      this.setCollection(this.collection);
      this.superMethod();
      this.containerElement = this.containerElement && this.element.find(this.containerElement) || this.element;
      this._renderItems();
    },
    
    setCollection: function(newCollection) {
      if(this.collection === newCollection && this.hasRenderedItems) { return; }
      
      this._removeCollectionListeners();
      
      this.collection = newCollection;
      this._createItemsFromCollection();
      
      this._addCollectionListeners();
    },
    
    _addCollectionListeners: function() {
      if(this.collection) {
        this.collection.addEventListener("refresh", this._createItemsFromCollection, this);
        this.collection.addEventListener("add", this._addItem, this);
        this.collection.addEventListener("remove", function(model, index) {
          this._removeItemAt(index); 
        }, this);
        this.collection.addEventListener("clear", this._removeAllItems, this);
      }
    },
    
    _removeCollectionListeners: function() {
      if(this.collection) {
        this.collection.removeEventListenersWithContext(this);
      }
    },
    
    _createItemsFromCollection: function() {
      this.items = [];
      
      this.collection.each(function(model) {
        var item = new this.itemType(model);
        this.items.push(item);
        this.dispatchEvent("add", item, this.items.length -1);
      },this);
      
      this.isRendered && this._renderItems();
    },
    
    _addItem: function(model, index) {
      var viewItem = new this.itemType(model);
      
      if(index > 0) {
        var elementBefore = this.items[index-1];
        this.items.splice(index, 1, viewItem);
        elementBefore.element.after(viewItem.element);
      } 
      else if(index == 0 && this.items.length) {
        var elementAfter = this.items[1];
        this.items.unshift(viewItem);
        elementAfter.element.before(viewItem.element);
      } 
      else {
        this.items.push(viewItem);
        viewItem.appendTo(this.containerElement);
      }
      this.dispatchEvent("add", viewItem, index);
      this.dispatchEvent("addItem", viewItem, index);
      return viewItem;
    },
    
    _removeItemAt: function(index) {
      this.items[index].removeEventListenersWithContext(this);
      this.items[index].destroy();
      this.items.splice(index, 1);
    },
    
    _removeAllItems: function() {
      this.each(function(viewItem, index) {
        this._removeItemAt(index);
      }, this);
    },
    
    _renderItems: function() {
      this.containerElement.empty();
      this.each(function(viewItem) {
        viewItem.element.appendTo(this.containerElement);
      }, this);
      this.hasRenderedItems = true;
      return this;
    },
    
    setItemType: function(itemType) {
      if(itemType === this.itemType) { return; }
      this.itemType = itemType;
      
      this._createItemsFromCollection();
    },
    
    _collectableCollection: function() {
      return this.items;
    }
    
  })
  
  .end();
  
});

