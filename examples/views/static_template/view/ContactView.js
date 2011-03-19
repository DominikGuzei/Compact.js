
define([
 'compact/Class',
 'compact/view/TemplateView',
 'model/ContactModel',
 'text!view/templates/ContactView.tmpl',
 'text!view/templates/ContactEdit.tmpl' 
],

function(Class, TemplateView, ContactModel, contactViewTemplate, contactEditTemplate) {
  
  return Class("ContactView") .extend(TemplateView)
  
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
      this.render();
    },
    
    saveButtonClicked: function() {
      this.setTemplate(contactViewTemplate);
      
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
