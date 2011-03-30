
define([
  'compact/Module',
  'compact/model/Model',
],

function(Module, Model) {
  
  return Module("Post") .extend(Model)
  
  .initialize(function(config) {
    
    config = config || {};
    
    this.superMethod({
      title: config.title || "Default FAQ Post title",
      text: config.text || "This is a default text for faq post body texts."
    });
    
  })
  
  .end();
  
});