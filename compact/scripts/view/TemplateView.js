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
    
    this._setupModelListeners(this.model);
    this.setTemplate(this.template, false);
  })
  
  .methods({
    
    render: function() {
      this.element.empty();
      this.element.append( $.tmpl(this.template, this.model.data) );
    },
    
    setTemplate: function(markup, rerender, name) {
      this.template = $.template(name || "", markup);
      if(rerender || rerender === undefined) { this.render(); }
    },
    
    setModel: function(newModel) {
      this._removeModelListeners(this.model);
      this.model = newModel;
      this._setupModelListeners(this.model);
      this.render();
    },
    
    _setupModelListeners: function(model) {
      this.model.addEventListener(this.model.afterChange(), this.render, this);
    },
    
    _removeModelListeners: function(model) {
      this.model.removeEventListener(this.model.afterChange(), this.render);
    }
    
  })
  
  .end();

});
