
define([
  'compact/Module',
  'compact/view/TemplateView',
  'compact/lib/jquery',
  'compact/event/Observable',
  'compact/view/Template!view/Post',
  'model/Post',
],

function(Module, TemplateView, $, Observable, PostTemplate, Post) {
  
  return Module("PostView") .extend(TemplateView) .mixin( Observable )
  
  .initialize(function(model) {
    
    this.superMethod({
      element: $('<li class="closed">'),
      model: model || new Post(),
      template: PostTemplate,
      events: {
        'click h3' : 'onClick'
      }
    });
    
    this.active = false;
  })
  
  .methods({
    
    onClick: function(event) {
      this.dispatchEvent("click", this);
    },
    
    setActive: function(flag) {
      if(this.active !== flag) {
        this.element.toggleClass("open closed");
        this.active = flag;
      } 
    }
    
  })
  
  .end();
  
});