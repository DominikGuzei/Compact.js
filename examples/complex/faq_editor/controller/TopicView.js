
define([
  'compact/Module',
  'compact/view/TemplateView',
  'model/Topic',
  'text!view/Topic.tmpl',
  'compact/lib/jquery',
  'compact/event/Observable'
],

function(Module, TemplateView, Topic, TopicTemplate, $, Observable) {
  
  return Module("TopicView") .extend(TemplateView) .mixin( Observable )
  
  .initialize(function(model) {
    
    this.superMethod({
      element: $('<li class="topic">'),
      model: model || new Topic(),
      template: TopicTemplate,
      events: {
        'click .title' : 'onClick'
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
        this.element.find("h3.title").toggleClass("active");
        this.active = flag;
      } 
    }
    
  })
  
  .end();
  
});