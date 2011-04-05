
define([
  'compact/Module',
  'compact/view/ListView',
  'compact/model/Collection',
  'compact/lib/jquery',
  'compact/event/Observable',
  'model/Topic',
  'view/TopicView',
],

function(Module, ListView, Collection, $, Observable, Topic, TopicView) {
  
  return Module("TopicListViewController") .extend(ListView) .mixin(Observable)
  
  .initialize(function(collection) {
    
    this.superMethod({
      element: $('<ul id="topics">'),
      collection: collection || new Collection(),
      viewItemType: TopicView
    });
    
    this.each(function(topicView) {
      this._setupTopicListeners(topicView);
    }, this);

    $("#addTopicButton").click($.proxy(this.addTopic, this));
  })
  
  .methods({
    
    selectTopic: function(topic, silent) {
      if(this.selectedTopic === topic) { return; }
      
      if(this.selectedTopic) { this.selectedTopic.setActive(false); }
      topic.setActive(true);
      
      this.selectedTopic = topic;
      !silent && this.dispatchEvent("topicSelected", this.selectedTopic);
    },
    
    addTopic: function(event) {
      this.collection.add(new Topic());
    },
    
    _addItem: function(item, index, collection) {
      var addedItem = this.superMethod.apply(this, arguments);
      this._setupTopicListeners(addedItem);
    },
    
    _setupTopicListeners: function(topicView) {
      topicView.addEventListener("click", this.selectTopic, this);
    }
    
  })
  
  .end();
  
});