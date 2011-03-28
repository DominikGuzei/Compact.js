
define([
  'compact/Module',
  'compact/view/TemplateView',
  'model/Topic',
  'text!view/Topic.tmpl',
  'compact/lib/jquery',
  'compact/event/Observable'
],

function(Module, TemplateView, Topic, TopicTemplate, $, Observable) {
  
  return Module("TopicViewController") .extend(TemplateView) .mixin( Observable )
  
  .initialize(function(model) {
    
    this.superMethod({
      element: $('<li class="topic">'),
      model: model || new Topic(),
      template: TopicTemplate,
      events: {
        'click .title' : 'onClick'
      }
    });
    
  })
  
  .methods({
    
    onClick: function() {
      this.dispatchEvent("click", this);
    }
    
  })
  
  .end();
  
});