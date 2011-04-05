
define([
  'compact/Module',
  'compact/controller/Component',
  'compact/lib/jquery',
  'compact/event/Observable',
  'compact/view/Template!view/postView',
  'compact/view/Template!view/postEdit',
  'model/Post',
  'compact/view/bindings/text',
  'compact/view/bindings/value' 
],

function(Module, Component, $, Observable, postViewTemplate, postEditTemplate, Post) {
  
  return Module("PostView") .extend(Component) .mixin( Observable )
  
  .initialize(function(model) {
    
    this.superMethod({
      model: model || new Post(),
      states: {
        
        view: {
          template: postViewTemplate,
          events: {
            "click h3"    : "onClick",
            "click .delete"   : "onDeleteClick",
            "click .edit"     : "onEditClick",
          },
          isDefault: true
        },
        
        edit: {
          template: postEditTemplate,
          events: {
            "click .save"           : "onSaveClick",
            "keydown .title, .text" : "onInputKeyDown",
            "focus .title, .text"   : "onInputFocus"
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
      if(!this.active && this.inEditMode) {
        this.setState(this.states.view);
      }
    },
    
    onStateChanged: function(oldState, newState) {
      if(newState === this.states.edit) {
        this.inEditMode = true;
        this.element.find(".title").focus();
      } else {
        this.inEditMode = false;
      }
      this.setActive(this.active);
    },
    
    enterEditMode: function() {
      this.setState(this.states.edit);
      this.dispatchEvent("open", this);
    },
    
    onClick: function() {
      this.dispatchEvent("open", this);
    },
    
    onEditClick: function() {
      this.enterEditMode();
    },
    
    onDeleteClick: function() {
      this.model.destroy();
    },
    
    onSaveClick: function() {
      this.setState(this.states.view);
    },
    
    onInputKeyDown: function(event) {
      if(event.keyCode === 13) {
        event.preventDefault();
        $(event.target).change();
        this.setState(this.states.view);
      }
    },
    
    onInputFocus: function(event) {
      event.target.select();
    }
    
  })
  
  .end();
  
});