
define([
  'compact/Module',
  'compact/view/TemplateView',
  'compact/lib/jquery',
  'compact/event/Observable',
  'compact/view/Template!view/Post',
  'compact/view/Template!view/PostEdit',
  'model/Post'
],

function(Module, TemplateView, $, Observable, PostViewTemplate, PostEditTemplate, Post) {
  
  return Module("PostView") .extend(TemplateView) .mixin( Observable )
  
  .initialize(function(model) {
    
    this.superMethod({
      element: $('<li class="closed">'),
      model: model || new Post(),
      template: PostViewTemplate,
      events: {
        "click h3"        : "onClick",
        "click .edit"     : "onEditClick",
        "click .save"     : "onSaveClick",
        "click .delete"   : "onDeleteClick",
        "focus textarea, input[type='text']"  : "onInputFocus",
        "keydown textarea, input[type='text']"  : "onKeyDownInEditMode"
      }
    });
    
    this.inEditMode = false;
    this.active = false;
  })
  
  .methods({
    
    onClick: function(event) {
      this.dispatchEvent("click", this);
    },
    
    setActive: function(flag) {
      if(this.active !== flag) {
        this.element.toggleClass("open closed");
        this.active = flag;
      } 
    },
    
    enterEditMode: function() {
      this.dispatchEvent("enterEdit", this);
      this.inEditMode = true;
      this.setTemplate(PostEditTemplate);
      this.element.find("input[type='text']").focus();
    },
    
    saveChanges: function() {
      if(this.inEditMode) {
        this.setTemplate(PostViewTemplate, false);
        
        this.model.set({
          title: this.element.find("input[type='text']").val(),
          text: this.element.find("textarea").val()
        });
        
        this.render();
        this.inEditMode = false;
      }
    },
    
    onEditClick: function(event) {
      event.preventDefault();
      this.enterEditMode();
    },
    
    onSaveClick: function(event) {
      event.preventDefault();
      this.saveChanges();
    },
    
    onDeleteClick: function(event) {
      event.preventDefault();
      this.dispatchEvent("delete", this);
    },
    
    onInputFocus: function(event) {
      $(event.target).select();
    },
    
    onKeyDownInEditMode: function(event) {
      if(event.keyCode == 13) {
        event.preventDefault();
        this.saveChanges();
      }
    }
    
  })
  
  .end();
  
});