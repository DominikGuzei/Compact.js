
define([
  'compact/Module',
  'compact/view/View',
  'compact/model/Collection',
  'compact/collection/Enumerable'
],

function(Module, View, Collection, Enumerable) {
  
  return Module("ListView") .extend(View) .mixin(Enumerable)
  
  .initialize(function(config) {
    config = config || {};
    this.superMethod(config);
    
    this.viewItemType = config.viewItemType || View;
    this.setCollection(config.collection || new Collection());
  })
  
  .methods({
    
    setCollection: function(newCollection) {
      if(this.collection === newCollection) { return; }
      
      this._removeCollectionListeners();
      
      this.collection = newCollection;
      this._createItemsFromCollection();
      
      this._addCollectionListeners();
    },
    
    _addCollectionListeners: function() {
      if(this.collection) {
        this.collection.addEventListener("refresh", this._createItemsFromCollection, this);
        this.collection.addEventListener("add", this._addItem, this);
      }
    },
    
    _removeCollectionListeners: function() {
      if(this.collection) {
        this.collection.removeEventListener("refresh", this._createItemsFromCollection);
        this.collection.removeEventListener("add", this._addItem);
      }
    },
    
    _createItemsFromCollection: function() {
      this.viewItems = [];
      
      this.collection.each(function(model) {
        this.viewItems.push( new this.viewItemType(model) );
      },this);
      
      this.isRendered() && this.render();
    },
    
    _addItem: function(model, index, collection) {
      var viewItem = new this.viewItemType(model);
      
      if(index > 0) {
        var elementBefore = this.viewItems[index-1];
        this.viewItems.splice(index, 1, viewItem);
        elementBefore.element.after(viewItem.element);
      } 
      else if(index == 0 && this.viewItems.length) {
        var elementAfter = this.viewItems[1];
        this.viewItems.unshift(viewItem);
        elementAfter.element.before(viewItem.element);
      } 
      else {
        this.viewItems.push(viewItem);
        viewItem.appendTo(this.element);
      }
      return viewItem;
    },
    
    render: function() {
      this.element.empty();
      this.each(function(viewItem) {
        viewItem.element.appendTo(this.element);
      }, this);
      
      return this;
    },
    
    setViewItemType: function(viewItemType) {
      if(viewItemType === this.viewItemType) { return; }
      this.viewItemType = viewItemType;
      
      this._createItemsFromCollection();
    },
    
    _enumerableCollection: function() {
      return this.viewItems;
    }
    
  })
  
  .end();
  
});
