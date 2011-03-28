require(
  {
    "packages": [
        {
            name: "compact",
            location: "../../../compact",
            lib: "scripts"
        }
    ]
  },
  
[
  'compact/lib/jquery',
  'compact/model/Collection',
  'model/Topic',
  'controller/TopicListViewController'
], 

function($, Collection, Topic, TopicListViewController) {
  
  var topicCollection = new Collection([
    new Topic({ title: "Topic 1" }),
    new Topic(),
    new Topic()
  ]);
  
  var listView = new TopicListViewController({
    collection: topicCollection
  });
  
  listView.appendTo($("#application"));
  listView.render();
  console.log(listView);
});
