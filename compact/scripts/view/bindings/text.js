
define([
  'compact/model/BindingsManager',
  'compact/lib/jquery'
],  

function(BindingsManager, $) {
  
  var manager = BindingsManager.getInstance();

  /**
   * text binding
   */
   
   manager.registerBinding("text", {
     
     setup: function(element, value, model, property) {
      $(element).html(value);
     },
      
     update: function(element, value, model, property) {
      $(element).html(value);
     }
     
   });
   
});