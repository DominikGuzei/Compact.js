define([
  'compact/Class',
  'compact/collection/each',
  'compact/function/bind',
  'compact/lib/jquery'
], 

function(Class, each, bind, $) {

  return Class("View")
  
  .properties({
    element: $("<div>"),
    parentElement: null,
    events: null
  })
  
  .initialize(function() {
    this.delegateEvents(this.events);
  })
  
  .methods({
    
    appendTo: function(parent, render) {
      this.element.appendTo(parent);
      this.parentElement = parent;
      if(render || render === undefined) { this.render(); }
    },
    
    remove: function() {
      this.element.remove();
    },
    
    detach: function() {
      this.element.detach();
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
    },
    
    render: function() {}
  })
  
  .end();

});
