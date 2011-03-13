require(
  {
    "packages": [
        {
            name: "compact",
            location: "../../compact",
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
  
  window.contactView = new ContactView();
  var mirrorContact = new ContactView({
    model: contactView.model
  });
  
  contactView.appendTo($("#application"));
  mirrorContact.appendTo($("#application"));
});
