var __defProp = Object.defineProperty,
  __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key,
  {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value
  }) : obj[key] = value,
  __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

function Delegate(root)
{
  this.listenerMap = [
  {},
  {}], root && this.root(root), this.handle = Delegate.prototype.handle.bind(this), this._removedListeners = []
}
Delegate.prototype.root = function(root)
{
  const listenerMap = this.listenerMap;
  let eventType;
  if (this.rootElement)
  {
    for (eventType in listenerMap[1]) listenerMap[1].hasOwnProperty(eventType) && this.rootElement.removeEventListener(eventType, this.handle, !0);
    for (eventType in listenerMap[0]) listenerMap[0].hasOwnProperty(eventType) && this.rootElement.removeEventListener(eventType, this.handle, !1)
  }
  if (!root || !root.addEventListener) return this.rootElement && delete this.rootElement, this;
  this.rootElement = root;
  for (eventType in listenerMap[1]) listenerMap[1].hasOwnProperty(eventType) && this.rootElement.addEventListener(eventType, this.handle, !0);
  for (eventType in listenerMap[0]) listenerMap[0].hasOwnProperty(eventType) && this.rootElement.addEventListener(eventType, this.handle, !1);
  return this
}, Delegate.prototype.captureForType = function(eventType)
{
  return ["blur", "error", "focus", "load", "resize", "scroll"].indexOf(eventType) !== -1
}, Delegate.prototype.on = function(eventType, selector, handler, useCapture)
{
  let root, listenerMap, matcher, matcherParam;
  if (!eventType) throw new TypeError("Invalid event type: " + eventType);
  if (typeof selector == "function" && (useCapture = handler, handler = selector, selector = null), useCapture === void 0 && (useCapture = this.captureForType(eventType)), typeof handler != "function") throw new TypeError("Handler must be a type of Function");
  return root = this.rootElement, listenerMap = this.listenerMap[useCapture ? 1 : 0], listenerMap[eventType] || (root && root.addEventListener(eventType, this.handle, useCapture), listenerMap[eventType] = []), selector ? /^[a-z]+$/i.test(selector) ? (matcherParam = selector, matcher = matchesTag) : /^#[a-z0-9\-_]+$/i.test(selector) ? (matcherParam = selector.slice(1), matcher = matchesId) : (matcherParam = selector, matcher = Element.prototype.matches) : (matcherParam = null, matcher = matchesRoot.bind(this)), listenerMap[eventType].push(
  {
    selector,
    handler,
    matcher,
    matcherParam
  }), this
}, Delegate.prototype.off = function(eventType, selector, handler, useCapture)
{
  let i, listener, listenerMap, listenerList, singleEventType;
  if (typeof selector == "function" && (useCapture = handler, handler = selector, selector = null), useCapture === void 0) return this.off(eventType, selector, handler, !0), this.off(eventType, selector, handler, !1), this;
  if (listenerMap = this.listenerMap[useCapture ? 1 : 0], !eventType)
  {
    for (singleEventType in listenerMap) listenerMap.hasOwnProperty(singleEventType) && this.off(singleEventType, selector, handler);
    return this
  }
  if (listenerList = listenerMap[eventType], !listenerList || !listenerList.length) return this;
  for (i = listenerList.length - 1; i >= 0; i--) listener = listenerList[i], (!selector || selector === listener.selector) && (!handler || handler === listener.handler) && (this._removedListeners.push(listener), listenerList.splice(i, 1));
  return listenerList.length || (delete listenerMap[eventType], this.rootElement && this.rootElement.removeEventListener(eventType, this.handle, useCapture)), this
}, Delegate.prototype.handle = function(event)
{
  let i, l;
  const type = event.type;
  let root, phase, listener, returned, listenerList = [],
    target;
  const eventIgnore = "ftLabsDelegateIgnore";
  if (event[eventIgnore] === !0) return;
  switch (target = event.target, target.nodeType === 3 && (target = target.parentNode), target.correspondingUseElement && (target = target.correspondingUseElement), root = this.rootElement, phase = event.eventPhase || (event.target !== event.currentTarget ? 3 : 2), phase)
  {
    case 1:
      listenerList = this.listenerMap[1][type];
      break;
    case 2:
      this.listenerMap[0] && this.listenerMap[0][type] && (listenerList = listenerList.concat(this.listenerMap[0][type])), this.listenerMap[1] && this.listenerMap[1][type] && (listenerList = listenerList.concat(this.listenerMap[1][type]));
      break;
    case 3:
      listenerList = this.listenerMap[0][type];
      break
  }
  let toFire = [];
  for (l = listenerList.length; target && l;)
  {
    for (i = 0; i < l && (listener = listenerList[i], !!listener); i++) target.tagName && ["button", "input", "select", "textarea"].indexOf(target.tagName.toLowerCase()) > -1 && target.hasAttribute("disabled") ? toFire = [] : listener.matcher.call(target, listener.matcherParam, target) && toFire.push([event, target, listener]);
    if (target === root || (l = listenerList.length, target = target.parentElement || target.parentNode, target instanceof HTMLDocument)) break
  }
  let ret;
  for (i = 0; i < toFire.length; i++)
    if (!(this._removedListeners.indexOf(toFire[i][2]) > -1) && (returned = this.fire.apply(this, toFire[i]), returned === !1))
    {
      toFire[i][0][eventIgnore] = !0, toFire[i][0].preventDefault(), ret = !1;
      break
    } return ret
}, Delegate.prototype.fire = function(event, target, listener)
{
  return listener.handler.call(target, event, target)
};

function matchesTag(tagName, element)
{
  return tagName.toLowerCase() === element.tagName.toLowerCase()
}

function matchesRoot(selector, element)
{
  return this.rootElement === window ? element === document || element === document.documentElement || element === window : this.rootElement === element
}

function matchesId(id, element)
{
  return id === element.id
}
Delegate.prototype.destroy = function()
{
  this.off(), this.root()
};
var main_default = Delegate,
  InputBindingManager = class
  {
    constructor()
    {
      this.delegateElement = new main_default(document.body), this.delegateElement.on("change", "[data-bind-value]", this._onValueChanged.bind(this))
    }
    _onValueChanged(event, target)
    {
      const boundElement = document.getElementById(target.getAttribute("data-bind-value"));
      boundElement && (target.tagName === "SELECT" && (target = target.options[target.selectedIndex]), boundElement.innerHTML = target.hasAttribute("title") ? target.getAttribute("title") : target.value)
      if (String(target.getAttribute("data-bind-value")).endsWith('-limited')) {
        const otherBoundElement = document.getElementById(String(target.getAttribute("data-bind-value")).substring(0, String(target.getAttribute("data-bind-value")).lastIndexOf('-limited')));
        if (otherBoundElement) otherBoundElement.innerHTML = '';
      } else {
        const otherBoundElement = document.getElementById(target.getAttribute("data-bind-value")+'-limited');
        if (otherBoundElement) otherBoundElement.innerHTML = '';
      }
    }
  };

function triggerEvent(element, name, data = {})
{
  element.dispatchEvent(new CustomEvent(name,
  {
    bubbles: !0,
    detail: data
  }))
}

function triggerNonBubblingEvent(element, name, data = {})
{
  element.dispatchEvent(new CustomEvent(name,
  {
    bubbles: !1,
    detail: data
  }))
}
var CustomHTMLElement = class extends HTMLElement
  {
    constructor()
    {
      super(), this._hasSectionReloaded = !1, Shopify.designMode && this.rootDelegate.on("shopify:section:select", event =>
      {
        const parentSection = this.closest(".shopify-section");
        event.target === parentSection && event.detail.load && (this._hasSectionReloaded = !0)
      })
    }
    get rootDelegate()
    {
      return this._rootDelegate = this._rootDelegate || new main_default(document.documentElement)
    }
    get delegate()
    {
      return this._delegate = this._delegate || new main_default(this)
    }
    showLoadingBar()
    {
      triggerEvent(document.documentElement, "theme:loading:start")
    }
    hideLoadingBar()
    {
      triggerEvent(document.documentElement, "theme:loading:end")
    }
    untilVisible(intersectionObserverOptions = {
      rootMargin: "30px 0px",
      threshold: 0
    })
    {
      const onBecameVisible = () =>
      {
        this.classList.add("became-visible"), this.style.opacity = "1"
      };
      return new Promise(resolve =>
      {
        window.IntersectionObserver ? (this.intersectionObserver = new IntersectionObserver(event =>
        {
          event[0].isIntersecting && (this.intersectionObserver.disconnect(), requestAnimationFrame(() =>
          {
            resolve(), onBecameVisible()
          }))
        }, intersectionObserverOptions), this.intersectionObserver.observe(this)) : (resolve(), onBecameVisible())
      })
    }
    disconnectedCallback()
    {
      this.delegate.destroy(), this.rootDelegate.destroy(), this.intersectionObserver?.disconnect(), delete this._delegate, delete this._rootDelegate
    }
  },
  candidateSelectors = ["input:not([inert])", "select:not([inert])", "textarea:not([inert])", "a[href]:not([inert])", "button:not([inert])", "[tabindex]:not(slot):not([inert])", "audio[controls]:not([inert])", "video[controls]:not([inert])", '[contenteditable]:not([contenteditable="false"]):not([inert])', "details>summary:first-of-type:not([inert])", "details:not([inert])"],
  candidateSelector = candidateSelectors.join(","),
  NoElement = typeof Element > "u",
  matches = NoElement ? function() {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector,
  getRootNode = !NoElement && Element.prototype.getRootNode ? function(element)
  {
    var _element$getRootNode;
    return element == null || (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element)
  } : function(element)
  {
    return element?.ownerDocument
  },
  isInert = function isInert2(node, lookUp)
  {
    var _node$getAttribute;
    lookUp === void 0 && (lookUp = !0);
    var inertAtt = node == null || (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, "inert"),
      inert = inertAtt === "" || inertAtt === "true",
      result = inert || lookUp && node && isInert2(node.parentNode);
    return result
  },
  isContentEditable = function(node)
  {
    var _node$getAttribute2, attValue = node == null || (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, "contenteditable");
    return attValue === "" || attValue === "true"
  },
  getCandidates = function(el, includeContainer, filter)
  {
    if (isInert(el)) return [];
    var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
    return includeContainer && matches.call(el, candidateSelector) && candidates.unshift(el), candidates = candidates.filter(filter), candidates
  },
  getCandidatesIteratively = function getCandidatesIteratively2(elements, includeContainer, options)
  {
    for (var candidates = [], elementsToCheck = Array.from(elements); elementsToCheck.length;)
    {
      var element = elementsToCheck.shift();
      if (!isInert(element, !1))
        if (element.tagName === "SLOT")
        {
          var assigned = element.assignedElements(),
            content = assigned.length ? assigned : element.children,
            nestedCandidates = getCandidatesIteratively2(content, !0, options);
          options.flatten ? candidates.push.apply(candidates, nestedCandidates) : candidates.push(
          {
            scopeParent: element,
            candidates: nestedCandidates
          })
        }
      else
      {
        var validCandidate = matches.call(element, candidateSelector);
        validCandidate && options.filter(element) && (includeContainer || !elements.includes(element)) && candidates.push(element);
        var shadowRoot = element.shadowRoot || typeof options.getShadowRoot == "function" && options.getShadowRoot(element),
          validShadowRoot = !isInert(shadowRoot, !1) && (!options.shadowRootFilter || options.shadowRootFilter(element));
        if (shadowRoot && validShadowRoot)
        {
          var _nestedCandidates = getCandidatesIteratively2(shadowRoot === !0 ? element.children : shadowRoot.children, !0, options);
          options.flatten ? candidates.push.apply(candidates, _nestedCandidates) : candidates.push(
          {
            scopeParent: element,
            candidates: _nestedCandidates
          })
        }
        else elementsToCheck.unshift.apply(elementsToCheck, element.children)
      }
    }
    return candidates
  },
  hasTabIndex = function(node)
  {
    return !isNaN(parseInt(node.getAttribute("tabindex"), 10))
  },
  getTabIndex = function(node)
  {
    if (!node) throw new Error("No node provided");
    return node.tabIndex < 0 && (/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node) ? 0 : node.tabIndex
  },
  getSortOrderTabIndex = function(node, isScope)
  {
    var tabIndex = getTabIndex(node);
    return tabIndex < 0 && isScope && !hasTabIndex(node) ? 0 : tabIndex
  },
  sortOrderedTabbables = function(a, b)
  {
    return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex
  },
  isInput = function(node)
  {
    return node.tagName === "INPUT"
  },
  isHiddenInput = function(node)
  {
    return isInput(node) && node.type === "hidden"
  },
  isDetailsWithSummary = function(node)
  {
    var r = node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child)
    {
      return child.tagName === "SUMMARY"
    });
    return r
  },
  getCheckedRadio = function(nodes, form)
  {
    for (var i = 0; i < nodes.length; i++)
      if (nodes[i].checked && nodes[i].form === form) return nodes[i]
  },
  isTabbableRadio = function(node)
  {
    if (!node.name) return !0;
    var radioScope = node.form || getRootNode(node),
      queryRadios = function(name)
      {
        return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]')
      },
      radioSet;
    if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function") radioSet = queryRadios(window.CSS.escape(node.name));
    else try
    {
      radioSet = queryRadios(node.name)
    }
    catch (err)
    {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message), !1
    }
    var checked = getCheckedRadio(radioSet, node.form);
    return !checked || checked === node
  },
  isRadio = function(node)
  {
    return isInput(node) && node.type === "radio"
  },
  isNonTabbableRadio = function(node)
  {
    return isRadio(node) && !isTabbableRadio(node)
  },
  isNodeAttached = function(node)
  {
    var _nodeRoot, nodeRoot = node && getRootNode(node),
      nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host,
      attached = !1;
    if (nodeRoot && nodeRoot !== node)
    {
      var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
      for (attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node != null && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node)); !attached && nodeRootHost;)
      {
        var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
        nodeRoot = getRootNode(nodeRootHost), nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host, attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost))
      }
    }
    return attached
  },
  isZeroArea = function(node)
  {
    var _node$getBoundingClie = node.getBoundingClientRect(),
      width = _node$getBoundingClie.width,
      height = _node$getBoundingClie.height;
    return width === 0 && height === 0
  },
  isHidden = function(node, _ref)
  {
    var displayCheck = _ref.displayCheck,
      getShadowRoot = _ref.getShadowRoot;
    if (getComputedStyle(node).visibility === "hidden") return !0;
    var isDirectSummary = matches.call(node, "details>summary:first-of-type"),
      nodeUnderDetails = isDirectSummary ? node.parentElement : node;
    if (matches.call(nodeUnderDetails, "details:not([open]) *")) return !0;
    if (!displayCheck || displayCheck === "full" || displayCheck === "legacy-full")
    {
      if (typeof getShadowRoot == "function")
      {
        for (var originalNode = node; node;)
        {
          var parentElement = node.parentElement,
            rootNode = getRootNode(node);
          if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === !0) return isZeroArea(node);
          node.assignedSlot ? node = node.assignedSlot : !parentElement && rootNode !== node.ownerDocument ? node = rootNode.host : node = parentElement
        }
        node = originalNode
      }
      if (isNodeAttached(node)) return !node.getClientRects().length;
      if (displayCheck !== "legacy-full") return !0
    }
    else if (displayCheck === "non-zero-area") return isZeroArea(node);
    return !1
  },
  isDisabledFromFieldset = function(node)
  {
    if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName))
      for (var parentNode = node.parentElement; parentNode;)
      {
        if (parentNode.tagName === "FIELDSET" && parentNode.disabled)
        {
          for (var i = 0; i < parentNode.children.length; i++)
          {
            var child = parentNode.children.item(i);
            if (child.tagName === "LEGEND") return matches.call(parentNode, "fieldset[disabled] *") ? !0 : !child.contains(node)
          }
          return !0
        }
        parentNode = parentNode.parentElement
      }
    return !1
  },
  isNodeMatchingSelectorFocusable = function(options, node)
  {
    return !(node.disabled || isInert(node) || isHiddenInput(node) || isHidden(node, options) || isDetailsWithSummary(node) || isDisabledFromFieldset(node))
  },
  isNodeMatchingSelectorTabbable = function(options, node)
  {
    return !(isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node))
  },
  isValidShadowRootTabbable = function(shadowHostNode)
  {
    var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
    return !!(isNaN(tabIndex) || tabIndex >= 0)
  },
  sortByOrder = function sortByOrder2(candidates)
  {
    var regularTabbables = [],
      orderedTabbables = [];
    return candidates.forEach(function(item, i)
    {
      var isScope = !!item.scopeParent,
        element = isScope ? item.scopeParent : item,
        candidateTabindex = getSortOrderTabIndex(element, isScope),
        elements = isScope ? sortByOrder2(item.candidates) : element;
      candidateTabindex === 0 ? isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element) : orderedTabbables.push(
      {
        documentOrder: i,
        tabIndex: candidateTabindex,
        item,
        isScope,
        content: elements
      })
    }), orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable)
    {
      return sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content), acc
    }, []).concat(regularTabbables)
  },
  tabbable = function(container, options)
  {
    options = options ||
    {};
    var candidates;
    return options.getShadowRoot ? candidates = getCandidatesIteratively([container], options.includeContainer,
    {
      filter: isNodeMatchingSelectorTabbable.bind(null, options),
      flatten: !1,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isValidShadowRootTabbable
    }) : candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options)), sortByOrder(candidates)
  },
  focusable = function(container, options)
  {
    options = options ||
    {};
    var candidates;
    return options.getShadowRoot ? candidates = getCandidatesIteratively([container], options.includeContainer,
    {
      filter: isNodeMatchingSelectorFocusable.bind(null, options),
      flatten: !0,
      getShadowRoot: options.getShadowRoot
    }) : candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options)), candidates
  },
  isTabbable = function(node, options)
  {
    if (options = options ||
      {}, !node) throw new Error("No node provided");
    return matches.call(node, candidateSelector) === !1 ? !1 : isNodeMatchingSelectorTabbable(options, node)
  },
  focusableCandidateSelector = candidateSelectors.concat("iframe").join(","),
  isFocusable = function(node, options)
  {
    if (options = options ||
      {}, !node) throw new Error("No node provided");
    return matches.call(node, focusableCandidateSelector) === !1 ? !1 : isNodeMatchingSelectorFocusable(options, node)
  };

function ownKeys(e, r)
{
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols)
  {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2)
    {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable
    })), t.push.apply(t, o)
  }
  return t
}

function _objectSpread2(e)
{
  for (var r = 1; r < arguments.length; r++)
  {
    var t = arguments[r] != null ? arguments[r] :
    {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function(r2)
    {
      _defineProperty(e, r2, t[r2])
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2)
    {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2))
    })
  }
  return e
}

function _defineProperty(obj, key, value)
{
  return key = _toPropertyKey(key), key in obj ? Object.defineProperty(obj, key,
  {
    value,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : obj[key] = value, obj
}

function _toPrimitive(input, hint)
{
  if (typeof input != "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0)
  {
    var res = prim.call(input, hint || "default");
    if (typeof res != "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.")
  }
  return (hint === "string" ? String : Number)(input)
}

function _toPropertyKey(arg)
{
  var key = _toPrimitive(arg, "string");
  return typeof key == "symbol" ? key : String(key)
}
var activeFocusTraps = {
    activateTrap: function(trapStack, trap)
    {
      if (trapStack.length > 0)
      {
        var activeTrap = trapStack[trapStack.length - 1];
        activeTrap !== trap && activeTrap.pause()
      }
      var trapIndex = trapStack.indexOf(trap);
      trapIndex === -1 || trapStack.splice(trapIndex, 1), trapStack.push(trap)
    },
    deactivateTrap: function(trapStack, trap)
    {
      var trapIndex = trapStack.indexOf(trap);
      trapIndex !== -1 && trapStack.splice(trapIndex, 1), trapStack.length > 0 && trapStack[trapStack.length - 1].unpause()
    }
  },
  isSelectableInput = function(node)
  {
    return node.tagName && node.tagName.toLowerCase() === "input" && typeof node.select == "function"
  },
  isEscapeEvent = function(e)
  {
    return e?.key === "Escape" || e?.key === "Esc" || e?.keyCode === 27
  },
  isTabEvent = function(e)
  {
    return e?.key === "Tab" || e?.keyCode === 9
  },
  isKeyForward = function(e)
  {
    return isTabEvent(e) && !e.shiftKey
  },
  isKeyBackward = function(e)
  {
    return isTabEvent(e) && e.shiftKey
  },
  delay = function(fn)
  {
    return setTimeout(fn, 0)
  },
  findIndex = function(arr, fn)
  {
    var idx = -1;
    return arr.every(function(value, i)
    {
      return fn(value) ? (idx = i, !1) : !0
    }), idx
  },
  valueOrHandler = function(value)
  {
    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) params[_key - 1] = arguments[_key];
    return typeof value == "function" ? value.apply(void 0, params) : value
  },
  getActualTarget = function(event)
  {
    return event.target.shadowRoot && typeof event.composedPath == "function" ? event.composedPath()[0] : event.target
  },
  internalTrapStack = [],
  createFocusTrap = function(elements, userOptions)
  {
    var doc = userOptions?.document || document,
      trapStack = userOptions?.trapStack || internalTrapStack,
      config = _objectSpread2(
      {
        returnFocusOnDeactivate: !0,
        escapeDeactivates: !0,
        delayInitialFocus: !0,
        isKeyForward,
        isKeyBackward
      }, userOptions),
      state = {
        containers: [],
        containerGroups: [],
        tabbableGroups: [],
        nodeFocusedBeforeActivation: null,
        mostRecentlyFocusedNode: null,
        active: !1,
        paused: !1,
        delayInitialFocusTimer: void 0,
        recentNavEvent: void 0
      },
      trap, getOption = function(configOverrideOptions, optionName, configOptionName)
      {
        return configOverrideOptions && configOverrideOptions[optionName] !== void 0 ? configOverrideOptions[optionName] : config[configOptionName || optionName]
      },
      findContainerIndex = function(element, event)
      {
        var composedPath = typeof event?.composedPath == "function" ? event.composedPath() : void 0;
        return state.containerGroups.findIndex(function(_ref)
        {
          var container = _ref.container,
            tabbableNodes = _ref.tabbableNodes;
          return container.contains(element) || composedPath?.includes(container) || tabbableNodes.find(function(node)
          {
            return node === element
          })
        })
      },
      getNodeForOption = function(optionName)
      {
        var optionValue = config[optionName];
        if (typeof optionValue == "function")
        {
          for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) params[_key2 - 1] = arguments[_key2];
          optionValue = optionValue.apply(void 0, params)
        }
        if (optionValue === !0 && (optionValue = void 0), !optionValue)
        {
          if (optionValue === void 0 || optionValue === !1) return optionValue;
          throw new Error("`".concat(optionName, "` was specified but was not a node, or did not return a node"))
        }
        var node = optionValue;
        if (typeof optionValue == "string" && (node = doc.querySelector(optionValue), !node)) throw new Error("`".concat(optionName, "` as selector refers to no known node"));
        return node
      },
      getInitialFocusNode = function()
      {
        var node = getNodeForOption("initialFocus");
        if (node === !1) return !1;
        if (node === void 0 || !isFocusable(node, config.tabbableOptions))
          if (findContainerIndex(doc.activeElement) >= 0) node = doc.activeElement;
          else
          {
            var firstTabbableGroup = state.tabbableGroups[0],
              firstTabbableNode = firstTabbableGroup && firstTabbableGroup.firstTabbableNode;
            node = firstTabbableNode || getNodeForOption("fallbackFocus")
          } if (!node) throw new Error("Your focus-trap needs to have at least one focusable element");
        return node
      },
      updateTabbableNodes = function()
      {
        if (state.containerGroups = state.containers.map(function(container)
          {
            var tabbableNodes = tabbable(container, config.tabbableOptions),
              focusableNodes = focusable(container, config.tabbableOptions),
              firstTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[0] : void 0,
              lastTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[tabbableNodes.length - 1] : void 0,
              firstDomTabbableNode = focusableNodes.find(function(node)
              {
                return isTabbable(node)
              }),
              lastDomTabbableNode = focusableNodes.slice().reverse().find(function(node)
              {
                return isTabbable(node)
              }),
              posTabIndexesFound = !!tabbableNodes.find(function(node)
              {
                return getTabIndex(node) > 0
              });
            return {
              container,
              tabbableNodes,
              focusableNodes,
              posTabIndexesFound,
              firstTabbableNode,
              lastTabbableNode,
              firstDomTabbableNode,
              lastDomTabbableNode,
              nextTabbableNode: function(node)
              {
                var forward = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0,
                  nodeIdx = tabbableNodes.indexOf(node);
                return nodeIdx < 0 ? forward ? focusableNodes.slice(focusableNodes.indexOf(node) + 1).find(function(el)
                {
                  return isTabbable(el)
                }) : focusableNodes.slice(0, focusableNodes.indexOf(node)).reverse().find(function(el)
                {
                  return isTabbable(el)
                }) : tabbableNodes[nodeIdx + (forward ? 1 : -1)]
              }
            }
          }), state.tabbableGroups = state.containerGroups.filter(function(group)
          {
            return group.tabbableNodes.length > 0
          }), state.tabbableGroups.length <= 0 && !getNodeForOption("fallbackFocus")) throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
        if (state.containerGroups.find(function(g)
          {
            return g.posTabIndexesFound
          }) && state.containerGroups.length > 1) throw new Error("At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps.")
      },
      getActiveElement = function getActiveElement2(el)
      {
        var activeElement = el.activeElement;
        if (activeElement) return activeElement.shadowRoot && activeElement.shadowRoot.activeElement !== null ? getActiveElement2(activeElement.shadowRoot) : activeElement
      },
      tryFocus = function tryFocus2(node)
      {
        if (node !== !1 && node !== getActiveElement(document))
        {
          if (!node || !node.focus)
          {
            tryFocus2(getInitialFocusNode());
            return
          }
          node.focus(
          {
            preventScroll: !!config.preventScroll
          }), state.mostRecentlyFocusedNode = node, isSelectableInput(node) && node.select()
        }
      },
      getReturnFocusNode = function(previousActiveElement)
      {
        var node = getNodeForOption("setReturnFocus", previousActiveElement);
        return node || (node === !1 ? !1 : previousActiveElement)
      },
      findNextNavNode = function(_ref2)
      {
        var target = _ref2.target,
          event = _ref2.event,
          _ref2$isBackward = _ref2.isBackward,
          isBackward = _ref2$isBackward === void 0 ? !1 : _ref2$isBackward;
        target = target || getActualTarget(event), updateTabbableNodes();
        var destinationNode = null;
        if (state.tabbableGroups.length > 0)
        {
          var containerIndex = findContainerIndex(target, event),
            containerGroup = containerIndex >= 0 ? state.containerGroups[containerIndex] : void 0;
          if (containerIndex < 0) isBackward ? destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode : destinationNode = state.tabbableGroups[0].firstTabbableNode;
          else if (isBackward)
          {
            var startOfGroupIndex = findIndex(state.tabbableGroups, function(_ref3)
            {
              var firstTabbableNode = _ref3.firstTabbableNode;
              return target === firstTabbableNode
            });
            if (startOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target, !1)) && (startOfGroupIndex = containerIndex), startOfGroupIndex >= 0)
            {
              var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1,
                destinationGroup = state.tabbableGroups[destinationGroupIndex];
              destinationNode = getTabIndex(target) >= 0 ? destinationGroup.lastTabbableNode : destinationGroup.lastDomTabbableNode
            }
            else isTabEvent(event) || (destinationNode = containerGroup.nextTabbableNode(target, !1))
          }
          else
          {
            var lastOfGroupIndex = findIndex(state.tabbableGroups, function(_ref4)
            {
              var lastTabbableNode = _ref4.lastTabbableNode;
              return target === lastTabbableNode
            });
            if (lastOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target)) && (lastOfGroupIndex = containerIndex), lastOfGroupIndex >= 0)
            {
              var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1,
                _destinationGroup = state.tabbableGroups[_destinationGroupIndex];
              destinationNode = getTabIndex(target) >= 0 ? _destinationGroup.firstTabbableNode : _destinationGroup.firstDomTabbableNode
            }
            else isTabEvent(event) || (destinationNode = containerGroup.nextTabbableNode(target))
          }
        }
        else destinationNode = getNodeForOption("fallbackFocus");
        return destinationNode
      },
      checkPointerDown = function(e)
      {
        var target = getActualTarget(e);
        if (!(findContainerIndex(target, e) >= 0))
        {
          if (valueOrHandler(config.clickOutsideDeactivates, e))
          {
            trap.deactivate(
            {
              returnFocus: config.returnFocusOnDeactivate
            });
            return
          }
          valueOrHandler(config.allowOutsideClick, e) || e.preventDefault()
        }
      },
      checkFocusIn = function(event)
      {
        var target = getActualTarget(event),
          targetContained = findContainerIndex(target, event) >= 0;
        if (targetContained || target instanceof Document) targetContained && (state.mostRecentlyFocusedNode = target);
        else
        {
          event.stopImmediatePropagation();
          var nextNode, navAcrossContainers = !0;
          if (state.mostRecentlyFocusedNode)
            if (getTabIndex(state.mostRecentlyFocusedNode) > 0)
            {
              var mruContainerIdx = findContainerIndex(state.mostRecentlyFocusedNode),
                tabbableNodes = state.containerGroups[mruContainerIdx].tabbableNodes;
              if (tabbableNodes.length > 0)
              {
                var mruTabIdx = tabbableNodes.findIndex(function(node)
                {
                  return node === state.mostRecentlyFocusedNode
                });
                mruTabIdx >= 0 && (config.isKeyForward(state.recentNavEvent) ? mruTabIdx + 1 < tabbableNodes.length && (nextNode = tabbableNodes[mruTabIdx + 1], navAcrossContainers = !1) : mruTabIdx - 1 >= 0 && (nextNode = tabbableNodes[mruTabIdx - 1], navAcrossContainers = !1))
              }
            }
          else state.containerGroups.some(function(g)
          {
            return g.tabbableNodes.some(function(n)
            {
              return getTabIndex(n) > 0
            })
          }) || (navAcrossContainers = !1);
          else navAcrossContainers = !1;
          navAcrossContainers && (nextNode = findNextNavNode(
          {
            target: state.mostRecentlyFocusedNode,
            isBackward: config.isKeyBackward(state.recentNavEvent)
          })), tryFocus(nextNode || state.mostRecentlyFocusedNode || getInitialFocusNode())
        }
        state.recentNavEvent = void 0
      },
      checkKeyNav = function(event)
      {
        var isBackward = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
        state.recentNavEvent = event;
        var destinationNode = findNextNavNode(
        {
          event,
          isBackward
        });
        destinationNode && (isTabEvent(event) && event.preventDefault(), tryFocus(destinationNode))
      },
      checkKey = function(event)
      {
        if (isEscapeEvent(event) && valueOrHandler(config.escapeDeactivates, event) !== !1)
        {
          event.preventDefault(), trap.deactivate();
          return
        }(config.isKeyForward(event) || config.isKeyBackward(event)) && checkKeyNav(event, config.isKeyBackward(event))
      },
      checkClick = function(e)
      {
        var target = getActualTarget(e);
        findContainerIndex(target, e) >= 0 || valueOrHandler(config.clickOutsideDeactivates, e) || valueOrHandler(config.allowOutsideClick, e) || (e.preventDefault(), e.stopImmediatePropagation())
      },
      addListeners = function()
      {
        if (state.active) return activeFocusTraps.activateTrap(trapStack, trap), state.delayInitialFocusTimer = config.delayInitialFocus ? delay(function()
        {
          tryFocus(getInitialFocusNode())
        }) : tryFocus(getInitialFocusNode()), doc.addEventListener("focusin", checkFocusIn, !0), doc.addEventListener("mousedown", checkPointerDown,
        {
          capture: !0,
          passive: !1
        }), doc.addEventListener("touchstart", checkPointerDown,
        {
          capture: !0,
          passive: !1
        }), doc.addEventListener("click", checkClick,
        {
          capture: !0,
          passive: !1
        }), doc.addEventListener("keydown", checkKey,
        {
          capture: !0,
          passive: !1
        }), trap
      },
      removeListeners = function()
      {
        if (state.active) return doc.removeEventListener("focusin", checkFocusIn, !0), doc.removeEventListener("mousedown", checkPointerDown, !0), doc.removeEventListener("touchstart", checkPointerDown, !0), doc.removeEventListener("click", checkClick, !0), doc.removeEventListener("keydown", checkKey, !0), trap
      },
      checkDomRemoval = function(mutations)
      {
        var isFocusedNodeRemoved = mutations.some(function(mutation)
        {
          var removedNodes = Array.from(mutation.removedNodes);
          return removedNodes.some(function(node)
          {
            return node === state.mostRecentlyFocusedNode
          })
        });
        isFocusedNodeRemoved && tryFocus(getInitialFocusNode())
      },
      mutationObserver = typeof window < "u" && "MutationObserver" in window ? new MutationObserver(checkDomRemoval) : void 0,
      updateObservedNodes = function()
      {
        mutationObserver && (mutationObserver.disconnect(), state.active && !state.paused && state.containers.map(function(container)
        {
          mutationObserver.observe(container,
          {
            subtree: !0,
            childList: !0
          })
        }))
      };
    return trap = {
      get active()
      {
        return state.active
      },
      get paused()
      {
        return state.paused
      },
      activate: function(activateOptions)
      {
        if (state.active) return this;
        var onActivate = getOption(activateOptions, "onActivate"),
          onPostActivate = getOption(activateOptions, "onPostActivate"),
          checkCanFocusTrap = getOption(activateOptions, "checkCanFocusTrap");
        checkCanFocusTrap || updateTabbableNodes(), state.active = !0, state.paused = !1, state.nodeFocusedBeforeActivation = doc.activeElement, onActivate?.();
        var finishActivation = function()
        {
          checkCanFocusTrap && updateTabbableNodes(), addListeners(), updateObservedNodes(), onPostActivate?.()
        };
        return checkCanFocusTrap ? (checkCanFocusTrap(state.containers.concat()).then(finishActivation, finishActivation), this) : (finishActivation(), this)
      },
      deactivate: function(deactivateOptions)
      {
        if (!state.active) return this;
        var options = _objectSpread2(
        {
          onDeactivate: config.onDeactivate,
          onPostDeactivate: config.onPostDeactivate,
          checkCanReturnFocus: config.checkCanReturnFocus
        }, deactivateOptions);
        clearTimeout(state.delayInitialFocusTimer), state.delayInitialFocusTimer = void 0, removeListeners(), state.active = !1, state.paused = !1, updateObservedNodes(), activeFocusTraps.deactivateTrap(trapStack, trap);
        var onDeactivate = getOption(options, "onDeactivate"),
          onPostDeactivate = getOption(options, "onPostDeactivate"),
          checkCanReturnFocus = getOption(options, "checkCanReturnFocus"),
          returnFocus = getOption(options, "returnFocus", "returnFocusOnDeactivate");
        onDeactivate?.();
        var finishDeactivation = function()
        {
          delay(function()
          {
            returnFocus && tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation)), onPostDeactivate?.()
          })
        };
        return returnFocus && checkCanReturnFocus ? (checkCanReturnFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation)).then(finishDeactivation, finishDeactivation), this) : (finishDeactivation(), this)
      },
      pause: function(pauseOptions)
      {
        if (state.paused || !state.active) return this;
        var onPause = getOption(pauseOptions, "onPause"),
          onPostPause = getOption(pauseOptions, "onPostPause");
        return state.paused = !0, onPause?.(), removeListeners(), updateObservedNodes(), onPostPause?.(), this
      },
      unpause: function(unpauseOptions)
      {
        if (!state.paused || !state.active) return this;
        var onUnpause = getOption(unpauseOptions, "onUnpause"),
          onPostUnpause = getOption(unpauseOptions, "onPostUnpause");
        return state.paused = !1, onUnpause?.(), updateTabbableNodes(), addListeners(), updateObservedNodes(), onPostUnpause?.(), this
      },
      updateContainerElements: function(containerElements)
      {
        var elementsAsArray = [].concat(containerElements).filter(Boolean);
        return state.containers = elementsAsArray.map(function(element)
        {
          return typeof element == "string" ? doc.querySelector(element) : element
        }), state.active && updateTabbableNodes(), updateObservedNodes(), this
      }
    }, trap.updateContainerElements(elements), trap
  };

function filterShopifyEvent(event, domElement, callback)
{
  let executeCallback = !1;
  event.type.includes("shopify:section") ? domElement.hasAttribute("section") && domElement.getAttribute("section") === event.detail.sectionId && (executeCallback = !0) : event.type.includes("shopify:block") && event.target === domElement && (executeCallback = !0), executeCallback && callback(event)
}
var OpenableElement = class extends CustomHTMLElement
{
  static get observedAttributes()
  {
    return ["open"]
  }
  constructor()
  {
    if (super(), Shopify.designMode && (this.rootDelegate.on("shopify:section:select", event => filterShopifyEvent(event, this, () => this.open = !0)), this.rootDelegate.on("shopify:section:deselect", event => filterShopifyEvent(event, this, () => this.open = !1))), this.hasAttribute("append-body"))
    {
      const existingNode = document.getElementById(this.id);
      this.removeAttribute("append-body"), existingNode && existingNode !== this ? (existingNode.replaceWith(this.cloneNode(!0)), this.remove()) : document.body.appendChild(this)
    }
  }
  connectedCallback()
  {
    this.delegate.on("click", ".openable__overlay", () => this.open = !1), this.delegate.on("click", '[data-action="close"]', event =>
    {
      event.stopPropagation(), this.open = !1
    })
  }
  get requiresLoading()
  {
    return this.hasAttribute("href")
  }
  get open()
  {
    return this.hasAttribute("open")
  }
  set open(value)
  {
    value ? (async () => (await this._load(), this.clientWidth, this.setAttribute("open", "")))() : this.removeAttribute("open")
  }
  get shouldTrapFocus()
  {
    return !0
  }
  get returnFocusOnDeactivate()
  {
    return !this.hasAttribute("return-focus") || this.getAttribute("return-focus") === "true"
  }
  get focusTrap()
  {
    return this._focusTrap = this._focusTrap || createFocusTrap(this,
    {
      fallbackFocus: this,
      initialFocus: this.hasAttribute("initial-focus-selector") ? this.getAttribute("initial-focus-selector") : void 0,
      clickOutsideDeactivates: event => !(event.target.hasAttribute("aria-controls") && event.target.getAttribute("aria-controls") === this.id),
      allowOutsideClick: event => event.target.hasAttribute("aria-controls") && event.target.getAttribute("aria-controls") === this.id,
      returnFocusOnDeactivate: this.returnFocusOnDeactivate,
      onDeactivate: () => this.open = !1,
      preventScroll: !0
    })
  }
  attributeChangedCallback(name, oldValue, newValue)
  {
    switch (name)
    {
      case "open":
        oldValue === null && newValue === "" ? (this.shouldTrapFocus && setTimeout(() => this.focusTrap.activate(), 150), triggerEvent(this, "openable-element:open")) : newValue === null && (this.shouldTrapFocus && this.focusTrap.deactivate(), triggerEvent(this, "openable-element:close"))
    }
  }
  async _load()
  {
    if (!this.requiresLoading) return;
    triggerNonBubblingEvent(this, "openable-element:load:start");
    const response = await fetch(this.getAttribute("href")),
      element = document.createElement("div");
    element.innerHTML = await response.text(), this.innerHTML = element.querySelector(this.tagName.toLowerCase()).innerHTML, this.removeAttribute("href"), triggerNonBubblingEvent(this, "openable-element:load:end")
  }
};
window.customElements.define("openable-element", OpenableElement);
var CollapsibleContent = class extends OpenableElement
{
  constructor()
  {
    super(), this.ignoreNextTransition = this.open, this.addEventListener("shopify:block:select", () => this.open = !0), this.addEventListener("shopify:block:deselect", () => this.open = !1)
  }
  get animateItems()
  {
    return this.hasAttribute("animate-items")
  }
  attributeChangedCallback(name)
  {
    if (this.ignoreNextTransition) return this.ignoreNextTransition = !1;
    switch (name)
    {
      case "open":
        this.style.overflow = "hidden";
        const keyframes = {
          height: ["0px", `${this.scrollHeight}px`],
          visibility: ["hidden", "visible"]
        };
        this.animateItems && (keyframes.opacity = this.open ? [0, 0] : [0, 1]), this.animate(keyframes,
        {
          duration: 500,
          direction: this.open ? "normal" : "reverse",
          easing: "cubic-bezier(0.75, 0, 0.175, 1)"
        }).onfinish = () =>
        {
          this.style.overflow = this.open ? "visible" : "hidden"
        }, this.animateItems && this.open && this.animate(
        {
          opacity: [0, 1],
          transform: ["translateY(10px)", "translateY(0)"]
        },
        {
          duration: 250,
          delay: 250,
          easing: "cubic-bezier(0.75, 0, 0.175, 1)"
        }), triggerEvent(this, this.open ? "openable-element:open" : "openable-element:close")
    }
  }
};
window.customElements.define("collapsible-content", CollapsibleContent);
var ConfirmButton = class extends HTMLButtonElement
{
  connectedCallback()
  {
    this.addEventListener("click", event =>
    {
      window.confirm(this.getAttribute("data-message") || "Are you sure you wish to do this?") || event.preventDefault()
    })
  }
};
window.customElements.define("confirm-button", ConfirmButton,
{
  extends: "button"
});
var LoaderButtonMixin = {
    _prepareButton()
    {
      this.originalContent = this.innerHTML, this._startTransitionPromise = null, this.innerHTML = `
      <span class="loader-button__text">${this.innerHTML}</span>
      <span class="loader-button__loader" hidden>
        <div class="spinner">
          <svg focusable="false" width="24" height="24" class="icon icon--spinner" viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle>
          </svg>
        </div>
      </span>
    `, this.textElement = this.firstElementChild, this.spinnerElement = this.lastElementChild, window.addEventListener("pagehide", () => this.removeAttribute("aria-busy"))
    },
    _startTransition()
    {
      const textAnimation = this.textElement.animate(
      {
        opacity: [1, 0],
        transform: ["translateY(0)", "translateY(-10px)"]
      },
      {
        duration: 75,
        easing: "ease",
        fill: "forwards"
      });
      this.spinnerElement.hidden = !1;
      const spinnerAnimation = this.spinnerElement.animate(
      {
        opacity: [0, 1],
        transform: ["translate(-50%, 0%)", "translate(-50%, -50%)"]
      },
      {
        duration: 75,
        delay: 75,
        easing: "ease",
        fill: "forwards"
      });
      this._startTransitionPromise = Promise.all([new Promise(resolve => textAnimation.onfinish = () => resolve()), new Promise(resolve => spinnerAnimation.onfinish = () => resolve())])
    },
    async _endTransition()
    {
      this._startTransitionPromise && (await this._startTransitionPromise, this.spinnerElement.animate(
      {
        opacity: [1, 0],
        transform: ["translate(-50%, -50%)", "translate(-50%, -100%)"]
      },
      {
        duration: 75,
        delay: 100,
        easing: "ease",
        fill: "forwards"
      }).onfinish = () => this.spinnerElement.hidden = !0, this.textElement.animate(
      {
        opacity: [0, 1],
        transform: ["translateY(10px)", "translateY(0)"]
      },
      {
        duration: 75,
        delay: 175,
        easing: "ease",
        fill: "forwards"
      }), this._startTransitionPromise = null)
    }
  },
  LoaderButton = class extends HTMLButtonElement
  {
    static get observedAttributes()
    {
      return ["aria-busy"]
    }
    constructor()
    {
      super(), this.addEventListener("click", event =>
      {
        this.type === "submit" && this.form && this.form.checkValidity() && !this.form.hasAttribute("is") && (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) ? (event.preventDefault(), this.setAttribute("aria-busy", "true"), setTimeout(() => this.form.submit(), 250)) : this.setAttribute("aria-busy", "true"))
      })
    }
    connectedCallback()
    {
      this._prepareButton()
    }
    disconnectedCallback()
    {
      this.innerHTML = this.originalContent
    }
    attributeChangedCallback(property, oldValue, newValue)
    {
      property === "aria-busy" && (newValue === "true" ? this._startTransition() : this._endTransition())
    }
  };
Object.assign(LoaderButton.prototype, LoaderButtonMixin), window.customElements.define("loader-button", LoaderButton,
{
  extends: "button"
});
var PagePagination = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.hasAttribute("ajax") && this.delegate.on("click", "a", this._onLinkClicked.bind(this))
  }
  _onLinkClicked(event, target)
  {
    event.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set("page", target.getAttribute("data-page")), triggerEvent(this, "pagination:page-changed",
    {
      url: url.toString()
    })
  }
};
window.customElements.define("page-pagination", PagePagination);
var ToggleButton = class extends HTMLButtonElement
{
  static get observedAttributes()
  {
    return ["aria-expanded", "aria-busy"]
  }
  constructor()
  {
    super(), this.hasAttribute("loader") && this._prepareButton(), this.addEventListener("click", this._onButtonClick.bind(this)), this.rootDelegate = new main_default(document.documentElement)
  }
  _onButtonClick()
  {
    this.isExpanded = !this.isExpanded
  }
  connectedCallback()
  {
    document.addEventListener("openable-element:close", event =>
    {
      this.controlledElement === event.target && (this.isExpanded = !1, event.stopPropagation())
    }), document.addEventListener("openable-element:open", event =>
    {
      this.controlledElement === event.target && (this.isExpanded = !0, event.stopPropagation())
    }), this.rootDelegate.on("openable-element:load:start", `#${this.getAttribute("aria-controls")}`, () =>
    {
      this.classList.contains("button") ? this.setAttribute("aria-busy", "true") : this.offsetParent !== null && triggerEvent(document.documentElement, "theme:loading:start")
    }, !0), this.rootDelegate.on("openable-element:load:end", `#${this.getAttribute("aria-controls")}`, () =>
    {
      this.classList.contains("button") ? this.removeAttribute("aria-busy") : this.offsetParent !== null && triggerEvent(document.documentElement, "theme:loading:end")
    }, !0)
  }
  disconnectedCallback()
  {
    this.rootDelegate.destroy()
  }
  get isExpanded()
  {
    return this.getAttribute("aria-expanded") === "true"
  }
  set isExpanded(value)
  {
    this.setAttribute("aria-expanded", value ? "true" : "false")
  }
  get controlledElement()
  {
    return document.getElementById(this.getAttribute("aria-controls"))
  }
  attributeChangedCallback(name, oldValue, newValue)
  {
    switch (name)
    {
      case "aria-expanded":
        oldValue === "false" && newValue === "true" ? this.controlledElement.open = !0 : oldValue === "true" && newValue === "false" && (this.controlledElement.open = !1);
        break;
      case "aria-busy":
        this.hasAttribute("loader") && (newValue === "true" ? this._startTransition() : this._endTransition());
        break
    }
  }
};
Object.assign(ToggleButton.prototype, LoaderButtonMixin), window.customElements.define("toggle-button", ToggleButton,
{
  extends: "button"
});
var ToggleLink = class extends HTMLAnchorElement
{
  static get observedAttributes()
  {
    return ["aria-expanded"]
  }
  constructor()
  {
    super(), this.addEventListener("click", event =>
    {
      event.preventDefault(), this.isExpanded = !this.isExpanded
    }), this.rootDelegate = new main_default(document.documentElement)
  }
  connectedCallback()
  {
    this.rootDelegate.on("openable-element:close", `#${this.getAttribute("aria-controls")}`, event =>
    {
      this.controlledElement === event.target && (this.isExpanded = !1)
    }, !0), this.rootDelegate.on("openable-element:open", `#${this.getAttribute("aria-controls")}`, event =>
    {
      this.controlledElement === event.target && (this.isExpanded = !0)
    }, !0)
  }
  disconnectedCallback()
  {
    this.rootDelegate.destroy()
  }
  get isExpanded()
  {
    return this.getAttribute("aria-expanded") === "true"
  }
  set isExpanded(value)
  {
    this.setAttribute("aria-expanded", value ? "true" : "false")
  }
  get controlledElement()
  {
    return document.querySelector(`#${this.getAttribute("aria-controls")}`)
  }
  attributeChangedCallback(name, oldValue, newValue)
  {
    switch (name)
    {
      case "aria-expanded":
        oldValue === "false" && newValue === "true" ? this.controlledElement.open = !0 : oldValue === "true" && newValue === "false" && (this.controlledElement.open = !1)
    }
  }
};
window.customElements.define("toggle-link", ToggleLink,
{
  extends: "a"
});
var PageDots = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.buttons = Array.from(this.querySelectorAll("button")), this.delegate.on("click", "button", (event, target) =>
    {
      this._dispatchEvent(this.buttons.indexOf(target))
    }), this.hasAttribute("animation-timer") && this.delegate.on("animationend", event =>
    {
      event.elapsedTime > 0 && this._dispatchEvent((this.selectedIndex + 1 + this.buttons.length) % this.buttons.length)
    })
  }
  get selectedIndex()
  {
    return this.buttons.findIndex(button => button.getAttribute("aria-current") === "true")
  }
  set selectedIndex(selectedIndex)
  {
    if (this.buttons.forEach((button, index) => button.setAttribute("aria-current", selectedIndex === index ? "true" : "false")), this.hasAttribute("align-selected"))
    {
      const selectedItem = this.buttons[selectedIndex],
        windowHalfWidth = window.innerWidth / 2,
        boundingRect = selectedItem.getBoundingClientRect(),
        scrollableElement = this._findFirstScrollableElement(this.parentElement);
      scrollableElement && scrollableElement.scrollTo(
      {
        behavior: "smooth",
        left: scrollableElement.scrollLeft + (boundingRect.left - windowHalfWidth) + boundingRect.width / 2
      })
    }
  }
  _dispatchEvent(index)
  {
    index !== this.selectedIndex && this.dispatchEvent(new CustomEvent("page-dots:changed",
    {
      bubbles: !0,
      detail:
      {
        index
      }
    }))
  }
  _findFirstScrollableElement(item, currentDepth = 0)
  {
    return item === null || currentDepth > 3 ? null : item.scrollWidth > item.clientWidth ? item : this._findFirstScrollableElement(item.parentElement, currentDepth + 1)
  }
};
window.customElements.define("page-dots", PageDots);
var PrevNextButtons = class extends HTMLElement
  {
    connectedCallback()
    {
      this.prevButton = this.querySelector("button:first-of-type"), this.nextButton = this.querySelector("button:last-of-type"), this.prevButton.addEventListener("click", () => this.prevButton.dispatchEvent(new CustomEvent("prev-next:prev",
      {
        bubbles: !0
      }))), this.nextButton.addEventListener("click", () => this.nextButton.dispatchEvent(new CustomEvent("prev-next:next",
      {
        bubbles: !0
      })))
    }
    set isPrevDisabled(value)
    {
      this.prevButton.disabled = value
    }
    set isNextDisabled(value)
    {
      this.nextButton.disabled = value
    }
  },
  PrevButton = class extends HTMLButtonElement
  {
    connectedCallback()
    {
      this.addEventListener("click", () => this.dispatchEvent(new CustomEvent("prev-next:prev",
      {
        bubbles: !0
      })))
    }
  },
  NextButton = class extends HTMLButtonElement
  {
    connectedCallback()
    {
      this.addEventListener("click", () => this.dispatchEvent(new CustomEvent("prev-next:next",
      {
        bubbles: !0
      })))
    }
  };
window.customElements.define("prev-next-buttons", PrevNextButtons), window.customElements.define("prev-button", PrevButton,
{
  extends: "button"
}), window.customElements.define("next-button", NextButton,
{
  extends: "button"
});

function getStickyHeaderOffset()
{
  const documentStyles = getComputedStyle(document.documentElement);
  return parseInt(documentStyles.getPropertyValue("--header-height") || 0) * parseInt(documentStyles.getPropertyValue("--enable-sticky-header") || 0) + parseInt(documentStyles.getPropertyValue("--announcement-bar-height") || 0) * parseInt(documentStyles.getPropertyValue("--enable-sticky-announcement-bar") || 0)
}
var SafeSticky = class extends HTMLElement
{
  connectedCallback()
  {
    this.lastKnownY = window.scrollY, this.currentTop = 0, this.hasPendingRaf = !1, window.addEventListener("scroll", this._checkPosition.bind(this))
  }
  get initialTopOffset()
  {
    return getStickyHeaderOffset() + (parseInt(this.getAttribute("offset")) || 0)
  }
  _checkPosition()
  {
    this.hasPendingRaf || (this.hasPendingRaf = !0, requestAnimationFrame(() =>
    {
      let bounds = this.getBoundingClientRect(),
        maxTop = bounds.top + window.scrollY - this.offsetTop + this.initialTopOffset,
        minTop = this.clientHeight - window.innerHeight;
      window.scrollY < this.lastKnownY ? this.currentTop -= window.scrollY - this.lastKnownY : this.currentTop += this.lastKnownY - window.scrollY, this.currentTop = Math.min(Math.max(this.currentTop, -minTop), maxTop, this.initialTopOffset), this.lastKnownY = window.scrollY, this.style.top = `${this.currentTop}px`, this.hasPendingRaf = !1
    }))
  }
};
window.customElements.define("safe-sticky", SafeSticky);

function throttle(callback, delay3 = 15)
{
  let throttleTimeout = null,
    storedEvent = null;
  const throttledEventHandler = event =>
  {
    storedEvent = event, !throttleTimeout && (callback(storedEvent), storedEvent = null, throttleTimeout = setTimeout(() =>
    {
      throttleTimeout = null, storedEvent && throttledEventHandler(storedEvent)
    }, delay3))
  };
  return throttledEventHandler
}
var ScrollSpy = class extends HTMLElement
{
  connectedCallback()
  {
    this._createSvg(), this.elementsToObserve = Array.from(this.querySelectorAll("a")).map(linkElement => document.querySelector(linkElement.getAttribute("href"))), this.navListItems = Array.from(this.querySelectorAll("li")), this.navItems = this.navListItems.map(listItem =>
    {
      const anchor = listItem.firstElementChild,
        targetID = anchor && anchor.getAttribute("href").slice(1),
        target = document.getElementById(targetID);
      return {
        listItem,
        anchor,
        target
      }
    }).filter(item => item.target), this.drawPath(), window.addEventListener("scroll", throttle(this.markVisibleSection.bind(this), 25)), window.addEventListener("orientationchange", () =>
    {
      window.addEventListener("resize", () =>
      {
        this.drawPath(), this.markVisibleSection()
      },
      {
        once: !0
      })
    }), this.markVisibleSection()
  }
  _createSvg()
  {
    this.navPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.insertAdjacentElement("beforeend", this.navPath), this.insertAdjacentElement("beforeend", svgElement), this.lastPathStart = this.lastPathEnd = null
  }
  drawPath()
  {
    let path = [],
      pathIndent;
    this.navItems.forEach((item, i) =>
    {
      const x = item.anchor.offsetLeft - 5,
        y = item.anchor.offsetTop,
        height = item.anchor.offsetHeight;
      i === 0 ? (path.push("M", x, y, "L", x, y + height), item.pathStart = 0) : (pathIndent !== x && path.push("L", pathIndent, y), path.push("L", x, y), this.navPath.setAttribute("d", path.join(" ")), item.pathStart = this.navPath.getTotalLength() || 0, path.push("L", x, y + height)), pathIndent = x, this.navPath.setAttribute("d", path.join(" ")), item.pathEnd = this.navPath.getTotalLength()
    })
  }
  syncPath()
  {
    const someElsAreVisible = () => this.querySelectorAll(".is-visible").length > 0,
      thisElIsVisible = el => el.classList.contains("is-visible"),
      pathLength = this.navPath.getTotalLength();
    let pathStart = pathLength,
      pathEnd = 0;
    if (this.navItems.forEach(item =>
      {
        thisElIsVisible(item.listItem) && (pathStart = Math.min(item.pathStart, pathStart), pathEnd = Math.max(item.pathEnd, pathEnd))
      }), someElsAreVisible() && pathStart < pathEnd)
    {
      if (pathStart !== this.lastPathStart || pathEnd !== this.lastPathEnd)
      {
        const dashArray = `1 ${pathStart} ${pathEnd-pathStart} ${pathLength}`;
        this.navPath.style.setProperty("stroke-dashoffset", "1"), this.navPath.style.setProperty("stroke-dasharray", dashArray), this.navPath.style.setProperty("opacity", "1")
      }
    }
    else this.navPath.style.setProperty("opacity", "0");
    this.lastPathStart = pathStart, this.lastPathEnd = pathEnd
  }
  markVisibleSection()
  {
    this.navListItems.forEach(item => item.classList.remove("is-visible"));
    for (const [index, elementToObserve] of this.elementsToObserve.entries())
      if (elementToObserve.getBoundingClientRect().top > getStickyHeaderOffset() || index === this.elementsToObserve.length - 1)
      {
        this.querySelector(`a[href="#${elementToObserve.id}"]`).parentElement.classList.add("is-visible");
        break
      } this.syncPath()
  }
};
window.customElements.define("scroll-spy", ScrollSpy);
var template = `
  <style>
    :host {
      display: inline-block;
      contain: layout;
      position: relative;
    }
    
    :host([hidden]) {
      display: none;
    }
    
    s {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      pointer-events: none;
      background-image:
        var(--scroll-shadow-top, radial-gradient(farthest-side at 50% 0%, rgba(0,0,0,.2), rgba(0,0,0,0))),
        var(--scroll-shadow-bottom, radial-gradient(farthest-side at 50% 100%, rgba(0,0,0,.2), rgba(0,0,0,0))),
        var(--scroll-shadow-left, radial-gradient(farthest-side at 0%, rgba(0,0,0,.2), rgba(0,0,0,0))),
        var(--scroll-shadow-right, radial-gradient(farthest-side at 100%, rgba(0,0,0,.2), rgba(0,0,0,0)));
      background-position: top, bottom, left, right;
      background-repeat: no-repeat;
      background-size: 100% var(--top, 0), 100% var(--bottom, 0), var(--left, 0) 100%, var(--right, 0) 100%;
    }
  </style>
  <slot></slot>
  <s></s>
`,
  Updater = class
  {
    constructor(targetElement)
    {
      this.scheduleUpdate = throttle(() => this.update(targetElement, getComputedStyle(targetElement))), this.resizeObserver = new ResizeObserver(this.scheduleUpdate.bind(this))
    }
    start(element)
    {
      this.element && this.stop(), element && (element.addEventListener("scroll", this.scheduleUpdate), this.resizeObserver.observe(element), this.element = element)
    }
    stop()
    {
      this.element && (this.element.removeEventListener("scroll", this.scheduleUpdate), this.resizeObserver.unobserve(this.element), this.element = null)
    }
    update(targetElement, style)
    {
      if (!this.element) return;
      const maxSize = style.getPropertyValue("--scroll-shadow-size") ? parseInt(style.getPropertyValue("--scroll-shadow-size")) : 0,
        scroll = {
          top: Math.max(this.element.scrollTop, 0),
          bottom: Math.max(this.element.scrollHeight - this.element.offsetHeight - this.element.scrollTop, 0),
          left: Math.max(this.element.scrollLeft, 0),
          right: Math.max(this.element.scrollWidth - this.element.offsetWidth - this.element.scrollLeft, 0)
        };
      requestAnimationFrame(() =>
      {
        for (const position of ["top", "bottom", "left", "right"]) targetElement.style.setProperty(`--${position}`, `${scroll[position]>maxSize?maxSize:scroll[position]}px`)
      })
    }
  },
  ScrollShadow = class extends HTMLElement
  {
    constructor()
    {
      super(), this.attachShadow(
      {
        mode: "open"
      }).innerHTML = template, this.updater = new Updater(this.shadowRoot.lastElementChild)
    }
    connectedCallback()
    {
      this.shadowRoot.querySelector("slot").addEventListener("slotchange", () => this.start()), this.start()
    }
    disconnectedCallback()
    {
      this.updater.stop()
    }
    start()
    {
      this.updater.start(this.firstElementChild)
    }
  };
"ResizeObserver" in window && window.customElements.define("scroll-shadow", ScrollShadow);
var ShareToggleButton = class extends ToggleButton
{
  _onButtonClick()
  {
    window.matchMedia(window.themeVariables.breakpoints.phone).matches && navigator.share ? navigator.share(
    {
      title: this.hasAttribute("share-title") ? this.getAttribute("share-title") : document.title,
      url: this.hasAttribute("share-url") ? this.getAttribute("share-url") : window.location.href
    }) : super._onButtonClick()
  }
};
window.customElements.define("share-toggle-button", ShareToggleButton,
{
  extends: "button"
});
var NativeCarousel = class extends CustomHTMLElement
  {
    connectedCallback()
    {
      this.items = Array.from(this.querySelectorAll("native-carousel-item")), this.pageDotsElements = Array.from(this.querySelectorAll("page-dots")), this.prevNextButtonsElements = Array.from(this.querySelectorAll("prev-next-buttons")), this.items.length > 1 && (this.addEventListener("prev-next:prev", this.prev.bind(this)), this.addEventListener("prev-next:next", this.next.bind(this)), this.addEventListener("page-dots:changed", event => this.select(event.detail.index, !0)), Shopify.designMode && this.addEventListener("shopify:block:select", event => this.select(event.target.index, !event.detail.load)));
      const scrollerElement = this.items[0].parentElement;
      this.intersectionObserver = new IntersectionObserver(this._onVisibilityChanged.bind(this),
      {
        root: scrollerElement,
        rootMargin: `${scrollerElement.clientHeight}px 0px`,
        threshold: .8
      }), this.items.forEach(item => this.intersectionObserver.observe(item))
    }
    disconnectedCallback()
    {
      super.disconnectedCallback(), this.intersectionObserver.disconnect()
    }
    get selectedIndex()
    {
      return this.items.findIndex(item => item.selected)
    }
    prev(shouldAnimate = !0)
    {
      this.select(Math.max(this.selectedIndex - 1, 0), shouldAnimate)
    }
    next(shouldAnimate = !0)
    {
      this.select(Math.min(this.selectedIndex + 1, this.items.length - 1), shouldAnimate)
    }
    select(index, shouldAnimate = !0)
    {
      const clampIndex = Math.max(0, Math.min(index, this.items.length)),
        selectedElement = this.items[clampIndex];
      this._adjustNavigationForElement(selectedElement), shouldAnimate && (this.items.forEach(item => this.intersectionObserver.unobserve(item)), setInterval(() =>
      {
        this.items.forEach(item => this.intersectionObserver.observe(item))
      }, 800)), this.items.forEach((item, loopIndex) => item.selected = loopIndex === clampIndex);
      const direction = window.themeVariables.settings.direction === "ltr" ? 1 : -1;
      selectedElement.parentElement.scrollTo(
      {
        left: direction * (selectedElement.clientWidth * clampIndex),
        behavior: shouldAnimate ? "smooth" : "auto"
      })
    }
    _adjustNavigationForElement(selectedElement)
    {
      this.items.forEach(item => item.selected = selectedElement === item), this.pageDotsElements.forEach(pageDot => pageDot.selectedIndex = selectedElement.index), this.prevNextButtonsElements.forEach(prevNextButton =>
      {
        prevNextButton.isPrevDisabled = selectedElement.index === 0, prevNextButton.isNextDisabled = selectedElement.index === this.items.length - 1
      })
    }
    _onVisibilityChanged(entries)
    {
      for (let entry of entries)
        if (entry.isIntersecting)
        {
          this._adjustNavigationForElement(entry.target);
          break
        }
    }
  },
  NativeCarouselItem = class extends CustomHTMLElement
  {
    static get observedAttributes()
    {
      return ["hidden"]
    }
    get index()
    {
      return [...this.parentNode.children].indexOf(this)
    }
    get selected()
    {
      return !this.hasAttribute("hidden")
    }
    set selected(value)
    {
      this.hidden = !value
    }
  };
window.customElements.define("native-carousel-item", NativeCarouselItem), window.customElements.define("native-carousel", NativeCarousel);
var DragCursor = class extends HTMLElement
{
  connectedCallback()
  {
    this.scrollableElement = this.parentElement, this.scrollableElement.addEventListener("mouseenter", this._onMouseEnter.bind(this)), this.scrollableElement.addEventListener("mousemove", this._onMouseMove.bind(this)), this.scrollableElement.addEventListener("mouseleave", this._onMouseLeave.bind(this)), this.innerHTML = `
      <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <path d="M0 60C0 26.863 26.863 0 60 0s60 26.863 60 60-26.863 60-60 60S0 93.137 0 60z" fill="rgb(var(--text-color))"/>
        <path d="M46 50L36 60l10 10M74 50l10 10-10 10" stroke="rgb(var(--section-background))" stroke-width="4"/>
      </svg>
    `
  }
  _onMouseEnter(event)
  {
    this.removeAttribute("hidden"), this._positionCursor(event)
  }
  _onMouseLeave()
  {
    this.setAttribute("hidden", "")
  }
  _onMouseMove(event)
  {
    this.toggleAttribute("hidden", event.target.tagName === "BUTTON" || event.target.tagName === "A"), this._positionCursor(event)
  }
  _positionCursor(event)
  {
    const elementBoundingRect = this.scrollableElement.getBoundingClientRect(),
      x = event.clientX - elementBoundingRect.x,
      y = event.clientY - elementBoundingRect.y;
    this.style.transform = `translate(${x-this.clientWidth/2}px, ${y-this.clientHeight/2}px)`
  }
};
window.customElements.define("drag-cursor", DragCursor);
var ScrollableContent = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.draggable && this._setupDraggability(), this._checkScrollability(), window.addEventListener("resize", this._checkScrollability.bind(this)), this.addEventListener("scroll", throttle(this._calculateProgress.bind(this), 15))
  }
  get draggable()
  {
    return this.hasAttribute("draggable")
  }
  _setupDraggability()
  {
    this.insertAdjacentHTML("afterend", '<drag-cursor hidden class="custom-drag-cursor"></drag-cursor>');
    const mediaQuery = matchMedia("(hover: none)");
    mediaQuery.addListener(this._onMediaChanges.bind(this)), mediaQuery.matches || this._attachDraggableListeners()
  }
  _attachDraggableListeners()
  {
    this.delegate.on("mousedown", this._onMouseDown.bind(this)), this.delegate.on("mousemove", this._onMouseMove.bind(this)), this.delegate.on("mouseup", this._onMouseUp.bind(this))
  }
  _removeDraggableListeners()
  {
    this.delegate.off("mousedown"), this.delegate.off("mousemove"), this.delegate.off("mouseup")
  }
  _checkScrollability()
  {
    this.classList.toggle("is-scrollable", this.scrollWidth > this.offsetWidth)
  }
  _calculateProgress()
  {
    const scrollLeft = this.scrollLeft * (window.themeVariables.settings.direction === "ltr" ? 1 : -1),
      progress = Math.max(0, Math.min(1, scrollLeft / (this.scrollWidth - this.clientWidth))) * 100;
    triggerEvent(this, "scrollable-content:progress",
    {
      progress
    })
  }
  _onMediaChanges(event)
  {
    event.matches ? this._removeDraggableListeners() : this._attachDraggableListeners()
  }
  _onMouseDown(event)
  {
    event.target && event.target.nodeName === "IMG" && event.preventDefault(), this.startX = event.clientX + this.scrollLeft, this.diffX = 0, this.drag = !0
  }
  _onMouseMove(event)
  {
    this.drag && (this.diffX = this.startX - (event.clientX + this.scrollLeft), this.scrollLeft += this.diffX)
  }
  _onMouseUp()
  {
    this.drag = !1;
    let start = 1,
      animate = () =>
      {
        let step = Math.sinh(start);
        step <= 0 ? window.cancelAnimationFrame(animate) : (this.scrollLeft += this.diffX * step, start -= .03, window.requestAnimationFrame(animate))
      };
    animate()
  }
};
window.customElements.define("scrollable-content", ScrollableContent);
var LoadingBar = class extends CustomHTMLElement
{
  constructor()
  {
    super(), this.rootDelegate.on("theme:loading:start", this.show.bind(this)), this.rootDelegate.on("theme:loading:end", this.hide.bind(this)), this.delegate.on("transitionend", this._onTransitionEnd.bind(this))
  }
  show()
  {
    this.classList.add("is-visible"), this.style.transform = "scaleX(0.4)"
  }
  hide()
  {
    this.style.transform = "scaleX(1)", this.classList.add("is-finished")
  }
  _onTransitionEnd(event)
  {
    event.propertyName === "transform" && this.classList.contains("is-finished") && (this.classList.remove("is-visible"), this.classList.remove("is-finished"), this.style.transform = "scaleX(0)")
  }
};
window.customElements.define("loading-bar", LoadingBar);
var SplitLines = class extends HTMLElement
{
  connectedCallback()
  {
    this.originalContent = this.textContent, this.lastWidth = window.innerWidth, this.hasBeenSplitted = !1, window.addEventListener("resize", this._onResize.bind(this))
  } [Symbol.asyncIterator]()
  {
    return {
      splitPromise: this.split.bind(this),
      index: 0,
      async next()
      {
        const lines = await this.splitPromise();
        return this.index !== lines.length ?
        {
          done: !1,
          value: lines[this.index++]
        } :
        {
          done: !0
        }
      }
    }
  }
  split(force = !1)
  {
    return this.childElementCount > 0 && !force ? Promise.resolve(Array.from(this.children)) : (this.hasBeenSplitted = !0, new Promise(resolve =>
    {
      requestAnimationFrame(() =>
      {
        this.innerHTML = this.originalContent.replace(/./g, "<span>$&</span>").replace(/\s/g, " ");
        const bounds = {};
        Array.from(this.children).forEach(child =>
        {
          const rect = parseInt(child.getBoundingClientRect().top);
          bounds[rect] = (bounds[rect] || "") + child.textContent
        }), this.innerHTML = Object.values(bounds).map(item => `<span ${this.hasAttribute("reveal")&&!force?"reveal":""} ${this.hasAttribute("reveal-visibility")&&!force?"reveal-visibility":""} style="display: block">${item.trim()}</span>`).join(""), this.style.opacity = this.hasAttribute("reveal") ? 1 : null, this.style.visibility = this.hasAttribute("reveal-visibility") ? "visible" : null, resolve(Array.from(this.children))
      })
    }))
  }
  async _onResize()
  {
    this.lastWidth === window.innerWidth || !this.hasBeenSplitted || (await this.split(!0), this.dispatchEvent(new CustomEvent("split-lines:re-split",
    {
      bubbles: !0
    })), this.lastWidth = window.innerWidth)
  }
};
window.customElements.define("split-lines", SplitLines);
var PopoverContent = class extends OpenableElement
{
  connectedCallback()
  {
    super.connectedCallback(), this.delegate.on("click", ".popover__overlay", () => this.open = !1)
  }
  attributeChangedCallback(name, oldValue, newValue)
  {
    switch (super.attributeChangedCallback(name, oldValue, newValue), name)
    {
      case "open":
        document.documentElement.classList.toggle("lock-mobile", this.open)
    }
  }
};
window.customElements.define("popover-content", PopoverContent);
var TabsNav = class extends HTMLElement
{
  connectedCallback()
  {
    this.buttons = Array.from(this.querySelectorAll("button[aria-controls]")), this.scrollerElement = this.querySelector(".tabs-nav__scroller"), this.buttons.forEach(button => button.addEventListener("click", () => this.selectButton(button))), this.addEventListener("shopify:block:select", event => this.selectButton(event.target, !event.detail.load)), this.positionElement = document.createElement("span"), this.positionElement.classList.add("tabs-nav__position"), this.buttons[0].parentElement.insertAdjacentElement("afterend", this.positionElement), window.addEventListener("resize", this._onWindowResized.bind(this)), this._adjustNavigationPosition(), this.hasArrows && this._handleArrows()
  }
  get hasArrows()
  {
    return this.hasAttribute("arrows")
  }
  get selectedTabIndex()
  {
    return this.buttons.findIndex(button => button.getAttribute("aria-expanded") === "true")
  }
  get selectedButton()
  {
    return this.buttons.find(button => button.getAttribute("aria-expanded") === "true")
  }
  selectButton(button, animate = !0)
  {
    if (!this.buttons.includes(button) || this.selectedButton === button) return;
    const from = document.getElementById(this.selectedButton.getAttribute("aria-controls")),
      to = document.getElementById(button.getAttribute("aria-controls"));
    animate ? this._transitionContent(from, to) : (from.hidden = !0, to.hidden = !1), this.selectedButton.setAttribute("aria-expanded", "false"), button.setAttribute("aria-expanded", "true"), triggerEvent(this, "tabs-nav:changed",
    {
      button
    }), this._adjustNavigationPosition()
  }
  addButton(button)
  {
    button.addEventListener("click", () => this.selectButton(button)), button.setAttribute("aria-expanded", "false"), this.buttons[this.buttons.length - 1].insertAdjacentElement("afterend", button), this.buttons.push(button), this._adjustNavigationPosition(!1)
  }
  _transitionContent(from, to)
  {
    from.animate(
    {
      opacity: [1, 0]
    },
    {
      duration: 250,
      easing: "ease"
    }).onfinish = () =>
    {
      from.hidden = !0, to.hidden = !1, to.animate(
      {
        opacity: [0, 1]
      },
      {
        duration: 250,
        easing: "ease"
      })
    }
  }
  _onWindowResized()
  {
    this._adjustNavigationPosition()
  }
  _adjustNavigationPosition(shouldAnimate = !0)
  {
    const scale = this.selectedButton.clientWidth / this.positionElement.parentElement.clientWidth,
      translate = this.selectedButton.offsetLeft / this.positionElement.parentElement.clientWidth / scale,
      windowHalfWidth = this.scrollerElement.clientWidth / 2;
    this.scrollerElement.scrollTo(
    {
      behavior: shouldAnimate ? "smooth" : "auto",
      left: this.selectedButton.offsetLeft - windowHalfWidth + this.selectedButton.clientWidth / 2
    }), shouldAnimate || (this.positionElement.style.transition = "none"), this.positionElement.style.setProperty("--scale", scale), this.positionElement.style.setProperty("--translate", `${translate*100}%`), this.positionElement.clientWidth, requestAnimationFrame(() =>
    {
      this.positionElement.classList.add("is-initialized"), this.positionElement.style.transition = null
    })
  }
  _handleArrows()
  {
    const arrowsContainer = this.querySelector(".tabs-nav__arrows");
    arrowsContainer.firstElementChild.addEventListener("click", () =>
    {
      this.selectButton(this.buttons[Math.max(this.selectedTabIndex - 1, 0)])
    }), arrowsContainer.lastElementChild.addEventListener("click", () =>
    {
      this.selectButton(this.buttons[Math.min(this.selectedTabIndex + 1, this.buttons.length - 1)])
    })
  }
};
window.customElements.define("tabs-nav", TabsNav);
var LibraryLoader = class
{
  static load(libraryName)
  {
    const STATUS_REQUESTED = "requested",
      STATUS_LOADED = "loaded",
      library = this.libraries[libraryName];
    if (!library) return;
    if (library.status === STATUS_REQUESTED) return library.promise;
    if (library.status === STATUS_LOADED) return Promise.resolve();
    let promise;
    return library.type === "script" ? promise = new Promise((resolve, reject) =>
    {
      let tag = document.createElement("script");
      tag.id = library.tagId, tag.src = library.src, tag.onerror = reject, tag.onload = () =>
      {
        library.status = STATUS_LOADED, resolve()
      }, document.body.appendChild(tag)
    }) : promise = new Promise((resolve, reject) =>
    {
      let tag = document.createElement("link");
      tag.id = library.tagId, tag.href = library.src, tag.rel = "stylesheet", tag.type = "text/css", tag.onerror = reject, tag.onload = () =>
      {
        library.status = STATUS_LOADED, resolve()
      }, document.body.appendChild(tag)
    }), library.promise = promise, library.status = STATUS_REQUESTED, promise
  }
};
__publicField(LibraryLoader, "libraries",
{
  flickity:
  {
    tagId: "flickity",
    src: window.themeVariables.libs.flickity,
    type: "script"
  },
  photoswipe:
  {
    tagId: "photoswipe",
    src: window.themeVariables.libs.photoswipe,
    type: "script"
  },
  qrCode:
  {
    tagId: "qrCode",
    src: window.themeVariables.libs.qrCode,
    type: "script"
  },
  modelViewerUiStyles:
  {
    tagId: "shopify-model-viewer-ui-styles",
    src: "https://cdn.shopify.com/shopifycloud/model-viewer-ui/assets/v1.0/model-viewer-ui.css",
    type: "link"
  }
});
var QrCode = class extends HTMLElement
{
  async connectedCallback()
  {
    await LibraryLoader.load("qrCode"), new window.QRCode(this,
    {
      text: this.getAttribute("identifier"),
      width: 200,
      height: 200
    })
  }
};
window.customElements.define("qr-code", QrCode);
var CountrySelector = class extends HTMLSelectElement
{
  connectedCallback()
  {
    if (this.provinceElement = document.getElementById(this.getAttribute("aria-owns")), this.addEventListener("change", this._updateProvinceVisibility.bind(this)), this.hasAttribute("data-default"))
    {
      for (let i = 0; i !== this.options.length; ++i)
        if (this.options[i].text === this.getAttribute("data-default"))
        {
          this.selectedIndex = i;
          break
        }
    }
    this._updateProvinceVisibility();
    const provinceSelectElement = this.provinceElement.tagName === "SELECT" ? this.provinceElement : this.provinceElement.querySelector("select");
    if (provinceSelectElement.hasAttribute("data-default"))
    {
      for (let i = 0; i !== provinceSelectElement.options.length; ++i)
        if (provinceSelectElement.options[i].text === provinceSelectElement.getAttribute("data-default"))
        {
          provinceSelectElement.selectedIndex = i;
          break
        }
    }
  }
  _updateProvinceVisibility()
  {
    const selectedOption = this.options[this.selectedIndex];
    if (!selectedOption) return;
    let provinces = JSON.parse(selectedOption.getAttribute("data-provinces") || "[]"),
      provinceSelectElement = this.provinceElement.tagName === "SELECT" ? this.provinceElement : this.provinceElement.querySelector("select");
    if (provinceSelectElement.innerHTML = "", provinces.length === 0)
    {
      this.provinceElement.hidden = !0;
      return
    }
    provinces.forEach(data =>
    {
      provinceSelectElement.options.add(new Option(data[1], data[0]))
    }), this.provinceElement.hidden = !1
  }
};
window.customElements.define("country-selector", CountrySelector,
{
  extends: "select"
});
var ModalContent = class extends OpenableElement
{
  connectedCallback()
  {
    super.connectedCallback(), this.appearAfterDelay && !(this.onlyOnce && this.hasAppearedOnce) && setTimeout(() => this.open = !0, this.apparitionDelay), this.delegate.on("click", ".modal__overlay", () => this.open = !1)
  }
  get appearAfterDelay()
  {
    return this.hasAttribute("apparition-delay")
  }
  get apparitionDelay()
  {
    return parseInt(this.getAttribute("apparition-delay") || 0) * 1e3
  }
  get onlyOnce()
  {
    return this.hasAttribute("only-once")
  }
  get hasAppearedOnce()
  {
    return localStorage.getItem("theme:popup-appeared") !== null
  }
  attributeChangedCallback(name, oldValue, newValue)
  {
    switch (super.attributeChangedCallback(name, oldValue, newValue), name)
    {
      case "open":
        document.documentElement.classList.toggle("lock-all", this.open), this.open && localStorage.setItem("theme:popup-appeared", !0)
    }
  }
};
window.customElements.define("modal-content", ModalContent);
var PriceRange = class extends HTMLElement
{
  connectedCallback()
  {
    this.rangeLowerBound = this.querySelector(".price-range__range-group input:first-child"), this.rangeHigherBound = this.querySelector(".price-range__range-group input:last-child"), this.textInputLowerBound = this.querySelector(".price-range__input:first-child input"), this.textInputHigherBound = this.querySelector(".price-range__input:last-child input"), this.textInputLowerBound.addEventListener("focus", () => this.textInputLowerBound.select()), this.textInputHigherBound.addEventListener("focus", () => this.textInputHigherBound.select()), this.textInputLowerBound.addEventListener("change", event =>
    {
      event.target.value = Math.max(Math.min(parseInt(event.target.value), parseInt(this.textInputHigherBound.value || event.target.max) - 1), event.target.min), this.rangeLowerBound.value = event.target.value, this.rangeLowerBound.parentElement.style.setProperty("--range-min", `${parseInt(this.rangeLowerBound.value)/parseInt(this.rangeLowerBound.max)*100}%`)
    }), this.textInputHigherBound.addEventListener("change", event =>
    {
      event.target.value = Math.min(Math.max(parseInt(event.target.value), parseInt(this.textInputLowerBound.value || event.target.min) + 1), event.target.max), this.rangeHigherBound.value = event.target.value, this.rangeHigherBound.parentElement.style.setProperty("--range-max", `${parseInt(this.rangeHigherBound.value)/parseInt(this.rangeHigherBound.max)*100}%`)
    }), this.rangeLowerBound.addEventListener("change", event =>
    {
      this.textInputLowerBound.value = event.target.value, this.textInputLowerBound.dispatchEvent(new Event("change",
      {
        bubbles: !0
      }))
    }), this.rangeHigherBound.addEventListener("change", event =>
    {
      this.textInputHigherBound.value = event.target.value, this.textInputHigherBound.dispatchEvent(new Event("change",
      {
        bubbles: !0
      }))
    }), this.rangeLowerBound.addEventListener("input", event =>
    {
      triggerEvent(this, "facet:abort-loading"), event.target.value = Math.min(parseInt(event.target.value), parseInt(this.textInputHigherBound.value || event.target.max) - 1), event.target.parentElement.style.setProperty("--range-min", `${parseInt(event.target.value)/parseInt(event.target.max)*100}%`), this.textInputLowerBound.value = event.target.value
    }), this.rangeHigherBound.addEventListener("input", event =>
    {
      triggerEvent(this, "facet:abort-loading"), event.target.value = Math.max(parseInt(event.target.value), parseInt(this.textInputLowerBound.value || event.target.min) + 1), event.target.parentElement.style.setProperty("--range-max", `${parseInt(event.target.value)/parseInt(event.target.max)*100}%`), this.textInputHigherBound.value = event.target.value
    })
  }
};
window.customElements.define("price-range", PriceRange);
var LinkBar = class extends HTMLElement
{
  connectedCallback()
  {
    const selectedItem = this.querySelector(".link-bar__link-item--selected");
    selectedItem && requestAnimationFrame(() =>
    {
      selectedItem.style.scrollSnapAlign = "none"
    })
  }
};
window.customElements.define("link-bar", LinkBar);
var MediaFeatures = class
  {
    static prefersReducedMotion()
    {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    }
    static supportsHover()
    {
      return window.matchMedia("(pointer: fine)").matches
    }
  },
  FlickityCarousel = class extends CustomHTMLElement
  {
    constructor()
    {
      super(), this.childElementCount !== 1 && (this.addEventListener("flickity:ready", this._preloadNextImage.bind(this)), this.addEventListener("flickity:slide-changed", this._preloadNextImage.bind(this)), this._createFlickity())
    }
    async disconnectedCallback()
    {
      this.flickity && (await this.flickity).destroy()
    }
    get flickityConfig()
    {
      return JSON.parse(this.getAttribute("flickity-config"))
    }
    get flickityInstance()
    {
      return this.flickity
    }
    async next()
    {
      (await this.flickityInstance).next()
    }
    async previous()
    {
      (await this.flickityInstance).previous()
    }
    async select(indexOrSelector)
    {
      (await this.flickityInstance).selectCell(indexOrSelector)
    }
    async setDraggable(draggable)
    {
      const flickityInstance = await this.flickity;
      flickityInstance.options.draggable = draggable, flickityInstance.updateDraggable()
    }
    async reload()
    {
      (await this.flickity).destroy(), this.flickityConfig.cellSelector && Array.from(this.children).sort((a, b) => parseInt(a.getAttribute("data-original-position")) > parseInt(b.getAttribute("data-original-position")) ? 1 : -1).forEach(node => this.appendChild(node)), this._createFlickity()
    }
    async _createFlickity()
    {
      this.flickity = new Promise(async resolve =>
      {
        await LibraryLoader.load("flickity"), await this.untilVisible(
        {
          rootMargin: "400px",
          threshold: 0
        });
        const flickityInstance = new window.ThemeFlickity(this,
        {
          ...this.flickityConfig,
          rightToLeft: window.themeVariables.settings.direction === "rtl",
          accessibility: MediaFeatures.supportsHover(),
          on:
          {
            ready: event => triggerEvent(this, "flickity:ready", event),
            change: event => triggerEvent(this, "flickity:slide-changed", event),
            settle: event => triggerEvent(this, "flickity:slide-settled", event)
          }
        });
        resolve(flickityInstance)
      }), this.hasAttribute("click-nav") && ((await this.flickityInstance).on("staticClick", this._onStaticClick.bind(this)), this.addEventListener("mousemove", this._onMouseMove.bind(this)))
    }
    async _onStaticClick(event, pointer, cellElement)
    {
      const flickityInstance = await this.flickityInstance,
        isVideoOrModelType = flickityInstance.selectedElement.hasAttribute("data-media-type") && ["video", "external_video", "model"].includes(flickityInstance.selectedElement.getAttribute("data-media-type"));
      if (!cellElement || isVideoOrModelType || window.matchMedia(window.themeVariables.breakpoints.phone).matches) return;
      const flickityViewport = flickityInstance.viewport,
        boundingRect = flickityViewport.getBoundingClientRect(),
        halfEdge = Math.floor(boundingRect.right - boundingRect.width / 2);
      pointer.clientX > halfEdge ? flickityInstance.next() : flickityInstance.previous()
    }
    async _onMouseMove(event)
    {
      const flickityInstance = await this.flickityInstance,
        isVideoOrModelType = flickityInstance.selectedElement.hasAttribute("data-media-type") && ["video", "external_video", "model"].includes(flickityInstance.selectedElement.getAttribute("data-media-type"));
      this.classList.toggle("is-hovering-right", event.offsetX > this.clientWidth / 2 && !isVideoOrModelType), this.classList.toggle("is-hovering-left", event.offsetX <= this.clientWidth / 2 && !isVideoOrModelType)
    }
    async _preloadNextImage()
    {
      const flickityInstance = await this.flickity;
      flickityInstance.selectedElement.nextElementSibling && flickityInstance.selectedElement.nextElementSibling.querySelector("img")?.setAttribute("loading", "eager")
    }
  };
window.customElements.define("flickity-carousel", FlickityCarousel);

function getSiblings(element, filter, includeSelf = !1)
{
  let siblings = [],
    currentElement = element;
  for (; currentElement = currentElement.previousElementSibling;)(!filter || currentElement.matches(filter)) && siblings.push(currentElement);
  for (includeSelf && siblings.push(element), currentElement = element; currentElement = currentElement.nextElementSibling;)(!filter || currentElement.matches(filter)) && siblings.push(currentElement);
  return siblings
}
async function resolveAsyncIterator(target)
{
  const processedTarget = [];
  target != null && typeof target[Symbol.iterator] == "function" || (target = [target]);
  for (const targetItem of target)
    if (typeof targetItem[Symbol.asyncIterator] == "function")
      for await (const awaitTarget of targetItem) processedTarget.push(awaitTarget);
    else processedTarget.push(targetItem);
  return processedTarget
}
var FlickityControls = class extends CustomHTMLElement
{
  async connectedCallback()
  {
    this.flickityCarousel.addEventListener("flickity:ready", this._onSlideChanged.bind(this, !1)), this.flickityCarousel.addEventListener("flickity:slide-changed", this._onSlideChanged.bind(this, !0)), this.delegate.on("click", '[data-action="prev"]', () => this.flickityCarousel.previous()), this.delegate.on("click", '[data-action="next"]', () => this.flickityCarousel.next()), this.delegate.on("click", '[data-action="select"]', (event, target) => this.flickityCarousel.select(`#${target.getAttribute("aria-controls")}`))
  }
  get flickityCarousel()
  {
    return this._flickityCarousel = this._flickityCarousel || document.getElementById(this.getAttribute("controls"))
  }
  async _onSlideChanged(animate = !0)
  {
    let flickityInstance = await this.flickityCarousel.flickityInstance;
    Array.from(this.querySelectorAll(`[aria-controls="${flickityInstance.selectedElement.id}"]`)).forEach(activeItem =>
    {
      activeItem.setAttribute("aria-current", "true"), getSiblings(activeItem).forEach(sibling => sibling.removeAttribute("aria-current")), requestAnimationFrame(() =>
      {
        if (activeItem.offsetParent && activeItem.offsetParent !== this)
        {
          const windowHalfHeight = activeItem.offsetParent.clientHeight / 2,
            windowHalfWidth = activeItem.offsetParent.clientWidth / 2;
          activeItem.offsetParent.scrollTo(
          {
            behavior: animate ? "smooth" : "auto",
            top: activeItem.offsetTop - windowHalfHeight + activeItem.clientHeight / 2,
            left: activeItem.offsetLeft - windowHalfWidth + activeItem.clientWidth / 2
          })
        }
      })
    })
  }
};
window.customElements.define("flickity-controls", FlickityControls);
var ExternalVideo = class extends CustomHTMLElement
{
  constructor()
  {
    super(), this.hasLoaded = !1, (async () => this.autoPlay ? (await this.untilVisible(
    {
      rootMargin: "300px",
      threshold: 0
    }), this.play()) : this.addEventListener("click", this.play.bind(this),
    {
      once: !0
    }))()
  }
  get autoPlay()
  {
    return this.hasAttribute("autoplay")
  }
  get provider()
  {
    return this.getAttribute("provider")
  }
  async play()
  {
    this.hasLoaded || await this._setupPlayer(), this.provider === "youtube" ? setTimeout(() =>
    {
      this.querySelector("iframe").contentWindow.postMessage(JSON.stringify(
      {
        event: "command",
        func: "playVideo",
        args: ""
      }), "*")
    }, 150) : this.provider === "vimeo" && this.querySelector("iframe").contentWindow.postMessage(JSON.stringify(
    {
      method: "play"
    }), "*")
  }
  pause()
  {
    this.hasLoaded && (this.provider === "youtube" ? this.querySelector("iframe").contentWindow.postMessage(JSON.stringify(
    {
      event: "command",
      func: "pauseVideo",
      args: ""
    }), "*") : this.provider === "vimeo" && this.querySelector("iframe").contentWindow.postMessage(JSON.stringify(
    {
      method: "pause"
    }), "*"))
  }
  _setupPlayer()
  {
    return this._setupPromise ? this._setupPromise : this._setupPromise = new Promise(resolve =>
    {
      const template2 = this.querySelector("template"),
        node = template2.content.firstElementChild.cloneNode(!0);
      node.onload = () =>
      {
        this.hasLoaded = !0, resolve()
      }, this.autoPlay ? template2.replaceWith(node) : (this.innerHTML = "", this.appendChild(node))
    })
  }
};
window.customElements.define("external-video", ExternalVideo);
var ProductLoader = class
{
  static load(productHandle)
  {
    if (productHandle) return this.loadedProducts[productHandle] ? this.loadedProducts[productHandle] : (this.loadedProducts[productHandle] = new Promise(async resolve =>
    {
      const responseAsJson = await (await fetch(`${window.themeVariables.routes.rootUrlWithoutSlash}/products/${productHandle}.js`)).json();
      resolve(responseAsJson)
    }), this.loadedProducts[productHandle])
  }
};
__publicField(ProductLoader, "loadedProducts",
{});
var ModelMedia = class extends HTMLElement
{
  constructor()
  {
    super(), LibraryLoader.load("modelViewerUiStyles"), window.Shopify.loadFeatures([
    {
      name: "shopify-xr",
      version: "1.0",
      onLoad: this._setupShopifyXr.bind(this)
    },
    {
      name: "model-viewer-ui",
      version: "1.0",
      onLoad: () =>
      {
        this.modelUi = new window.Shopify.ModelViewerUI(this.firstElementChild,
        {
          focusOnPlay: !1
        });
        const modelViewer = this.querySelector("model-viewer");
        modelViewer.addEventListener("shopify_model_viewer_ui_toggle_play", () =>
        {
          modelViewer.dispatchEvent(new CustomEvent("model:played",
          {
            bubbles: !0
          }))
        }), modelViewer.addEventListener("shopify_model_viewer_ui_toggle_pause", () =>
        {
          modelViewer.dispatchEvent(new CustomEvent("model:paused",
          {
            bubbles: !0
          }))
        })
      }
    }])
  }
  disconnectedCallback()
  {
    this.modelUi?.destroy()
  }
  play()
  {
    this.modelUi && this.modelUi.play()
  }
  pause()
  {
    this.modelUi && this.modelUi.pause()
  }
  async _setupShopifyXr()
  {
    if (!window.ShopifyXR) document.addEventListener("shopify_xr_initialized", this._setupShopifyXr.bind(this));
    else
    {
      const models = (await ProductLoader.load(this.getAttribute("product-handle"))).media.filter(media => media.media_type === "model");
      window.ShopifyXR.addModels(models), window.ShopifyXR.setupXRElements()
    }
  }
};
window.customElements.define("model-media", ModelMedia);
var NativeVideo = class extends HTMLElement
{
  constructor()
  {
    super(), this.hasLoaded = !1, this.autoPlay ? this.play() : this.addEventListener("click", this.play.bind(this),
    {
      once: !0
    })
  }
  get autoPlay()
  {
    return this.hasAttribute("autoplay")
  }
  play()
  {
    this.hasLoaded || this._replaceContent(), this.querySelector("video").play()
  }
  pause()
  {
    this.hasLoaded && this.querySelector("video").pause()
  }
  _replaceContent()
  {
    let node = this.querySelector("template");
    node && (node = node.content.firstElementChild.cloneNode(!0), this.hasAttribute("autoplay") || (this.innerHTML = ""), this.appendChild(node), this.firstElementChild.addEventListener("play", () =>
    {
      this.dispatchEvent(new CustomEvent("video:played",
      {
        bubbles: !0
      }))
    }), this.firstElementChild.addEventListener("pause", () =>
    {
      this.dispatchEvent(new CustomEvent("video:paused",
      {
        bubbles: !0
      }))
    }), this.hasLoaded = !0)
  }
};
window.customElements.define("native-video", NativeVideo);
var ComboBox = class extends OpenableElement
{
  connectedCallback()
  {
    if (super.connectedCallback(), this.options = Array.from(this.querySelectorAll('[role="option"]')), this.delegate.on("click", '[role="option"]', this._onValueClicked.bind(this)), this.delegate.on("keydown", '[role="listbox"]', this._onKeyDown.bind(this)), this.delegate.on("change", "select", this._onValueChanged.bind(this)), this.delegate.on("click", ".combo-box__overlay", () => this.open = !1), this.hasAttribute("fit-toggle"))
    {
      const maxWidth = Math.max(...this.options.map(item => item.clientWidth)),
        control = document.querySelector(`[aria-controls="${this.id}"]`);
      control && control.style.setProperty("--largest-option-width", `${maxWidth+2}px`)
    }
  }
  get nativeSelect()
  {
    return this.querySelector("select")
  }
  set selectedValue(value)
  {
    this.options.forEach(option =>
    {
      option.setAttribute("aria-selected", option.getAttribute("value") === value ? "true" : "false")
    })
  }
  attributeChangedCallback(name, oldValue, newValue)
  {
    switch (super.attributeChangedCallback(name, oldValue, newValue), name)
    {
      case "open":
        if (this.open)
        {
          const boundingRect = this.getBoundingClientRect();
          this.classList.toggle("combo-box--top", boundingRect.top >= window.innerHeight / 2 * 1.5), setTimeout(() => this.focusTrap.activate(), 150)
        }
        else this.focusTrap.deactivate(), setTimeout(() => this.classList.remove("combo-box--top"), 200);
        document.documentElement.classList.toggle("lock-mobile", this.open)
    }
  }
  _onValueClicked(event, target)
  {
    this.selectedValue = target.value, this.nativeSelect.value = target.value, this.nativeSelect.dispatchEvent(new Event("change",
    {
      bubbles: !0
    })), this.open = !1
  }
  _onValueChanged(event, target)
  {
    Array.from(this.nativeSelect.options).forEach(option => option.toggleAttribute("selected", target.value === option.value)), this.selectedValue = target.value
  }
  _onKeyDown(event)
  {
    (event.key === "ArrowDown" || event.key === "ArrowUp") && (event.preventDefault(), event.key === "ArrowDown" ? document.activeElement.nextElementSibling?.focus() : document.activeElement.previousElementSibling?.focus())
  }
};
window.customElements.define("combo-box", ComboBox);
var QuantitySelector = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.inputElement = this.querySelector("input"), this.delegate.on("click", "button:first-child", () => this.inputElement.quantity = this.inputElement.quantity - 1), this.delegate.on("click", "button:last-child", () => this.inputElement.quantity = this.inputElement.quantity + 1)
  }
};
window.customElements.define("quantity-selector", QuantitySelector);
var InputNumber = class extends HTMLInputElement
{
  connectedCallback()
  {
    this.addEventListener("input", this._onValueInput.bind(this)), this.addEventListener("change", this._onValueChanged.bind(this)), this.addEventListener("keydown", this._onKeyDown.bind(this))
  }
  get quantity()
  {
    return parseInt(this.value)
  }
  set quantity(quantity)
  {
    const isNumeric = (typeof quantity == "number" || typeof quantity == "string" && quantity.trim() !== "") && !isNaN(quantity);
    quantity !== "" && ((!isNumeric || quantity < 0) && (quantity = parseInt(quantity) || 1), this.value = Math.max(this.min || 1, Math.min(quantity, this.max || Number.MAX_VALUE)).toString(), this.size = Math.max(this.value.length + 1, 2))
  }
  _onValueInput()
  {
    this.quantity = this.value
  }
  _onValueChanged()
  {
    this.value === "" && (this.quantity = 1)
  }
  _onKeyDown(event)
  {
    event.stopPropagation(), event.key === "ArrowUp" ? this.quantity = this.quantity + 1 : event.key === "ArrowDown" && (this.quantity = this.quantity - 1)
  }
};
window.customElements.define("input-number", InputNumber,
{
  extends: "input"
});
var AnnouncementBar = class extends CustomHTMLElement
{
  async connectedCallback()
  {
    await customElements.whenDefined("announcement-bar-item"), this.items = Array.from(this.querySelectorAll("announcement-bar-item")), this.hasPendingTransition = !1, this.delegate.on("click", '[data-action="prev"]', this.previous.bind(this)), this.delegate.on("click", '[data-action="next"]', this.next.bind(this)), this.autoPlay && (this.delegate.on("announcement-bar:content:open", this._pausePlayer.bind(this)), this.delegate.on("announcement-bar:content:close", this._startPlayer.bind(this))), window.ResizeObserver && (this.resizeObserver = new ResizeObserver(this._updateCustomProperties.bind(this)), this.resizeObserver.observe(this)), this.autoPlay && this._startPlayer(), Shopify.designMode && this.delegate.on("shopify:block:select", event => this.select(event.target.index, !1))
  }
  get autoPlay()
  {
    return this.hasAttribute("auto-play")
  }
  get selectedIndex()
  {
    return this.items.findIndex(item => item.selected)
  }
  previous()
  {
    this.select((this.selectedIndex - 1 + this.items.length) % this.items.length)
  }
  next()
  {
    this.select((this.selectedIndex + 1 + this.items.length) % this.items.length)
  }
  async select(index, animate = !0)
  {
    this.selectedIndex === index || this.hasPendingTransition || (this.autoPlay && this._pausePlayer(), this.hasPendingTransition = !0, await this.items[this.selectedIndex].deselect(animate), await this.items[index].select(animate), this.hasPendingTransition = !1, this.autoPlay && this._startPlayer())
  }
  _pausePlayer()
  {
    clearInterval(this._interval)
  }
  _startPlayer()
  {
    clearInterval(this._interval), this._interval = setInterval(this.next.bind(this), parseInt(this.getAttribute("cycle-speed")) * 1e3)
  }
  _updateCustomProperties(entries)
  {
    entries.forEach(entry =>
    {
      if (entry.target === this)
      {
        const height = entry.borderBoxSize ? entry.borderBoxSize.length > 0 ? entry.borderBoxSize[0].blockSize : entry.borderBoxSize.blockSize : entry.target.clientHeight;
        document.documentElement.style.setProperty("--announcement-bar-height", `${height}px`)
      }
    })
  }
};
window.customElements.define("announcement-bar", AnnouncementBar);
var AnnouncementBarItem = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.hasContent && (this.contentElement = this.querySelector(".announcement-bar__content"), this.delegate.on("click", '[data-action="open-content"]', this.openContent.bind(this)), this.delegate.on("click", '[data-action="close-content"]', this.closeContent.bind(this)), Shopify.designMode && (this.addEventListener("shopify:block:select", this.openContent.bind(this)), this.addEventListener("shopify:block:deselect", this.closeContent.bind(this))))
  }
  get index()
  {
    return [...this.parentNode.children].indexOf(this)
  }
  get hasContent()
  {
    return this.hasAttribute("has-content")
  }
  get selected()
  {
    return !this.hasAttribute("hidden")
  }
  get focusTrap()
  {
    return this._trapFocus = this._trapFocus || createFocusTrap(this.contentElement.querySelector(".announcement-bar__content-inner"),
    {
      fallbackFocus: this,
      clickOutsideDeactivates: event => event.target.tagName !== "BUTTON",
      allowOutsideClick: event => event.target.tagName === "BUTTON",
      onDeactivate: this.closeContent.bind(this),
      preventScroll: !0
    })
  }
  async select(animate = !0)
  {
    this.removeAttribute("hidden"), await new Promise(resolve =>
    {
      this.animate(
      {
        transform: ["translateY(8px)", "translateY(0)"],
        opacity: [0, 1]
      },
      {
        duration: animate ? 150 : 0,
        easing: "ease-in-out"
      }).onfinish = resolve
    })
  }
  async deselect(animate = !0)
  {
    await this.closeContent(), await new Promise(resolve =>
    {
      this.animate(
      {
        transform: ["translateY(0)", "translateY(-8px)"],
        opacity: [1, 0]
      },
      {
        duration: animate ? 150 : 0,
        easing: "ease-in-out"
      }).onfinish = resolve
    }), this.setAttribute("hidden", "")
  }
  async openContent()
  {
    this.hasContent && (this.contentElement.addEventListener("transitionend", () => this.focusTrap.activate(),
    {
      once: !0
    }), this.contentElement.removeAttribute("hidden"), document.documentElement.classList.add("lock-all"), this.dispatchEvent(new CustomEvent("announcement-bar:content:open",
    {
      bubbles: !0
    })))
  }
  async closeContent()
  {
    if (!this.hasContent || this.contentElement.hasAttribute("hidden")) return Promise.resolve();
    await new Promise(resolve =>
    {
      this.contentElement.addEventListener("transitionend", () => resolve(),
      {
        once: !0
      }), this.contentElement.setAttribute("hidden", ""), this.focusTrap.deactivate(), document.documentElement.classList.remove("lock-all"), this.dispatchEvent(new CustomEvent("announcement-bar:content:close",
      {
        bubbles: !0
      }))
    })
  }
};
window.customElements.define("announcement-bar-item", AnnouncementBarItem);
var SearchPage = class extends HTMLElement
{
  connectedCallback()
  {
    this.facetToolbar = document.getElementById("mobile-facet-toolbar"), this.tabsNav = document.getElementById("search-tabs-nav"), this.tabsNav.addEventListener("tabs-nav:changed", this._onCategoryChanged.bind(this)), this._completeSearch()
  }
  get terms()
  {
    return this.getAttribute("terms")
  }
  get completeFor()
  {
    return this.getAttribute("complete-for").split(",")
  }
  async _completeSearch()
  {
    const promisesList = [];
    this.completeFor.forEach(item =>
    {
      promisesList.push(fetch(`${window.themeVariables.routes.searchUrl}?section_id=${this.getAttribute("section-id")}&q=${this.terms}&type=${item}&options[prefix]=last&options[unavailable_products]=${window.themeVariables.settings.searchUnavailableProducts}`))
    });
    const responses = await Promise.all(promisesList);
    await Promise.all(responses.map(async response =>
    {
      const div = document.createElement("div");
      div.innerHTML = await response.text();
      const categoryResultDiv = div.querySelector(".main-search__category-result"),
        tabNavItem = div.querySelector("#search-tabs-nav .tabs-nav__item");
      categoryResultDiv && (categoryResultDiv.setAttribute("hidden", ""), this.insertAdjacentElement("beforeend", categoryResultDiv), this.tabsNav.addButton(tabNavItem))
    }))
  }
  _onCategoryChanged(event)
  {
    const button = event.detail.button;
    this.facetToolbar.classList.toggle("is-collapsed", button.getAttribute("data-type") !== "product")
  }
};
window.customElements.define("search-page", SearchPage);
var CookieBar = class extends CustomHTMLElement
{
  connectedCallback()
  {
    window.Shopify && window.Shopify.designMode && (this.rootDelegate.on("shopify:section:select", event => filterShopifyEvent(event, this, () => this.open = !0)), this.rootDelegate.on("shopify:section:deselect", event => filterShopifyEvent(event, this, () => this.open = !1))), this.delegate.on("click", '[data-action~="accept-policy"]', this._acceptPolicy.bind(this)), this.delegate.on("click", '[data-action~="decline-policy"]', this._declinePolicy.bind(this)), window.Shopify.loadFeatures([
    {
      name: "consent-tracking-api",
      version: "0.1",
      onLoad: this._onCookieBarSetup.bind(this)
    }])
  }
  set open(value)
  {
    this.toggleAttribute("hidden", !value)
  }
  _onCookieBarSetup()
  {
    window.Shopify.customerPrivacy.shouldShowGDPRBanner() && (this.open = !0)
  }
  _acceptPolicy()
  {
    window.Shopify.customerPrivacy.setTrackingConsent(!0, () => this.open = !1)
  }
  _declinePolicy()
  {
    window.Shopify.customerPrivacy.setTrackingConsent(!1, () => this.open = !1)
  }
};
window.customElements.define("cookie-bar", CookieBar);
var ProductRecommendations = class extends HTMLElement
{
  async connectedCallback()
  {
    const response = await fetch(`${window.themeVariables.routes.productRecommendationsUrl}?product_id=${this.productId}&limit=${this.recommendationsCount}&section_id=${this.sectionId}&intent=${this.intent}`),
      div = document.createElement("div");
    div.innerHTML = await response.text();
    const productRecommendationsElement = div.querySelector("product-recommendations");
    productRecommendationsElement.hasChildNodes() ? this.innerHTML = productRecommendationsElement.innerHTML : this.intent === "complementary" && this.remove()
  }
  get productId()
  {
    return this.getAttribute("product-id")
  }
  get sectionId()
  {
    return this.getAttribute("section-id")
  }
  get recommendationsCount()
  {
    return parseInt(this.getAttribute("recommendations-count") || 4)
  }
  get intent()
  {
    return this.getAttribute("intent")
  }
};
window.customElements.define("product-recommendations", ProductRecommendations);
var RecentlyViewedProducts = class extends HTMLElement
{
  async connectedCallback()
  {
    if (this.searchQueryString === "") return;
    const response = await fetch(`${window.themeVariables.routes.searchUrl}?type=product&q=${this.searchQueryString}&section_id=${this.sectionId}`),
      div = document.createElement("div");
    div.innerHTML = await response.text();
    const recentlyViewedProductsElement = div.querySelector("recently-viewed-products");
    recentlyViewedProductsElement.hasChildNodes() && (this.innerHTML = recentlyViewedProductsElement.innerHTML)
  }
  get searchQueryString()
  {
    const items = JSON.parse(localStorage.getItem("theme:recently-viewed-products") || "[]");
    return this.hasAttribute("exclude-product-id") && items.includes(parseInt(this.getAttribute("exclude-product-id"))) && items.splice(items.indexOf(parseInt(this.getAttribute("exclude-product-id"))), 1), items.map(item => "id:" + item).slice(0, this.productsCount).join(" OR ")
  }
  get sectionId()
  {
    return this.getAttribute("section-id")
  }
  get productsCount()
  {
    return this.getAttribute("products-count") || 4
  }
};
window.customElements.define("recently-viewed-products", RecentlyViewedProducts);

function getSizedMediaUrl(media, size)
{
  let src = typeof media == "string" ? media : media.preview_image ? media.preview_image.src : media.url;
  if (size === null) return src;
  if (size === "master") return src.replace(/http(s)?:/, "");
  const match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif|webp)(\?v=\d+)?$/i);
  if (match)
  {
    const prefix = src.split(match[0]),
      suffix = match[0];
    return (prefix[0] + "_" + size + suffix).replace(/http(s)?:/, "")
  }
  else return null
}

function getMediaSrcset(media, sizeList)
{
  let srcset = [];
  return (typeof media == "string" ? sizeList : getSupportedSizes(media, sizeList)).forEach(supportedSize =>
  {
    srcset.push(`${getSizedMediaUrl(media,supportedSize+"x")} ${supportedSize}w`)
  }), srcset.join(",")
}

function getSupportedSizes(media, desiredSizes)
{
  let supportedSizes = [],
    mediaWidth = media.preview_image.width;
  return desiredSizes.forEach(width =>
  {
    mediaWidth >= width && supportedSizes.push(width)
  }), supportedSizes
}

function imageLoaded(image)
{
  return new Promise(resolve =>
  {
    !image || image.tagName !== "IMG" || image.complete ? resolve() : image.onload = () => resolve()
  })
}
var CustomAnimation = class
  {
    constructor(effect)
    {
      this._effect = effect, this._playState = "idle", this._finished = Promise.resolve()
    }
    get finished()
    {
      return this._finished
    }
    get animationEffects()
    {
      return this._effect instanceof CustomKeyframeEffect ? [this._effect] : this._effect.animationEffects
    }
    cancel()
    {
      this.animationEffects.forEach(animationEffect => animationEffect.cancel())
    }
    finish()
    {
      this.animationEffects.forEach(animationEffect => animationEffect.finish())
    }
    play()
    {
      this._playState = "running", this._effect.play(), this._finished = this._effect.finished, this._finished.then(() =>
      {
        this._playState = "finished"
      }, rejection =>
      {
        this._playState = "idle"
      })
    }
  },
  CustomKeyframeEffect = class
  {
    constructor(target, keyframes, options = {})
    {
      target && ("Animation" in window ? this._animation = new Animation(new KeyframeEffect(target, keyframes, options)) : (options.fill = "forwards", this._animation = target.animate(keyframes, options), this._animation.pause()), this._animation.addEventListener("finish", () =>
      {
        target.style.opacity = keyframes.hasOwnProperty("opacity") ? keyframes.opacity[keyframes.opacity.length - 1] : null, target.style.visibility = keyframes.hasOwnProperty("visibility") ? keyframes.visibility[keyframes.visibility.length - 1] : null
      }))
    }
    get finished()
    {
      return this._animation ? this._animation.finished ? this._animation.finished : new Promise(resolve => this._animation.onfinish = resolve) : Promise.resolve()
    }
    play()
    {
      this._animation && (this._animation.startTime = null, this._animation.play())
    }
    cancel()
    {
      this._animation && this._animation.cancel()
    }
    finish()
    {
      this._animation && this._animation.finish()
    }
  },
  GroupEffect = class
  {
    constructor(childrenEffects)
    {
      this._childrenEffects = childrenEffects, this._finished = Promise.resolve()
    }
    get finished()
    {
      return this._finished
    }
    get animationEffects()
    {
      return this._childrenEffects.flatMap(effect => effect instanceof CustomKeyframeEffect ? effect : effect.animationEffects)
    }
  },
  ParallelEffect = class extends GroupEffect
  {
    play()
    {
      const promises = [];
      for (const effect of this._childrenEffects) effect.play(), promises.push(effect.finished);
      this._finished = Promise.all(promises)
    }
  },
  SequenceEffect = class extends GroupEffect
  {
    play()
    {
      this._finished = new Promise(async (resolve, reject) =>
      {
        try
        {
          for (const effect of this._childrenEffects) effect.play(), await effect.finished;
          resolve()
        }
        catch
        {
          reject()
        }
      })
    }
  },
  SlideshowItem = class extends HTMLElement
  {
    async connectedCallback()
    {
      this._pendingAnimations = [], this.addEventListener("split-lines:re-split", event =>
      {
        Array.from(event.target.children).forEach(line => line.style.visibility = this.selected ? "visible" : "hidden")
      }), MediaFeatures.prefersReducedMotion() && (this.setAttribute("reveal-visibility", ""), Array.from(this.querySelectorAll("[reveal], [reveal-visibility]")).forEach(item =>
      {
        item.removeAttribute("reveal"), item.removeAttribute("reveal-visibility")
      }))
    }
    get index()
    {
      return [...this.parentNode.children].indexOf(this)
    }
    get selected()
    {
      return !this.hasAttribute("hidden")
    }
    async transitionToLeave(transitionType, shouldAnimate = !0)
    {
      transitionType !== "reveal" && this.setAttribute("hidden", ""), this._pendingAnimations.forEach(animation2 => animation2.cancel()), this._pendingAnimations = [];
      let animation = null,
        textElements = await resolveAsyncIterator(this.querySelectorAll("split-lines, .button-group, .button-wrapper")),
        imageElements = Array.from(this.querySelectorAll(".slideshow__image-wrapper"));
      switch (transitionType)
      {
        case "sweep":
          animation = new CustomAnimation(new SequenceEffect([new CustomKeyframeEffect(this,
          {
            visibility: ["visible", "hidden"]
          },
          {
            duration: 500
          }), new ParallelEffect(textElements.map(item => new CustomKeyframeEffect(item,
          {
            opacity: [1, 0],
            visibility: ["visible", "hidden"]
          })))]));
          break;
        case "fade":
          animation = new CustomAnimation(new CustomKeyframeEffect(this,
          {
            opacity: [1, 0],
            visibility: ["visible", "hidden"]
          },
          {
            duration: 250,
            easing: "ease-in-out"
          }));
          break;
        case "reveal":
          animation = new CustomAnimation(new SequenceEffect([new ParallelEffect(textElements.reverse().map(item => new CustomKeyframeEffect(item,
          {
            opacity: [1, 0],
            visibility: ["visible", "hidden"]
          },
          {
            duration: 250,
            easing: "ease-in-out"
          }))), new ParallelEffect(imageElements.map(item => item.classList.contains("slideshow__image-wrapper--secondary") ? new CustomKeyframeEffect(item,
          {
            visibility: ["visible", "hidden"],
            clipPath: ["inset(0 0 0 0)", "inset(100% 0 0 0)"]
          },
          {
            duration: 450,
            easing: "cubic-bezier(0.99, 0.01, 0.50, 0.94)"
          }) : new CustomKeyframeEffect(item,
          {
            visibility: ["visible", "hidden"],
            clipPath: ["inset(0 0 0 0)", "inset(0 0 100% 0)"]
          },
          {
            duration: 450,
            easing: "cubic-bezier(0.99, 0.01, 0.50, 0.94)"
          })))]));
          break
      }
      await this._executeAnimation(animation, shouldAnimate), transitionType === "reveal" && this.setAttribute("hidden", "")
    }
    async transitionToEnter(transitionType, shouldAnimate = !0, reverseDirection = !1)
    {
      this.removeAttribute("hidden"), await this._untilReady();
      let animation = null,
        textElements = await resolveAsyncIterator(this.querySelectorAll("split-lines, .button-group, .button-wrapper")),
        imageElements = Array.from(this.querySelectorAll(".slideshow__image-wrapper"));
      switch (transitionType)
      {
        case "sweep":
          animation = new CustomAnimation(new SequenceEffect([new CustomKeyframeEffect(this,
          {
            visibility: ["hidden", "visible"],
            clipPath: reverseDirection ? ["inset(0 100% 0 0)", "inset(0 0 0 0)"] : ["inset(0 0 0 100%)", "inset(0 0 0 0)"]
          },
          {
            duration: 500,
            easing: "cubic-bezier(1, 0, 0, 1)"
          }), new ParallelEffect(textElements.map((item, index) => new CustomKeyframeEffect(item,
          {
            opacity: [0, 1],
            visibility: ["hidden", "visible"],
            clipPath: ["inset(0 0 100% 0)", "inset(0 0 0 0)"],
            transform: ["translateY(100%)", "translateY(0)"]
          },
          {
            duration: 450,
            delay: 100 * index,
            easing: "cubic-bezier(0.5, 0.06, 0.01, 0.99)"
          })))]));
          break;
        case "fade":
          animation = new CustomAnimation(new CustomKeyframeEffect(this,
          {
            opacity: [0, 1],
            visibility: ["hidden", "visible"]
          },
          {
            duration: 250,
            easing: "ease-in-out"
          }));
          break;
        case "reveal":
          animation = new CustomAnimation(new SequenceEffect([new ParallelEffect(imageElements.map(item => item.classList.contains("slideshow__image-wrapper--secondary") ? new CustomKeyframeEffect(item,
          {
            visibility: ["hidden", "visible"],
            clipPath: ["inset(100% 0 0 0)", "inset(0 0 0 0)"]
          },
          {
            duration: 450,
            delay: 100,
            easing: "cubic-bezier(0.5, 0.06, 0.01, 0.99)"
          }) : new CustomKeyframeEffect(item,
          {
            visibility: ["hidden", "visible"],
            clipPath: ["inset(0 0 100% 0)", "inset(0 0 0 0)"]
          },
          {
            duration: 450,
            delay: 100,
            easing: "cubic-bezier(0.5, 0.06, 0.01, 0.99)"
          }))), new ParallelEffect(textElements.map((item, index) => new CustomKeyframeEffect(item,
          {
            opacity: [0, 1],
            visibility: ["hidden", "visible"],
            clipPath: ["inset(0 0 100% 0)", "inset(0 0 0 0)"],
            transform: ["translateY(100%)", "translateY(0)"]
          },
          {
            duration: 450,
            delay: 100 * index,
            easing: "cubic-bezier(0.5, 0.06, 0.01, 0.99)"
          })))]));
          break
      }
      return this._executeAnimation(animation, shouldAnimate)
    }
    async _executeAnimation(animation, shouldAnimate)
    {
      return this._pendingAnimations.push(animation), shouldAnimate ? animation.play() : animation.finish(), animation.finished
    }
    async _untilReady()
    {
      return Promise.all(this._getVisibleImages().map(image => imageLoaded(image)))
    }
    _preloadImages()
    {
      this._getVisibleImages().forEach(image =>
      {
        image.setAttribute("loading", "eager")
      })
    }
    _getVisibleImages()
    {
      return Array.from(this.querySelectorAll("img")).filter(image => getComputedStyle(image.parentElement).display !== "none")
    }
  };
window.customElements.define("slide-show-item", SlideshowItem);
var VerticalScrollBlockerMixin = {
    _blockVerticalScroll(threshold = 18)
    {
      this.addEventListener("touchstart", event =>
      {
        this.firstTouchClientX = event.touches[0].clientX
      }), this.addEventListener("touchmove", event =>
      {
        const touchClientX = event.touches[0].clientX - this.firstTouchClientX;
        Math.abs(touchClientX) > threshold && event.preventDefault()
      },
      {
        passive: !1
      })
    }
  },
  Slideshow = class extends CustomHTMLElement
  {
    connectedCallback()
    {
      this.items = Array.from(this.querySelectorAll("slide-show-item")), this.pageDots = this.querySelector("page-dots"), this.isTransitioning = !1, this.items.length > 1 && (Shopify.designMode && (this.addEventListener("shopify:block:deselect", this.startPlayer.bind(this)), this.addEventListener("shopify:block:select", event =>
      {
        this.pausePlayer(), this.intersectionObserver.disconnect(), !event.detail.load && event.target.selected || this.select(event.target.index, !event.detail.load)
      })), this.addEventListener("swiperight", this.previous.bind(this)), this.addEventListener("swipeleft", this.next.bind(this)), this.addEventListener("page-dots:changed", event => this.select(event.detail.index)), this._blockVerticalScroll()), this._setupVisibility()
    }
    get selectedIndex()
    {
      return this.items.findIndex(item => item.selected)
    }
    get transitionType()
    {
      return MediaFeatures.prefersReducedMotion() ? "fade" : this.getAttribute("transition-type")
    }
    async _setupVisibility()
    {
      await this.untilVisible(), await this.items[this.selectedIndex].transitionToEnter(this.transitionType).catch(error =>
      {}), this.startPlayer()
    }
    previous()
    {
      this.select((this.selectedIndex - 1 + this.items.length) % this.items.length, !0, !0)
    }
    next()
    {
      this.select((this.selectedIndex + 1 + this.items.length) % this.items.length, !0, !1)
    }
    async select(index, shouldTransition = !0, reverseDirection = !1)
    {
      if (this.transitionType === "reveal" && this.isTransitioning) return;
      this.isTransitioning = !0;
      const previousItem = this.items[this.selectedIndex],
        newItem = this.items[index];
      this.items[(newItem.index + 1) % this.items.length]._preloadImages(), previousItem && previousItem !== newItem && (this.transitionType !== "reveal" ? previousItem.transitionToLeave(this.transitionType, shouldTransition) : await previousItem.transitionToLeave(this.transitionType, shouldTransition)), this.pageDots && (this.pageDots.selectedIndex = newItem.index), await newItem.transitionToEnter(this.transitionType, shouldTransition, reverseDirection).catch(error =>
      {}), this.isTransitioning = !1
    }
    pausePlayer()
    {
      this.style.setProperty("--section-animation-play-state", "paused")
    }
    startPlayer()
    {
      this.hasAttribute("auto-play") && this.style.setProperty("--section-animation-play-state", "running")
    }
  };
Object.assign(Slideshow.prototype, VerticalScrollBlockerMixin), window.customElements.define("slide-show", Slideshow);
var ImageWithTextItem = class extends HTMLElement
{
  get index()
  {
    return [...this.parentNode.children].indexOf(this)
  }
  get selected()
  {
    return !this.hasAttribute("hidden")
  }
  get hasAttachedImage()
  {
    return this.hasAttribute("attached-image")
  }
  async transitionToEnter(shouldAnimate = !0)
  {
    this.removeAttribute("hidden");
    const textWrapper = this.querySelector(".image-with-text__text-wrapper"),
      headings = await resolveAsyncIterator(this.querySelectorAll(".image-with-text__content split-lines")),
      animation = new CustomAnimation(new SequenceEffect([new ParallelEffect(headings.map((item, index) => new CustomKeyframeEffect(item,
      {
        opacity: [0, .2, 1],
        transform: ["translateY(100%)", "translateY(0)"],
        clipPath: ["inset(0 0 100% 0)", "inset(0 0 0 0)"]
      },
      {
        duration: 350,
        delay: 120 * index,
        easing: "cubic-bezier(0.5, 0.06, 0.01, 0.99)"
      }))), new CustomKeyframeEffect(textWrapper,
      {
        opacity: [0, 1]
      },
      {
        duration: 300
      })]));
    return shouldAnimate ? animation.play() : animation.finish(), animation.finished
  }
  async transitionToLeave(shouldAnimate = !0)
  {
    const elements = await resolveAsyncIterator(this.querySelectorAll(".image-with-text__text-wrapper, .image-with-text__content split-lines")),
      animation = new CustomAnimation(new ParallelEffect(elements.map(item => new CustomKeyframeEffect(item,
      {
        opacity: [1, 0]
      },
      {
        duration: 200
      }))));
    shouldAnimate ? animation.play() : animation.finish(), await animation.finished, this.setAttribute("hidden", "")
  }
};
window.customElements.define("image-with-text-item", ImageWithTextItem);
var ImageWithText = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.items = Array.from(this.querySelectorAll("image-with-text-item")), this.imageItems = Array.from(this.querySelectorAll(".image-with-text__image")), this.pageDots = this.querySelector("page-dots"), this.hasPendingTransition = !1, this.items.length > 1 && (this.addEventListener("page-dots:changed", event => this.select(event.detail.index)), Shopify.designMode && (this.addEventListener("shopify:block:deselect", this.startPlayer.bind(this)), this.addEventListener("shopify:block:select", event =>
    {
      this.intersectionObserver.disconnect(), this.pausePlayer(), this.select(event.target.index, !event.detail.load)
    }))), this._setupVisibility()
  }
  async _setupVisibility()
  {
    await this.untilVisible(), this.hasAttribute("reveal-on-scroll") && (await this.transitionImage(this.selectedIndex), this.select(this.selectedIndex)), this.startPlayer()
  }
  get selectedIndex()
  {
    return this.items.findIndex(item => item.selected)
  }
  async select(index, shouldAnimate = !0)
  {
    this.hasPendingTransition || (this.hasPendingTransition = !0, (this.items[index].hasAttachedImage || !shouldAnimate) && await this.transitionImage(index, shouldAnimate), this.selectedIndex !== index && await this.items[this.selectedIndex].transitionToLeave(shouldAnimate), this.pageDots && (this.pageDots.selectedIndex = index), await this.items[index].transitionToEnter(shouldAnimate), this.hasPendingTransition = !1)
  }
  async transitionImage(index, shouldAnimate = !0)
  {
    const activeImage = this.imageItems.find(item => !item.hasAttribute("hidden")),
      nextImage = this.imageItems.find(item => item.id === this.items[index].getAttribute("attached-image")) || activeImage;
    activeImage.setAttribute("hidden", ""), nextImage.removeAttribute("hidden"), await imageLoaded(nextImage);
    const animation = new CustomAnimation(new CustomKeyframeEffect(nextImage,
    {
      visibility: ["hidden", "visible"],
      clipPath: ["inset(0 0 0 100%)", "inset(0 0 0 0)"]
    },
    {
      duration: 600,
      easing: "cubic-bezier(1, 0, 0, 1)"
    }));
    shouldAnimate ? animation.play() : animation.finish()
  }
  pausePlayer()
  {
    this.style.setProperty("--section-animation-play-state", "paused")
  }
  startPlayer()
  {
    this.style.setProperty("--section-animation-play-state", "running")
  }
};
window.customElements.define("image-with-text", ImageWithText);
var TestimonialItem = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.addEventListener("split-lines:re-split", event =>
    {
      Array.from(event.target.children).forEach(line => line.style.visibility = this.selected ? "visible" : "hidden")
    })
  }
  get index()
  {
    return [...this.parentNode.children].indexOf(this)
  }
  get selected()
  {
    return !this.hasAttribute("hidden")
  }
  async transitionToLeave(shouldAnimate = !0)
  {
    const textLines = await resolveAsyncIterator(this.querySelectorAll("split-lines, .testimonial__author")),
      animation = new CustomAnimation(new ParallelEffect(textLines.reverse().map((item, index) => new CustomKeyframeEffect(item,
      {
        visibility: ["visible", "hidden"],
        clipPath: ["inset(0 0 0 0)", "inset(0 0 100% 0)"],
        transform: ["translateY(0)", "translateY(100%)"]
      },
      {
        duration: 350,
        delay: 60 * index,
        easing: "cubic-bezier(0.68, 0.00, 0.77, 0.00)"
      }))));
    shouldAnimate ? animation.play() : animation.finish(), await animation.finished, this.setAttribute("hidden", "")
  }
  async transitionToEnter(shouldAnimate = !0)
  {
    const textLines = await resolveAsyncIterator(this.querySelectorAll("split-lines, .testimonial__author")),
      animation = new CustomAnimation(new ParallelEffect(textLines.map((item, index) => new CustomKeyframeEffect(item,
      {
        visibility: ["hidden", "visible"],
        clipPath: ["inset(0 0 100% 0)", "inset(0 0 0px 0)"],
        transform: ["translateY(100%)", "translateY(0)"]
      },
      {
        duration: 550,
        delay: 120 * index,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)"
      }))));
    return this.removeAttribute("hidden"), shouldAnimate ? animation.play() : animation.finish(), animation.finished
  }
};
window.customElements.define("testimonial-item", TestimonialItem);
var TestimonialList = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.items = Array.from(this.querySelectorAll("testimonial-item")), this.pageDots = this.querySelector("page-dots"), this.hasPendingTransition = !1, this.items.length > 1 && (this.addEventListener("swiperight", this.previous.bind(this)), this.addEventListener("swipeleft", this.next.bind(this)), this.addEventListener("prev-next:prev", this.previous.bind(this)), this.addEventListener("prev-next:next", this.next.bind(this)), this.addEventListener("page-dots:changed", event => this.select(event.detail.index)), Shopify.designMode && this.addEventListener("shopify:block:select", event =>
    {
      this.intersectionObserver?.disconnect(), (event.detail.load || !event.target.selected) && this.select(event.target.index, !event.detail.load)
    }), this._blockVerticalScroll()), this.hasAttribute("reveal-on-scroll") && this._setupVisibility()
  }
  get selectedIndex()
  {
    return this.items.findIndex(item => item.selected)
  }
  async _setupVisibility()
  {
    await this.untilVisible(), this.items[this.selectedIndex].transitionToEnter()
  }
  previous()
  {
    this.select((this.selectedIndex - 1 + this.items.length) % this.items.length)
  }
  next()
  {
    this.select((this.selectedIndex + 1 + this.items.length) % this.items.length)
  }
  async select(index, shouldAnimate = !0)
  {
    this.hasPendingTransition || (this.hasPendingTransition = !0, await this.items[this.selectedIndex].transitionToLeave(shouldAnimate), this.pageDots && (this.pageDots.selectedIndex = index), await this.items[index].transitionToEnter(shouldAnimate), this.hasPendingTransition = !1)
  }
};
Object.assign(TestimonialList.prototype, VerticalScrollBlockerMixin), window.customElements.define("testimonial-list", TestimonialList);
var ShopTheLookItem = class extends HTMLElement
{
  get index()
  {
    return [...this.parentNode.children].indexOf(this)
  }
  get selected()
  {
    return !this.hasAttribute("hidden")
  }
  async transitionToLeave(shouldAnimate = !0)
  {
    this.setAttribute("hidden", "");
    const animation = new CustomAnimation(new CustomKeyframeEffect(this,
    {
      visibility: ["visible", "hidden"]
    },
    {
      duration: 500
    }));
    return shouldAnimate ? animation.play() : animation.finish(), animation.finished
  }
  async transitionToEnter(shouldAnimate = !0)
  {
    this.removeAttribute("hidden");
    const dots = Array.from(this.querySelectorAll(".shop-the-look__dot"));
    dots.forEach(dot => dot.style.opacity = 0);
    const animation = new CustomAnimation(new SequenceEffect([new ParallelEffect(Array.from(this.querySelectorAll(".shop-the-look__image")).map(item => new CustomKeyframeEffect(item,
    {
      opacity: [1, 1]
    },
    {
      duration: 0
    }))), new CustomKeyframeEffect(this,
    {
      visibility: ["hidden", "visible"],
      zIndex: [0, 1],
      clipPath: ["inset(0 0 0 100%)", "inset(0 0 0 0)"]
    },
    {
      duration: 500,
      easing: "cubic-bezier(1, 0, 0, 1)"
    }), new ParallelEffect(dots.map((item, index) => new CustomKeyframeEffect(item,
    {
      opacity: [0, 1],
      transform: ["scale(0)", "scale(1)"]
    },
    {
      duration: 120,
      delay: 75 * index,
      easing: "ease-in-out"
    })))]));
    shouldAnimate ? animation.play() : animation.finish(), await animation.finished, window.matchMedia(window.themeVariables.breakpoints.tabletAndUp).matches && this.querySelector(".shop-the-look__product-wrapper .shop-the-look__dot")?.setAttribute("aria-expanded", "true")
  }
};
window.customElements.define("shop-the-look-item", ShopTheLookItem);
var ShopTheLookNav = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.shopTheLook = this.closest("shop-the-look"), this.inTransition = !1, this.pendingTransition = !1, this.pendingTransitionTo = null, this.delegate.on("click", '[data-action="prev"]', () => this.shopTheLook.previous()), this.delegate.on("click", '[data-action="next"]', () => this.shopTheLook.next())
  }
  transitionToIndex(selectedIndex, nextIndex, shouldAnimate = !0)
  {
    const indexElements = Array.from(this.querySelectorAll(".shop-the-look__counter-page-transition")),
      currentElement = indexElements[selectedIndex],
      nextElement = indexElements[nextIndex];
    if (this.inTransition)
    {
      this.pendingTransition = !0, this.pendingTransitionTo = nextIndex;
      return
    }
    this.inTransition = !0, currentElement.animate(
    {
      transform: ["translateY(0)", "translateY(-100%)"]
    },
    {
      duration: shouldAnimate ? 1e3 : 0,
      easing: "cubic-bezier(1, 0, 0, 1)"
    }).onfinish = () =>
    {
      currentElement.setAttribute("hidden", ""), this.inTransition = !1, this.pendingTransition && this.pendingTransitionTo !== nextIndex && (this.pendingTransition = !1, this.transitionToIndex(nextIndex, this.pendingTransitionTo, shouldAnimate), this.pendingTransitionTo = null)
    }, nextElement.removeAttribute("hidden"), nextElement.animate(
    {
      transform: ["translateY(100%)", "translateY(0)"]
    },
    {
      duration: shouldAnimate ? 1e3 : 0,
      easing: "cubic-bezier(1, 0, 0, 1)"
    })
  }
};
window.customElements.define("shop-the-look-nav", ShopTheLookNav);
var ShopTheLook = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.lookItems = Array.from(this.querySelectorAll("shop-the-look-item")), this.nav = this.querySelector("shop-the-look-nav"), this.hasPendingTransition = !1, this.hasAttribute("reveal-on-scroll") && this._setupVisibility(), this.lookItems.length > 1 && Shopify.designMode && this.addEventListener("shopify:block:select", async event =>
    {
      this.intersectionObserver.disconnect(), await this.select(event.target.index, !event.detail.load), this.nav.animate(
      {
        opacity: [0, 1],
        transform: ["translateY(30px)", "translateY(0)"]
      },
      {
        duration: 0,
        fill: "forwards",
        easing: "ease-in-out"
      })
    })
  }
  get selectedIndex()
  {
    return this.lookItems.findIndex(item => item.selected)
  }
  async _setupVisibility()
  {
    await this.untilVisible();
    const images = Array.from(this.lookItems[this.selectedIndex].querySelectorAll(".shop-the-look__image"));
    for (let image of images) image.offsetParent !== null && await imageLoaded(image);
    await this.lookItems[this.selectedIndex].transitionToEnter(), this.nav && this.nav.animate(
    {
      opacity: [0, 1],
      transform: ["translateY(30px)", "translateY(0)"]
    },
    {
      duration: 150,
      fill: "forwards",
      easing: "ease-in-out"
    })
  }
  previous()
  {
    this.select((this.selectedIndex - 1 + this.lookItems.length) % this.lookItems.length)
  }
  next()
  {
    this.select((this.selectedIndex + 1 + this.lookItems.length) % this.lookItems.length)
  }
  async select(index, animate = !0)
  {
    const currentLook = this.lookItems[this.selectedIndex],
      nextLook = this.lookItems[index];
    this.hasPendingTransition || (this.hasPendingTransition = !0, currentLook !== nextLook && (this.nav.transitionToIndex(this.selectedIndex, index, animate), currentLook.transitionToLeave()), nextLook.transitionToEnter(animate), this.hasPendingTransition = !1)
  }
};
window.customElements.define("shop-the-look", ShopTheLook);
var CollectionList = class extends CustomHTMLElement
{
  async connectedCallback()
  {
    this.items = Array.from(this.querySelectorAll(".list-collections__item")), this.hasAttribute("scrollable") && (this.scroller = this.querySelector(".list-collections__scroller"), this.addEventListener("prev-next:prev", this.previous.bind(this)), this.addEventListener("prev-next:next", this.next.bind(this)), this.addEventListener("shopify:block:select", event => event.target.scrollIntoView(
    {
      block: "nearest",
      inline: "center",
      behavior: event.detail.load ? "auto" : "smooth"
    }))), this.hasAttribute("reveal-on-scroll") && this._setupVisibility()
  }
  async _setupVisibility()
  {
    await this.untilVisible();
    const prefersReducedMotion = MediaFeatures.prefersReducedMotion(),
      animation = new CustomAnimation(new ParallelEffect(this.items.map((item, index) => new SequenceEffect([new CustomKeyframeEffect(item.querySelector(".list-collections__item-image"),
      {
        opacity: [0, 1],
        transform: [`scale(${prefersReducedMotion?1:1.1})`, "scale(1)"]
      },
      {
        duration: 250,
        delay: prefersReducedMotion ? 0 : 150 * index,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)"
      }), new ParallelEffect(Array.from(item.querySelectorAll(".list-collections__item-info [reveal]")).map((textItem, subIndex) => new CustomKeyframeEffect(textItem,
      {
        opacity: [0, 1],
        clipPath: [`inset(${prefersReducedMotion?"0 0 0 0":"0 0 100% 0"})`, "inset(0 0 0 0)"],
        transform: [`translateY(${prefersReducedMotion?0:"100%"})`, "translateY(0)"]
      },
      {
        duration: 200,
        delay: prefersReducedMotion ? 0 : 150 * index + 150 * subIndex,
        easing: "cubic-bezier(0.5, 0.06, 0.01, 0.99)"
      })))]))));
    this._hasSectionReloaded ? animation.finish() : animation.play()
  }
  previous()
  {
    const directionFlip = window.themeVariables.settings.direction === "ltr" ? 1 : -1;
    this.scroller.scrollBy(
    {
      left: -this.items[0].clientWidth * directionFlip,
      behavior: "smooth"
    })
  }
  next()
  {
    const directionFlip = window.themeVariables.settings.direction === "ltr" ? 1 : -1;
    this.scroller.scrollBy(
    {
      left: this.items[0].clientWidth * directionFlip,
      behavior: "smooth"
    })
  }
};
window.customElements.define("collection-list", CollectionList);
var ProductList = class extends CustomHTMLElement
{
  constructor()
  {
    super(), this.productListInner = this.querySelector(".product-list__inner"), this.productItems = Array.from(this.querySelectorAll("product-item"))
  }
  connectedCallback()
  {
    this.addEventListener("prev-next:prev", this.previous.bind(this)), this.addEventListener("prev-next:next", this.next.bind(this)), !this.hidden && this.staggerApparition && this._staggerProductsApparition()
  }
  get staggerApparition()
  {
    return this.hasAttribute("stagger-apparition")
  }
  get apparitionAnimation()
  {
    return this._animation = this._animation || new CustomAnimation(new ParallelEffect(this.productItems.map((item, index) => new CustomKeyframeEffect(item,
    {
      opacity: [0, 1],
      transform: [`translateY(${MediaFeatures.prefersReducedMotion()?0:window.innerWidth<1e3?35:60}px)`, "translateY(0)"]
    },
    {
      duration: 600,
      delay: MediaFeatures.prefersReducedMotion() ? 0 : 100 * index - Math.min(3 * index * index, 100 * index),
      easing: "ease"
    }))))
  }
  previous(event)
  {
    const directionFlip = window.themeVariables.settings.direction === "ltr" ? 1 : -1,
      columnGap = parseInt(getComputedStyle(this).getPropertyValue("--product-list-column-gap"));
    event.target.nextElementSibling.removeAttribute("disabled"), event.target.toggleAttribute("disabled", this.productListInner.scrollLeft * directionFlip - (this.productListInner.clientWidth + columnGap) <= 0), this.productListInner.scrollBy(
    {
      left: -(this.productListInner.clientWidth + columnGap) * directionFlip,
      behavior: "smooth"
    })
  }
  next(event)
  {
    const directionFlip = window.themeVariables.settings.direction === "ltr" ? 1 : -1,
      columnGap = parseInt(getComputedStyle(this).getPropertyValue("--product-list-column-gap"));
    event.target.previousElementSibling.removeAttribute("disabled"), event.target.toggleAttribute("disabled", this.productListInner.scrollLeft * directionFlip + (this.productListInner.clientWidth + columnGap) * 2 >= this.productListInner.scrollWidth), this.productListInner.scrollBy(
    {
      left: (this.productListInner.clientWidth + columnGap) * directionFlip,
      behavior: "smooth"
    })
  }
  attributeChangedCallback(name)
  {
    if (this.staggerApparition) switch (name)
    {
      case "hidden":
        this.hidden ? this.apparitionAnimation.finish() : (this.productListInner.scrollLeft = 0, this.productListInner.parentElement.scrollLeft = 0, this.querySelector(".prev-next-button--prev")?.setAttribute("disabled", ""), this.querySelector(".prev-next-button--next")?.removeAttribute("disabled"), this._staggerProductsApparition())
    }
  }
  async _staggerProductsApparition()
  {
    this.productItems.forEach(item => item.style.opacity = 0), await this.untilVisible(
    {
      threshold: this.clientHeight > 0 ? Math.min(50 / this.clientHeight, 1) : 0
    }), this.apparitionAnimation.play()
  }
};
__publicField(ProductList, "observedAttributes", ["hidden"]), window.customElements.define("product-list", ProductList);
var LogoList = class extends CustomHTMLElement
{
  async connectedCallback()
  {
    this.items = Array.from(this.querySelectorAll(".logo-list__item")), this.logoListScrollable = this.querySelector(".logo-list__list"), this.items.length > 1 && (this.addEventListener("prev-next:prev", this.previous.bind(this)), this.addEventListener("prev-next:next", this.next.bind(this))), this.hasAttribute("reveal-on-scroll") && this._setupVisibility()
  }
  async _setupVisibility()
  {
    await this.untilVisible(
    {
      rootMargin: "50px 0px",
      threshold: 0
    });
    const animation = new CustomAnimation(new ParallelEffect(this.items.map((item, index) => new CustomKeyframeEffect(item,
    {
      opacity: [0, 1],
      transform: [`translateY(${MediaFeatures.prefersReducedMotion()?0:"30px"})`, "translateY(0)"]
    },
    {
      duration: 300,
      delay: MediaFeatures.prefersReducedMotion() ? 0 : 100 * index,
      easing: "ease"
    }))));
    this._hasSectionReloaded ? animation.finish() : animation.play()
  }
  previous(event)
  {
    const directionFlip = window.themeVariables.settings.direction === "ltr" ? 1 : -1;
    event.target.nextElementSibling.removeAttribute("disabled"), event.target.toggleAttribute("disabled", this.logoListScrollable.scrollLeft * directionFlip - (this.logoListScrollable.clientWidth + 24) <= 0), this.logoListScrollable.scrollBy(
    {
      left: -(this.logoListScrollable.clientWidth + 24) * directionFlip,
      behavior: "smooth"
    })
  }
  next(event)
  {
    const directionFlip = window.themeVariables.settings.direction === "ltr" ? 1 : -1;
    event.target.previousElementSibling.removeAttribute("disabled"), event.target.toggleAttribute("disabled", this.logoListScrollable.scrollLeft * directionFlip + (this.logoListScrollable.clientWidth + 24) * 2 >= this.logoListScrollable.scrollWidth), this.logoListScrollable.scrollBy(
    {
      left: (this.logoListScrollable.clientWidth + 24) * directionFlip,
      behavior: "smooth"
    })
  }
};
window.customElements.define("logo-list", LogoList);
var BlogPostNavigation = class extends HTMLElement
{
  connectedCallback()
  {
    window.addEventListener("scroll", throttle(this._updateProgressBar.bind(this), 15))
  }
  get hasNextArticle()
  {
    return this.hasAttribute("has-next-article")
  }
  _updateProgressBar()
  {
    const stickyHeaderOffset = getStickyHeaderOffset(),
      marginCompensation = window.matchMedia(window.themeVariables.breakpoints.pocket).matches ? 40 : 80,
      articleNavBoundingBox = this.getBoundingClientRect(),
      articleMainPartBoundingBox = this.parentElement.getBoundingClientRect(),
      difference = articleMainPartBoundingBox.bottom - (articleNavBoundingBox.bottom - marginCompensation),
      progress = Math.max(-1 * (difference / (articleMainPartBoundingBox.height + marginCompensation) - 1), 0);
    this.classList.toggle("is-visible", articleMainPartBoundingBox.top < stickyHeaderOffset && articleMainPartBoundingBox.bottom > stickyHeaderOffset + this.clientHeight - marginCompensation), this.hasNextArticle && (progress > .8 ? this.classList.add("article__nav--show-next") : this.classList.remove("article__nav--show-next")), this.style.setProperty("--transform", `${progress}`)
  }
};
window.customElements.define("blog-post-navigation", BlogPostNavigation);
var MultiColumn = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.hasAttribute("stack") || (this.multiColumnInner = this.querySelector(".multi-column__inner"), this.addEventListener("prev-next:prev", this.previous.bind(this)), this.addEventListener("prev-next:next", this.next.bind(this)), Shopify.designMode && this.addEventListener("shopify:block:select", event =>
    {
      event.target.scrollIntoView(
      {
        inline: "center",
        block: "nearest",
        behavior: event.detail.load ? "auto" : "smooth"
      })
    })), this.hasAttribute("stagger-apparition") && this._setupVisibility()
  }
  async _setupVisibility()
  {
    await this.untilVisible(
    {
      threshold: Math.min(50 / this.clientHeight, 1)
    });
    const prefersReducedMotion = MediaFeatures.prefersReducedMotion(),
      animation = new CustomAnimation(new ParallelEffect(Array.from(this.querySelectorAll(".multi-column__item")).map((item, index) => new CustomKeyframeEffect(item,
      {
        opacity: [0, 1],
        transform: [`translateY(${MediaFeatures.prefersReducedMotion()?0:window.innerWidth<1e3?35:60}px)`, "translateY(0)"]
      },
      {
        duration: 600,
        delay: prefersReducedMotion ? 0 : 100 * index,
        easing: "ease"
      }))));
    this._hasSectionReloaded ? animation.finish() : animation.play()
  }
  previous(event)
  {
    const directionFlip = window.themeVariables.settings.direction === "ltr" ? 1 : -1,
      columnGap = parseInt(getComputedStyle(this).getPropertyValue("--multi-column-column-gap"));
    event.target.nextElementSibling.removeAttribute("disabled"), event.target.toggleAttribute("disabled", this.multiColumnInner.scrollLeft * directionFlip - (this.multiColumnInner.clientWidth + columnGap) <= 0), this.multiColumnInner.scrollBy(
    {
      left: -(this.multiColumnInner.clientWidth + columnGap) * directionFlip,
      behavior: "smooth"
    })
  }
  next(event)
  {
    const directionFlip = window.themeVariables.settings.direction === "ltr" ? 1 : -1,
      columnGap = parseInt(getComputedStyle(this).getPropertyValue("--multi-column-column-gap"));
    event.target.previousElementSibling.removeAttribute("disabled"), event.target.toggleAttribute("disabled", this.multiColumnInner.scrollLeft * directionFlip + (this.multiColumnInner.clientWidth + columnGap) * 2 >= this.multiColumnInner.scrollWidth), this.multiColumnInner.scrollBy(
    {
      left: (this.multiColumnInner.clientWidth + columnGap) * directionFlip,
      behavior: "smooth"
    })
  }
};
window.customElements.define("multi-column", MultiColumn);
var GalleryList = class extends HTMLElement
{
  connectedCallback()
  {
    this.listItems = Array.from(this.querySelectorAll("gallery-item")), this.scrollBarElement = this.querySelector(".gallery__progress-bar"), this.listWrapperElement = this.querySelector(".gallery__list-wrapper"), this.listItems.length > 1 && (this.addEventListener("scrollable-content:progress", this._updateProgressBar.bind(this)), this.addEventListener("prev-next:prev", this.previous.bind(this)), this.addEventListener("prev-next:next", this.next.bind(this)), Shopify.designMode && this.addEventListener("shopify:block:select", event => this.select(event.target.index, !event.detail.load)))
  }
  previous()
  {
    this.select([...this.listItems].reverse().find(item => item.isOnLeftHalfPartOfScreen).index)
  }
  next()
  {
    this.select(this.listItems.findIndex(item => item.isOnRightHalfPartOfScreen))
  }
  select(index, animate = !0)
  {
    const boundingRect = this.listItems[index].getBoundingClientRect();
    this.listWrapperElement.scrollBy(
    {
      behavior: animate ? "smooth" : "auto",
      left: Math.floor(boundingRect.left - window.innerWidth / 2 + boundingRect.width / 2)
    })
  }
  _updateProgressBar(event)
  {
    this.scrollBarElement?.style.setProperty("--transform", `${event.detail.progress}%`)
  }
};
window.customElements.define("gallery-list", GalleryList);
var GalleryItem = class extends HTMLElement
{
  get index()
  {
    return [...this.parentNode.children].indexOf(this)
  }
  get isOnRightHalfPartOfScreen()
  {
    return window.themeVariables.settings.direction === "ltr" ? this.getBoundingClientRect().left > window.innerWidth / 2 : this.getBoundingClientRect().right < window.innerWidth / 2
  }
  get isOnLeftHalfPartOfScreen()
  {
    return window.themeVariables.settings.direction === "ltr" ? this.getBoundingClientRect().right < window.innerWidth / 2 : this.getBoundingClientRect().left > window.innerWidth / 2
  }
};
window.customElements.define("gallery-item", GalleryItem);
var ImageWithTextOverlay = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.hasAttribute("parallax") && !MediaFeatures.prefersReducedMotion() && (this._hasPendingRaF = !1, this._onScrollListener = this._onScroll.bind(this), window.addEventListener("scroll", this._onScrollListener)), this.hasAttribute("reveal-on-scroll") && this._setupVisibility()
  }
  disconnectedCallback()
  {
    super.disconnectedCallback(), this._onScrollListener && window.removeEventListener("scroll", this._onScrollListener)
  }
  async _setupVisibility()
  {
    await this.untilVisible();
    const image = this.querySelector(".image-overlay__image"),
      headings = await resolveAsyncIterator(this.querySelectorAll("split-lines")),
      prefersReducedMotion = MediaFeatures.prefersReducedMotion();
    await imageLoaded(image);
    const innerEffect = [new CustomKeyframeEffect(image,
      {
        opacity: [0, 1],
        transform: [`scale(${prefersReducedMotion?1:1.1})`, "scale(1)"]
      },
      {
        duration: 500,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)"
      }), new ParallelEffect(headings.map((item, index) => new CustomKeyframeEffect(item,
      {
        opacity: [0, .2, 1],
        transform: [`translateY(${prefersReducedMotion?0:"100%"})`, "translateY(0)"],
        clipPath: [`inset(${prefersReducedMotion?"0 0 0 0":"0 0 100% 0"})`, "inset(0 0 0 0)"]
      },
      {
        duration: 300,
        delay: prefersReducedMotion ? 0 : 120 * index,
        easing: "cubic-bezier(0.5, 0.06, 0.01, 0.99)"
      }))), new CustomKeyframeEffect(this.querySelector(".image-overlay__text-container"),
      {
        opacity: [0, 1]
      },
      {
        duration: 300
      })],
      animation = prefersReducedMotion ? new CustomAnimation(new ParallelEffect(innerEffect)) : new CustomAnimation(new SequenceEffect(innerEffect));
    this._hasSectionReloaded ? animation.finish() : animation.play()
  }
  _onScroll()
  {
    this._hasPendingRaF || (this._hasPendingRaF = !0, requestAnimationFrame(() =>
    {
      const boundingRect = this.getBoundingClientRect(),
        speedFactor = 3,
        contentElement = this.querySelector(".image-overlay__content-wrapper"),
        imageElement = this.querySelector(".image-overlay__image"),
        boundingRectBottom = boundingRect.bottom,
        boundingRectHeight = boundingRect.height,
        stickyHeaderOffset = getStickyHeaderOffset();
      contentElement && (contentElement.style.opacity = Math.max(1 - speedFactor * (1 - Math.min(boundingRectBottom / boundingRectHeight, 1)), 0).toString()), imageElement && (imageElement.style.transform = `translateY(${100-Math.max(1-(1-Math.min(boundingRectBottom/(boundingRectHeight+stickyHeaderOffset),1)),0)*100}px)`), this._hasPendingRaF = !1
    }))
  }
};
window.customElements.define("image-with-text-overlay", ImageWithTextOverlay);
var ImageWithTextBlock = class extends CustomHTMLElement
{
  async connectedCallback()
  {
    this.hasAttribute("reveal-on-scroll") && this._setupVisibility()
  }
  async _setupVisibility()
  {
    await this.untilVisible();
    const images = Array.from(this.querySelectorAll(".image-with-text-block__image[reveal]")),
      headings = await resolveAsyncIterator(this.querySelectorAll("split-lines")),
      prefersReducedMotion = MediaFeatures.prefersReducedMotion();
    for (const image of images) image.offsetParent !== null && await imageLoaded(image);
    const innerEffect = [new ParallelEffect(images.map(item => new CustomKeyframeEffect(item,
      {
        opacity: [0, 1],
        transform: [`scale(${prefersReducedMotion?1:1.1})`, "scale(1)"]
      },
      {
        duration: 500,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)"
      }))), new CustomKeyframeEffect(this.querySelector(".image-with-text-block__content"),
      {
        opacity: [0, 1],
        transform: [`translateY(${prefersReducedMotion?0:"60px"})`, "translateY(0)"]
      },
      {
        duration: 150,
        easing: "ease-in-out"
      }), new ParallelEffect(headings.map((item, index) => new CustomKeyframeEffect(item,
      {
        opacity: [0, .2, 1],
        transform: [`translateY(${prefersReducedMotion?0:"100%"})`, "translateY(0)"],
        clipPath: [`inset(${prefersReducedMotion?"0 0 0 0":"0 0 100% 0"})`, "inset(0 0 0 0)"]
      },
      {
        duration: 300,
        delay: prefersReducedMotion ? 0 : 120 * index,
        easing: "cubic-bezier(0.5, 0.06, 0.01, 0.99)"
      }))), new CustomKeyframeEffect(this.querySelector(".image-with-text-block__text-container"),
      {
        opacity: [0, 1]
      },
      {
        duration: 300
      })],
      animation = prefersReducedMotion ? new CustomAnimation(new ParallelEffect(innerEffect)) : new CustomAnimation(new SequenceEffect(innerEffect));
    this._hasSectionReloaded ? animation.finish() : animation.play()
  }
};
window.customElements.define("image-with-text-block", ImageWithTextBlock);
var ArticleList = class extends CustomHTMLElement
{
  async connectedCallback()
  {
    if (this.articleItems = Array.from(this.querySelectorAll(".article-item")), this.staggerApparition)
    {
      await this.untilVisible(
      {
        threshold: this.clientHeight > 0 ? Math.min(50 / this.clientHeight, 1) : 0
      });
      const animation = new CustomAnimation(new ParallelEffect(this.articleItems.map((item, index) => new CustomKeyframeEffect(item,
      {
        opacity: [0, 1],
        transform: [`translateY(${MediaFeatures.prefersReducedMotion()?0:window.innerWidth<1e3?35:60}px)`, "translateY(0)"]
      },
      {
        duration: 600,
        delay: MediaFeatures.prefersReducedMotion() ? 0 : 100 * index - Math.min(3 * index * index, 100 * index),
        easing: "ease"
      }))));
      this._hasSectionReloaded ? animation.finish() : animation.play()
    }
  }
  get staggerApparition()
  {
    return this.hasAttribute("stagger-apparition")
  }
};
window.customElements.define("article-list", ArticleList);
var BlogPostHeader = class extends HTMLElement
{
  async connectedCallback()
  {
    const image = this.querySelector(".article__image");
    MediaFeatures.prefersReducedMotion() ? image.removeAttribute("reveal") : (await imageLoaded(image), image.animate(
    {
      opacity: [0, 1],
      transform: ["scale(1.1)", "scale(1)"]
    },
    {
      duration: 500,
      fill: "forwards",
      easing: "cubic-bezier(0.65, 0, 0.35, 1)"
    }))
  }
};
window.customElements.define("blog-post-header", BlogPostHeader);
var PredictiveSearchInput = class extends HTMLInputElement
{
  connectedCallback()
  {
    this.addEventListener("click", () => document.getElementById(this.getAttribute("aria-controls")).open = !0)
  }
};
window.customElements.define("predictive-search-input", PredictiveSearchInput,
{
  extends: "input"
});
var DrawerContent = class extends OpenableElement
{
  connectedCallback()
  {
    if (super.connectedCallback(), this.hasAttribute("reverse-breakpoint"))
    {
      this.originalDirection = this.classList.contains("drawer--from-left") ? "left" : "right";
      const matchMedia2 = window.matchMedia(this.getAttribute("reverse-breakpoint"));
      matchMedia2.addListener(this._checkReverseOpeningDirection.bind(this)), this._checkReverseOpeningDirection(matchMedia2)
    }
    this.delegate.on("click", ".drawer__overlay", () => this.open = !1)
  }
  attributeChangedCallback(name, oldValue, newValue)
  {
    switch (super.attributeChangedCallback(name, oldValue, newValue), name)
    {
      case "open":
        document.documentElement.classList.toggle("lock-all", this.open)
    }
  }
  _checkReverseOpeningDirection(match)
  {
    this.classList.remove("drawer--from-left"), (this.originalDirection === "left" && !match.matches || this.originalDirection !== "left" && match.matches) && this.classList.add("drawer--from-left")
  }
};
window.customElements.define("drawer-content", DrawerContent);
var PredictiveSearchDrawer = class extends DrawerContent
{
  connectedCallback()
  {
    super.connectedCallback(), this.inputElement = this.querySelector('[name="q"]'), this.drawerContentElement = this.querySelector(".drawer__content"), this.drawerFooterElement = this.querySelector(".drawer__footer"), this.loadingStateElement = this.querySelector(".predictive-search__loading-state"), this.resultsElement = this.querySelector(".predictive-search__results"), this.menuListElement = this.querySelector(".predictive-search__menu-list"), this.delegate.on("input", '[name="q"]', this._debounce(this._onSearch.bind(this), 200)), this.delegate.on("click", '[data-action="reset-search"]', this._startNewSearch.bind(this))
  }
  async _onSearch(event, target)
  {
    if (event.key !== "Enter")
      if (this.abortController && this.abortController.abort(), this.drawerContentElement.classList.remove("drawer__content--center"), this.drawerFooterElement.hidden = !0, target.value === "") this.loadingStateElement.hidden = !0, this.resultsElement.hidden = !0, this.menuListElement && (this.menuListElement.hidden = !1);
      else
      {
        this.drawerContentElement.classList.add("drawer__content--center"), this.loadingStateElement.hidden = !1, this.resultsElement.hidden = !0, this.menuListElement && (this.menuListElement.hidden = !0);
        let searchResults = {};
        try
        {
          this.abortController = new AbortController, this._supportPredictiveApi() ? searchResults = await this._doPredictiveSearch(target.value) : searchResults = await this._doLiquidSearch(target.value)
        }
        catch (e)
        {
          if (e.name === "AbortError") return
        }
        this.loadingStateElement.hidden = !0, this.resultsElement.hidden = !1, this.menuListElement && (this.menuListElement.hidden = !0), searchResults.hasResults && (this.drawerFooterElement.hidden = !1, this.drawerContentElement.classList.remove("drawer__content--center")), this.resultsElement.innerHTML = searchResults.html
      }
  }
  async _doPredictiveSearch(term)
  {
    const response = await fetch(`${window.themeVariables.routes.predictiveSearchUrl}?q=${encodeURIComponent(term)}&resources[limit]=10&resources[limit_scope]=each&section_id=predictive-search`,
      {
        signal: this.abortController.signal
      }),
      div = document.createElement("div");
    return div.innerHTML = await response.text(),
    {
      hasResults: div.querySelector(".predictive-search__results-categories") !== null,
      html: div.firstElementChild.innerHTML
    }
  }
  async _doLiquidSearch(term)
  {
    const response = await fetch(`${window.themeVariables.routes.searchUrl}?q=${encodeURIComponent(term)}&resources[limit]=50&section_id=predictive-search-compatibility`,
      {
        signal: this.abortController.signal
      }),
      div = document.createElement("div");
    return div.innerHTML = await response.text(),
    {
      hasResults: div.querySelector(".predictive-search__results-categories") !== null,
      html: div.firstElementChild.innerHTML
    }
  }
  _startNewSearch()
  {
    this.inputElement.value = "", this.inputElement.focus();
    const event = new Event("input",
    {
      bubbles: !0,
      cancelable: !0
    });
    this.inputElement.dispatchEvent(event)
  }
  _supportPredictiveApi()
  {
    return JSON.parse(document.getElementById("shopify-features").innerHTML).predictiveSearch
  }
  _debounce(fn, delay3)
  {
    let timer = null;
    return (...args) =>
    {
      clearTimeout(timer), timer = setTimeout(() =>
      {
        fn.apply(this, args)
      }, delay3)
    }
  }
};
window.customElements.define("predictive-search-drawer", PredictiveSearchDrawer);
var Timeline = class extends HTMLElement
{
  connectedCallback()
  {
    if (this.prevNextButtons = this.querySelector("prev-next-buttons"), this.pageDots = this.querySelector("page-dots"), this.scrollBarElement = this.querySelector(".timeline__progress-bar"), this.listWrapperElement = this.querySelector(".timeline__list-wrapper"), this.listItemElements = Array.from(this.querySelectorAll(".timeline__item")), this.isScrolling = !1, this.listItemElements.length > 1)
    {
      this.addEventListener("prev-next:prev", this.previous.bind(this)), this.addEventListener("prev-next:next", this.next.bind(this)), this.addEventListener("page-dots:changed", event => this.select(event.detail.index)), Shopify.designMode && this.addEventListener("shopify:block:select", event =>
      {
        this.select([...event.target.parentNode.children].indexOf(event.target), !event.detail.load)
      }), this.itemIntersectionObserver = new IntersectionObserver(this._onItemObserved.bind(this),
      {
        threshold: .4
      });
      const mediaQuery = window.matchMedia(window.themeVariables.breakpoints.pocket);
      mediaQuery.addListener(this._onMediaChanged.bind(this)), this._onMediaChanged(mediaQuery)
    }
  }
  get selectedIndex()
  {
    return this.listItemElements.findIndex(item => !item.hasAttribute("hidden"))
  }
  previous()
  {
    this.select(Math.max(0, this.selectedIndex - 1))
  }
  next()
  {
    this.select(Math.min(this.selectedIndex + 1, this.listItemElements.length - 1))
  }
  select(index, animate = !0)
  {
    const listItemElement = this.listItemElements[index],
      boundingRect = listItemElement.getBoundingClientRect();
    animate && (this.isScrolling = !0, setTimeout(() => this.isScrolling = !1, 800)), window.matchMedia(window.themeVariables.breakpoints.pocket).matches ? this.listWrapperElement.scrollTo(
    {
      behavior: animate ? "smooth" : "auto",
      left: this.listItemElements[0].clientWidth * index
    }) : this.listWrapperElement.scrollBy(
    {
      behavior: animate ? "smooth" : "auto",
      left: Math.floor(boundingRect.left - window.innerWidth / 2 + boundingRect.width / 2)
    }), this._onItemSelected(index)
  }
  _onItemSelected(index)
  {
    const listItemElement = this.listItemElements[index];
    listItemElement.removeAttribute("hidden", "false"), getSiblings(listItemElement).forEach(item => item.setAttribute("hidden", "")), this.prevNextButtons.isPrevDisabled = index === 0, this.prevNextButtons.isNextDisabled = index === this.listItemElements.length - 1, this.pageDots.selectedIndex = index, this.scrollBarElement?.style.setProperty("--transform", `${100/(this.listItemElements.length-1)*index}%`)
  }
  _onItemObserved(entries)
  {
    this.isScrolling || entries.forEach(entry =>
    {
      entry.isIntersecting && this._onItemSelected([...entry.target.parentNode.children].indexOf(entry.target))
    })
  }
  _onMediaChanged(event)
  {
    event.matches ? this.listItemElements.forEach(item => this.itemIntersectionObserver.observe(item)) : this.listItemElements.forEach(item => this.itemIntersectionObserver.unobserve(item))
  }
};
window.customElements.define("time-line", Timeline);
var PressList = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.pressItemsWrapper = this.querySelector(".press-list__wrapper"), this.pressItems = Array.from(this.querySelectorAll("press-item")), this.pageDots = this.querySelector("page-dots"), this.pressItems.length > 1 && (Shopify.designMode && this.addEventListener("shopify:block:select", event =>
    {
      this.intersectionObserver?.disconnect(), (event.detail.load || !event.target.selected) && this.select(event.target.index, !event.detail.load)
    }), this.pressItemsWrapper.addEventListener("swiperight", this.previous.bind(this)), this.pressItemsWrapper.addEventListener("swipeleft", this.next.bind(this)), this.addEventListener("page-dots:changed", event => this.select(event.detail.index)), this._blockVerticalScroll()), this.hasAttribute("reveal-on-scroll") && this._setupVisibility()
  }
  async _setupVisibility()
  {
    await this.untilVisible(), this.pressItems[this.selectedIndex].transitionToEnter()
  }
  get selectedIndex()
  {
    return this.pressItems.findIndex(item => item.selected)
  }
  previous()
  {
    this.select((this.selectedIndex - 1 + this.pressItems.length) % this.pressItems.length)
  }
  next()
  {
    this.select((this.selectedIndex + 1 + this.pressItems.length) % this.pressItems.length)
  }
  async select(index, shouldAnimate = !0)
  {
    const previousItem = this.pressItems[this.selectedIndex],
      newItem = this.pressItems[index];
    await previousItem.transitionToLeave(shouldAnimate), this.pageDots.selectedIndex = index, await newItem.transitionToEnter(shouldAnimate)
  }
};
Object.assign(PressList.prototype, VerticalScrollBlockerMixin), window.customElements.define("press-list", PressList);
var PressItem = class extends HTMLElement
{
  connectedCallback()
  {
    this.addEventListener("split-lines:re-split", event =>
    {
      Array.from(event.target.children).forEach(line => line.style.visibility = this.selected ? "visible" : "hidden")
    })
  }
  get index()
  {
    return [...this.parentNode.children].indexOf(this)
  }
  get selected()
  {
    return !this.hasAttribute("hidden")
  }
  async transitionToLeave(shouldAnimate = !0)
  {
    const textLines = await resolveAsyncIterator(this.querySelectorAll("split-lines")),
      animation = new CustomAnimation(new ParallelEffect(textLines.reverse().map((item, index) => new CustomKeyframeEffect(item,
      {
        visibility: ["visible", "hidden"],
        clipPath: ["inset(0 0 0 0)", "inset(0 0 100% 0)"],
        transform: ["translateY(0)", "translateY(100%)"]
      },
      {
        duration: 350,
        delay: 60 * index,
        easing: "cubic-bezier(0.68, 0.00, 0.77, 0.00)"
      }))));
    shouldAnimate ? animation.play() : animation.finish(), await animation.finished, this.setAttribute("hidden", "")
  }
  async transitionToEnter(shouldAnimate = !0)
  {
    this.removeAttribute("hidden");
    const textLines = await resolveAsyncIterator(this.querySelectorAll("split-lines, .testimonial__author")),
      animation = new CustomAnimation(new ParallelEffect(textLines.map((item, index) => new CustomKeyframeEffect(item,
      {
        visibility: ["hidden", "visible"],
        clipPath: ["inset(0 0 100% 0)", "inset(0 0 0px 0)"],
        transform: ["translateY(100%)", "translateY(0)"]
      },
      {
        duration: 550,
        delay: 120 * index,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)"
      }))));
    return shouldAnimate ? animation.play() : animation.finish(), animation.finished
  }
};
window.customElements.define("press-item", PressItem);
var DesktopNavigation = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.openingTimeout = null, this.currentMegaMenu = null, this.delegate.on("mouseenter", ".has-dropdown", (event, target) =>
    {
      event.target === target && event.relatedTarget !== null && this.openDropdown(target)
    }, !0), this.delegate.on("click", ".header__linklist-link[aria-expanded], .nav-dropdown__link[aria-expanded]", (event, target) =>
    {
      window.matchMedia("(hover: hover)").matches || target.getAttribute("aria-expanded") === "true" || (event.preventDefault(), this.openDropdown(target.parentElement))
    }), this.delegate.on("shopify:block:select", event => this.openDropdown(event.target.parentElement)), this.delegate.on("shopify:block:deselect", event => this.closeDropdown(event.target.parentElement))
  }
  openDropdown(parentElement)
  {
    const menuItem = parentElement.querySelector("[aria-controls]"),
      dropdown = parentElement.querySelector(`#${menuItem.getAttribute("aria-controls")}`);
    this.currentMegaMenu = dropdown.classList.contains("mega-menu") ? dropdown : null;
    let openingTimeout = setTimeout(() =>
    {
      if (menuItem.getAttribute("aria-expanded") === "true") return;
      if (menuItem.setAttribute("aria-expanded", "true"), dropdown.removeAttribute("hidden"), dropdown.classList.contains("mega-menu") && !MediaFeatures.prefersReducedMotion())
      {
        const items = Array.from(dropdown.querySelectorAll(".mega-menu__column, .mega-menu__image-push"));
        items.forEach(item =>
        {
          item.getAnimations().forEach(animation2 => animation2.cancel()), item.style.opacity = 0
        }), new CustomAnimation(new ParallelEffect(items.map((item, index) => new CustomKeyframeEffect(item,
        {
          opacity: [0, 1],
          transform: ["translateY(20px)", "translateY(0)"]
        },
        {
          duration: 250,
          delay: 100 + 60 * index,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)"
        })))).play()
      }
      const leaveListener = event =>
        {
          event.relatedTarget !== null && (this.closeDropdown(parentElement), parentElement.removeEventListener("mouseleave", leaveListener))
        },
        leaveDocumentListener = () =>
        {
          this.closeDropdown(parentElement), document.documentElement.removeEventListener("mouseleave", leaveDocumentListener)
        };
      parentElement.addEventListener("mouseleave", leaveListener), document.documentElement.addEventListener("mouseleave", leaveDocumentListener), openingTimeout = null, this.dispatchEvent(new CustomEvent("desktop-nav:dropdown:open",
      {
        bubbles: !0
      }))
    }, 100);
    parentElement.addEventListener("mouseleave", () =>
    {
      openingTimeout && clearTimeout(openingTimeout)
    },
    {
      once: !0
    })
  }
  closeDropdown(parentElement)
  {
    const menuItem = parentElement.querySelector("[aria-controls]"),
      dropdown = parentElement.querySelector(`#${menuItem.getAttribute("aria-controls")}`);
    requestAnimationFrame(() =>
    {
      dropdown.classList.add("is-closing"), menuItem.setAttribute("aria-expanded", "false"), setTimeout(() =>
      {
        dropdown.setAttribute("hidden", ""), clearTimeout(this.openingTimeout), dropdown.classList.remove("is-closing")
      }, dropdown.classList.contains("mega-menu") && this.currentMegaMenu !== dropdown ? 250 : 0), this.dispatchEvent(new CustomEvent("desktop-nav:dropdown:close",
      {
        bubbles: !0
      }))
    })
  }
};
window.customElements.define("desktop-navigation", DesktopNavigation);
var MobileNavigation = class extends DrawerContent
{
  get apparitionAnimation()
  {
    if (this._apparitionAnimation) return this._apparitionAnimation;
    if (!MediaFeatures.prefersReducedMotion())
    {
      const navItems = Array.from(this.querySelectorAll('.mobile-nav__item[data-level="1"]')),
        effects = [];
      effects.push(new ParallelEffect(navItems.map((item, index) => new CustomKeyframeEffect(item,
      {
        opacity: [0, 1],
        transform: ["translateX(-40px)", "translateX(0)"]
      },
      {
        duration: 300,
        delay: 300 + 120 * index - Math.min(2 * index * index, 120 * index),
        easing: "cubic-bezier(0.25, 1, 0.5, 1)"
      }))));
      const bottomBar = this.querySelector(".drawer__footer");
      return bottomBar && effects.push(new CustomKeyframeEffect(bottomBar,
      {
        opacity: [0, 1],
        transform: ["translateY(100%)", "translateY(0)"]
      },
      {
        duration: 300,
        delay: 500 + Math.max(125 * navItems.length - 25 * navItems.length, 25),
        easing: "cubic-bezier(0.25, 1, 0.5, 1)"
      })), this._apparitionAnimation = new CustomAnimation(new ParallelEffect(effects))
    }
  }
  attributeChangedCallback(name, oldValue, newValue)
  {
    switch (super.attributeChangedCallback(name, oldValue, newValue), name)
    {
      case "open":
        this.open && this.apparitionAnimation && (Array.from(this.querySelectorAll('.mobile-nav__item[data-level="1"], .drawer__footer')).forEach(item => item.style.opacity = 0), this.apparitionAnimation.play()), triggerEvent(this, this.open ? "mobile-nav:open" : "mobile-nav:close")
    }
  }
};
window.customElements.define("mobile-navigation", MobileNavigation);
var StoreHeader = class extends CustomHTMLElement
{
  connectedCallback()
  {
    window.ResizeObserver && (this.resizeObserver = new ResizeObserver(this._updateCustomProperties.bind(this)), this.resizeObserver.observe(this), this.resizeObserver.observe(this.querySelector(".header__wrapper"))), this.isTransparent && (this.isTransparencyDetectionLocked = !1, this.delegate.on("desktop-nav:dropdown:open", () => this.lockTransparency = !0), this.delegate.on("desktop-nav:dropdown:close", () => this.lockTransparency = !1), this.rootDelegate.on("mobile-nav:open", () => this.lockTransparency = !0), this.rootDelegate.on("mobile-nav:close", () => this.lockTransparency = !1), this.delegate.on("mouseenter", this._checkTransparentHeader.bind(this), !0), this.delegate.on("mouseleave", this._checkTransparentHeader.bind(this)), this.isSticky && (this._checkTransparentHeader(), this._onWindowScrollListener = throttle(this._checkTransparentHeader.bind(this), 100), window.addEventListener("scroll", this._onWindowScrollListener)))
  }
  disconnectedCallback()
  {
    super.disconnectedCallback(), window.ResizeObserver && this.resizeObserver.disconnect(), this.isTransparent && this.isSticky && window.removeEventListener("scroll", this._onWindowScrollListener)
  }
  get isSticky()
  {
    return this.hasAttribute("sticky")
  }
  get isTransparent()
  {
    return this.hasAttribute("transparent")
  }
  get transparentHeaderThreshold()
  {
    return 25
  }
  set lockTransparency(value)
  {
    this.isTransparencyDetectionLocked = value, this._checkTransparentHeader()
  }
  _updateCustomProperties(entries)
  {
    entries.forEach(entry =>
    {
      if (entry.target === this)
      {
        const height = entry.borderBoxSize ? entry.borderBoxSize.length > 0 ? entry.borderBoxSize[0].blockSize : entry.borderBoxSize.blockSize : entry.target.clientHeight;
        document.documentElement.style.setProperty("--header-height", `${height}px`)
      }
      if (entry.target.classList.contains("header__wrapper"))
      {
        const heightWithoutNav = entry.borderBoxSize ? entry.borderBoxSize.length > 0 ? entry.borderBoxSize[0].blockSize : entry.borderBoxSize.blockSize : entry.target.clientHeight;
        document.documentElement.style.setProperty("--header-height-without-bottom-nav", `${heightWithoutNav}px`)
      }
    })
  }
  _checkTransparentHeader(event)
  {
    this.isTransparencyDetectionLocked || window.scrollY > this.transparentHeaderThreshold || event && event.type === "mouseenter" ? this.classList.remove("header--transparent") : this.classList.add("header--transparent")
  }
};
window.customElements.define("store-header", StoreHeader);
var GiftCardRecipient = class extends HTMLElement
{
  connectedCallback()
  {
    const properties = Array.from(this.querySelectorAll('[name*="properties"]')),
      checkboxPropertyName = "properties[__shopify_send_gift_card_to_recipient]";
    this.recipientCheckbox = properties.find(input => input.name === checkboxPropertyName), this.recipientOtherProperties = properties.filter(input => input.name !== checkboxPropertyName), this.recipientFieldsContainer = this.querySelector(".gift-card-recipient__fields"), this.recipientCheckbox?.addEventListener("change", this._synchronizeProperties.bind(this)), this.offsetProperty = this.querySelector('[name="properties[__shopify_offset]"]'), this.offsetProperty && (this.offsetProperty.value = new Date().getTimezoneOffset().toString()), this.recipientSendOnProperty = this.querySelector('[name="properties[Send on]"]');
    const minDate = new Date,
      maxDate = new Date;
    maxDate.setDate(minDate.getDate() + 90), this.recipientSendOnProperty?.setAttribute("min", this._formatDate(minDate)), this.recipientSendOnProperty?.setAttribute("max", this._formatDate(maxDate)), this._synchronizeProperties()
  }
  _synchronizeProperties()
  {
    this.recipientOtherProperties.forEach(property => property.disabled = !this.recipientCheckbox.checked), this.recipientFieldsContainer.classList.toggle("js:hidden", !this.recipientCheckbox.checked)
  }
  _formatDate(date)
  {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60 * 1e3).toISOString().split("T")[0]
  }
};
window.customElements.get("gift-card-recipient") || window.customElements.define("gift-card-recipient", GiftCardRecipient);
var PhotoSwipeUi = class
  {
    constructor(pswp)
    {
      this.photoSwipeInstance = pswp, this.delegate = new main_default(this.photoSwipeInstance.scrollWrap), this.maxSpreadZoom = window.themeVariables.settings.mobileZoomFactor || 2, this.pswpUi = this.photoSwipeInstance.scrollWrap.querySelector(".pswp__ui"), this.delegate.on("click", '[data-action="pswp-close"]', this._close.bind(this)), this.delegate.on("click", '[data-action="pswp-prev"]', this._goToPrev.bind(this)), this.delegate.on("click", '[data-action="pswp-next"]', this._goToNext.bind(this)), this.delegate.on("click", '[data-action="pswp-move-to"]', this._moveTo.bind(this)), this.photoSwipeInstance.listen("close", this._onPswpClosed.bind(this)), this.photoSwipeInstance.listen("doubleTap", this._onPswpDoubleTap.bind(this)), this.photoSwipeInstance.listen("beforeChange", this._onPswpBeforeChange.bind(this)), this.photoSwipeInstance.listen("initialZoomInEnd", this._onPswpInitialZoomInEnd.bind(this)), this.photoSwipeInstance.listen("initialZoomOut", this._onPswpInitialZoomOut.bind(this)), this.photoSwipeInstance.listen("parseVerticalMargin", this._onPswpParseVerticalMargin.bind(this)), this.delegate.on("pswpTap", ".pswp__img", this._onPswpTap.bind(this))
    }
    init()
    {
      const prevNextButtons = this.pswpUi.querySelector(".pswp__prev-next-buttons"),
        dotsNavWrapper = this.pswpUi.querySelector(".pswp__dots-nav-wrapper");
      if (this.photoSwipeInstance.items.length <= 1)
      {
        prevNextButtons.style.display = "none", dotsNavWrapper.style.display = "none";
        return
      }
      prevNextButtons.style.display = "", dotsNavWrapper.style.display = "";
      let dotsNavHtml = "";
      this.photoSwipeInstance.items.forEach((item, index) =>
      {
        dotsNavHtml += `
        <button class="dots-nav__item tap-area" ${index===0?'aria-current="true"':""} data-action="pswp-move-to">
          <span class="visually-hidden">Go to slide ${index}</span>
        </button>
      `
      }), dotsNavWrapper.querySelector(".pswp__dots-nav-wrapper .dots-nav").innerHTML = dotsNavHtml
    }
    _close()
    {
      this.photoSwipeInstance.close()
    }
    _goToPrev()
    {
      this.photoSwipeInstance.prev()
    }
    _goToNext()
    {
      this.photoSwipeInstance.next()
    }
    _moveTo(event, target)
    {
      this.photoSwipeInstance.goTo([...target.parentNode.children].indexOf(target))
    }
    _onPswpClosed()
    {
      this.delegate.off("pswpTap")
    }
    _onPswpDoubleTap(point)
    {
      const initialZoomLevel = this.photoSwipeInstance.currItem.initialZoomLevel;
      this.photoSwipeInstance.getZoomLevel() !== initialZoomLevel ? this.photoSwipeInstance.zoomTo(initialZoomLevel, point, 333) : this.photoSwipeInstance.zoomTo(initialZoomLevel < .7 ? 1 : this.maxSpreadZoom, point, 333)
    }
    _onPswpTap(event)
    {
      event.detail.pointerType === "mouse" && this.photoSwipeInstance.toggleDesktopZoom(event.detail.releasePoint)
    }
    _onPswpBeforeChange()
    {
      if (this.photoSwipeInstance.items.length <= 1) return;
      const activeDot = this.photoSwipeInstance.scrollWrap.querySelector(`.dots-nav__item:nth-child(${this.photoSwipeInstance.getCurrentIndex()+1})`);
      activeDot.setAttribute("aria-current", "true"), getSiblings(activeDot).forEach(item => item.removeAttribute("aria-current"))
    }
    _onPswpInitialZoomInEnd()
    {
      this.pswpUi?.classList.remove("pswp__ui--hidden")
    }
    _onPswpInitialZoomOut()
    {
      this.pswpUi?.classList.add("pswp__ui--hidden")
    }
    _onPswpParseVerticalMargin(item)
    {
      item.vGap.bottom = this.photoSwipeInstance.items.length <= 1 || window.matchMedia(window.themeVariables.breakpoints.lapAndUp).matches ? 0 : 60
    }
  },
  ProductImageZoom = class extends OpenableElement
  {
    connectedCallback()
    {
      super.connectedCallback(), this.mediaElement = this.closest(".product__media"), this.maxSpreadZoom = window.themeVariables.settings.mobileZoomFactor || 2, LibraryLoader.load("photoswipe")
    }
    disconnectedCallback()
    {
      super.disconnectedCallback(), this.photoSwipeInstance?.destroy()
    }
    async attributeChangedCallback(name, oldValue, newValue)
    {
      switch (super.attributeChangedCallback(name, oldValue, newValue), name)
      {
        case "open":
          this.open && (await LibraryLoader.load("photoswipe"), this._openPhotoSwipe())
      }
    }
    async _openPhotoSwipe()
    {
      const items = await this._buildItems();
      this.photoSwipeInstance = new window.ThemePhotoSwipe(this, PhotoSwipeUi, items,
      {
        index: items.findIndex(item => item.selected),
        maxSpreadZoom: this.maxSpreadZoom,
        loop: !1,
        allowPanToNext: !1,
        closeOnScroll: !1,
        closeOnVerticalDrag: MediaFeatures.supportsHover(),
        showHideOpacity: !0,
        arrowKeys: !0,
        history: !1,
        getThumbBoundsFn: () =>
        {
          const thumbnail = this.mediaElement.querySelector(".product__media-item.is-selected"),
            pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
            rect = thumbnail.getBoundingClientRect();
          return {
            x: rect.left,
            y: rect.top + pageYScroll,
            w: rect.width
          }
        },
        getDoubleTapZoom: (isMouseClick, item) => isMouseClick ? item.w > item.h ? 1.6 : 1 : item.initialZoomLevel < .7 ? 1 : 1.33
      });
      let lastWidth = null;
      this.photoSwipeInstance.updateSize = new Proxy(this.photoSwipeInstance.updateSize,
      {
        apply: (target, thisArg, argArray) =>
        {
          lastWidth !== window.innerWidth && (target(arguments), lastWidth = window.innerWidth)
        }
      }), this.photoSwipeInstance.listen("close", () =>
      {
        this.open = !1
      }), this.photoSwipeInstance.init()
    }
    async _buildItems()
    {
      console.log('here is start _buildItems function ... ... ...');
      const activeImages = Array.from(this.mediaElement.querySelectorAll('.product__media-item[data-media-type="image"]:not(.is-filtered)')),
        product = await ProductLoader.load(this.getAttribute("product-handle"));
      return Promise.resolve(activeImages.map(item =>
      {
        const matchedMedia = product.media.find(media => media.id === parseInt(item.getAttribute("data-media-id")));
        console.log('matchedMedia', matchedMedia);
        const supportedSizes = getSupportedSizes(matchedMedia, [200, 300, 400, 500, 600, 700, 800, 1e3, 1200, 1400, 1600, 1800, 2e3, 2200, 2400, 2600, 2800, 3e3]),
          desiredWidth = Math.min(supportedSizes[supportedSizes.length - 1], window.innerWidth);
        return {
          selected: item.classList.contains("is-selected"),
          src: getSizedMediaUrl(matchedMedia, `${Math.ceil(Math.min(desiredWidth*window.devicePixelRatio*this.maxSpreadZoom,3e3))}x`),
          msrc: item.firstElementChild.currentSrc,
          originalMedia: matchedMedia,
          w: desiredWidth,
          h: parseInt(desiredWidth / matchedMedia.aspect_ratio)
        }
      }))
    }
  };
window.customElements.define("product-image-zoom", ProductImageZoom);
var ProductInventory = class extends HTMLElement
{
  connectedCallback()
  {
    const scriptTag = this.querySelector("script");
    scriptTag && (this.inventories = JSON.parse(scriptTag.innerHTML), document.getElementById(this.getAttribute("form-id"))?.addEventListener("variant:changed", this._onVariantChanged.bind(this)))
  }
  _onVariantChanged(event)
  {
    this.querySelector("span")?.remove(), event.detail.variant && this.inventories[event.detail.variant.id] !== "" ? (this.hidden = !1, this.insertAdjacentHTML("afterbegin", this.inventories[event.detail.variant.id])) : this.hidden = !0
  }
};
window.customElements.define("product-inventory", ProductInventory);
var PaymentContainer = class extends HTMLElement
{
  connectedCallback()
  {
    document.getElementById(this.getAttribute("form-id"))?.addEventListener("variant:changed", this._onVariantChanged.bind(this)), Shopify.designMode && Shopify.PaymentButton && Shopify.PaymentButton.init()
  }
  _onVariantChanged(event)
  {
    this._updateAddToCartButton(event.detail.variant), this._updateDynamicCheckoutButton(event.detail.variant)
  }
  _updateAddToCartButton(variant)
  {
    let addToCartButtonElement = this.querySelector("[data-product-add-to-cart-button]");
    if (!addToCartButtonElement) return;
    let addToCartButtonText = "";
    addToCartButtonElement.classList.remove("button--primary", "button--secondary", "button--ternary"), variant ? variant.available ? (addToCartButtonElement.removeAttribute("disabled"), addToCartButtonElement.classList.add(addToCartButtonElement.hasAttribute("data-use-primary") ? "button--primary" : "button--secondary"), addToCartButtonText = addToCartButtonElement.getAttribute("data-button-content")) : (addToCartButtonElement.setAttribute("disabled", "disabled"), addToCartButtonElement.classList.add("button--ternary"), addToCartButtonText = window.themeVariables.strings.productFormSoldOut) : (addToCartButtonElement.setAttribute("disabled", "disabled"), addToCartButtonElement.classList.add("button--ternary"), addToCartButtonText = window.themeVariables.strings.productFormUnavailable), addToCartButtonElement.getAttribute("is") === "loader-button" ? addToCartButtonElement.firstElementChild.innerHTML = addToCartButtonText : addToCartButtonElement.innerHTML = addToCartButtonText
  }
  _updateDynamicCheckoutButton(variant)
  {
    let paymentButtonElement = this.querySelector(".shopify-payment-button");
    paymentButtonElement && (paymentButtonElement.style.display = !variant || !variant.available ? "none" : "block")
  }
};
window.customElements.define("product-payment-container", PaymentContainer);
var PaymentTerms = class extends CustomHTMLElement
{
  connectedCallback()
  {
    document.getElementById(this.getAttribute("form-id"))?.addEventListener("variant:changed", this._onVariantChanged.bind(this))
  }
  _onVariantChanged(event)
  {
    const variant = event.detail.variant;
    if (variant)
    {
      const idElement = this.querySelector('[name="id"]');
      idElement.value = variant.id, idElement.dispatchEvent(new Event("change",
      {
        bubbles: !0
      }))
    }
  }
};
window.customElements.define("product-payment-terms", PaymentTerms);
var ProductForm = class extends HTMLFormElement
{
  connectedCallback()
  {
    this.id.disabled = !1, this.addEventListener("submit", this._onSubmit.bind(this))
  }
  async _onSubmit(event)
  {
    if (event.preventDefault(), !this.checkValidity())
    {
      this.reportValidity();
      return
    }
    const submitButtons = Array.from(this.elements).filter(button => button.type === "submit");
    submitButtons.forEach(submitButton =>
    {
      submitButton.setAttribute("disabled", "disabled"), submitButton.setAttribute("aria-busy", "true")
    });
    const productForm = new FormData(this);
    productForm.append("sections", ["mini-cart"]), productForm.delete("option1"), productForm.delete("option2"), productForm.delete("option3");
    const response = await fetch(`${window.themeVariables.routes.cartAddUrl}.js`,
    {
      body: productForm,
      method: "POST",
      headers:
      {
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    submitButtons.forEach(submitButton =>
    {
      submitButton.removeAttribute("disabled"), submitButton.removeAttribute("aria-busy")
    });
    const responseJson = await response.json();
    if (response.ok)
    {
      if (window.themeVariables.settings.cartType === "page" || window.themeVariables.settings.pageType === "cart") return window.location.href = `${Shopify.routes.root}cart`;
      this.dispatchEvent(new CustomEvent("variant:added",
      {
        bubbles: !0,
        detail:
        {
          variant: responseJson.hasOwnProperty("items") ? responseJson.items[0] : responseJson
        }
      })), fetch(`${window.themeVariables.routes.cartUrl}.js`).then(async response2 =>
      {
        const cartContent = await response2.json();
        document.documentElement.dispatchEvent(new CustomEvent("cart:updated",
        {
          bubbles: !0,
          detail:
          {
            cart: cartContent
          }
        })), cartContent.sections = responseJson.sections, document.documentElement.dispatchEvent(new CustomEvent("cart:refresh",
        {
          bubbles: !0,
          detail:
          {
            cart: cartContent,
            openMiniCart: window.themeVariables.settings.cartType === "drawer" && this.closest(".drawer") === null
          }
        }))
      })
    }
    this.dispatchEvent(new CustomEvent("cart-notification:show",
    {
      bubbles: !0,
      cancelable: !0,
      detail:
      {
        status: response.ok ? "success" : "error",
        error: responseJson.description || ""
      }
    }))
  }
};
window.customElements.define("product-form", ProductForm,
{
  extends: "form"
});
var ProductMedia = class extends CustomHTMLElement
{
  async connectedCallback()
  {
    this.mainCarousel = this.querySelector("flickity-carousel"), this.hasAttribute("reveal-on-scroll") && this._setupVisibility(), this.mainCarousel.childElementCount !== 1 && (this.selectedVariantMediaId = null, this.viewInSpaceElement = this.querySelector("[data-shopify-model3d-id]"), this.zoomButton = this.querySelector(".product__zoom-button"), this.product = await ProductLoader.load(this.getAttribute("product-handle")), document.getElementById(this.getAttribute("form-id"))?.addEventListener("variant:changed", this._onVariantChanged.bind(this)), this.mainCarousel.addEventListener("model:played", () => this.mainCarousel.setDraggable(!1)), this.mainCarousel.addEventListener("model:paused", () => this.mainCarousel.setDraggable(!0)), this.mainCarousel.addEventListener("video:played", () => this.mainCarousel.setDraggable(!1)), this.mainCarousel.addEventListener("video:paused", () => this.mainCarousel.setDraggable(!0)), this.mainCarousel.addEventListener("flickity:ready", this._onFlickityReady.bind(this)), this.mainCarousel.addEventListener("flickity:slide-changed", this._onFlickityChanged.bind(this)), this.mainCarousel.addEventListener("flickity:slide-settled", this._onFlickitySettled.bind(this)), this._onFlickityReady())
  }
  get thumbnailsPosition()
  {
    return window.matchMedia(window.themeVariables.breakpoints.pocket).matches ? "bottom" : this.getAttribute("thumbnails-position")
  }
  async _setupVisibility()
  {
    await this.untilVisible();
    const flickityInstance = await this.mainCarousel.flickityInstance,
      image = flickityInstance ? flickityInstance.selectedElement.querySelector("img") : this.querySelector(".product__media-image-wrapper img"),
      prefersReducedMotion = MediaFeatures.prefersReducedMotion();
    await imageLoaded(image);
    const animation = new CustomAnimation(new ParallelEffect([new CustomKeyframeEffect(image,
    {
      opacity: [0, 1],
      transform: [`scale(${prefersReducedMotion?1:1.1})`, "scale(1)"]
    },
    {
      duration: 500,
      easing: "cubic-bezier(0.65, 0, 0.35, 1)"
    }), new ParallelEffect(Array.from(this.querySelectorAll(".product__thumbnail-item:not(.is-filtered)")).map((item, index) => new CustomKeyframeEffect(item,
    {
      opacity: [0, 1],
      transform: this.thumbnailsPosition === "left" ? [`translateY(${prefersReducedMotion?0:"40px"})`, "translateY(0)"] : [`translateX(${prefersReducedMotion?0:"50px"})`, "translateX(0)"]
    },
    {
      duration: 250,
      delay: prefersReducedMotion ? 0 : 100 * index,
      easing: "cubic-bezier(0.75, 0, 0.175, 1)"
    })))]));
    this._hasSectionReloaded ? animation.finish() : animation.play()
  }
  async _onVariantChanged(event)
  {
    const variant = event.detail.variant,
      filteredMediaIds = [];
    let shouldReload = !1;
    if (this.product.media.forEach(media =>
      {
        let matchMedia2 = variant.featured_media && media.id === variant.featured_media.id;
        if (media.alt?.includes("#") && (shouldReload = !0, !matchMedia2))
        {
          const altParts = media.alt.split("#"),
            mediaGroupParts = altParts.pop().split("_");
          this.product.options.forEach(option =>
          {
            option.name.toLowerCase() === mediaGroupParts[0].toLowerCase() && variant.options[option.position - 1].toLowerCase() !== mediaGroupParts[1].trim().toLowerCase() && filteredMediaIds.push(media.id)
          })
        }
      }), [...new Set(Array.from(this.querySelectorAll(".is-filtered[data-media-id]")).map(item => parseInt(item.getAttribute("data-media-id"))))].some(value => !filteredMediaIds.includes(value)))
    {
      const selectedMediaId = variant.featured_media ? variant.featured_media.id : this.product.media.map(item => item.id).filter(item => !filteredMediaIds.includes(item))[0];
      Array.from(this.querySelectorAll("[data-media-id]")).forEach(item =>
      {
        item.classList.toggle("is-filtered", filteredMediaIds.includes(parseInt(item.getAttribute("data-media-id")))), item.classList.toggle("is-selected", selectedMediaId === parseInt(item.getAttribute("data-media-id"))), item.classList.toggle("is-initial-selected", selectedMediaId === parseInt(item.getAttribute("data-media-id")))
      }), this.mainCarousel.reload()
    }
    else
    {
      if (!event.detail.variant.featured_media || this.selectedVariantMediaId === event.detail.variant.featured_media.id) return;
      this.mainCarousel.select(`[data-media-id="${event.detail.variant.featured_media.id}"]`)
    }
    this.selectedVariantMediaId = event.detail.variant.featured_media ? event.detail.variant.featured_media.id : null
  }
  async _onFlickityReady()
  {
    const flickityInstance = await this.mainCarousel.flickityInstance;
    ["video", "external_video"].includes(flickityInstance.selectedElement.getAttribute("data-media-type")) && this.hasAttribute("autoplay-video") && flickityInstance.selectedElement.firstElementChild.play()
  }
  async _onFlickityChanged()
  {
    (await this.mainCarousel.flickityInstance).cells.forEach(item =>
    {
      ["external_video", "video", "model"].includes(item.element.getAttribute("data-media-type")) && item.element.firstElementChild.pause()
    })
  }
  async _onFlickitySettled()
  {
    const flickityInstance = await this.mainCarousel.flickityInstance,
      selectedSlide = flickityInstance.selectedElement;
    switch (this.zoomButton && (this.zoomButton.hidden = selectedSlide.getAttribute("data-media-type") !== "image"), this.viewInSpaceElement && this.viewInSpaceElement.setAttribute("data-shopify-model3d-id", this.viewInSpaceElement.getAttribute("data-shopify-model3d-default-id")), selectedSlide.getAttribute("data-media-type"))
    {
      case "model":
        this.viewInSpaceElement.setAttribute("data-shopify-model3d-id", selectedSlide.getAttribute("data-media-id")), selectedSlide.firstElementChild.play();
        break;
      case "external_video":
      case "video":
        this.hasAttribute("autoplay-video") && selectedSlide.firstElementChild.play();
        break
    }
  }
};
window.customElements.define("product-media", ProductMedia);

function formatMoney(cents, format = "")
{
  typeof cents == "string" && (cents = cents.replace(".", ""));
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
    formatString = format || window.themeVariables.settings.moneyFormat;

  function defaultTo(value2, defaultValue)
  {
    return value2 == null || value2 !== value2 ? defaultValue : value2
  }

  function formatWithDelimiters(number, precision, thousands, decimal)
  {
    if (precision = defaultTo(precision, 2), thousands = defaultTo(thousands, ","), decimal = defaultTo(decimal, "."), isNaN(number) || number == null) return 0;
    number = (number / 100).toFixed(precision);
    let parts = number.split("."),
      dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
      centsAmount = parts[1] ? decimal + parts[1] : "";
    return dollarsAmount + centsAmount
  }
  let value = "";
  switch (formatString.match(placeholderRegex)[1])
  {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_space_separator":
      value = formatWithDelimiters(cents, 2, " ", ".");
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_with_apostrophe_separator":
      value = formatWithDelimiters(cents, 2, "'", ".");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
    case "amount_no_decimals_with_space_separator":
      value = formatWithDelimiters(cents, 0, " ");
      break;
    case "amount_no_decimals_with_apostrophe_separator":
      value = formatWithDelimiters(cents, 0, "'");
      break
  }
  return formatString.indexOf("with_comma_separator") !== -1, formatString.replace(placeholderRegex, value)
}
var ProductMeta = class extends HTMLElement
{
  connectedCallback()
  {
    document.getElementById(this.getAttribute("form-id"))?.addEventListener("variant:changed", this._onVariantChanged.bind(this))
  }
  get priceClass()
  {
    return this.getAttribute("price-class") || ""
  }
  get unitPriceClass()
  {
    return this.getAttribute("unit-price-class") || ""
  }
  _onVariantChanged(event)
  {
    this._updateLabels(event.detail.variant), this._updatePrices(event.detail.variant), this._updateSku(event.detail.variant)
  }
  _updateLabels(variant)
  {
    let productLabelList = this.querySelector("[data-product-label-list]");
    if (productLabelList)
    {
      if (!variant) productLabelList.innerHTML = "";
      else if (productLabelList.innerHTML = "", !variant.available) productLabelList.innerHTML = `<span class="label label--subdued">${window.themeVariables.strings.collectionSoldOut}</span>`;
      else if (variant.compare_at_price > variant.price)
      {
        let savings = "";
        window.themeVariables.settings.discountMode === "percentage" ? savings = `${Math.round((variant.compare_at_price-variant.price)*100/variant.compare_at_price)}%` : savings = formatMoney(variant.compare_at_price - variant.price), productLabelList.innerHTML = `<span class="label label--highlight">${window.themeVariables.strings.collectionDiscount.replace("@savings@",savings)}</span>`
      }
    }
  }
  _updatePrices(variant)
  {
    let productPrices = this.querySelector("[data-product-price-list]"),
      currencyFormat = window.themeVariables.settings.currencyCodeEnabled ? window.themeVariables.settings.moneyWithCurrencyFormat : window.themeVariables.settings.moneyFormat;
    if (productPrices)
      if (!variant) productPrices.style.display = "none";
      else
      {
        let div = productPrices.parentElement;
        const [ vid, pid, spgid, tags, price ] = [
          div.dataset.datoraVid,
          div.dataset.datoraPid,
          div.dataset.datoraSpgid,
          div.dataset.datoraTags,
          div.dataset.datoraPrice
        ]

        if(!(vid && pid && price)) {
          if (productPrices.innerHTML = "", variant.compare_at_price > variant.price ? (productPrices.innerHTML += `<span class="price price--highlight ${this.priceClass}"><span class="visually-hidden">${window.themeVariables.strings.productSalePrice}</span>${formatMoney(variant.price,currencyFormat)}</span>`, productPrices.innerHTML += `<span class="price price--compare"><span class="visually-hidden">${window.themeVariables.strings.productRegularPrice}</span>${formatMoney(variant.compare_at_price,currencyFormat)}</span>`) : productPrices.innerHTML += `<span class="price ${this.priceClass}"><span class="visually-hidden">${window.themeVariables.strings.productSalePrice}</span>${formatMoney(variant.price,currencyFormat)}</span>`, variant.unit_price_measurement)
          {
            let referenceValue = "";
            variant.unit_price_measurement.reference_value !== 1 && (referenceValue = `<span class="unit-price-measurement__reference-value">${variant.unit_price_measurement.reference_value}</span>`), productPrices.innerHTML += `
            <div class="price text--subdued ${this.unitPriceClass}">
              <div class="unit-price-measurement">
                <span class="unit-price-measurement__price">${formatMoney(variant.unit_price)}</span>
                <span class="unit-price-measurement__separator">/</span>
                ${referenceValue}
                <span class="unit-price-measurement__reference-unit">${variant.unit_price_measurement.reference_unit}</span>
              </div>
            </div>
          `
          }
        } else {
         console.log('test');
          co2.itemDiscountFull(Number(pid), Number(vid), tags ? tags.split(',') : [], Number(price), 1, spgid === "" ? null : spgid).then(data => {
            switch(data.calc) {
              case "perc":
                if(data.discPerc === 0) {
                  if (productPrices.innerHTML = "", variant.compare_at_price > variant.price ? (productPrices.innerHTML += `<span class="price price--highlight ${this.priceClass}"><span class="visually-hidden">${window.themeVariables.strings.productSalePrice}</span>${formatMoney(variant.price,currencyFormat)}</span>`, productPrices.innerHTML += `<span class="price price--compare"><span class="visually-hidden">${window.themeVariables.strings.productRegularPrice}</span>${formatMoney(variant.compare_at_price,currencyFormat)}</span>`) : productPrices.innerHTML += `<span class="price ${this.priceClass}"><span class="visually-hidden">${window.themeVariables.strings.productSalePrice}</span>${formatMoney(variant.price,currencyFormat)}</span>`, variant.unit_price_measurement)
                  {
                    let referenceValue = "";
                    variant.unit_price_measurement.reference_value !== 1 && (referenceValue = `<span class="unit-price-measurement__reference-value">${variant.unit_price_measurement.reference_value}</span>`), productPrices.innerHTML += `
                    <div class="price text--subdued ${this.unitPriceClass}">
                      <div class="unit-price-measurement">
                        <span class="unit-price-measurement__price">${formatMoney(variant.unit_price)}</span>
                        <span class="unit-price-measurement__separator">/</span>
                        ${referenceValue}
                        <span class="unit-price-measurement__reference-unit">${variant.unit_price_measurement.reference_unit}</span>
                      </div>
                    </div>
                  `
                  }
                } else {
                  if (productPrices.innerHTML = "", variant.compare_at_price > variant.price ? (productPrices.innerHTML += `<span class="price price--highlight ${this.priceClass}"><span class="visually-hidden">${window.themeVariables.strings.productSalePrice}</span>${formatMoney(variant.price,currencyFormat)}</span>`, productPrices.innerHTML += `<span class="price price--compare"><span class="visually-hidden">${window.themeVariables.strings.productRegularPrice}</span>${formatMoney(variant.compare_at_price,currencyFormat)}</span>`) : productPrices.innerHTML += `<span class="price ${this.priceClass}" data-datora-classes="price ${this.priceClass} price--highlight"><span class="visually-hidden">${window.themeVariables.strings.productSalePrice}</span>${formatMoney(variant.price,currencyFormat)}</span><span class="hidden" data-datora-classes="price ${this.priceClass} price--compare"><span class="visually-hidden">${window.themeVariables.strings.productRegularPrice}</span><span></span></span>`, variant.unit_price_measurement)
                  {
                    let referenceValue = "";
                    variant.unit_price_measurement.reference_value !== 1 && (referenceValue = `<span class="unit-price-measurement__reference-value">${variant.unit_price_measurement.reference_value}</span>`), productPrices.innerHTML += `
                    <div class="price text--subdued ${this.unitPriceClass}">
                      <div class="unit-price-measurement">
                        <span class="unit-price-measurement__price">${formatMoney(variant.unit_price)}</span>
                        <span class="unit-price-measurement__separator">/</span>
                        ${referenceValue}
                        <span class="unit-price-measurement__reference-unit">${variant.unit_price_measurement.reference_unit}</span>
                      </div>
                    </div>
                  `
                  }


                  let originalPriceAsComparePrice = Shopify.formatMoney(price, "€{{amount_with_comma_separator}}");

                  div.querySelectorAll('[data-datora-classes]').forEach(elem => {
                    const newClasses = elem.dataset.datoraClasses;

                    if(newClasses.length === 0) {
                      return;
                    }

                    if(newClasses.includes('price--compare')) {
                      elem.querySelector('span:not(.visually-hidden)').textContent = originalPriceAsComparePrice;
                    }

                    elem.setAttribute('class', newClasses);
                  })
                }
              default:
                break;
            }
          })
        }
        productPrices.style.display = ""
      }
  }
  _updateSku(variant)
  {
    let productSku = this.querySelector("[data-product-sku-container]");
    if (!productSku) return;
    let productSkuNumber = productSku.querySelector("[data-product-sku-number]");
    !variant || !variant.sku ? productSku.style.display = "none" : (productSkuNumber.innerHTML = variant.sku, productSku.style.display = "")
  }
};
window.customElements.define("product-meta", ProductMeta);
var QuickBuyDrawer = class extends DrawerContent
{
  connectedCallback()
  {
    super.connectedCallback(), this.delegate.on("variant:changed", this._onVariantChanged.bind(this))
  }
  async _load()
  {
    await super._load(), this.imageElement = this.querySelector(".quick-buy-product__image"), window.Shopify && window.Shopify.PaymentButton && window.Shopify.PaymentButton.init()
  }
  _onVariantChanged(event)
  {
    const variant = event.detail.variant;
    if (variant && Array.from(this.querySelectorAll('[href*="/products"]')).forEach(link =>
      {
        const url = new URL(link.href);
        url.searchParams.set("variant", variant.id), link.setAttribute("href", url.toString())
      }), !this.imageElement || !variant || !variant.featured_media) return;
    const featuredMedia = variant.featured_media;
    featuredMedia.alt && this.imageElement.setAttribute("alt", featuredMedia.alt), this.imageElement.setAttribute("width", featuredMedia.preview_image.width), this.imageElement.setAttribute("height", featuredMedia.preview_image.height), this.imageElement.setAttribute("src", getSizedMediaUrl(featuredMedia, "342x")), this.imageElement.setAttribute("srcset", getMediaSrcset(featuredMedia, [114, 228, 342]))
  }
};
window.customElements.define("quick-buy-drawer", QuickBuyDrawer);
var QuickBuyPopover = class extends PopoverContent
{
  connectedCallback()
  {
    super.connectedCallback(), this.delegate.on("variant:changed", this._onVariantChanged.bind(this)), this.delegate.on("variant:added", () => this.open = !1)
  }
  async _load()
  {
    await super._load(), this.imageElement = this.querySelector(".quick-buy-product__image")
  }
  _onVariantChanged(event)
  {
    const variant = event.detail.variant;
    if (variant && Array.from(this.querySelectorAll('[href*="/products"]')).forEach(link =>
      {
        const url = new URL(link.href);
        url.searchParams.set("variant", variant.id), link.setAttribute("href", url.toString())
      }), !this.imageElement || !variant || !variant.featured_media) return;
    const featuredMedia = variant.featured_media;
    featuredMedia.alt && this.imageElement.setAttribute("alt", featuredMedia.alt), this.imageElement.setAttribute("width", featuredMedia.preview_image.width), this.imageElement.setAttribute("height", featuredMedia.preview_image.height), this.imageElement.setAttribute("src", getSizedMediaUrl(featuredMedia, "195x")), this.imageElement.setAttribute("srcset", getMediaSrcset(featuredMedia, [65, 130, 195]))
  }
};
window.customElements.define("quick-buy-popover", QuickBuyPopover);
var StorePickup = class extends HTMLElement
{
  connectedCallback()
  {
    document.getElementById(this.getAttribute("form-id"))?.addEventListener("variant:changed", this._onVariantChanged.bind(this))
  }
  _onVariantChanged(event)
  {
    event.detail.variant ? this._renderForVariant(event.detail.variant.id) : this.innerHTML = ""
  }
  async _renderForVariant(id)
  {
    const response = await fetch(`${window.themeVariables.routes.rootUrlWithoutSlash}/variants/${id}?section_id=store-availability`),
      div = document.createElement("div");
    div.innerHTML = await response.text(), this.innerHTML = div.firstElementChild.innerHTML.trim()
  }
};
window.customElements.define("store-pickup", StorePickup);
var ProductVariants = class extends CustomHTMLElement
{
  async connectedCallback()
  {
    if (this.masterSelector = document.getElementById(this.getAttribute("form-id")).id, this.optionSelectors = Array.from(this.querySelectorAll("[data-selector-type]")), !this.masterSelector)
    {
      console.warn(`The variant selector for product with handle ${this.productHandle} is not linked to any product form.`);
      return
    }
    this.product = await ProductLoader.load(this.productHandle), this.delegate.on("change", '[name^="option"]', this._onOptionChanged.bind(this)), this.masterSelector.addEventListener("change", this._onMasterSelectorChanged.bind(this)), this._updateDisableSelectors(), this.selectVariant(this.selectedVariant.id)
  }
  get selectedVariant()
  {
    return this._getVariantById(parseInt(this.masterSelector.value))
  }
  get productHandle()
  {
    return this.getAttribute("handle")
  }
  get hideSoldOutVariants()
  {
    return this.hasAttribute("hide-sold-out-variants")
  }
  get updateUrl()
  {
    return this.hasAttribute("update-url")
  }
  selectVariant(id)
  {
    if (this._isVariantSelectable(this._getVariantById(id)) || (id = this._getFirstMatchingAvailableOrSelectableVariant().id), this.selectedVariant?.id !== id)
    {
      if (this.masterSelector.value = id, this.masterSelector.dispatchEvent(new Event("change",
        {
          bubbles: !0
        })), this.updateUrl && history.replaceState)
      {
        const newUrl = new URL(window.location.href);
        id ? newUrl.searchParams.set("variant", id) : newUrl.searchParams.delete("variant"), window.history.replaceState(
        {
          path: newUrl.toString()
        }, "", newUrl.toString())
      }
      this._updateDisableSelectors(), triggerEvent(this.masterSelector.form, "variant:changed",
      {
        variant: this.selectedVariant
      })
    }
  }
  _onOptionChanged()
  {
    this.selectVariant(this._getVariantFromOptions()?.id)
  }
  _onMasterSelectorChanged()
  {
    (this.selectedVariant?.options || []).forEach((value, index) =>
    {
      let input = this.querySelector(`input[name="option${index+1}"][value="${CSS.escape(value)}"], select[name="option${index+1}"]`),
        triggerChangeEvent = !1;
      input.tagName === "SELECT" ? (triggerChangeEvent = input.value !== value, input.value = value) : input.tagName === "INPUT" && (triggerChangeEvent = !input.checked && input.value === value, input.checked = input.value === value), triggerChangeEvent && input.dispatchEvent(new Event("change",
      {
        bubbles: !0
      }))
    })
  }
  _getVariantById(id)
  {
    return this.product.variants.find(variant => variant.id === id)
  }
  _getVariantFromOptions()
  {
    const options = this._getSelectedOptionValues();
    return this.product.variants.find(variant => variant.options.every((value, index) => value === options[index]))
  }
  _isVariantSelectable(variant)
  {
    return variant ? variant.available || !this.hideSoldOutVariants && !variant.available : !1
  }
  _getFirstMatchingAvailableOrSelectableVariant()
  {
    let options = this._getSelectedOptionValues(),
      matchedVariant = null,
      slicedCount = 0;
    do options.pop(), slicedCount += 1, matchedVariant = this.product.variants.find(variant => this.hideSoldOutVariants ? variant.available && variant.options.slice(0, variant.options.length - slicedCount).every((value, index) => value === options[index]) : variant.options.slice(0, variant.options.length - slicedCount).every((value, index) => value === options[index])); while (!matchedVariant && options.length > 0);
    return matchedVariant
  }
  _getSelectedOptionValues()
  {
    const options = [];
    return Array.from(this.querySelectorAll('input[name^="option"]:checked, select[name^="option"]')).forEach(option => options.push(option.value)), options
  }
  _updateDisableSelectors()
  {
    const selectedVariant = this.selectedVariant;
    if (!selectedVariant) return;
    const applyClassToSelector = (selector, valueIndex, available, hasAtLeastOneCombination) =>
    {
      let selectorType = selector.getAttribute("data-selector-type"),
        cssSelector = "";
      switch (selectorType)
      {
        case "color":
          cssSelector = `.color-swatch`;
          break;
        case "variant-image":
          cssSelector = `.variant-swatch`;
          break;
        case "block":
          cssSelector = `.block-swatch`;
          break;
        case "dropdown":
          cssSelector = `.combo-box__option-item`;
          break
      }
      let element = selector.querySelectorAll(cssSelector)[valueIndex];
      let elements = selector.querySelectorAll(cssSelector);
      if (element.classList.contains('hb_color-swatch') && element.hasAttribute('data-index')) {
        element = selector.querySelector(cssSelector+'[data-index="'+valueIndex+'"]');
      }
      element.toggleAttribute("hidden", !hasAtLeastOneCombination);
      if (this.hideSoldOutVariants) {
        element.toggleAttribute("hidden", !available);
      } else {
        element.classList.toggle("is-disabled", !available);
      }
    };
    this.optionSelectors && this.optionSelectors[0] && this.product.options[0].values.forEach((value, valueIndex) =>
    {
      const hasAtLeastOneCombination = this.product.variants.some(variant => variant.option1 === value && variant),
        hasAvailableVariant = this.product.variants.some(variant => variant.option1 === value && variant.available);
      applyClassToSelector(this.optionSelectors[0], valueIndex, hasAvailableVariant, hasAtLeastOneCombination), this.optionSelectors[1] && this.product.options[1].values.forEach((value2, valueIndex2) =>
      {
        const hasAtLeastOneCombination2 = this.product.variants.some(variant => variant.option2 === value2 && variant.option1 === selectedVariant.option1 && variant),
          hasAvailableVariant2 = this.product.variants.some(variant => variant.option2 === value2 && variant.option1 === selectedVariant.option1 && variant.available);
        applyClassToSelector(this.optionSelectors[1], valueIndex2, hasAvailableVariant2, hasAtLeastOneCombination2), this.optionSelectors[2] && this.product.options[2].values.forEach((value3, valueIndex3) =>
        {
          const hasAtLeastOneCombination3 = this.product.variants.some(variant => variant.option3 === value3 && variant.option1 === selectedVariant.option1 && variant.option2 === selectedVariant.option2 && variant),
            hasAvailableVariant3 = this.product.variants.some(variant => variant.option3 === value3 && variant.option1 === selectedVariant.option1 && variant.option2 === selectedVariant.option2 && variant.available);
          applyClassToSelector(this.optionSelectors[2], valueIndex3, hasAvailableVariant3, hasAtLeastOneCombination3)
        })
      })
    })
  }
};
window.customElements.define("product-variants", ProductVariants);
var ProductItem = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.primaryImageList = Array.from(this.querySelectorAll(".product-item__primary-image")), this.delegate.on("change", ".product-item-meta__swatch-list .color-swatch__radio", this._onColorSwatchChanged.bind(this)), this.delegate.on("mouseenter", ".product-item-meta__swatch-list .color-swatch__item", this._onColorSwatchHovered.bind(this), !0)
  }
  async _onColorSwatchChanged(event, target)
  {
    if (Array.from(this.querySelectorAll('[href*="/products"]')).forEach(link =>
      {
        let url;
        link.tagName === "A" ? url = new URL(link.href) : url = new URL(link.getAttribute("href"), `https://${window.themeVariables.routes.host}`), url.searchParams.set("variant", target.getAttribute("data-variant-id")), link.setAttribute("href", url.toString())
      }), target.hasAttribute("data-variant-featured-media"))
    {
      const newImage = this.primaryImageList.find(image => image.getAttribute("data-media-id") === target.getAttribute("data-variant-featured-media"));
      if (!newImage) return;
      newImage.setAttribute("loading", "eager"), await (newImage.complete ? Promise.resolve() : new Promise(resolve => newImage.onload = resolve)), newImage.removeAttribute("hidden");
      let properties = {};
      console.log('here is console animation');
      Array.from(newImage.parentElement.classList).some(item => ["aspect-ratio--short", "aspect-ratio--tall", "aspect-ratio--square"].includes(item)) ? properties = [
      {
        clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
        transform: "translate(calc(-50% - 20px), -50%)",
        zIndex: 1,
        offset: 0
      },
      {
        clipPath: "polygon(0 0, 20% 0, 5% 100%, 0 100%)",
        transform: "translate(calc(-50% - 20px), -50%)",
        zIndex: 1,
        offset: .3
      },
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        transform: "translate(-50%, -50%)",
        zIndex: 1,
        offset: 1
      }] : properties = [
      {
        clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
        transform: "translateX(-20px)",
        zIndex: 1,
        offset: 0
      },
      {
        clipPath: "polygon(0 0, 20% 0, 5% 100%, 0 100%)",
        transform: "translateX(-20px)",
        zIndex: 1,
        offset: .3
      },
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        transform: "translateX(0px)",
        zIndex: 1,
        offset: 1
      }], await newImage.animate(properties,
      {
        // duration: 500,
        // easing: "ease-in-out"
      }).finished, this.primaryImageList.filter(image => image.classList.contains("product-item__primary-image") && image !== newImage).forEach(image => image.setAttribute("hidden", ""))
    }
  }
  _onColorSwatchHovered(event, target)
  {
    const input = target.previousElementSibling;
    input.hasAttribute("data-variant-featured-media") && this.primaryImageList.find(image => image.getAttribute("data-media-id") === input.getAttribute("data-variant-featured-media")).setAttribute("loading", "eager")
  }
};
window.customElements.define("product-item", ProductItem);
var ProductFacet = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.delegate.on("pagination:page-changed", this._rerender.bind(this)), this.delegate.on("facet:criteria-changed", this._rerender.bind(this)), this.delegate.on("facet:abort-loading", this._abort.bind(this))
  }
  async _rerender(event)
  {
    history.replaceState(
    {}, "", event.detail.url), this._abort(), this.showLoadingBar();
    const url = new URL(window.location);
    url.searchParams.set("section_id", this.getAttribute("section-id"));
    try
    {
      this.abortController = new AbortController;
      const responseAsText = await (await fetch(url.toString(),
        {
          signal: this.abortController.signal
        })).text(),
        fakeDiv = document.createElement("div");
      fakeDiv.innerHTML = responseAsText, this.querySelector("#facet-main").innerHTML = fakeDiv.querySelector("#facet-main").innerHTML;
      const activeFilterList = Array.from(fakeDiv.querySelectorAll(".product-facet__active-list")),
        toolbarItem = document.querySelector(".mobile-toolbar__item--filters");
      toolbarItem && toolbarItem.classList.toggle("has-filters", activeFilterList.length > 0);
      const filtersTempDiv = fakeDiv.querySelector("#facet-filters");
      if (filtersTempDiv)
      {
        const previousScrollTop = this.querySelector("#facet-filters .drawer__content").scrollTop;
        Array.from(this.querySelectorAll("#facet-filters-form .collapsible-toggle[aria-controls]")).forEach(filterToggle =>
        {
          const filtersTempDivToggle = filtersTempDiv.querySelector(`[aria-controls="${filterToggle.getAttribute("aria-controls")}"]`),
            isExpanded = filterToggle.getAttribute("aria-expanded") === "true";
          filtersTempDivToggle.setAttribute("aria-expanded", isExpanded ? "true" : "false"), filtersTempDivToggle.nextElementSibling.toggleAttribute("open", isExpanded), filtersTempDivToggle.nextElementSibling.style.overflow = isExpanded ? "visible" : ""
        }), this.querySelector("#facet-filters").innerHTML = filtersTempDiv.innerHTML, this.querySelector("#facet-filters .drawer__content").scrollTop = previousScrollTop
      }
      const scrollTo = this.querySelector(".product-facet__meta-bar") || this.querySelector(".product-facet__product-list") || this.querySelector(".product-facet__main");
      requestAnimationFrame(() =>
      {
        scrollTo.scrollIntoView(
        {
          block: "start",
          behavior: "smooth"
        })
      }), this.hideLoadingBar()
    }
    catch (e)
    {
      if (e.name === "AbortError") return
    }
  }
  _abort()
  {
    this.abortController && this.abortController.abort()
  }
};
window.customElements.define("product-facet", ProductFacet);
var FacetFilters = class extends DrawerContent
{
  connectedCallback()
  {
    super.connectedCallback(), this.delegate.on("change", '[name^="filter."]', this._onFilterChanged.bind(this)), this.rootDelegate.on("click", '[data-action="clear-filters"]', this._onFiltersCleared.bind(this)), this.alwaysVisible && (this.matchMedia = window.matchMedia(window.themeVariables.breakpoints.pocket), this.matchMedia.addListener(this._adjustDrawer.bind(this)), this._adjustDrawer(this.matchMedia))
  }
  get alwaysVisible()
  {
    return this.hasAttribute("always-visible")
  }
  _onFiltersCleared(event, target)
  {
    event.preventDefault(), triggerEvent(this, "facet:criteria-changed",
    {
      url: target.href
    })
  }
  _onFilterChanged()
  {
    const formData = new FormData(this.querySelector("#facet-filters-form")),
      searchParamsAsString = new URLSearchParams(formData).toString();
    triggerEvent(this, "facet:criteria-changed",
    {
      url: `${window.location.pathname}?${searchParamsAsString}`
    })
  }
  _adjustDrawer(match)
  {
    this.classList.toggle("drawer", match.matches), this.classList.toggle("drawer--from-left", match.matches)
  }
};
window.customElements.define("facet-filters", FacetFilters);
var SortByPopover = class extends PopoverContent
{
  connectedCallback()
  {
    super.connectedCallback(), this.delegate.on("change", '[name="sort_by"]', this._onSortChanged.bind(this))
  }
  _onSortChanged(event, target)
  {
    const currentUrl = new URL(location.href);
    currentUrl.searchParams.set("sort_by", target.value), currentUrl.searchParams.delete("page"), this.open = !1, this.dispatchEvent(new CustomEvent("facet:criteria-changed",
    {
      bubbles: !0,
      detail:
      {
        url: currentUrl.toString()
      }
    }))
  }
};
window.customElements.define("sort-by-popover", SortByPopover);
var CartCount = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.rootDelegate.on("cart:updated", event => this.innerText = event.detail.cart.item_count), this.rootDelegate.on("cart:refresh", this._updateCartCount.bind(this))
  }
  _updateCartCount(event)
  {
    event?.detail?.cart ? this.innerText = event.detail.cart.item_count : fetch(Shopify.routes.root + "cart.js").then(response =>
    {
      response.json().then(responseAsJson =>
      {
        this.innerText = responseAsJson.item_count
      })
    })
  }
};
window.customElements.define("cart-count", CartCount);
var CartDrawer = class extends DrawerContent
{
  connectedCallback()
  {
    super.connectedCallback(), this.nextReplacementDelay = 0, this.rootDelegate.on("cart:refresh", this._rerenderCart.bind(this)), this.addEventListener("variant:added", () => this.nextReplacementDelay = 600)
  }
  async _rerenderCart(event)
  {
    let cartContent = null,
      html = "";
    event.detail && event.detail.cart && event.detail.cart.sections ? (cartContent = event.detail.cart, html = event.detail.cart.sections["mini-cart"]) : html = await (await fetch(`${window.themeVariables.routes.cartUrl}?section_id=${this.getAttribute("section")}`)).text();
    const fakeDiv = document.createElement("div");
    fakeDiv.innerHTML = html, setTimeout(async () =>
    {
      const previousPosition = this.querySelector(".drawer__content").scrollTop;
      if (cartContent && cartContent.item_count === 0)
      {
        const animation = new CustomAnimation(new ParallelEffect(Array.from(this.querySelectorAll(".drawer__content, .drawer__footer")).map(item => new CustomKeyframeEffect(item,
        {
          opacity: [1, 0]
        },
        {
          duration: 250,
          easing: "ease-in"
        }))));
        animation.play(), await animation.finished
      }
      this.innerHTML = fakeDiv.querySelector("cart-drawer").innerHTML, cartContent && cartContent.item_count === 0 ? this.querySelector(".drawer__content").animate(
      {
        opacity: [0, 1],
        transform: ["translateY(40px)", "translateY(0)"]
      },
      {
        duration: 450,
        easing: "cubic-bezier(0.33, 1, 0.68, 1)"
      }) : this.querySelector(".drawer__content").scrollTop = previousPosition, event?.detail?.openMiniCart && (this.clientWidth, this.open = !0)
    }, event?.detail?.replacementDelay || this.nextReplacementDelay), this.nextReplacementDelay = 0
  }
  async attributeChangedCallback(name, oldValue, newValue)
  {
    switch (super.attributeChangedCallback(name, oldValue, newValue), name)
    {
      case "open":
        if (this.open && (this.querySelector(".drawer__content").scrollTop = 0, !MediaFeatures.prefersReducedMotion()))
        {
          const lineItems = Array.from(this.querySelectorAll(".line-item")),
            recommendationsInner = this.querySelector(".mini-cart__recommendations-inner"),
            bottomBar = this.querySelector(".drawer__footer"),
            effects = [];
          recommendationsInner && window.matchMedia(window.themeVariables.breakpoints.pocket).matches && lineItems.push(recommendationsInner), lineItems.forEach(item => item.style.opacity = 0), recommendationsInner && (recommendationsInner.style.opacity = 0), bottomBar && (bottomBar.style.opacity = 0), effects.push(new ParallelEffect(lineItems.map((item, index) => new CustomKeyframeEffect(item,
          {
            opacity: [0, 1],
            transform: ["translateX(40px)", "translateX(0)"]
          },
          {
            duration: 400,
            delay: 400 + 120 * index - Math.min(2 * index * index, 120 * index),
            easing: "cubic-bezier(0.25, 1, 0.5, 1)"
          })))), bottomBar && effects.push(new CustomKeyframeEffect(bottomBar,
          {
            opacity: [0, 1],
            transform: ["translateY(100%)", "translateY(0)"]
          },
          {
            duration: 300,
            delay: 400,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)"
          })), recommendationsInner && !window.matchMedia(window.themeVariables.breakpoints.pocket).matches && effects.push(new CustomKeyframeEffect(recommendationsInner,
          {
            opacity: [0, 1],
            transform: ["translateX(100%)", "translateX(0)"]
          },
          {
            duration: 250,
            delay: 400 + Math.max(120 * lineItems.length - 25 * lineItems.length, 25),
            easing: "cubic-bezier(0.25, 1, 0.5, 1)"
          })), new CustomAnimation(new ParallelEffect(effects)).play()
        }
    }
  }
};
window.customElements.define("cart-drawer", CartDrawer);
var _CartDrawerRecommendations = class _CartDrawerRecommendations2 extends HTMLElement
{
  async connectedCallback()
  {
    _CartDrawerRecommendations2.recommendationsCache[this.productId] || (_CartDrawerRecommendations2.recommendationsCache[this.productId] = fetch(`${window.themeVariables.routes.productRecommendationsUrl}?product_id=${this.productId}&limit=10&section_id=${this.sectionId}`));
    const response = await _CartDrawerRecommendations2.recommendationsCache[this.productId],
      div = document.createElement("div");
    div.innerHTML = await response.clone().text();
    const productRecommendationsElement = div.querySelector("cart-drawer-recommendations");
    productRecommendationsElement && productRecommendationsElement.hasChildNodes() ? this.innerHTML = productRecommendationsElement.innerHTML : this.hidden = !0
  }
  get productId()
  {
    return this.getAttribute("product-id")
  }
  get sectionId()
  {
    return this.getAttribute("section-id")
  }
};
__publicField(_CartDrawerRecommendations, "recommendationsCache",
{});
var CartDrawerRecommendations = _CartDrawerRecommendations;
window.customElements.define("cart-drawer-recommendations", CartDrawerRecommendations);
var CartNote = class extends HTMLTextAreaElement
{
  connectedCallback()
  {
    this.addEventListener("change", this._onNoteChanged.bind(this))
  }
  get ownedToggle()
  {
    return this.hasAttribute("aria-owns") ? document.getElementById(this.getAttribute("aria-owns")) : null
  }
  async _onNoteChanged()
  {
    this.ownedToggle && (this.ownedToggle.innerHTML = this.value === "" ? window.themeVariables.strings.cartAddOrderNote : window.themeVariables.strings.cartEditOrderNote);
    const cartContent = await (await fetch(`${window.themeVariables.routes.cartUrl}/update.js`,
    {
      body: JSON.stringify(
      {
        note: this.value
      }),
      credentials: "same-origin",
      method: "POST",
      headers:
      {
        "Content-Type": "application/json"
      }
    })).json();
    document.documentElement.dispatchEvent(new CustomEvent("cart:updated",
    {
      bubbles: !0,
      detail:
      {
        cart: cartContent
      }
    }))
  }
};
window.customElements.define("cart-note", CartNote,
{
  extends: "textarea"
});
var FreeShippingBar = class extends HTMLElement
{
  connectedCallback()
  {
    document.documentElement.addEventListener("cart:updated", this._onCartUpdated.bind(this))
  }
  get threshold()
  {
    return parseFloat(this.getAttribute("threshold"))
  }
  _onCartUpdated(event)
  {
    const totalPrice = event.detail.cart.items.filter(item => item.requires_shipping).reduce((sum, item) => sum + item.final_line_price, 0);
    this.style.setProperty("--progress", Math.min(totalPrice / this.threshold, 1))
  }
};
window.customElements.define("free-shipping-bar", FreeShippingBar);
var LineItemQuantity = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.delegate.on("click", "a", this._onQuantityLinkClicked.bind(this)), this.delegate.on("change", "input", this._onQuantityChanged.bind(this))
  }
  _onQuantityLinkClicked(event, target)
  {
    event.preventDefault(), this._updateFromLink(target.href)
  }
  _onQuantityChanged(event, target)
  {
    this._updateFromLink(`${window.themeVariables.routes.cartChangeUrl}?quantity=${target.value}&line=${target.getAttribute("data-line")}`)
  }
  async _updateFromLink(link)
  {
    if (window.themeVariables.settings.pageType === "cart")
    {
      window.location.href = link;
      return
    }
    const changeUrl = new URL(link, `https://${window.themeVariables.routes.host}`),
      searchParams = changeUrl.searchParams,
      line = searchParams.get("line"),
      id = searchParams.get("id"),
      quantity = parseInt(searchParams.get("quantity"));
    this.dispatchEvent(new CustomEvent("line-item-quantity:change:start",
    {
      bubbles: !0,
      detail:
      {
        newLineQuantity: quantity
      }
    }));
    const cartContent = await (await fetch(`${window.themeVariables.routes.cartChangeUrl}.js`,
    {
      body: JSON.stringify(
      {
        line,
        id,
        quantity,
        sections: ["mini-cart"]
      }),
      credentials: "same-origin",
      method: "POST",
      headers:
      {
        "Content-Type": "application/json"
      }
    })).json();
    this.dispatchEvent(new CustomEvent("line-item-quantity:change:end",
    {
      bubbles: !0,
      detail:
      {
        cart: cartContent,
        newLineQuantity: quantity
      }
    })), document.documentElement.dispatchEvent(new CustomEvent("cart:updated",
    {
      bubbles: !0,
      detail:
      {
        cart: cartContent
      }
    })), document.documentElement.dispatchEvent(new CustomEvent("cart:refresh",
    {
      bubbles: !0,
      detail:
      {
        cart: cartContent,
        replacementDelay: quantity === 0 ? 600 : 750
      }
    }))
  }
};
window.customElements.define("line-item-quantity", LineItemQuantity);
var LineItem = class extends HTMLElement
{
  connectedCallback()
  {
    this.lineItemLoader = this.querySelector(".line-item__loader"), this.addEventListener("line-item-quantity:change:start", this._onQuantityStart.bind(this)), this.addEventListener("line-item-quantity:change:end", this._onQuantityEnd.bind(this))
  }
  _onQuantityStart()
  {
    this.lineItemLoader && (this.lineItemLoader.hidden = !1, this.lineItemLoader.firstElementChild.hidden = !1, this.lineItemLoader.lastElementChild.hidden = !0)
  }
  async _onQuantityEnd(event)
  {
    event.detail.cart.item_count !== 0 && this.lineItemLoader && (await this.lineItemLoader.firstElementChild.animate(
    {
      opacity: [1, 0],
      transform: ["translateY(0)", "translateY(-10px)"]
    }, 75).finished, this.lineItemLoader.firstElementChild.hidden = !0, event.detail.newLineQuantity === 0 ? (await this.animate(
    {
      opacity: [1, 0],
      height: [`${this.clientHeight}px`, 0]
    },
    {
      duration: 300,
      easing: "ease"
    }).finished, this.remove()) : (this.lineItemLoader.lastElementChild.hidden = !1, await this.lineItemLoader.lastElementChild.animate(
    {
      opacity: [0, 1],
      transform: ["translateY(10px)", "translateY(0)"]
    },
    {
      duration: 75,
      endDelay: 300
    }).finished, this.lineItemLoader.hidden = !0))
  }
};
window.customElements.define("line-item", LineItem);
var CartNotification = class extends CustomHTMLElement
{
  connectedCallback()
  {
    this.rootDelegate.on("cart-notification:show", this._onShow.bind(this), !this.hasAttribute("global")), this.delegate.on("click", '[data-action="close"]', event =>
    {
      event.stopPropagation(), this.hidden = !0
    }), this.addEventListener("mouseenter", this.stopTimer.bind(this)), this.addEventListener("mouseleave", this.startTimer.bind(this)), window.addEventListener("pagehide", () => this.hidden = !0)
  }
  set hidden(value)
  {
    value ? this.stopTimer() : this.startTimer(), this.toggleAttribute("hidden", value)
  }
  get isInsideDrawer()
  {
    return this.classList.contains("cart-notification--drawer")
  }
  stopTimer()
  {
    clearTimeout(this._timeout)
  }
  startTimer()
  {
    this._timeout = setTimeout(() => this.hidden = !0, 3e3)
  }
  _onShow(event)
  {
    if (this.isInsideDrawer && !this.closest(".drawer").open || this.hasAttribute("global") && event.detail.status === "success" && window.themeVariables.settings.cartType === "drawer") return;
    event.stopPropagation();
    let closeButtonHtml = "";
    this.isInsideDrawer || (closeButtonHtml = `
        <button class="cart-notification__close tap-area hidden-phone" data-action="close">
          <span class="visually-hidden">${window.themeVariables.strings.accessibilityClose}</span>
          <svg focusable="false" width="14" height="14" class="icon icon--close icon--inline" viewBox="0 0 14 14">
            <path d="M13 13L1 1M13 1L1 13" stroke="currentColor" stroke-width="2" fill="none"></path>
          </svg>
        </button>
      `), event.detail.status === "success" ? (this.classList.remove("cart-notification--error"), this.innerHTML = `
        <div class="cart-notification__overflow">
          <div class="container">
            <div class="cart-notification__wrapper">
              <svg focusable="false" width="20" height="20" class="icon icon--cart-notification" viewBox="0 0 20 20">
                <rect width="20" height="20" rx="10" fill="currentColor"></rect>
                <path d="M6 10L9 13L14 7" fill="none" stroke="rgb(var(--success-color))" stroke-width="2"></path>
              </svg>
              
              <div class="cart-notification__text-wrapper">
                <span class="cart-notification__heading heading hidden-phone">${window.themeVariables.strings.cartItemAdded}</span>
                <span class="cart-notification__heading heading hidden-tablet-and-up">${window.themeVariables.strings.cartItemAddedShort}</span>
                <a href="${window.themeVariables.routes.cartUrl}" class="cart-notification__view-cart link">${window.themeVariables.strings.cartViewCart}</a>
              </div>
              
              ${closeButtonHtml}
            </div>
          </div>
        </div>
      `) : (this.classList.add("cart-notification--error"), this.innerHTML = `
        <div class="cart-notification__overflow">
          <div class="container">
            <div class="cart-notification__wrapper">
              <svg focusable="false" width="20" height="20" class="icon icon--cart-notification" viewBox="0 0 20 20">
                <rect width="20" height="20" rx="10" fill="currentColor"></rect>
                <path d="M9.6748 13.2798C9.90332 13.0555 10.1763 12.9434 10.4937 12.9434C10.811 12.9434 11.0819 13.0555 11.3062 13.2798C11.5347 13.5041 11.6489 13.7749 11.6489 14.0923C11.6489 14.4097 11.5347 14.6847 11.3062 14.9175C11.0819 15.146 10.811 15.2603 10.4937 15.2603C10.1763 15.2603 9.90332 15.146 9.6748 14.9175C9.45052 14.6847 9.33838 14.4097 9.33838 14.0923C9.33838 13.7749 9.45052 13.5041 9.6748 13.2798ZM9.56689 12.1816V5.19922H11.4141V12.1816H9.56689Z" fill="rgb(var(--error-color))"></path>
              </svg>
              
              <div class="cart-notification__text-wrapper">
                <span class="cart-notification__heading heading">${event.detail.error}</span>
              </div>
              
              ${closeButtonHtml}
            </div>
          </div>
        </div>
      `), this.clientHeight, this.hidden = !1
  }
};
window.customElements.define("cart-notification", CartNotification);
var ShippingEstimator = class extends HTMLElement
{
  connectedCallback()
  {
    this.submitButton = this.querySelector('[type="button"]'), this.submitButton.addEventListener("click", this._estimateShipping.bind(this))
  }
  async _estimateShipping()
  {
    const zip = this.querySelector('[name="shipping-estimator[zip]"]').value,
      country = this.querySelector('[name="shipping-estimator[country]"]').value,
      province = this.querySelector('[name="shipping-estimator[province]"]').value;
    this.submitButton.setAttribute("aria-busy", "true");
    const prepareResponse = await fetch(`${window.themeVariables.routes.cartUrl}/prepare_shipping_rates.json?shipping_address[zip]=${zip}&shipping_address[country]=${country}&shipping_address[province]=${province}`,
    {
      method: "POST"
    });
    if (prepareResponse.ok)
    {
      const shippingRates = await this._getAsyncShippingRates(zip, country, province);
      this._formatShippingRates(shippingRates)
    }
    else
    {
      const jsonError = await prepareResponse.json();
      this._formatError(jsonError)
    }
    this.submitButton.removeAttribute("aria-busy")
  }
  async _getAsyncShippingRates(zip, country, province)
  {
    const responseAsText = await (await fetch(`${window.themeVariables.routes.cartUrl}/async_shipping_rates.json?shipping_address[zip]=${zip}&shipping_address[country]=${country}&shipping_address[province]=${province}`)).text();
    return responseAsText === "null" ? this._getAsyncShippingRates(zip, country, province) : JSON.parse(responseAsText).shipping_rates
  }
  _formatShippingRates(shippingRates)
  {
    this.querySelector(".shipping-estimator__results")?.remove();
    let formattedShippingRates = "";
    shippingRates.forEach(shippingRate =>
    {
      formattedShippingRates += `<li>${shippingRate.presentment_name}: ${formatMoney(parseFloat(shippingRate.price)*100)}</li>`
    });
    const html = `
      <div class="shipping-estimator__results">
        <p>${shippingRates.length===0?window.themeVariables.strings.shippingEstimatorNoResults:shippingRates.length===1?window.themeVariables.strings.shippingEstimatorOneResult:window.themeVariables.strings.shippingEstimatorMultipleResults}</p>
        ${formattedShippingRates===""?"":`<ul class="unordered-list">${formattedShippingRates}</ul>`}
      </div>
    `;
    this.insertAdjacentHTML("beforeend", html)
  }
  _formatError(errors)
  {
    this.querySelector(".shipping-estimator__results")?.remove();
    let formattedShippingRates = "";
    Object.keys(errors).forEach(errorKey =>
    {
      formattedShippingRates += `<li>${errorKey} ${errors[errorKey]}</li>`
    });
    const html = `
      <div class="shipping-estimator__results">
        <p>${window.themeVariables.strings.shippingEstimatorError}</p>
        <ul class="unordered-list">${formattedShippingRates}</ul>
      </div>
    `;
    this.insertAdjacentHTML("beforeend", html)
  }
};
window.customElements.define("shipping-estimator", ShippingEstimator);
var ReviewLink = class extends HTMLAnchorElement
{
  constructor()
  {
    super(), this.addEventListener("click", this._onClick.bind(this))
  }
  _onClick()
  {
    const shopifyReviewsElement = document.getElementById("shopify-product-reviews");
    shopifyReviewsElement && (window.matchMedia(window.themeVariables.breakpoints.pocket).matches ? shopifyReviewsElement.closest("collapsible-content").open = !0 : document.querySelector(`[aria-controls="${shopifyReviewsElement.closest(".product-tabs__tab-item-wrapper").id}"]`).click())
  }
};
window.customElements.define("review-link", ReviewLink,
{
  extends: "a"
});
var ProductStickyForm = class extends HTMLElement
{
  connectedCallback()
  {
    document.getElementById(this.getAttribute("form-id"))?.addEventListener("variant:changed", this._onVariantChanged.bind(this)), this.imageElement = this.querySelector(".product-sticky-form__image"), this.priceElement = this.querySelector(".product-sticky-form__price"), this.unitPriceElement = this.querySelector(".product-sticky-form__unit-price"), this._setupVisibilityObservers()
  }
  disconnectedCallback()
  {
    this.intersectionObserver.disconnect()
  }
  set hidden(value)
  {
    this.toggleAttribute("hidden", value), value ? document.documentElement.style.removeProperty("--cart-notification-offset") : document.documentElement.style.setProperty("--cart-notification-offset", `${this.clientHeight}px`)
  }
  _onVariantChanged(event)
  {
    const variant = event.detail.variant,
      currencyFormat = window.themeVariables.settings.currencyCodeEnabled ? window.themeVariables.settings.moneyWithCurrencyFormat : window.themeVariables.settings.moneyFormat;
    if (!variant) return;
    if (this.priceElement && (this.priceElement.innerHTML = formatMoney(variant.price, currencyFormat)), this.unitPriceElement && (this.unitPriceElement.style.display = variant.unit_price_measurement ? "block" : "none", variant.unit_price_measurement))
    {
      let referenceValue = "";
      variant.unit_price_measurement.reference_value !== 1 && (referenceValue = `<span class="unit-price-measurement__reference-value">${variant.unit_price_measurement.reference_value}</span>`), this.unitPriceElement.innerHTML = `
          <div class="unit-price-measurement">
            <span class="unit-price-measurement__price">${formatMoney(variant.unit_price)}</span>
            <span class="unit-price-measurement__separator">/</span>
            ${referenceValue}
            <span class="unit-price-measurement__reference-unit">${variant.unit_price_measurement.reference_unit}</span>
          </div>
        `
    }
    if (!this.imageElement || !variant || !variant.featured_media) return;
    const featuredMedia = variant.featured_media;
    featuredMedia.alt && this.imageElement.setAttribute("alt", featuredMedia.alt), this.imageElement.setAttribute("width", featuredMedia.preview_image.width), this.imageElement.setAttribute("height", featuredMedia.preview_image.height), this.imageElement.setAttribute("src", getSizedMediaUrl(featuredMedia, "165x")), this.imageElement.setAttribute("srcset", getMediaSrcset(featuredMedia, [55, 110, 165]))
  }
  _setupVisibilityObservers()
  {
    const paymentContainerElement = document.getElementById("MainPaymentContainer"),
      footerElement = document.querySelector(".shopify-section--footer"),
      stickyHeaderOffset = getStickyHeaderOffset();
    this._isFooterVisible = this._isPaymentContainerPassed = !1, this.intersectionObserver = new IntersectionObserver(entries =>
    {
      entries.forEach(entry =>
      {
        if (entry.target === footerElement && (this._isFooterVisible = entry.intersectionRatio > 0), entry.target === paymentContainerElement)
        {
          const boundingRect = paymentContainerElement.getBoundingClientRect();
          this._isPaymentContainerPassed = entry.intersectionRatio === 0 && boundingRect.top + boundingRect.height <= stickyHeaderOffset
        }
      }), window.matchMedia(window.themeVariables.breakpoints.pocket).matches ? this.hidden = !this._isPaymentContainerPassed || this._isFooterVisible : this.hidden = !this._isPaymentContainerPassed
    },
    {
      rootMargin: `-${stickyHeaderOffset}px 0px 0px 0px`
    }), this.intersectionObserver.observe(paymentContainerElement), this.intersectionObserver.observe(footerElement)
  }
};
window.customElements.define("product-sticky-form", ProductStickyForm), new InputBindingManager, Shopify.designMode && document.addEventListener("shopify:section:load", () =>
{
  window.SPR && (window.SPR.initDomEls(), window.SPR.loadProducts())
}), window.SPRCallbacks = {
  onFormSuccess: (event, info) =>
  {
    document.getElementById(`form_${info.id}`).classList.add("spr-form--success")
  }
}, (() =>
{
  let previousClientWidth = window.visualViewport ? window.visualViewport.width : document.documentElement.clientWidth,
    setViewportProperty = () =>
    {
      const clientWidth = window.visualViewport ? window.visualViewport.width : document.documentElement.clientWidth,
        clientHeight = window.visualViewport ? window.visualViewport.height : document.documentElement.clientHeight;
      clientWidth !== previousClientWidth && requestAnimationFrame(() =>
      {
        document.documentElement.style.setProperty("--window-height", clientHeight + "px"), previousClientWidth = clientWidth
      })
    };
  setViewportProperty(), window.visualViewport ? window.visualViewport.addEventListener("resize", setViewportProperty) : window.addEventListener("resize", setViewportProperty)
})(), (() =>
{
  let documentDelegate = new main_default(document.body);
  documentDelegate.on("change", 'input:not([type="checkbox"]):not([type="radio"]), textarea', (event, target) =>
  {
    target.classList.toggle("is-filled", target.value !== "")
  }), documentDelegate.on("change", "select", (event, target) =>
  {
    target.parentNode.classList.toggle("is-filled", target.value !== "")
  })
})(), document.querySelectorAll(".rte table").forEach(table =>
{
  table.outerHTML = '<div class="table-wrapper">' + table.outerHTML + "</div>"
}), document.querySelectorAll(".rte iframe").forEach(iframe =>
{
  (iframe.src.indexOf("youtube") !== -1 || iframe.src.indexOf("youtu.be") !== -1 || iframe.src.indexOf("vimeo") !== -1) && (iframe.outerHTML = '<div class="video-wrapper">' + iframe.outerHTML + "</div>")
}), new main_default(document.documentElement).on("click", "[data-smooth-scroll]", (event, target) =>
{
  const elementToScroll = document.querySelector(target.getAttribute("href"));
  elementToScroll && (event.preventDefault(), elementToScroll.scrollIntoView(
  {
    behavior: "smooth",
    block: "start"
  }))
}), document.addEventListener("keyup", function(event)
{
  event.key === "Tab" && (document.body.classList.remove("no-focus-outline"), document.body.classList.add("focus-outline"))
});
/*! Bundled license information:

tabbable/dist/index.esm.js:
  (*!
  * tabbable 6.2.0
  * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
  *)

focus-trap/dist/focus-trap.esm.js:
  (*!
  * focus-trap 7.5.4
  * @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
  *)
*/
//# sourceMappingURL=/s/files/1/0792/0687/5483/t/47/assets/theme.js.map?v=1732813777

// window.dispatchEvent(new CustomEvent('cart.update'))

