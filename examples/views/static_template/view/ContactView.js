
define([
 'compact/Module',
 'compact/view/TemplateView',
 'model/ContactModel',
 'text!view/templates/ContactView.tmpl',
 'text!view/templates/ContactEdit.tmpl' 
],

function(Module, TemplateView, ContactModel, contactViewTemplate, contactEditTemplate) {
  
  return Module("ContactView") .extend(TemplateView)
  
  .properties({
    model: new ContactModel(),
    template: contactViewTemplate,
    events: {
      "click .editButton"          : "editButtonClicked",
      "click .saveButton"          : "saveButtonClicked"
    }
  })
  
  .methods({
    
    editButtonClicked: function() {
      this.setTemplate(contactEditTemplate);
    },
    
    saveButtonClicked: function() {
      this.setTemplate(contactViewTemplate, false);
      
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
