
define([
 'compact/Class',
 'compact/view/View',
 'model/ContactModel',
 'text!view/templates/ContactView.tmpl',
 'text!view/templates/ContactEdit.tmpl' 
],

function(Class, View, ContactModel, contactViewTemplate, contactEditTemplate) {
  
  return Class("ContactView") .extend(View)
  
  .properties({
    model: new ContactModel(),
    template: contactViewTemplate,
    events: {
      "click .editButton"          : "editButtonClicked",
      "click .saveButton"          : "saveButtonClicked",
      "keyup .name, .description"  : "dataChanged"
    }
  })
  
  .methods({
    
    editButtonClicked: function() {
      this.setTemplate(contactEditTemplate);
      this.render();
    },
    
    dataChanged: function() {
      var name = this.element.find(".name").val();
      var description = this.element.find(".description").val();
      this.renderLock = true;
      this.model.set({
        name: name,
        description: description
      });
      this.renderLock = false;
    },
    
    saveButtonClicked: function() {
      this.setTemplate(contactViewTemplate);
      this.render();
    }
    
  })
  
  .end();
  
});
