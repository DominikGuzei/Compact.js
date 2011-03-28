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
  'view/ContactView',
  'compact/model/Model',
  'compact/lib/jquery'
], 

function(ContactView, Model, $) {

  var contactView = new ContactView();
  var mirrorContact = new ContactView(contactView.model);
  
  contactView.appendTo($("#application"));
  mirrorContact.appendTo($("#application"));
});
