
define([
  'compact/Module',
  'compact/view/TemplateView',
  'compact/lib/jquery',
  'compact/event/Observable',
  'compact/view/Template!view/Topic',
  'model/Topic',
],

function(Module, TemplateView, $, Observable, TopicTemplate, Topic) {
  
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