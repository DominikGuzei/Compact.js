
define([
  'compact/Module',
  'compact/model/Model',
  'compact/model/Collection',
  'model/Post'
],

function(Module, Model, Collection, Post) {
  
  return Module("Topic") .extend(Model)
  
  .initialize(function(config) {
    
    config = config || {};
    
    this.superMethod({
      title: config.title || "Default title",
      posts: config.posts || new Collection()
    });
    
  })
  
  .end();
  
});
