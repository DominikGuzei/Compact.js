
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
      element: $('<li class="post">'),
      model: model || new Post(),
      template: PostTemplate
    });
    
  })
  
  .end();
  
});