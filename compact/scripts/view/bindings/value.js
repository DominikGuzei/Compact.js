
define([
  'compact/model/BindingsManager',
  'compact/lib/jquery'
],  

function(BindingsManager, $) {
  
  var manager = BindingsManager.getInstance();

  /**
   * text binding
   */
   
   manager.registerBinding("value", {
     
     setup: function(element, value, model, property) {
      element = $(element);
      element.val(value);
      element.change($.proxy(function() {
        this.updating = true;
        model.set(property, element.val());
        this.updating = false;
      }, this));
     },
      
     update: function(element, value, model, property) {
      if(!this.updating) {
        $(element).val(value);
      }
     }
     
   });
   
});