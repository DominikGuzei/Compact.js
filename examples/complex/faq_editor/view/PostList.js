
define([
  'compact/Module',
  'compact/view/ListView',
  'compact/model/Collection',
  'compact/lib/jquery',
  'compact/event/Observable',
  'model/Post',
  'view/PostView'
],

function(Module, ListView, Collection, $, Observable, Post, PostView) {
  
  return Module("PostsListViewController") .extend(ListView) .mixin(Observable)
  
  .initialize(function(collection) {
    
    this.superMethod({
      element: $('<ul id="posts">'),
      collection: collection || new Collection(),
      viewItemType: PostView
    });
    
    this.currentEditPost = null;
    
    this._setupAllPostListeners();
    this.collection.addEventListener("refresh", this._setupAllPostListeners, this);
    
    $("#addPostButton").click($.proxy(this.addPost, this));    
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
    
    addPost: function() {
      this.collection.add(new Post());
    },
    
    _addItem: function(item, index, collection) {
      var addedItem = this.superMethod.apply(this, arguments);
      this._setupPostListeners(addedItem);
      addedItem.enterEditMode();
    },
    
    deletePost: function(post) {
      this.collection.remove(post.model);
    },
    
    editPost: function(post) {
      if(this.currentEditPost && this.currentEditPost != post) {
        this.currentEditPost.saveChanges();
      }
      this.currentEditPost = post;
    },
    
    _setupAllPostListeners: function() {
      this.each(function(postView) {
        postView.removeEventListenersWithContext(this);
        this._setupPostListeners(postView);
      }, this);
    },
    
    _setupPostListeners: function(postView) {
      postView.addEventListener("click", this.openPost, this);
      postView.addEventListener("delete", this.deletePost, this);
      postView.addEventListener("enterEdit", this.editPost, this);
    }
    
  })
  
  .end();
  
});