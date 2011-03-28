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
  'compact/lib/jquery'
], 

function(ContactView, $) {

  var contactView = new ContactView();
  var mirrorContact = new ContactView(contactView.model);
  
  contactView.appendTo($("#application"));
  mirrorContact.appendTo($("#application"));
});
