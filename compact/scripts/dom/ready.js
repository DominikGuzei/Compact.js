define([
'compact/dom/core'
], function(DOMAssistant) {
  // Developed by Robert Nyman/DOMAssistant team, code/licensing: http://domassistant.googlecode.com/, documentation: http://www.domassistant.com/documentation. Module inspiration by Dean Edwards, Matthias Miller, and John Resig: http://dean.edwards.name/weblog/2006/06/again/
  /*global DOMAssistant */
  DOMAssistant.DOMLoad = function () {
    var DOMLoaded = false,
    DOMLoadTimer = null,
    functionsToCall = [],
    addedStrings = {},
    errorHandling = null,
    execFunctions = function () {
      for (var i=0, il=functionsToCall.length; i<il; i++) {
        try {
          functionsToCall[i]();
        } catch (e) {
          if (errorHandling && typeof errorHandling === "function") {
            errorHandling(e);
          }
        }
      }
      functionsToCall = [];
    },

    DOMHasLoaded = function () {
      if (DOMLoaded) {
        return;
      }
      DOMLoaded = true;
      execFunctions();
    };

    /* Internet Explorer */
    /*@cc_on
     @if (@_win32 || @_win64)
     document.write("<script id=\"ieScriptLoad\" defer src=\"//:\"><\/script>");
     document.getElementById("ieScriptLoad").onreadystatechange = function() {
     if (this.readyState === "complete") {
     DOMHasLoaded();
     }
     };
     @end @*/
    /* Mozilla, Chrome, Opera */
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", DOMHasLoaded, false);
    }
    /* Safari, iCab, Konqueror */
    if (/KHTML|WebKit|iCab/i.test(navigator.userAgent)) {
      DOMLoadTimer = setInterval( function () {
        if (/loaded|complete/i.test(document.readyState)) {
          DOMHasLoaded();
          clearInterval(DOMLoadTimer);
        }
      }, 10);

    }
    /* Other web browsers */
    window.onload = DOMHasLoaded;

    return {
      DOMReady : function () {
        for (var i=0, il=arguments.length, funcRef; i<il; i++) {
          funcRef = arguments[i];
          if (!funcRef.DOMReady && !addedStrings[funcRef]) {
            if (typeof funcRef === "string") {
              addedStrings[funcRef] = true;
              funcRef = new Function(funcRef);
            }
            funcRef.DOMReady = true;
            functionsToCall.push(funcRef);
          }
        }
        if (DOMLoaded) {
          execFunctions();
        }
      },

      setErrorHandling : function (funcRef) {
        errorHandling = funcRef;
      }

    };
  }();

  DOMAssistant.DOMReady = DOMAssistant.DOMLoad.DOMReady;

  return DOMAssistant;

});