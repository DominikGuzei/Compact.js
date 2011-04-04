define([
  'compact/Module',
  'compact/view/View',
  'compact/model/Model',
  'compact/lib/jquery',
  'compact/lib/jquery-tmpl'
], 

function(Module, View, Model, $) {

  return Module("TemplateView") .extend(View)
  
  .initialize(function(config) {
    config = config || {};
    this.superMethod(config);
    
    this.model = config.model || new Model();
    this.template = config.template || "empty";
    
    this._setupModelListeners();
    this.render();
  })
  
  .methods({
    
    render: function() {
      this.element.empty();
      this.element.append( $.tmpl(this.template, this.model.data) );
      return this;
    },
    
    setTemplate: function(template, rerender) {
      this.template = template;
      if(rerender || rerender === undefined) { this.render(); }
    },
    
    setModel: function(newModel) {
      if(this.model === newModel) { return; }
      this._removeModelListeners();
      this.model = newModel;
      this._setupModelListeners();
      this.render();
    },
    
    _setupModelListeners: function() {
      this.model && this.model.addEventListener(this.model.afterChange(), this.render, this);
    },
    
    _removeModelListeners: function() {
      this.model && this.model.removeEventListener(this.model.afterChange(), this.render);
    }
    
  })
  
  .end();

});
