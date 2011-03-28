
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
    
    this.collection = config.collection || new Collection();
    this.viewItemType = config.viewItemType || View;
    
    this.rendered = false;
    
    this._createItemsFromCollection();
  })
  
  .methods({
    
    setCollection: function(newCollection) {
      this.collection = newCollection;
      this._createItemsFromCollection();
      this.rendered && this.render();
    },
    
    _createItemsFromCollection: function() {
      this.viewItems = [];
      this.collection.each(function(model) {
        this.viewItems.push( new this.viewItemType(model) );
      },this);
    },
    
    render: function() {
      this.element.empty();
      this.each(function(viewItem) {
        viewItem.appendTo(this.element);
      }, this);
      this.rendered = true;
    },
    
    setViewItemType: function(viewItemType) {
      if(viewItemType === this.viewItemType) { return; }
      this.viewItemType = viewItemType;
      
      this._createItemsFromCollection();
      this.rendered && this.render();
    },
    
    _enumerableCollection: function() {
      return this.viewItems;
    }
    
  })
  
  .end();
  
});
