define([
  'compact/Class',
  'compact/view/View',
  'compact/lib/jquery',
  'compact/lib/jquery-tmpl'
], 

function(Class, View, $) {

  return Class("TemplateView") .extend(View)
  
  .properties({
    model: null,
    template: "empty"
  })
  
  .initialize(function() {
    this.init = true;
    this.setTemplate(this.template);
    if(this.model) { this.setModel(this.model); }
    delete this.init;
  })
  
  .methods({
    
    render: function() {
      this.element.empty();
      if(this.model) {
        this.element.append( $.tmpl(this.template, this.model.data) );
      }
    },
    
    setTemplate: function(markup, name) {
      this.template = $.template(name || "", markup);
    },
    
    setModel: function(newModel) {
      if(!this.init && this.model) {
        this.model.removeEventListener(this.model.afterChange(), this.render);
      }
      this.model = newModel;
      this.model.addEventListener(this.model.afterChange(), this.render, this);
      this.render();
    }
    
  })
  
  .end();

});
