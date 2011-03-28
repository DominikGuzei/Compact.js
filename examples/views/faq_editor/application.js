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
  'model/Post',
  'controller/TopicListViewController',
  'controller/PostsListViewController'
], 

function($, Collection, Topic, Post, TopicListViewController, PostsListViewController) {
  
  var topicCollection = new Collection([
    new Topic({ 
      title: "Topic 1",
      posts: new Collection([
        new Post({
          title: "der erste Post überhaupt"
        }),
        new Post()
      ])
    }),
    new Topic({
      title: "Ein cooles Topic!",
      posts: new Collection([
        new Post({
          title: "ein einzigartiger Titel"
        }),
        new Post()
      ])
    }),
    new Topic()
  ]);
  
  var topicListView = new TopicListViewController(topicCollection);
  var postsListView = new PostsListViewController(topicCollection.first().get("posts"));
  
  topicListView.addEventListener("topicSelected", function(topic) {
    postsListView.setCollection(topic.model.get("posts"));
  });
  
  topicListView.appendTo($("#application"));
  postsListView.appendTo($("#application"));
});
