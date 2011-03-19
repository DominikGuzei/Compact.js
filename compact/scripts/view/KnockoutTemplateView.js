define([
  'compact/Class',
  'compact/view/TemplateView',
  'compact/collection/each',
  'compact/lib/jquery',
  'compact/lib/jquery-tmpl',
  'compact/lib/knockout'
], 

function(Class, TemplateView, each, $) {

  return Class("KnockoutTemplateView") .extend(TemplateView)
  
  .properties({
    viewModel: {},
    _knockoutSubscriptions: [],
    _modelListeners: []
  })
  
  .methods({
    
    setModel: function(newModel) {
      if(!newModel || this.model == newModel) { return; }
      
      this._removeModelBindings();
      
      this.model = newModel;
      this.render();
      
      this._setupModelBindings();
    },
    
    _setupModelBindings: function() {
      each(this.model.attributes, function(value, key) {
        this._addModelBinding(key, value);
      }, this);
      
      ko.applyBindings(this.viewModel, this.element[0]);
    },
    
    _addModelBinding: function(key, value) {
      var model = this.model;
      var viewModel = this.viewModel;
      
      // create a corresponding knockout observable for every model attribute
      viewModel[key] = ko.observable(value);
      
      // add change handler for knockout observable that updates the model attribute
      this._knockoutSubscriptions.push(
        viewModel[key].subscribe(function(value) {
          model.set(key, value);
        })
      );
      
      // add model change handler that calls the knockout observable to update the view
      this._modelListeners.push(model.addEventListener(model.afterChange(key), viewModel[key]) );
    },
    
    _removeModelBindings: function() {
      each(this._knockoutSubscriptions, function(subscription, index, collection) {
        subscription.dispose();
      });
      this._knockoutSubscriptions = [];
      
      each(this._modelListeners, function(listener, index, collection) {
        this.model.removeEventListener(listener);
      }, this);
      this._modelListeners = [];
    }
    
  })
  
  .end();

});
