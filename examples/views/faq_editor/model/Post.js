
define([
  'compact/Module',
  'compact/model/Model',
],

function(Module, Model) {
  
  return Module("Post") .extend(Model)
  
  .initialize(function(params) {
    
    Module.assignProperties({
      
      title: "Default FAQ Post title",
      text: "This is a default text for faq post body texts."
      
    }, params, this);
    
  })
  
  .end();
  
});