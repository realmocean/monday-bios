import { EventBus } from "@tuval/core";
import { Logger } from "./Logger";
import { Session } from "./Session";
import { has, isWorker, patch, roundToDecimal, truncate } from "./utils";

const MIN_ENTRIES_FOR_SEND = 1;

class _EventObserver {

  private eventEntries: any[] = [];
  private options: any;

  install(options: any, timeOrigin: number) {
    this.options = options;
    this.wrapHistory();
    this.wrapActivity();

    this.addEvent({
      name: isWorker() ? "worker_init" : "page_view",
      time: roundToDecimal(performance.now()),
      pageUrl: self.location.toString()
    });
  }

  getEvents(lastChance = false): any[] {
    if (lastChance || this.eventEntries.length >= MIN_ENTRIES_FOR_SEND) {
      var result = this.eventEntries;
      this.eventEntries = [];
      return result;
    }
    return [];
  }

  addEvent(event: any): void {
    Session.refreshSession();
    this.eventEntries.push(event);
  }

  private wrapActivity() {
    if (isWorker()) { return; }

    document.addEventListener("click", this.onDocumentClicked, true);
    document.addEventListener("blur", this.onInputChanged, true);
    document.addEventListener("scroll", this.onFirstScroll, {
      once: true,
      capture: true,
      passive: true
    });
  }

  private wrapHistory() {
    if (!this.isCompatible()) { return; }
    var _this = this;

    // Popstate event will be triggered from visitor-originated actions, like
    // clicking on a hash link or using the browser forward/back buttons.
    // https://developer.mozilla.org/en-US/docs/Web/Events/popstate
    self.addEventListener('popstate', () => {
      this.addEvent({
        name: "popstate",
        time: roundToDecimal(performance.now()),
        pageUrl: self.location.toString()
      });
    }, true);

    // pushState is the programmatic action that can be taken,
    // but will not generate a `popstate` event. We monkeypatch them to grab
    // location values immediately before and after the change.

    patch(history, 'pushState', function (original) {
      return function (/* state, title, url */) {
        var result = original.apply(this, arguments);

        _this.addEvent({
          name: 'pushState',
          time: roundToDecimal(performance.now()),
          pageUrl: self.location.toString()
        });

        return result;
      };
    });
  }

  private isCompatible() {
    return !isWorker() &&
      !has(self, 'chrome.app.runtime') &&
      has(self, 'addEventListener') &&
      has(self, 'history.pushState');
  }

  /**
    * Processes a click event for a valid user action and writes event to log.
    *
    * @method onDocumentClicked
    * @param {Object} evt The click event.
    */
  onDocumentClicked = (evt) => {
    try {
      var element = this.getElementFromEvent(evt);
      if (!element || !element.tagName) {
        return;
      }

      var clickedElement = this.getDescribedElement<HTMLAnchorElement>(element, "a") || this.getDescribedElement<HTMLButtonElement>(element, "button") || this.getDescribedElement<HTMLInputElement>(element, "input", ["button", "submit"]);
      var inputElement = this.getDescribedElement<HTMLInputElement>(element, "input", ["checkbox", "radio"]);

      if (clickedElement) {
        this.writeActivityEvent(clickedElement, "click");
      }
      else if (inputElement) {
        this.writeActivityEvent(inputElement, "input", inputElement.value, inputElement.checked);
      }

    } catch (e: any) {
      Logger.error(e, "On Document Clicked Error")
    }
  }

  /**
    * Processes a blur event for a valid user action and writes event to log.
    *
    * @method onInputChanged
    * @param {Object} evt The click event.
    */
  onInputChanged = (evt) => {
    try {
      var element = this.getElementFromEvent(evt);
      if (!element || !element.tagName) {
        return;
      }

      var textAreaElement = this.getDescribedElement<HTMLTextAreaElement>(element, "textarea");
      var selectElement = this.getDescribedElement<HTMLSelectElement>(element, "select");
      var inputElement = this.getDescribedElement<HTMLInputElement>(element, "input");
      var elementToIgnore = this.getDescribedElement<HTMLInputElement>(element, "input", ["button", "submit", "hidden", "checkbox", "radio"]);

      if (textAreaElement) {
        this.writeActivityEvent(textAreaElement, "input", textAreaElement.value);
      }
      else if (selectElement && selectElement.options && selectElement.options.length) {
        this.onSelectInputChanged(selectElement);
      }
      else if (inputElement && !elementToIgnore) {
        this.writeActivityEvent(inputElement, "input", inputElement.value);
      }
    } catch (e: any) {
      Logger.error(e, "On Input Changed Error")
    }
  }

  /**
    * Processes a change to a select element and writes to the log.
    *
    * @method onSelectInputChanged
    * @param {Object} element The element raising the event.
    */
  onSelectInputChanged(element) {
    if (element.multiple) {
      // NOTE: Preferred to enumerate element.selectIptions, but this property was
      //       not available before IE10.
      for (var i = 0; i < element.options.length; i++) {
        if (element.options[i].selected) {
          this.writeActivityEvent(element, "input", element.options[i].value);
        }
      }
    }
    else if (element.selectedIndex >= 0 && element.options[element.selectedIndex]) {
      this.writeActivityEvent(element, "input", element.options[element.selectedIndex].value);
    }
  }

  onFirstScroll = () => {
    document.removeEventListener("scroll", this.onFirstScroll);
    this.addEvent({
      name: "first_scroll",
      time: roundToDecimal(performance.now()),
      pageUrl: self.location.toString()
    });
  }

  /**
    * Writes a formatted visitor event to the log for the element.
    *
    * @method writeVisitorEvent
    * @param {Element} element The event.
    * @param {String} action The action taken on the element ('click'|'input').
    * @param {String} value The current value of the element.
    * @param {Boolean} isChecked Whether the element is currently checked.
    */
  writeActivityEvent(element, action, value?, isChecked?) {
    if (this.getElementType(element) === "password") {
      value = undefined;
    }

    this.addEvent({
      name: action,
      time: roundToDecimal(performance.now()),
      pageUrl: self.location.toString(),
      element: {
        tag: element.tagName.toLowerCase(),
        attributes: this.getElementAttributes(element),
        value: this.getMetaValue(value, isChecked),
        text: element.innerText ? truncate(element.innerText, 100) : ''
      }
    });
  }

  /**
    * Get the element that raised an event.
    *
    * @method getElementFromEvent
    * @param {Event} evt The event.
    */
  getElementFromEvent(evt) {
    return evt.target || document.elementFromPoint(evt.clientX, evt.clientY);
  }

  getDescribedElement<T extends HTMLElement>(element, tagName, types?): T {
    if (element.closest) {
      element = element.closest(tagName);
      if (!element) {
        return null;
      }
    }
    else if (element.tagName.toLowerCase() !== tagName.toLowerCase()) {
      return null;
    }

    if (!types) {
      return element;
    }

    var elementType = this.getElementType(element);
    for (var i = 0; i < types.length; i++) {
      if (types[i] === elementType) {
        return element;
      }
    }
    return null;
  }

  /**
    * Get the normalized type attribute of an element.
    *
    * @method getElementType
    * @param {Element} element The element to check.
    * @returns {String} The element type.
    */
  getElementType(element) {
    return (element.getAttribute("type") || "").toLowerCase();
  }
  /**
    * Get the normalized map of attributes of an element.
    *
    * @method getElementAttributes
    * @param {Element} element The element to check.
    * @return {Object} Key-Value map of attributes on the element.
    */
  getElementAttributes(element) {
    var attributes = {};
    var maxAttributes = Math.min(element.attributes.length, 10);
    for (var i = 0; i < maxAttributes; i++) {
      var attr = element['attributes'][i];
      var attrName = attr['name'];
      if (attrName.toLowerCase() != 'data-value' && attrName.toLowerCase() != 'value') {
        attributes[attr['name']] = truncate(attr['value'], 50);
      }
    }
    return attributes;
  }

  /**
    * Get the metadata information about the element value (for obfuscation).
    *
    * @method getMetaValue
    * @param {String} value The actual value of the element.
    * @param {Boolean} isChecked Whether the element was checked (for radio/checkbox).
    * @returns {Object} Metadata description of the value.
    */
  getMetaValue(value, isChecked) {
    return (value === undefined) ? undefined : {
      length: value.length,
      pattern: this.matchInputPattern(value),
      checked: isChecked
    };
  }

  /**
    * Matches a string against known character patterns.
    *
    * @method matchInputPattern
    * @param {String} value The string to match.
    * @returns {String} The name of the matched pattern.
    */
  matchInputPattern(value) {
    if (value === "") {
      return "empty";
    }
    else if ((/^[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/).test(value)) {
      return "email";
    }
    else if ((/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/).test(value) ||
      (/^(\d{4}[\/\-](0?[1-9]|1[012])[\/\-]0?[1-9]|[12][0-9]|3[01])$/).test(value)) {
      return "date";
    }
    else if ((/^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/.test(value))) {
      return "usphone";
    }
    else if ((/^\s*$/).test(value)) {
      return "whitespace";
    }
    else if ((/^\d*$/).test(value)) {
      return "numeric";
    }
    else if ((/^[a-zA-Z]*$/).test(value)) {
      return "alpha";
    }
    else if ((/^[a-zA-Z0-9]*$/).test(value)) {
      return "alphanumeric";
    }
    else {
      return "characters";
    }
  }

}

EventBus.Default.on('app.loaded', (evt) => {
 // alert(JSON.stringify(evt))
    EventObserver.addEvent({
     name: "app_start",
     time: roundToDecimal(evt.time),
     pageUrl: self.location.toString(),
     referrer: isWorker() ? "" : document.referrer,
     element: evt.app_name
   }); 
})

export const EventObserver = new _EventObserver();