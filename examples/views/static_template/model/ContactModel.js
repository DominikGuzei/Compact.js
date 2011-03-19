
define([
  'compact/Class',
  'compact/model/Model'
],

function(Class, Model) {
  
  return Class("ContactModel") .extend(Model)
  
  .properties({
    attributes: {
      name: "Name...",
      description: "A short description about the person..."
    }
  })
  
  .end();
  
});
