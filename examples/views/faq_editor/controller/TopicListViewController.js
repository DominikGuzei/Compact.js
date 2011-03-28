
define([
  'compact/Module',
  'compact/view/ListView',
  'controller/TopicViewController',
  'compact/model/Collection',
  'compact/lib/jquery',
  'compact/event/Observable'
],

function(Module, ListView, TopicViewController, Collection, $, Observable) {
  
  return Module("TopicListViewController") .extend(ListView) .mixin(Observable)
  
  .initialize(function(collection) {
    
    this.superMethod({
      element: $('<ul id="topics">'),
      collection: collection || new Collection(),
      viewItemType: TopicViewController
    });
    
    this.each(function(topicView) {
      topicView.addEventListener("click", this.onTopicClick, this);
    }, this);
    
    this.onTopicClick(this.viewItems[0]);
  })
  
  .methods({
    
    onTopicClick: function(clickedTopic) {
      
      if(this.selectedTopic === clickedTopic) return;
      
      this.selectedTopic = clickedTopic;
      this.dispatchEvent("topicSelected", this.selectedTopic);
    }
    
  })
  
  .end();
  
});