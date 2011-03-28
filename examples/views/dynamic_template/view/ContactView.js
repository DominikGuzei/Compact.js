
define([
 'compact/Module',
 'compact/view/KnockoutTemplateView',
 'model/ContactModel',
 'text!view/templates/ContactView.tmpl',
 'text!view/templates/ContactEdit.tmpl' 
],

function(Module, KnockoutTemplateView, ContactModel, contactViewTemplate, contactEditTemplate) {
  
  return Module("ContactView") .extend(KnockoutTemplateView)
  
  .initialize(function(model) {
    
    this.superMethod({
      model: model || new ContactModel(),
      template: contactViewTemplate,
      events: {
        "click .editButton"          : "editButtonClicked",
        "click .saveButton"          : "saveButtonClicked",
        "keyup .name, .description"  : "onKeyUp"
      }
    });
    
  })
  
  .methods({
    
    editButtonClicked: function() {
      this.setTemplate(contactEditTemplate);
    },
    
    saveButtonClicked: function() {
      this.setTemplate(contactViewTemplate);
    },
    
    onKeyUp: function() {
      var name = this.element.find(".name").val();
      var description = this.element.find(".description").val();
      
      this.model.set({
        name: name,
        description: description
      });
    }
    
  })
  
  .end();
  
});
