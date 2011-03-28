
define([
  'compact/Module',
  'compact/view/ListView',
  'controller/TopicViewController'
],

function(Module, ListView, TopicViewController) {
  
  return Module("TopicListViewController") .extend(ListView)
  
  .initialize(function(params) {
    
    Module.assignProperties({
      
      viewItemModule: TopicViewController
      
    }, params, this);
    
  })
  
  .end();
  
});