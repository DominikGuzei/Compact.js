
define([
  'compact/Module',
  'compact/controller/ComponentContainer',
  'compact/model/Collection',
  'compact/lib/jquery',
  'compact/event/Observable',
  'model/Topic',
  'controller/TopicView',
  'compact/view/Template!view/topicList'
],

function(Module, ComponentContainer, Collection, $, Observable, Topic, TopicView, topicListTemplate) {
  
  return Module("TopicList") .extend(ComponentContainer) .mixin(Observable)
  
  .initialize(function(collection) {
    
    this.superMethod({
      collection: collection || new Collection(),
      states: {
        view: {
          template: topicListTemplate,
          events: {
            "click .addButton" : "addTopic"
          },
          isDefault: true
        }
      },
      containerElement: "ul.list",
      itemType: TopicView
    });
  })
  
  .methods({
    
    setup: function() {
      this.addEventListener("addItem", this.itemAdded, this);
      this.addEventListener("add", this._setupTopicListeners, this);
      this.superMethod();
      this.selectedTopic = null;
      this.selectTopic(this.items[0]);
    },
    
    selectTopic: function(topic) {
      if(this.selectedTopic === topic) { return; }
      
      if(this.selectedTopic) { 
        this.selectedTopic.setActive(false);
        this.selectedTopic.setState(this.selectedTopic.states.view);
      }
      topic.setActive(true);
      
      this.selectedTopic = topic;
      window.PostList.showPosts();
      window.PostList.collection.refresh(topic.model.get("posts").all());
    },
    
    deleteTopic: function(topic) {
      var index = this.collection.indexOf(topic.model);
      this.collection.removeAt(index);
      
      if(this.selectedTopic == topic) {
        this.selectedTopic = null;
        var newSelectedTopic = null;
        
        if(!this.collection.isEmpty()) {
          newSelectedTopic = index >= this.items.length ? this.items[index-1] : this.items[index];
          this.selectTopic(newSelectedTopic);
        } else {
          window.PostList.showEmpty();
        }
      }
    },
    
    addTopic: function(event) {
      this.collection.add(new Topic());
    },
    
    itemAdded: function(item, index) {
      item.enterEditMode();
    },
    
    _setupTopicListeners: function(topicView) {
      topicView.addEventListener("select", this.selectTopic, this);
      topicView.addEventListener("delete", this.deleteTopic, this);
    }
    
  })
  
  .end();
  
});