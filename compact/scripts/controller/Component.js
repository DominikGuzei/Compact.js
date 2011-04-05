
define([
  'compact/collection/each',
  'compact/function/bind',
  'compact/Module',
  'compact/event/Observable',
  'compact/model/Model',
  'compact/model/Bindingsmanager',
  'compact/lib/jquery',
  'compact/lib/jquery-tmpl'
], 

function(each, bind, Module, Observable, Model, BindingsManager, $) {

  return Module("Component") .mixin(Observable)
  
  .initialize(function(config){
    config = config || {};
    
    this.model = config.model || new Model();
    this.states = config.states || {
      defaultState: {
        template: "<div>",
        isDefault: true
      }
    };
    this.setup();
  })
  
  .methods({
    
    setup: function() {
      this.isRendered = false;
      each(this.states, function(state) {
        if(state.isDefault) {
          this.setState(state);
        }
      }, this);
    },
    
    _renderState: function(state, force) {
      if(!state.rendered || force) {
        state.rendered = $.tmpl(state.template, this.model.data);
      }
      this._applyBindings(state);
    },
    
    _renderElement: function(state) {
      var renderedState = state.rendered;
      if(this.isRendered) {
        this.element.replaceWith(renderedState)
      }
      this.element = renderedState;
      this._delegateEvents(this.element, state.events);
      this.isRendered = true;
    },
    
    beforeStateChange: function(newState, finishCallback) {
      finishCallback(newState);
    },
    
    setState: function(state, silent) {
      if(state === this.currentState) { return; }
      this.currentState && this._removeBindings(this.currentState);
      this._renderState(state);
      this._renderElement(state);
      var oldState = this.currentState;
      this.currentState = state;
      !silent && this.dispatchEvent("stateChanged", oldState, state, this);
    },
    
    changeState: function(newState) {
      this.beforeStateChange(newState, bind(function(state) {
        var oldState = this.currentState;
        this.setState(state || newState);
        this.afterStateChange && this.afterStateChange(oldState, newState);
      }, this));
    },

    appendTo: function(parent) {
      this.element.appendTo(parent);
      this.parentElement = parent;
    },
    
    isAttachedToDom: function() {
      if(!this.isRendered) { return false; }
      return this.element.closest('html').length ? true : false;
    },
    
    destroy: function() {
      this._removeBindings(this.currentState);
      this.model.removeEventListenersWithContext(this);
      this.model = null;
      this.element.remove();
      this.parentElement = null;
      delete this.element;
      delete this.states;
      delete this.currentState;
    },
    
    _delegateEvents: function(element, events) {
      
      var eventSplitter = /^(\w+)\s*(.*)/;
    
      each(events, function(methodName, key) {
        var match = key.match(eventSplitter);
        var eventName = match[1], selector = match[2];
        var method = bind(this[methodName], this);
        
        if (selector === '') {
          element.bind(eventName, method);
        } else {
          element.delegate(selector, eventName, method);
        }
      }, this);
      
    },
    
    _applyBindings: function(state) {
      
      var bindingElements = $(state.rendered).find("*[data-bind]");
      
      bindingElements.each($.proxy(function(index, element) {
        var expressions = $(element).attr("data-bind");
        var expressionMatches = expressions.match(/(\w+)\s*:\s*(\w+|\{.+\})\s*,*/gi);
        
        each(expressionMatches, function(expression, index) {
          var config = expression.match(/(\w+)\s*:\s*(\w+)\s*,*/i);
          var bindingName = config[1];
          var property = config[2];
          
          state.bindings = state.bindings || [];
          state.bindings.push(BindingsManager.getInstance().bind(bindingName, this.model, property, element));
        }, this);
        
      }, this));
    },
    
    _removeBindings: function(state) {
      each(state.bindings, function(bindingSubscription) {
        bindingSubscription.cancle();
      });
      state.bindings = [];
    }
    
  })
  
  .end();

});
