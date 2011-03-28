
define([
  'compact/Module',
  'compact/view/TemplateView',
  'model/Topic',
  'text!view/Topic.tmpl'
],

function(Module, TemplateView, Topic, TopicTemplate) {
  
  return Module("TopicViewController") .extend(TemplateView)
  
  .initialize(function(params) {
    
    Module.defaults({
      
      model: new Topic(),
      template: TopicTemplate
      
    }, params, this);
    
  })
  
  .end();
  
});