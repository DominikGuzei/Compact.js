
define([
  'compact/Module',
  'compact/model/Model'
],

function(Module, Model) {
  
  return Module("ContactModel") .extend(Model)
  
  .initialize(function(data) {
    this.superMethod(data || {
      name: "Anonymous",
      description: "A short description about the person..."
    });
  })
  
  .end();
  
});
