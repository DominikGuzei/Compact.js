define([
  'compact/Class',
  'compact/model/Model',
  'compact/collection/each',
  'compact/function/bind',
  'compact/lib/jquery'
], 

function(Class, Model, each, bind, $) {

  return Class("View")
  
  .properties({
    element: $("<div>"),
    parentElement: null,
    model: null,
    events: null
  })
  
  .initialize(function() {
    this.delegateEvents(this.events);
  })
  
  .methods({
    
    setModel: function(newModel) {
      this.model = newModel;
    },
    
    appendTo: function(parent) {
      this.element.appendTo(parent);
      this.parentElement = parent;
    },
    
    remove: function() {
      this.element.remove();
    },
    
    delegateEvents: function(events) {
      if (!(events || (events = this.events))) { return; }
      
      this.element.unbind();
      var eventSplitter = /^(\w+)\s*(.*)$/;
      
      each(events, function(methodName, key) {
        var match = key.match(eventSplitter);
        var eventName = match[1], selector = match[2];
        var method = bind(this[methodName], this);
        
        if (selector === '') {
          this.element.bind(eventName, method);
        } else {
          this.element.delegate(selector, eventName, method);
        }
      }, this);
    }
  })
  
  .end();

});
