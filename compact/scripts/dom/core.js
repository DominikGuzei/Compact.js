define( function() {

  // Developed by Robert Nyman/DOMAssistant team, code/licensing: http://domassistant.googlecode.com/, documentation: http://www.domassistant.com/documentation, version 2.8
  var DOMAssistant = function () {
    var HTMLArray = function () {
      // Constructor
    },

    w = window, _$ = w.$, _$$ = w.$$,
    isIE = /*@cc_on!@*/false,
    isIE5 = isIE && parseFloat(navigator.appVersion) < 6,
    sort, tagCache = {}, lastCache = {}, useCache = true,
    slice = Array.prototype.slice,
    camel = {
      "accesskey": "accessKey",
      "class": "className",
      "colspan": "colSpan",
      "for": "htmlFor",
      "maxlength": "maxLength",
      "readonly": "readOnly",
      "rowspan": "rowSpan",
      "tabindex": "tabIndex",
      "valign": "vAlign",
      "cellspacing": "cellSpacing",
      "cellpadding": "cellPadding"
    },
    regex = {
      rules: /\s*,\s*/g,
      selector: /^(\w+|\*)?(#[\w\u00C0-\uFFFF\-=$]+)?((\.[\w\u00C0-\uFFFF\-]+)*)?((\[\w+\s*([~^$*|])?(=\s*([-\w\u00C0-\uFFFF\s.]+|"[^"]*"|'[^']*'))?\]+)*)?((:\w[-\w]*(\((odd|even|\-?\d*n?([-+]\d+)?|[:#]?[-\w\u00C0-\uFFFF.]+|"[^"]*"|'[^']*'|((\w*\.[-\w\u00C0-\uFFFF]+)*)?|(\[#?\w+([~^$*|])?=?[-\w\u00C0-\uFFFF\s.'"]+\]+)|(:\w[-\w]*\(.+\)))\))?)*)?([+>~])?/,
      selectorSplit: /(?:\[.*\]|\(.*\)|[^\s+>~[(])+|[+>~]/g,
      id: /^#([-\w\u00C0-\uFFFF=$]+)$/,
      tag: /^\w+/,
      relation: /^[+>~]$/,
      pseudo: /^:(\w[-\w]*)(\((.+)\))?$/,
      pseudos: /:(\w[-\w]*)(\((([^(]+)|([^(]+\([^(]+)\))\))?/g,
      attribs: /\[(\w+)\s*([~^$*|])?(=)?\s*([^\[\]]*|"[^"]*"|'[^']*')?\](?=$|\[|:|\s)/g,
      classes: /\.([-\w\u00C0-\uFFFF]+)/g,
      quoted: /^["'](.*)["']$/,
      nth: /^((odd|even)|([1-9]\d*)|((([1-9]\d*)?)n([-+]\d+)?)|(-(([1-9]\d*)?)n\+(\d+)))$/,
      special: /(:check|:enabl|\bselect)ed\b/
    },
    navigate = function (node, direction, checkTagName) {
      var oldName = node.tagName;
      while ((node = node[direction + "Sibling"]) && (node.nodeType !== 1 || (checkTagName? node.tagName !== oldName : node.tagName === "!"))) {
      }
      return node;
    },

    def = function (obj) {
      return typeof obj !== "undefined";
    },

    sortDocumentOrder = function (elmArray) {
      return (sortDocumentOrder = elmArray[0].compareDocumentPosition? function (elmArray) {
          return elmArray.sort( function (a, b) {
            return 3 - (a.compareDocumentPosition(b) & 6);
          } );

        } :

        isIE? function (elmArray) {
          return elmArray.sort( function (a, b) {
            return a.sourceIndex - b.sourceIndex;
          } );

        } : function (elmArray) {
          return elmArray.sort( function (a, b) {
            var range1 = document.createRange(), range2 = document.createRange();
            range1.setStart(a, 0);
            range1.setEnd(a, 0);
            range2.setStart(b, 0);
            range2.setEnd(b, 0);
            return range1.compareBoundaryPoints(Range.START_TO_END, range2);
          } );

        })(elmArray);

    };

    var pushAll = function (set1, set2) {
      set1.push.apply(set1, slice.apply(set2));
      return set1;
    };

    if (isIE) {
      pushAll = function (set1, set2) {
        if (set2.slice) {
          return set1.concat(set2);
        }
        var i=0, item;
        while ((item = set2[i++])) {
          set1[set1.length] = item;
        }
        return set1;
      };

    }
    return {
      isIE : isIE,
      camel : camel,
      def : def,
      allMethods : [],
      publicMethods : [
      "prev",
      "next",
      "hasChild",
      "cssSelect",
      "elmsByClass",
      "elmsByAttribute",
      "elmsByTag"
      ],

      harmonize : function () {
        w.$ = _$;
        w.$$ = _$$;
        return this;
      },

      initCore : function () {
        this.applyMethod.call(w, "$", this.$);
        this.applyMethod.call(w, "$$", this.$$);
        w.DOMAssistant = this;
        if (isIE) {
          HTMLArray = Array;
        }
        HTMLArray.prototype = [];
        (function (H) {
          H.each = function (fn, context) {
            for (var i=0, il=this.length; i<il; i++) {
              if (fn.call(context || this[i], this[i], i, this) === false) {
                break;
              }
            }
            return this;
          };

          H.first = function () {
            return def(this[0])? DOMAssistant.addMethodsToElm(this[0]) : null;
          };

          H.end = function () {
            return this.previousSet;
          };

          H.indexOf = H.indexOf ||
          function (elm) {
            for (var i=0, il=this.length; i<il; i++) {
              if (i in this && this[i] === elm) {
                return i;
              }
            }
            return -1;
          };

          H.map = function (fn, context) {
            var res = [];
            for (var i=0, il=this.length; i<il; i++) {
              if (i in this) {
                res[i] = fn.call(context || this[i], this[i], i, this);
              }
            }
            return res;
          };

          H.filter = function (fn, context) {
            var res = new HTMLArray();
            res.previousSet = this;
            for (var i=0, il=this.length; i<il; i++) {
              if (i in this && fn.call(context || this[i], this[i], i, this)) {
                res.push(this[i]);
              }
            }
            return res;
          };

          H.every = function (fn, context) {
            for (var i=0, il=this.length; i<il; i++) {
              if (i in this && !fn.call(context || this[i], this[i], i, this)) {
                return false;
              }
            }
            return true;
          };

          H.some = function (fn, context) {
            for (var i=0, il=this.length; i<il; i++) {
              if (i in this && fn.call(context || this[i], this[i], i, this)) {
                return true;
              }
            }
            return false;
          };

        })(HTMLArray.prototype);

        this.attach(this);
      },

      addMethods : function (name, method) {
        if (!def(this.allMethods[name])) {
          this.allMethods[name] = method;
          this.addHTMLArrayPrototype(name, method);
        }
      },

      addMethodsToElm : function (elm) {
        for (var method in this.allMethods) {
          if (def(this.allMethods[method])) {
            this.applyMethod.call(elm, method, this.allMethods[method]);
          }
        }
        return elm;
      },

      applyMethod : function (method, func) {
        if (typeof this[method] !== "function") {
          this[method] = func;
        }
      },

      attach : function (plugin) {
        var publicMethods = plugin.publicMethods;
        if (!def(publicMethods)) {
          for (var method in plugin) {
            if (method !== "init" && def(plugin[method])) {
              this.addMethods(method, plugin[method]);
            }
          }
        }
        else if (publicMethods.constructor === Array) {
          for (var i=0, current; (current=publicMethods[i]); i++) {
            this.addMethods(current, plugin[current]);
          }
        }
        if (typeof plugin.init === "function") {
          plugin.init();
        }
      },

      addHTMLArrayPrototype : function (name, method) {
        HTMLArray.prototype[name] = function () {
          var elmsToReturn = new HTMLArray();
          elmsToReturn.previousSet = this;
          for (var i=0, il=this.length; i<il; i++) {
            elmsToReturn.push(method.apply(DOMAssistant.$$(this[i]), arguments));
          }
          return elmsToReturn;
        };

      },

      cleanUp : function (elm) {
        var children = elm.all || elm.getElementsByTagName("*");
        for (var i=0, child; (child=children[i++]);) {
          if (child.hasData && child.hasData()) {
            if (child.removeEvent) {
              child.removeEvent();
            }
            child.unstore();
          }
        }
        elm.innerHTML = "";
      },

      setCache : function (cache) {
        useCache = cache;
      },

      $ : function () {
        var obj = arguments[0];
        if (arguments.length === 1 && (typeof obj === "object" || (typeof obj === "function" && !!obj.nodeName))) {
          return DOMAssistant.$$(obj);
        }
        var elm = !!obj? new HTMLArray() : null;
        for (var i=0, arg, idMatch; (arg=arguments[i]); i++) {
          if (typeof arg === "string") {
            arg = arg.replace(/^[^#\(]*(#)/, "$1");
            if (regex.id.test(arg)) {
              if ((idMatch = DOMAssistant.$$(arg.substr(1), false))) {
                elm.push(idMatch);
              }
            }
            else {
              var doc = (document.all || document.getElementsByTagName("*")).length;
              elm = (!document.querySelectorAll && useCache && lastCache.rule && lastCache.rule === arg && lastCache.doc === doc)? lastCache.elms : pushAll(elm, DOMAssistant.cssSelection.call(document, arg));
              lastCache = { rule: arg, elms: elm, doc: doc };
            }
          }
        }
        return elm;
      },

      $$ : function (id, addMethods) {
        var elm = (typeof id === "object" || typeof id === "function" && !!id.nodeName)? id : document.getElementById(id),
        applyMethods = def(addMethods)? addMethods : true,
        getId = function(el) {
          var eid = el.id;
          return typeof eid !== "object"? eid : el.attributes.id.nodeValue;
        };

        if (typeof id === "string" && elm && getId(elm) !== id) {
          elm = null;
          for (var i=0, item; (item=document.all[i]); i++) {
            if (getId(item) === id) {
              elm = item;
              break;
            }
          }
        }
        if (elm && applyMethods && !elm.next) {
          DOMAssistant.addMethodsToElm(elm);
        }
        return elm;
      },

      prev : function () {
        return DOMAssistant.$$(navigate(this, "previous"));
      },

      next : function () {
        return DOMAssistant.$$(navigate(this, "next"));
      },

      hasChild: function (elm) {
        return this === document || this !== elm && (this.contains? this.contains(elm) : !!(this.compareDocumentPosition(elm) & 16));
      },

      getSequence : function (expression) {
        var start, add = 2, max = -1, modVal = -1,
        pseudoVal = regex.nth.exec(expression.replace(/^0n\+/, "").replace(/^2n$/, "even").replace(/^2n+1$/, "odd"));
        if (!pseudoVal) {
          return null;
        }
        if (pseudoVal[2]) {	// odd or even
          start = (pseudoVal[2] === "odd")? 1 : 2;
          modVal = (start === 1)? 1 : 0;
        }
        else if (pseudoVal[3]) {	// single digit
          start = max = parseInt(pseudoVal[3], 10);
          add = 0;
        }
        else if (pseudoVal[4]) {	// an+b
          add = pseudoVal[6]? parseInt(pseudoVal[6], 10) : 1;
          start = pseudoVal[7]? parseInt(pseudoVal[7], 10) : 0;
          while (start < 1) {
            start += add;
          }
          modVal = (start >= add)? (start - add) % add : start;
        }
        else if (pseudoVal[8]) {	// -an+b
          add = pseudoVal[10]? parseInt(pseudoVal[10], 10) : 1;
          start = max = parseInt(pseudoVal[11], 10);
          while (start > add) {
            start -= add;
          }
          modVal = (max >= add)? (max - add) % add : max;
        }
        return { start: start, add: add, max: max, modVal: modVal };
      },

      cssByDOM : function (cssRule) {
        var prevParents, currentRule, cssSelectors, childOrSiblingRef, nextTag, nextRegExp, current, previous, prevParent, notElm, addElm, iteratorNext, childElm, sequence, anyTag,
        elm = new HTMLArray(), index = elm.indexOf, prevElm = [], matchingElms = [], cssRules = cssRule.replace(regex.rules, ",").split(","), splitRule = {};
        function clearAdded (elm) {
          elm = elm || prevElm;
          for (var n=elm.length; n--;) {
            elm[n].added = null;
            elm[n].removeAttribute("added");
          }
        }

        function clearChildElms () {
          for (var n=prevParents.length; n--;) {
            prevParents[n].childElms = null;
          }
        }

        function subtractArray (arr1, arr2) {
          for (var i=0, src1; (src1=arr1[i]); i++) {
            var found = false;
            for (var j=0, src2; (src2=arr2[j]); j++) {
              if (src2 === src1) {
                found = true;
                arr2.splice(j, 1);
                break;
              }
            }
            if (found) {
              arr1.splice(i--, 1);
            }
          }
          return arr1;
        }

        function getAttr (elm, attr) {
          return (isIE || regex.special.test(attr))? elm[camel[attr.toLowerCase()] || attr] : elm.getAttribute(attr, 2);
        }

        function attrToRegExp (attrVal, substrOperator) {
          attrVal = attrVal? attrVal.replace(regex.quoted, "$1").replace(/(\.|\[|\])/g, "\\$1") : null;
          return {
            "^": "^" + attrVal,
            "$": attrVal + "$",
            "*": attrVal,
            "|": "^" + attrVal + "(\\-\\w+)*$",
            "~": "\\b" + attrVal + "\\b"
          }[substrOperator] || (attrVal !== null? "^" + attrVal + "$" : attrVal);
        }

        function notComment(el) {
          return (el || this).tagName !== "!";
        }

        function getTags (tag, context) {
          return isIE5? (tag === "*"? context.all : context.all.tags(tag)) : context.getElementsByTagName(tag);
        }

        function getElementsByTagName (tag, parent) {
          tag = tag || "*";
          parent = parent || document;
          return (parent === document || parent.lastModified)? tagCache[tag] || (tagCache[tag] = getTags(tag, document)) : getTags(tag, parent);
        }

        function getElementsByPseudo (previousMatch, pseudoClass, pseudoValue) {
          prevParents = [];
          var pseudo = pseudoClass.split("-"), matchingElms = [], idx = 0, checkNodeName = /\-of\-type$/.test(pseudoClass), recur,
          match = {
            first: function(el) {
              return !navigate(el, "previous", checkNodeName);
            },

            last: function(el) {
              return !navigate(el, "next", checkNodeName);
            },

            empty: function(el) {
              return !el.firstChild;
            },

            enabled: function(el) {
              return !el.disabled && el.type !== "hidden";
            },

            disabled: function(el) {
              return el.disabled;
            },

            checked: function(el) {
              return el.checked;
            },

            contains: function(el) {
              return (el.innerText || el.textContent || "").indexOf(pseudoValue.replace(regex.quoted, "$1")) > -1;
            },

            other: function(el) {
              return getAttr(el, pseudoClass) === pseudoValue;
            }

          };
          function basicMatch(key) {
            while ((previous=previousMatch[idx++])) {
              if (notComment(previous) && match[key](previous)) {
                matchingElms[matchingElms.length] = previous;
              }
            }
            return matchingElms;
          }

          var word = pseudo[0] || null;
          if (word && match[word]) {
            return basicMatch(word);
          }
          switch (word) {
            case "only":
              var kParent, kTag;
              while ((previous=previousMatch[idx++])) {
                prevParent = previous.parentNode;
                var q = previous.nodeName;
                if (prevParent !== kParent || q !== kTag) {
                  if (match.first(previous) && match.last(previous)) {
                    matchingElms[matchingElms.length] = previous;
                  }
                  kParent = prevParent;
                  kTag = q;
                }
              }
              break;
            case "nth":
              if (pseudoValue === "n") {
                matchingElms = previousMatch;
              }
              else {
                var direction = (pseudo[1] === "last")? ["lastChild", "previousSibling"] : ["firstChild", "nextSibling"];
                sequence = DOMAssistant.getSequence(pseudoValue);
                if (sequence) {
                  while ((previous=previousMatch[idx++])) {
                    prevParent = previous.parentNode;
                    prevParent.childElms = prevParent.childElms || {};
                    var p = previous.nodeName;
                    if (!prevParent.childElms[p]) {
                      var childCount = 0;
                      iteratorNext = sequence.start;
                      childElm = prevParent[direction[0]];
                      while (childElm && (sequence.max < 0 || iteratorNext <= sequence.max)) {
                        var c = childElm.nodeName;
                        if ((checkNodeName && c === p) || (!checkNodeName && childElm.nodeType === 1 && c !== "!")) {
                          if (++childCount === iteratorNext) {
                            if (c === p) {
                              matchingElms[matchingElms.length] = childElm;
                            }
                            iteratorNext += sequence.add;
                          }
                        }
                        childElm = childElm[direction[1]];
                      }
                      if (anyTag) {
                        sort++;
                      }
                      prevParent.childElms[p] = true;
                      prevParents[prevParents.length] = prevParent;
                    }
                  }
                  clearChildElms();
                }
              }
              break;
            case "target":
              var hash = document.location.hash.slice(1);
              if (hash) {
                while ((previous=previousMatch[idx++])) {
                  if (getAttr(previous, "name") === hash || getAttr(previous, "id") === hash) {
                    matchingElms[matchingElms.length] = previous;
                    break;
                  }
                }
              }
              break;
            case "not":
              if ((recur = regex.pseudo.exec(pseudoValue))) {
                matchingElms = subtractArray(previousMatch, getElementsByPseudo(previousMatch, recur[1]? recur[1].toLowerCase() : null, recur[3] || null));
              }
              else {
                for (var re in regex) {
                  if (regex[re].lastIndex) {
                    regex[re].lastIndex = 0;
                  }
                }
                pseudoValue = pseudoValue.replace(regex.id, "[id=$1]");
                var notTag = regex.tag.exec(pseudoValue);
                var notClass = regex.classes.exec(pseudoValue);
                var notAttr = regex.attribs.exec(pseudoValue);
                var notRegExp = new RegExp(notAttr? attrToRegExp(notAttr[4], notAttr[2]) : "(^|\\s)" + (notTag? notTag[0] : notClass? notClass[1] : "") + "(\\s|$)", "i");
                while ((notElm=previousMatch[idx++])) {
                  addElm = null;
                  if (notTag && !notRegExp.test(notElm.nodeName) || notClass && !notRegExp.test(notElm.className)) {
                    addElm = notElm;
                  }
                  else if (notAttr) {
                    var att = getAttr(notElm, notAttr[1]);
                    if (!def(att) || att === false || typeof att === "string" && !notRegExp.test(att)) {
                      addElm = notElm;
                    }
                  }
                  if (addElm && !addElm.added) {
                    addElm.added = true;
                    matchingElms[matchingElms.length] = addElm;
                  }
                }
              }
              break;
            default:
              return basicMatch("other");
          }
          return matchingElms;
        }

        function pushUnique(set1, set2) {
          var i=0, s=set1, item;
          while ((item = set2[i++])) {
            if (!s.length || s.indexOf(item) < 0) {
              set1.push(item);
            }
          }
          return set1;
        }

        sort = -1;
        for (var a=0, tagBin=[]; (currentRule=cssRules[a]); a++) {
          if (!(cssSelectors = currentRule.match(regex.selectorSplit)) || a && index.call(cssRules.slice(0, a), currentRule) > -1) {
            continue;
          }
          prevElm = [this];
          for (var i=0, rule; (rule=cssSelectors[i]); i++) {
            matchingElms = [];
            if ((childOrSiblingRef = regex.relation.exec(rule))) {
              var idElm = null, nextWord = cssSelectors[i+1];
              if ((nextTag = regex.tag.exec(nextWord))) {
                nextTag = nextTag[0];
                nextRegExp = new RegExp("(^|\\s)" + nextTag + "(\\s|$)", "i");
              }
              else if (regex.id.test(nextWord)) {
                idElm = DOMAssistant.$(nextWord) || null;
              }
              for (var j=0, prevRef; (prevRef=prevElm[j]); j++) {
                switch (childOrSiblingRef[0]) {
                  case ">":
                    var children = idElm || getElementsByTagName(nextTag, prevRef);
                    for (var k=0, child; (child=children[k]); k++) {
                      if (child.parentNode === prevRef) {
                        matchingElms[matchingElms.length] = child;
                      }
                    }
                    break;
                  case "+":
                    if ((prevRef = navigate(prevRef, "next"))) {
                      if ((idElm && idElm[0] === prevRef) || (!idElm && (!nextTag || nextRegExp.test(prevRef.nodeName)))) {
                        matchingElms[matchingElms.length] = prevRef;
                      }
                    }
                    break;
                  case "~":
                    while ((prevRef = prevRef.nextSibling) && !prevRef.added) {
                      if ((idElm && idElm[0] === prevRef) || (!idElm && (!nextTag || nextRegExp.test(prevRef.nodeName)))) {
                        prevRef.added = true;
                        matchingElms[matchingElms.length] = prevRef;
                      }
                    }
                    break;
                }
              }
              prevElm = matchingElms;
              clearAdded();
              rule = cssSelectors[++i];
              if (/^\w+$/.test(rule) || regex.id.test(rule)) {
                continue;
              }
              prevElm.skipTag = true;
            }
            var cssSelector = regex.selector.exec(rule);
            splitRule = {
              tag : cssSelector[1]? cssSelector[1] : "*",
              id : cssSelector[2],
              allClasses : cssSelector[3],
              allAttr : cssSelector[5],
              allPseudos : cssSelector[10]
            };
            anyTag = (splitRule.tag === "*");
            if (splitRule.id) {
              var u = 0, DOMElm = document.getElementById(splitRule.id.slice(1));
              if (DOMElm) {
                while (prevElm[u] && !DOMAssistant.hasChild.call(prevElm[u], DOMElm)) {
                  u++;
                }
                matchingElms = (u < prevElm.length && (anyTag || splitRule.tag === DOMElm.tagName.toLowerCase()))? [DOMElm] : [];
              }
              prevElm = matchingElms;
            }
            else if (splitRule.tag && !prevElm.skipTag) {
              if (i===0 && !matchingElms.length && prevElm.length === 1) {
                prevElm = matchingElms = pushAll([], getElementsByTagName(splitRule.tag, prevElm[0]));
              }
              else {
                for (var l=0, ll=prevElm.length, tagCollectionMatches, tagMatch; l<ll; l++) {
                  tagCollectionMatches = getElementsByTagName(splitRule.tag, prevElm[l]);
                  for (var m=0; (tagMatch=tagCollectionMatches[m]); m++) {
                    if (!tagMatch.added) {
                      tagMatch.added = true;
                      matchingElms[matchingElms.length] = tagMatch;
                    }
                  }
                }
                prevElm = matchingElms;
                clearAdded();
              }
            }
            if (!matchingElms.length) {
              break;
            }
            prevElm.skipTag = false;
            if (splitRule.allClasses) {
              var n = 0, matchingClassElms = [], allClasses = splitRule.allClasses.split(".").slice(1);
              while ((current = prevElm[n++])) {
                var matchCls = true, elmClass = current.className;
                if (elmClass && elmClass.length) {
                  elmClass = elmClass.split(" ");
                  for (var o=allClasses.length; o--;) {
                    if (elmClass.indexOf(allClasses[o]) < 0) {
                      matchCls = false;
                      break;
                    }
                  }
                  if (matchCls) {
                    matchingClassElms[matchingClassElms.length] = current;
                  }
                }
              }
              prevElm = matchingElms = matchingClassElms;
            }
            if (splitRule.allAttr) {
              var matchAttr, r = 0, regExpAttributes = [], matchingAttributeElms = [], allAttr = splitRule.allAttr.match(regex.attribs);
              for (var specialStrip = /^\[(selected|readonly)(\s*=.+)?\]$/, q=0, ql=allAttr.length, attributeMatch, attrVal; q<ql; q++) {
                regex.attribs.lastIndex = 0;
                attributeMatch = regex.attribs.exec(allAttr[q].replace(specialStrip, "[$1]"));
                attrVal = attrToRegExp(attributeMatch[4], attributeMatch[2] || null);
                regExpAttributes[q] = [(attrVal? new RegExp(attrVal) : null), attributeMatch[1]];
              }
              while ((current = matchingElms[r++])) {
                for (var s=0, sl=regExpAttributes.length; s<sl; s++) {
                  var attributeRegExp = regExpAttributes[s][0], currentAttr = getAttr(current, regExpAttributes[s][1]);
                  matchAttr = true;
                  if (!attributeRegExp && currentAttr === true) {
                    continue;
                  }
                  if ((!attributeRegExp && (!currentAttr || typeof currentAttr !== "string" || !currentAttr.length)) || (!!attributeRegExp && !attributeRegExp.test(currentAttr))) {
                    matchAttr = false;
                    break;
                  }
                }
                if (matchAttr) {
                  matchingAttributeElms[matchingAttributeElms.length] = current;
                }
              }
              prevElm = matchingElms = matchingAttributeElms;
            }
            if (splitRule.allPseudos) {
              var allPseudos = splitRule.allPseudos.match(regex.pseudos);
              for (var t=0, tl=allPseudos.length; t<tl; t++) {
                regex.pseudos.lastIndex = 0;
                var pseudo = regex.pseudos.exec(allPseudos[t]);
                var pseudoClass = pseudo[1]? pseudo[1].toLowerCase() : null;
                var pseudoValue = pseudo[3] || null;
                matchingElms = getElementsByPseudo(matchingElms, pseudoClass, pseudoValue);
                clearAdded(matchingElms);
              }
              prevElm = matchingElms;
            }
          }
          elm = ((tagBin.length && (anyTag || index.call(tagBin, splitRule.tag) >= 0 || index.call(tagBin, "*") >= 0))? pushUnique : pushAll)(elm, prevElm);
          tagBin.push(splitRule.tag);
          if (isIE && anyTag) {
            elm = elm.filter(notComment);
          }
        }
        return ((elm.length > 1 && cssRules.length > 1) || sort > 0)? sortDocumentOrder(elm) : elm;
      },

      cssByXpath : function (cssRule) {
        var ns = { xhtml: "http://www.w3.org/1999/xhtml" },
        prefix = (document.documentElement.namespaceURI === ns.xhtml)? "xhtml:" : "",
        nsResolver = function lookupNamespaceURI (prefix) {
          return ns[prefix] || null;
        };

        DOMAssistant.cssByXpath = function (cssRule) {
          var currentRule, cssSelectors, xPathExpression, cssSelector, splitRule, sequence,
          elm = new HTMLArray(), cssRules = cssRule.replace(regex.rules, ",").split(",");
          function attrToXPath (wrap) {
            var pre = wrap? "[" : "", post = wrap? "]" : "";
            return function (match, p1, p2, p3, p4) {
              p4 = (p4 || "").replace(regex.quoted, "$1");
              if (p1 === p4 && p1 === "readonly") {
                p3 = null;
              }
              return pre + ({
                  "^": "starts-with(@" + p1 + ", \"" + p4 + "\")",
                  "$": "substring(@" + p1 + ", (string-length(@" + p1 + ") - " + (p4.length - 1) + "), " + p4.length + ") = \"" + p4 + "\"",
                  "*": "contains(concat(\" \", @" + p1 + ", \" \"), \"" + p4 + "\")",
                  "|": "@" + p1 + "=\"" + p4 + "\" or starts-with(@" + p1 + ", \"" + p4 + "-\")",
                  "~": "contains(concat(\" \", @" + p1 + ", \" \"), \" " + p4 + " \")"
                }[p2] || ("@" + p1 + (p3? "=\"" + p4 + "\"" : ""))) + post;
            };

          }

          function pseudoToXPath (tag, pseudoClass, pseudoValue) {
            tag = /\-child$/.test(pseudoClass)? "*" : tag;
            var pseudo = pseudoClass.split("-"), position = ((pseudo[1] === "last")? "(count(following-sibling::" : "(count(preceding-sibling::") + tag + ") + 1)", recur, hash;
            switch (pseudo[0]) {
              case "nth":
                return (pseudoValue !== "n" && (sequence = DOMAssistant.getSequence(pseudoValue)))? ((sequence.start === sequence.max)? position + " = " + sequence.start : position + " mod " + sequence.add + " = " + sequence.modVal + ((sequence.start > 1)? " and " + position + " >= " + sequence.start : "") + ((sequence.max > 0)? " and " + position + " <= " + sequence.max: "")) : "";
              case "not":
                return "not(" + ((recur = regex.pseudo.exec(pseudoValue))? pseudoToXPath(tag, recur[1]? recur[1].toLowerCase() : null, recur[3] || null) : pseudoValue.replace(regex.id, "[id=$1]").replace(regex.tag, "self::$0").replace(regex.classes, "contains(concat(\" \", @class, \" \"), \" $1 \")").replace(regex.attribs, attrToXPath())) + ")";
              case "first":
                return "not(preceding-sibling::" + tag + ")";
              case "last":
                return "not(following-sibling::" + tag + ")";
              case "only":
                return "not(preceding-sibling::" + tag + " or following-sibling::" + tag + ")";
              case "empty":
                return "not(child::*) and not(text())";
              case "contains":
                return "contains(., \"" + pseudoValue.replace(regex.quoted, "$1") + "\")";
              case "enabled":
                return "not(@disabled) and not(@type=\"hidden\")";
              case "disabled":
                return "@disabled";
              case "target":
                return "@name=\"" + (hash = document.location.hash.slice(1)) + "\" or @id=\"" + hash + "\"";
              default:
                return "@" + pseudoClass + "=\"" + pseudoValue + "\"";
            }
          }

          for (var i=0; (currentRule=cssRules[i]); i++) {
            if (!(cssSelectors = currentRule.match(regex.selectorSplit)) || i && elm.indexOf.call(cssRules.slice(0, i), currentRule) > -1) {
              continue;
            }
            xPathExpression = xPathExpression? xPathExpression + " | ." : ".";
            for (var j=0, jl=cssSelectors.length; j<jl; j++) {
              cssSelector = regex.selector.exec(cssSelectors[j]);
              splitRule = {
                tag: prefix + (cssSelector[1]? cssSelector[1] : "*"),
                id: cssSelector[2],
                allClasses: cssSelector[3],
                allAttr: cssSelector[5],
                allPseudos: cssSelector[10],
                tagRelation: cssSelector[20]
              };
              xPathExpression +=
              (splitRule.tagRelation? ({ ">": "/", "+": "/following-sibling::*[1]/self::", "~": "/following-sibling::" }[splitRule.tagRelation] || "") : ((j > 0 && regex.relation.test(cssSelectors[j-1]))? splitRule.tag : ("//" + splitRule.tag))) +
              (splitRule.id || "").replace(regex.id, "[@id = \"$1\"]") +
              (splitRule.allClasses || "").replace(regex.classes, "[contains(concat(\" \", @class, \" \"), \" $1 \")]") +
              (splitRule.allAttr || "").replace(regex.attribs, attrToXPath(true));
              if (splitRule.allPseudos) {
                var allPseudos = splitRule.allPseudos.match(regex.pseudos);
                for (var k=0, kl=allPseudos.length; k<kl; k++) {
                  regex.pseudos.lastIndex = 0;
                  var pseudo = regex.pseudos.exec(allPseudos[k]),
                  pseudoClass = pseudo[1]? pseudo[1].toLowerCase() : null,
                  pseudoValue = pseudo[3] || null,
                  xpath = pseudoToXPath(splitRule.tag, pseudoClass, pseudoValue);
                  if (xpath.length) {
                    xPathExpression += "[" + xpath + "]";
                  }
                }
              }
            }
          }
          try {
            var xPathNodes = document.evaluate(xPathExpression, this, nsResolver, 7, null), node, p=0;
            while ((node = xPathNodes.snapshotItem(p++))) {
              elm.push(node);
            }
          } catch (e) {
          }
          return elm;
        };

        return DOMAssistant.cssByXpath.call(this, cssRule);
      },

      cssSelection : function (cssRule) {
        if (!cssRule) {
          return null;
        }
        var special = regex.special.test(cssRule);
        try {
          if (document.querySelectorAll && !special) {
            return pushAll(new HTMLArray(), this.querySelectorAll(cssRule));
          }
        } catch (e) {
        }
        return ((document.evaluate && !special && !/-of-type/.test(cssRule))? DOMAssistant.cssByXpath : DOMAssistant.cssByDOM).call(this, cssRule);
      },

      cssSelect : function (cssRule) {
        return DOMAssistant.cssSelection.call(this, cssRule);
      },

      elmsByClass : function (className, tag) {
        var cssRule = (tag || "") + "." + className;
        return DOMAssistant.cssSelection.call(this, cssRule);
      },

      elmsByAttribute : function (attr, attrVal, tag, substrMatchSelector) {
        var cssRule = (tag || "") + "[" + attr + ((attrVal && attrVal !== "*")? ((substrMatchSelector || "") + "=" + attrVal + "]") : "]");
        return DOMAssistant.cssSelection.call(this, cssRule);
      },

      elmsByTag : function (tag) {
        return DOMAssistant.cssSelection.call(this, tag);
      }

    };
  }();

  DOMAssistant.initCore();

  DOMAssistant.harmonize();
  return DOMAssistant;

});