
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

    this._setupPostListeners();
    this.collection.addEventListener("refresh", this._setupPostListeners, this);
    
  })
  
  .methods({
    
    appendTo: function() {
      this.superMethod.apply(this, arguments);
      this.openPost(this.viewItems[0]);
    },
    
    openPost: function(postToOpen) {
      if(this.openedPost === postToOpen) return;
      
      if(this.openedPost) { this.openedPost.setActive(false); }
      postToOpen.setActive(true);
      
      this.openedPost = postToOpen;
    },
    
    _setupPostListeners: function() {
      this.each(function(postView) {
        postView.addEventListener("click", this.openPost, this);
      }, this);
    }
    
  })
  
  .end();
  
});