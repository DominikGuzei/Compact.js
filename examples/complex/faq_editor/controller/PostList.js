
define([
  'compact/Module',
  'compact/controller/ComponentContainer',
  'compact/model/Collection',
  'compact/lib/jquery',
  'compact/event/Observable',
  'model/Post',
  'controller/PostView',
  'compact/view/Template!view/postList',
  'compact/view/Template!view/postListEmpty'
],

function(Module, ComponentContainer, Collection, $, Observable, Post, PostView, postListTemplate, postListEmpty) {
  
  return Module("PostList") .extend(ComponentContainer) .mixin(Observable)
  
  .initialize(function(collection) {
    
    this.superMethod({
      collection: collection || new Collection(),
      states: {
        view: {
          template: postListTemplate,
          events: {
            "click .addButton" : "addPost"
          },
          isDefault: true
        },
        empty: {
          template: postListEmpty
        }
      },
      containerElement: "ul.list",
      itemType: PostView
    });
    
    this.currentEditPost = null;
    this.openedPost = null;
  })
  
  .methods({
    
    setup: function() {
      this.addEventListener("addItem", this.itemAdded, this);
      this.addEventListener("add", this._setupPostListeners, this);
      this.superMethod();
    },

    addPost: function() {
      this.collection.add(new Post());
    },
    
    itemAdded: function(item, index, collection) {
      item.setActive(true);
      item.enterEditMode();
    },
    
    deletePost: function(post) {
      this.collection.remove(post.model);
    },
    
    openPost: function(post) {
      if(this.openedPost === post) return;
      
      if(this.openedPost) { this.openedPost.setActive(false); }
      post.setActive(true);
      
      this.openedPost = post;
    },
    
    showPosts: function() {
      this.setState(this.states.view);
    },
    
    showEmpty: function() {
      this.setState(this.states.empty);
    },
    
    _setupPostListeners: function(postView) {
      postView.addEventListener("click", this.openPost, this);
      postView.addEventListener("delete", this.deletePost, this);
      postView.addEventListener("open", this.openPost, this);
    }
    
  })
  
  .end();
  
});