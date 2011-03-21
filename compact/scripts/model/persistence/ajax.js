define([
'compact/dom/core'
], function(DOMAssistant) {

  // Developed by Robert Nyman/DOMAssistant team, code/licensing: http://domassistant.googlecode.com/, documentation: http://www.domassistant.com/documentation
  /*global DOMAssistant */
  DOMAssistant.AJAX = function () {
    var globalXMLHttp = null,
    readyState = 0,
    status = -1,
    statusText = "",
    requestPool = [],
    createAjaxObj = function (url, method, callback, addToContent) {
      var params = null;
      if (/POST/i.test(method)) {
        url = url.split("?");
        params = url[1];
        url = url[0];
      }
      return {
        url : url,
        method : method,
        callback : callback,
        params : params,
        headers : {},
        responseType : "text",
        addToContent : addToContent || false
      };
    };

    return {
      publicMethods : [
      "ajax",
      "get",
      "post",
      "load"
      ],

      initRequest : function () {
        var XMLHttp = null;
        if (!!window.XMLHttpRequest && !DOMAssistant.isIE) {
          XMLHttp = new XMLHttpRequest();
          DOMAssistant.AJAX.initRequest = function () {
            return requestPool.length? requestPool.pop() : new XMLHttpRequest();
          };

        }
        else if (!!window.ActiveXObject) {
          var XMLHttpMS = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
          for (var i=0; i<XMLHttpMS.length; i++) {
            try {
              XMLHttp = new window.ActiveXObject(XMLHttpMS[i]);
              DOMAssistant.AJAX.initRequest = function () {
                return requestPool.length? requestPool.pop() : new window.ActiveXObject(XMLHttpMS[i]);
              };

              break;
            } catch (e) {
              XMLHttp = null;
            }
          }
        }
        return XMLHttp;
      },

      ajax : function (ajaxObj) {
        if (!ajaxObj.noParse && ajaxObj.url && /\?/.test(ajaxObj.url) && ajaxObj.method && /POST/i.test(ajaxObj.method)) {
          var url = ajaxObj.url.split("?");
          ajaxObj.url = url[0];
          ajaxObj.params = url[1] + ((url[1].length > 0 && ajaxObj.params)? ("&" + ajaxObj.params) : "");
        }
        return DOMAssistant.AJAX.makeCall.call(this, ajaxObj);
      },

      get : function (url, callback, addToContent) {
        return DOMAssistant.AJAX.makeCall.call(this, createAjaxObj(url, "GET", callback, addToContent));
      },

      post : function (url, callback) {
        return DOMAssistant.AJAX.makeCall.call(this, createAjaxObj(url, "POST", callback));
      },

      load : function (url, addToContent) {
        this.get(url, DOMAssistant.AJAX.replaceWithAJAXContent, addToContent);
      },

      makeCall : function (ajaxObj) {
        var XMLHttp = DOMAssistant.AJAX.initRequest();
        if (XMLHttp) {
          globalXMLHttp = XMLHttp;
          (function (elm) {
            var url = ajaxObj.url,
            method = ajaxObj.method || "GET",
            callback = ajaxObj.callback,
            params = ajaxObj.params,
            headers = ajaxObj.headers,
            responseType = ajaxObj.responseType || "text",
            addToContent = ajaxObj.addToContent,
            timeout = ajaxObj.timeout || null,
            ex = ajaxObj.exception,
            timeoutId = null,
            done = false;
            XMLHttp.open(method, url, true);
            XMLHttp.setRequestHeader("AJAX", "true");
            XMLHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            if (method === "POST") {
              XMLHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
              XMLHttp.setRequestHeader("Content-length", params? params.length : 0);
              if (XMLHttp.overrideMimeType) {
                XMLHttp.setRequestHeader("Connection", "close");
              }
            }
            if (responseType === "json") {
              XMLHttp.setRequestHeader("Accept", "application/json, text/javascript, */*");
            }
            for (var i in headers) {
              if (typeof i === "string") {
                XMLHttp.setRequestHeader(i, headers[i]);
              }
            }
            if (typeof callback === "function") {
              XMLHttp.onreadystatechange = function () {
                try {
                  if (XMLHttp.readyState === 4 && !done) {
                    window.clearTimeout(timeoutId);
                    done = true;
                    status = XMLHttp.status;
                    statusText = XMLHttp.statusText;
                    readyState = 4;
                    if ((status || location.protocol !== "file:") && (status < 200 || status >= 300)) {
                      throw new Error(statusText);
                    }
                    var response = /xml/i.test(responseType)? XMLHttp.responseXML : XMLHttp.responseText;
                    if (/json/i.test(responseType) && !!response) {
                      response = (typeof JSON === "object" && typeof JSON.parse === "function")? JSON.parse(response) : eval("(" + response + ")");
                    }
                    globalXMLHttp = null;
                    XMLHttp.onreadystatechange = function () {
                    };

                    requestPool.push(XMLHttp);
                    callback.call(elm, response, addToContent);
                  }
                } catch (e) {
                  globalXMLHttp = XMLHttp = null;
                  if (typeof ex === "function") {
                    ex.call(elm, e);
                    ex = null;
                  }
                }
              };

            }
            XMLHttp.send(params);
            if (timeout) {
              timeoutId = window.setTimeout( function () {
                if (!done) {
                  XMLHttp.abort();
                  done = true;
                  if (typeof ex === "function") {
                    readyState = 0;
                    status = 408;
                    statusText = "Request timeout";
                    globalXMLHttp = XMLHttp = null;
                    ex.call(elm, new Error(statusText));
                    ex = null;
                  }
                }
              }, timeout);

            }
          })(this);

        }
        return this;
      },

      replaceWithAJAXContent : function (content, add) {
        if (add) {
          this.innerHTML += content;
        }
        else {
          DOMAssistant.cleanUp(this);
          this.innerHTML = content;
        }
      },

      getReadyState : function () {
        return (globalXMLHttp && DOMAssistant.def(globalXMLHttp.readyState))? globalXMLHttp.readyState : readyState;
      },

      getStatus : function () {
        return status;
      },

      getStatusText : function () {
        return statusText;
      }

    };
  }();

  DOMAssistant.attach(DOMAssistant.AJAX);

  return DOMAssistant;
});