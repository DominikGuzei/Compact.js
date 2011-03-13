define([
  'compact/Class',
  'compact/model/Model',
  'compact/lib/jquery',
  'compact/lib/jquery-tmpl'
], 

function(Class, Model, $) {

  return Class("View")
  
  .properties({
    element: $("<div>"),
    parentElement: null,
    template: "empty",
    model: null,
  })
  
  .initialize(function() {
    this.setTemplate(this.template);
    this.setModel(new Model());
  })
  
  .methods({
    
    render: function() {
      this.element.empty();
      this.element.append( $.tmpl(this.template, this.model.attributes) );
    },
    
    setTemplate: function(templateMarkup) {
      this.template = $.template("", templateMarkup);
    },
    
    setModel: function(newModel) {
      if(this.model) this.model.removeEventListener(this.model.afterChange(), this.render);
      this.model = newModel;
      this.model.addEventListener(this.model.afterChange(), this.render, this);
      this.render();
    },
    
    appendTo: function(parent) {
      this.parentElement = parent.append(this.element);
    },
    
    remove: function() {
      this.element.remove();
    }
  })
  
  .end();

});
