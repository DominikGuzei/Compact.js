
define([
  'compact/Module',
  'compact/view/TemplateView',
  'model/Post',
  'text!view/Post.tmpl',
  'compact/lib/jquery',
  'compact/event/Observable'
],

function(Module, TemplateView, Post, PostTemplate, $, Observable) {
  
  return Module("PostViewController") .extend(TemplateView) .mixin( Observable )
  
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