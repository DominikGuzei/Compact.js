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
  'compact/model/Collection',
  'model/Contact',
  'controller/ContactList',
  'compact/lib/jquery'
], 

function(Collection, Contact, ContactList, $) {

  var contacts = new Collection([
    new Contact({
      name: "Dominik Guzei",
      description: "A web application developer from Austria."
    })
  ]);

  var contactList = new ContactList(contacts);
  contactList.appendTo($("#application"));
  
});
