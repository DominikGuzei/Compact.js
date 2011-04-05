
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
  
  return Module("ContactController") .extend(Component)
  
  .initialize(function(model){
    
    this.superMethod({
      model: model || new Contact(),
      states: {
        
        view: {
          template: contactViewTemplate,
          events: {
            "click .editButton" : "editButtonClicked"
          }
        },
        
        edit: {
          template: contactEditTemplate,
          events: {
            "click .saveButton" : "saveButtonClicked"
          }
        }
      }
    });
    
  })
  
  .methods({
    
    setup: function() {
      this.superMethod();
      this.setState(this.states.view);
    },
    
    beforeStateChange: function(newState, finishCallback) {
      this.element.fadeOut("slow", finishCallback);
    },
    
    afterStateChange: function(oldState, newState) {
      if(newState === this.states.edit) {
        this.element.hide().fadeIn("slow");
      } else {
        this.element.fadeIn("slow");
      }
    },
    
    editButtonClicked: function() {
      this.changeState(this.states.edit);
    },
    
    saveButtonClicked: function() {
      var name = this.element.find(".name").val();
      var description = this.element.find(".description").val();
      
      this.model.set({
        name: name,
        description: description
      });
      
      this.changeState(this.states.view);
    }
    
  })
  
  .end();
  
});
