define([
  'compact/Class',
  'compact/view/View',
  'compact/model/Model',
  'compact/lib/jquery',
  'compact/lib/jquery-tmpl'
], 

function(Class, View, Model, $) {

  return Class("TemplateView") .extend(View)
  
  .properties({
    model: new Model(),
    template: "empty"
  })
  
  .initialize(function() {
    this.init = true;
    this.setTemplate(this.template);
    this._setupModelListeners(this.model);
    delete this.init;
  })
  
  .methods({
    
    render: function() {
      this.element.empty();
      this.element.append( $.tmpl(this.template, this.model.data) );
    },
    
    setTemplate: function(markup, name) {
      this.template = $.template(name || "", markup);
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
