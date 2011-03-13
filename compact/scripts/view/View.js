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
    events: null,
    renderLock: false
  })
  
  .initialize(function() {
    this.init = true;
    this.setTemplate(this.template);
    if(this.model) this.setModel(this.model);
    this.delegateEvents(this.events);
    delete this["init"];
  })
  
  .methods({
    
    render: function() {
      if(!this.renderLock) {
        this.element.empty();
        this.element.append( $.tmpl(this.template, this.model.attributes) );
      }
    },
    
    setTemplate: function(templateMarkup) {
      this.template = $.template("", templateMarkup);
    },
    
    setModel: function(newModel) {
      if(!this.init && this.model) this.model.removeEventListener(this.model.afterChange(), this.render);
      this.model = newModel;
      this.model.addEventListener(this.model.afterChange(), this.render, this);
      this.render();
    },
    
    appendTo: function(parent) {
      this.element.appendTo(parent);
    },
    
    remove: function() {
      this.element.remove();
    },
    
    delegateEvents: function(events) {
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
