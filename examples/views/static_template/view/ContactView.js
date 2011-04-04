
define([
 'compact/Module',
 'compact/view/TemplateView',
 'model/Contact',
 'compact/view/Template!view/ContactView',
 'compact/view/Template!view/ContactEdit' 
],

function(Module, TemplateView, Contact, contactViewTemplate, contactEditTemplate) {
  
  return Module("ContactView") .extend(TemplateView)
  
  .initialize(function(model){
    
    this.superMethod({
      model: model || new Contact(),
      template: contactViewTemplate,
      events: {
        "click .editButton"          : "editButtonClicked",
        "click .saveButton"          : "saveButtonClicked"
      }
    });
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
