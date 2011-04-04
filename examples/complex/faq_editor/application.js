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
  'view/TopicList',
  'view/PostList'
], 

function($, Collection, Topic, Post, TopicList, PostList) {
  
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
  
  var topicList = new TopicList (topicCollection);
  var postList = new PostList (topicCollection.first().get("posts"));
  
  topicList.addEventListener("topicSelected", function(topic) {
    postList.collection.refresh(topic.model.get("posts").all());
  });
  
  topicList.appendTo($("#faq-topics .wrap"));
  postList.appendTo($("#faq-posts"));
});
