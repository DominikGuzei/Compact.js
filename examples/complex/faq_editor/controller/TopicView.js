
define([
  'compact/Module',
  'compact/controller/Component',
  'compact/lib/jquery',
  'compact/event/Observable',
  'compact/view/Template!view/topicView',
  'compact/view/Template!view/topicEdit',
  'model/Topic',
  'compact/view/bindings/text',
  'compact/view/bindings/value' 
],

function(Module, Component, $, Observable, topicViewTemplate, topicEditTemplate, Topic) {
  
  return Module("TopicView") .extend(Component) .mixin( Observable )
  
  .initialize(function(model) {
    
    this.superMethod({
      model: model || new Topic(),
      states: {
        
        view: {
          template: topicViewTemplate,
          events: {
            "click"    : "onClick",
            "click .delete"   : "onDeleteClick",
            "click .edit"     : "onEditClick",
          },
          isDefault: true
        },
        
        edit: {
          template: topicEditTemplate,
          events: {
            "click .save"     : "onSaveClick",
            "keyup .title"    : "onKeyUpInTitle"
          }
        }
      }
    });
    
    this.inEditMode = false;
    this.active = false;
  })
  
  .methods({
    
    setup: function() {
      this.superMethod();
      this.addEventListener("stateChanged", this.onStateChanged, this);
    },
    
    setActive: function(flag) {
      flag ? this.element.addClass("active") : this.element.removeClass("active");
      this.active = flag;
    },
    
    enterEditMode: function() {
      this.setState(this.states.edit);
      this.dispatchEvent("select", this);
    },
    
    onStateChanged: function(oldState, newState) {
      if(newState === this.states.edit) {
        this.element.find(".title").focus().select();
      }
      this.setActive(this.active);
    },
    
    onClick: function() {
      this.dispatchEvent("select", this);
    },
    
    onEditClick: function() {
      this.enterEditMode();
    },
    
    onDeleteClick: function() {
      this.dispatchEvent("delete", this);
    },
    
    onSaveClick: function() {
      this.setState(this.states.view);
    },
    
    onKeyUpInTitle: function(event) {
      if(event.keyCode === 13) {
        event.preventDefault();
        this.setState(this.states.view);
      }
    }
    
  })
  
  .end();
  
});