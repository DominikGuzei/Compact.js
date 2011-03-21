define([
'compact/dom/core'
], function(DOMAssistant) {

  // Developed by Robert Nyman/DOMAssistant team, code/licensing: http://domassistant.googlecode.com/, documentation: http://www.domassistant.com/documentation
  /*global DOMAssistant */
  DOMAssistant.Events = function () {
    var handler,
    key = "_events",
    w3cMode = !!document.addEventListener,
    useCapture = { focus: true, blur: true },
    translate = DOMAssistant.isIE? { focus: "activate", blur: "deactivate", mouseenter: "mouseover", mouseleave: "mouseout" } : { mouseenter: "mouseover", mouseleave: "mouseout" },
    regex = {
      special: /^submit|reset|change|select$/i,
      mouseenterleave: /^mouse(enter|leave)$/i,
      dom: /^DOM/,
      on: /^on/i
    },
    special = function (e) {
      return DOMAssistant.isIE && regex.special.test(e);
    },

    fix = function (e) {
      return translate[e] || e;
    },

    createEvent = function (e, type, target) {
      e = e || window.event || {};
      if (e.event) {
        return e;
      }
      var event = {
        event: e,
        type: type || e.type,
        bubbles: e.bubbles || true,
        cancelable: e.cancelable || false,
        target: target || e.target || e.srcElement,
        clientX: e.clientX || 0,
        clientY: e.clientY || 0,
        altKey: e.altKey || false,
        ctrlKey: e.ctrlKey || false,
        shiftKey: e.shiftKey || false,
        button: e.button || null,
        timeStamp: +new Date(),
        preventDefault: function() {
          if (e.preventDefault) {
            e.preventDefault();
          }
          this.returnValue = e.returnValue = false;
        },

        stopPropagation: function() {
          if (e.stopPropagation) {
            e.stopPropagation();
          }
          this.cancelBubble = e.cancelBubble = true;
        }

      };
      if (event.target && 3 === event.target.nodeType) { // Safari textnode bug
        event.target = event.target.parentNode;
      }
      event.currentTarget = event.target;
      event.relatedTarget = e.relatedTarget || (e.fromElement === event.target? e.toElement : e.fromElement) || null;
      var de = document.documentElement, b = document.body;
      event.pageX = DOMAssistant.def(e.pageX)? e.pageX : (event.clientX + (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0));
      event.pageY = DOMAssistant.def(e.pageY)? e.pageY : (event.clientY + (de.scrollTop || b.scrollTop) - (de.clientTop || 0));
      if ("number" === typeof e.which) {
        event.keyCode = e.keyCode;
        event.charCode = event.which = e.which;
      }
      else if (e.keyCode) {
        event.keyCode = event.charCode = e.keyCode;
      }
      return event;
    };

    return {
      publicMethods : [
      "triggerEvent",
      "addEvent",
      "removeEvent",
      "relayEvent",
      "unrelayEvent",
      "preventDefault",
      "cancelBubble"
      ],

      init : function () {
        DOMAssistant.preventDefault = this.preventDefault;
        DOMAssistant.cancelBubble = this.cancelBubble;
        handler = this.handleEvent;
      },

      triggerEvent : function (evt, target, e) {
        var fevt = fix(evt),
        events = this.retrieve(key),
        event = e || createEvent(e, fevt, target || this);
        event.currentTarget = this;
        if (events && events[fevt]) {
          for (var i=0, iL=events[fevt].length; i<iL; i++) {
            if (events[fevt][i].call(this, event) === false) {
              event.stopPropagation();
            }
          }
        }
        else if (typeof this["on" + fevt] === "function") {
          this["on" + fevt].call(this, event);
        }
        var p = DOMAssistant.$$(this.parentNode);
        if (!event.cancelBubble && p && p.nodeType === 1) {
          p.triggerEvent(fevt, target, event);
        }
        return this;
      },

      addEvent : function (evt, func, relay, proxy, selector) {
        var existingEvent,
        fevt = fix(evt),
        uid = fevt + this.retrieve(),
        onevt = "on" + fevt;
        if (!(func.attachedElements && func.attachedElements[uid])) {
          var events = this.retrieve(key) || {};
          if (!events[fevt]) {
            events[fevt] = [];
            existingEvent = this[onevt];
            this[onevt] = null;
          }
          if (typeof this.window === "object") {
            this.window[onevt] = handler;
          }
          else if (!events[fevt].length) {
            if (w3cMode) {
              this.addEventListener(fevt, handler, useCapture[fevt]);
            }
            else {
              this[onevt] = handler;
            }
          }
          if (existingEvent) {
            events[fevt].push(existingEvent);
          }
          if (fevt !== evt) {
            func.evt = evt;
          }
          func.relay = relay;
          func.proxy = proxy;
          func.selector = selector;
          func.attachedElements = func.attachedElements || {};
          func.attachedElements[uid] = true;
          events[fevt].push(func);
          this.store(key, events);
        }
        return this;
      },

      handleEvent : function (evt) {
        var currentEvt = (evt && regex.dom.test(evt.type) && w3cMode)? evt : createEvent(evt),
        type = fix(currentEvt.type),
        targ = currentEvt.target,
        relatedTarg = currentEvt.relatedTarget,
        eventColl = this.retrieve(key)[type].slice(0), eventCollLength, eventReturn, oevt;
        if ((eventCollLength = eventColl.length)) {
          for (var i=0; i<eventCollLength; i++) {
            if (typeof eventColl[i] === "function") {
              if ((oevt = eventColl[i].evt) && oevt !== type) {
                currentEvt.type = oevt;
                if (relatedTarg && regex.mouseenterleave.test(oevt)) {
                  if (eventColl[i].relay) {
                    var elms = eventColl[i].elms || (eventColl[i].elms = this.cssSelect(eventColl[i].selector));
                    if (elms.indexOf(targ) < 0 || !DOMAssistant.hasChild.call(relatedTarg, targ)) {
                      continue;
                    }
                  }
                  else if (this === relatedTarg || this.hasChild(relatedTarg)) {
                    continue;
                  }
                }
              }
              eventReturn = eventColl[i].call(this, currentEvt);
            }
          }
          if (eventReturn === false) {
            currentEvt.stopPropagation();
          }
          return eventReturn;
        }
      },

      removeEvent : function (evt, func, relay, proxy) {
        var uid = (evt = fix(evt)) + this.retrieve(),
        events = this.retrieve(key),
        onevt = "on" + evt;
        if (events && !evt) {
          for (var ev in events) {
            if (events[ev].length) {
              this.removeEvent(ev);
            }
          }
          var attr = this.attributes;
          for (var att, j=attr.length; j--;) {
            att = attr[j].nodeName.toLowerCase();
            if (regex.on.test(att) && typeof this[att] === "function") {
              this[att] = null;
            }
          }
        }
        else if (events && events[evt]) {
          var eventColl = events[evt];
          for (var fn, i=eventColl.length; i--;) {
            fn = func || eventColl[i];
            if (eventColl[i] === fn && relay === fn.relay && proxy === fn.proxy) {
              eventColl.splice(i, 1);
              if (!!proxy && fn.selector) {
                this.cssSelect(fn.selector).removeEvent(proxy);
              }
              if (fn.attachedElements) {
                fn.attachedElements[uid] = null;
              }
            }
          }
          if (!events[evt].length) {
            if (w3cMode) {
              this.removeEventListener(evt, handler, useCapture[evt]);
            }
            else {
              this[onevt] = null;
            }
          }
        }
        else if (this[onevt] && !func && !relay) {
          this[onevt] = null;
        }
        return this;
      },

      relayEvent: function (evt, selector, fn, proxy) {
        if (special(evt)) {
          this.relayEvent("focus", selector, function() {
            DOMAssistant.$$(this).removeEvent(evt).addEvent(evt, function(e) {
              return fn.call(this, createEvent(e));
            });

          }, evt).relayEvent("blur", selector, function() {
            DOMAssistant.$$(this).removeEvent(evt);
          }, evt);

          return this;
        }
        return this.addEvent(evt, function(e) {
          e = createEvent(e);
          var target = e.target, args = arguments, i = 0, elm, elms = this.cssSelect(selector);
          while ((elm = elms[i++])) {
            if ((elm === target || DOMAssistant.hasChild.call(elm, target)) && !elm.disabled) {
              e.currentTarget = elm;
              var retVal = fn.apply(elm, args);
              if (!retVal) {
                e.preventDefault();
              }
              return retVal;
            }
          }
        }, true, proxy, selector);

      },

      unrelayEvent: function (evt) {
        if (special(evt)) {
          return this.removeEvent("focus", null, true, evt).removeEvent("blur", null, true, evt);
        }
        return this.removeEvent(evt, null, true);
      },

      preventDefault : function (evt) {
        if (evt.preventDefault) {
          evt.preventDefault();
        }
        evt.returnValue = false;
      },

      cancelBubble : function (evt) {
        if (evt.stopPropagation) {
          evt.stopPropagation();
        }
        evt.cancelBubble = true;
      }

    };
  }();

  DOMAssistant.attach(DOMAssistant.Events);

  return DOMAssistant;

});