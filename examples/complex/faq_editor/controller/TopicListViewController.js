
define([
  'compact/Module',
  'compact/view/ListView',
  'controller/TopicViewController',
  'compact/model/Collection',
  'compact/lib/jquery',
  'compact/event/Observable',
  'model/Topic'
],

function(Module, ListView, TopicViewController, Collection, $, Observable, Topic) {
  
  return Module("TopicListViewController") .extend(ListView) .mixin(Observable)
  
  .initialize(function(collection) {
    
    this.superMethod({
      element: $('<ul id="topics">'),
      collection: collection || new Collection(),
      viewItemType: TopicViewController
    });
    
    this.each(function(topicView) {
      this._setupTopicListeners(topicView);
    }, this);

    $("#addTopicButton").click($.proxy(this.addTopic, this));
  })
  
  .methods({
    
    appendTo: function() {
      this.superMethod.apply(this, arguments);
      this.selectTopic(this.viewItems[0]);
    },
    
    selectTopic: function(clickedTopic) {
      if(this.selectedTopic === clickedTopic) return;
      
      if(this.selectedTopic) { this.selectedTopic.setActive(false); }
      clickedTopic.setActive(true);
      
      this.selectedTopic = clickedTopic;
      this.dispatchEvent("topicSelected", this.selectedTopic);
    },
    
    addTopic: function(event) {
      this.collection.add(new Topic());
    },
    
    _addItem: function(item, index, collection) {
      var viewItem = this.superMethod.apply(this, arguments);
      this._setupTopicListeners(viewItem);
    },
    
    _setupTopicListeners: function(topicView) {
      topicView.addEventListener("click", this.selectTopic, this);
    }
    
  })
  
  .end();
  
});