
define([
  'compact/Module',
  'compact/view/ListView',
  'controller/PostViewController',
  'compact/model/Collection',
  'compact/lib/jquery',
  'compact/event/Observable'
],

function(Module, ListView, PostViewController, Collection, $, Observable) {
  
  return Module("PostsListViewController") .extend(ListView) .mixin(Observable)
  
  .initialize(function(collection) {
    
    this.superMethod({
      element: $('<ul id="posts">'),
      collection: collection || new Collection(),
      viewItemType: PostViewController
    });

  })
  
  .end();
  
});