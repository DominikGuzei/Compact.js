
define([
  'compact/Module',
  'compact/model/Model'
],

function(Module, Model) {
  
  return Module("ContactModel") .extend(Model)
  
  .initialize(function() {
    this.superMethod({
      name: "Name...",
      description: "A short description about the person..."
    });
  })
  
  .end();
  
});
