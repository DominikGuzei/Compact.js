
define([
  'compact/Module',
  'compact/model/Model',
  'compact/model/Collection',
  'model/Post'
],

function(Module, Model, Collection, Post) {
  
  return Module("Topic") .extend(Model)
  
  .initialize(function(params) {
    
    Module.assignProperties({
      
      title: "Default title",
      posts: new Collection()
      
    }, params, this);
    
  })
  
  .end();
  
});
