define([
  'compact/Class',
  'compact/model/Model',
  'compact/collection/each',
  'compact/function/bind',
  'compact/lib/jquery',
  'compact/lib/jquery-tmpl'
], 

function(Class, Model, each, bind, $) {

  return Class("View")
  
  .properties({
    element: $("<div>"),
    parentElement: null,
    template: "empty",
    model: null,
    events: null
  })
  
  .initialize(function() {
    this.setTemplate(this.template);
    this.setModel(new Model());
    this.delegateEvents(this.events);
  })
  
  .methods({
    
    render: function() {
      this.element.empty();
      this.element.append( $.tmpl(this.template, this.model.attributes) );
    },
    
    setTemplate: function(templateMarkup) {
      this.template = $.template("", templateMarkup);
    },
    
    setModel: function(newModel) {
      if(this.model) this.model.removeEventListener(this.model.afterChange(), this.render);
      this.model = newModel;
      this.model.addEventListener(this.model.afterChange(), this.render, this);
      this.render();
    },
    
    appendTo: function(parent) {
      this.parentElement = parent.append(this.element);
    },
    
    remove: function() {
      this.element.remove();
    },
    
    delegateEvents: function(events) {
      console.log(events);
      if (!(events || (events = this.events))) return;
      
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
