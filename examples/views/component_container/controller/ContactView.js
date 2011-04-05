
define([
 'compact/Module',
 'compact/controller/Component',
 'model/Contact',
 'compact/view/Template!view/ContactView',
 'compact/view/Template!view/ContactEdit',
 'compact/view/bindings/text',
 'compact/view/bindings/value' 
],

function(Module, Component, Contact, contactViewTemplate, contactEditTemplate) {
  
  return Module("ContactView") .extend(Component)
  
  .initialize(function(model) {
    
    this.superMethod({
      model: model || new Contact(),
      states: {
        
        view: {
          template: contactViewTemplate,
          events: {
            "click .editButton"   : "editButtonClicked",
            "click .deleteButton" : "deleteButtonClicked"
          },
          isDefault: true
        },
        
        edit: {
          template: contactEditTemplate,
          events: {
            "click .saveButton" : "saveButtonClicked",
            "focus .name, .description" : "onInputFocus"
          }
        }
      }
    });
    
  })
  
  .methods({
    
    setup: function() {
      this.superMethod();
      this.addEventListener("stateChanged", this.onStateChanged, this);
    },
    
    editButtonClicked: function() {
      this.setState(this.states.edit);
    },
    
    saveButtonClicked: function() {
      this.setState(this.states.view);
    },
    
    deleteButtonClicked: function() {
      this.model.destroy();
    },
    
    onStateChanged: function(oldState, newState) {
      if(newState === this.states.edit) {
        this.element.find(".name").focus();
      }
    },
    
    onInputFocus: function(event) {
      event.target.select();
    }
    
  })
  
  .end();
  
});
