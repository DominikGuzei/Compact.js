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
  'controller/TopicList',
  'controller/PostList'
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
  
  window.PostList = new PostList();
  window.TopicList = new TopicList (topicCollection);
  //var postList = new PostList ();
  
  window.TopicList.appendTo($("#application"));
  window.PostList.appendTo($("#application"));
});
