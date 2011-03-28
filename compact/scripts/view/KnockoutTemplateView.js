define([
  'compact/Module',
  'compact/view/View',
  'compact/model/Model',
  'compact/collection/each',
  'compact/lib/jquery',
  'compact/lib/knockout'
], 

function(Module, View, Model, each, $) {

  return Module("KnockoutTemplateView") .extend(View)
  
  .initialize(function(config) {
    
    config = config || {};
    this.superMethod(config);
    
    this.viewModel = config.viewModel || {};
    this.model = config.model || new Model();
    this.template = config.template || "empty";
    
    this._knockoutSubscriptions = [];
    this._modelListeners = [];
    
    this._setupModelBindings();
    this.setTemplate(this.template, false);
  })
  
  .methods({
    
    render: function() {
      this.element.empty();
      this.element.append( $.tmpl(this.template, this.model.data) );
      ko.applyBindings(this.viewModel, this.element[0]);
    },
    
    setTemplate: function(markup, rerender, name) {
      this.template = $.template(name || "", markup);
      if(rerender || rerender === undefined) { this.render(); }
    },
    
    setModel: function(newModel, dontRerender) {
      if(!newModel) { return; }
      
      this._removeModelBindings();
      
      this.model = newModel;
      this._setupModelBindings();
      
      if(!dontRerender) { this.render(); }
    },
    
    _setupModelBindings: function() {
      each(this.model.data, function(value, key) {
        this._addModelBinding(key, value);
      }, this);
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
      if(this._knockoutSubscriptions == [] && this._modelListeners == []) { return; }
      
      each(this._knockoutSubscriptions, function(subscription, index, collection) {
        subscription.dispose();
      });
      this._knockoutSubscriptions = [];
      
      each(this._modelListeners, function(listener, index, collection) {
        this.model.removeEventListener(listener);
      }, this);
      this._modelListeners = [];
    }
    
  })
  
  .end();

});
