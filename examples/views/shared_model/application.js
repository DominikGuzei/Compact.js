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
  'controller/ContactController',
  'compact/lib/jquery'
], 

function(ContactController, $) {

  var contact = new ContactController();
  var mirrorContact = new ContactController(contact.model);
  
  contact.appendTo($("#application"));
  mirrorContact.appendTo($("#application"));
});
