/**
 * compact/view/Template
 * Require.js plugin for loading compiled jquery templates
 */

(function () {
    var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        buildMap = [];

    define(function () {
        var Template, get, fs;

        if (typeof window !== "undefined" && window.navigator && window.document) {
            get = function (url, callback) {
                var xhr = Template.createXhr();
                xhr.open('GET', url, true);
                xhr.onreadystatechange = function (evt) {
                    //Do not explicitly handle errors, those should be
                    //visible via console output in the browser.
                    if (xhr.readyState === 4) {
                        callback(xhr.responseText);
                    }
                };
                xhr.send(null);
            };
        } else if (typeof process !== "undefined" &&
                 process.versions &&
                 !!process.versions.node) {
            //Using special require.nodeRequire, something added by r.js.
            fs = require.nodeRequire('fs');

            get = function (url, callback) {
                callback(fs.readFileSync(url, 'utf8'));
            };
        }

        Template = {
            version: '0.0.1',
            
            extension: "html",
            
            jsEscape: function (content) {
                return content.replace(/(['\\])/g, '\\$1')
                    .replace(/[\f]/g, "\\f")
                    .replace(/[\b]/g, "\\b")
                    .replace(/[\n]/g, "\\n")
                    .replace(/[\t]/g, "\\t")
                    .replace(/[\r]/g, "\\r");
            },

            createXhr: function () {
                //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
                var xhr, i, progId;
                if (typeof XMLHttpRequest !== "undefined") {
                    return new XMLHttpRequest();
                } else {
                    for (i = 0; i < 3; i++) {
                        progId = progIds[i];
                        try {
                            xhr = new ActiveXObject(progId);
                        } catch (e) {}

                        if (xhr) {
                            progIds = [progId];  // so faster next time
                            break;
                        }
                    }
                }

                if (!xhr) {
                    throw new Error("require.getXhr(): XMLHttpRequest not available");
                }

                return xhr;
            },

            get: get,

            load: function (name, req, onLoad, config) {

                var url = req.nameToUrl(name, "." + Template.extension);
                
                req(['compact/lib/jquery-tmpl'], function() {
                  Template.get(url, function (content) {
                    
                    if (config.isBuild && config.inlineTemplates) {
                      buildMap[name] = content;
                      onLoad(content);
                    } else {
                      onLoad($.template(name, content));
                    }
                    
                  });
                });
                
            },

            write: function (pluginName, moduleName, write) {
              
                if (moduleName in buildMap) {
                    var content = Template.jsEscape(buildMap[moduleName]);
                    write("define('" + pluginName + "!" + moduleName  + 
                      "', ['compact/lib/jquery-tmpl'], function () { return $.template('" 
                      + moduleName + "', '" + content + "');});\n");
                }
                
            }
        };

        return Template;
    });
}());