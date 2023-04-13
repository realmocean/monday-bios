import { Logger } from "./Logger";

export function isWorker() {
  return (typeof document === "undefined");
}

export function isURLSupported(): boolean {
  return !!(self.URL && self.URL.prototype && ('hostname' in self.URL.prototype));
}

export function truncateUrl(url: string): string {
  url = url || "";
  if (url.indexOf("?") >= 0) {
    url = url.split("?")[0];
  }
  if (url.length >= 1000) {
    url = url.substr(0, 1000);
  }
  return url;
}

export function truncate(str: string, length: number) {
  str = '' + str; // Handle cases where we might get a stringable object rather than a string.
  if (str.length <= length) { return str; }
  var truncatedLength = str.length - length;
  return str.substr(0, length) + '...{' + truncatedLength + '}';
}

export function roundToDecimal(num: number, places: number = 0): number {
  return parseFloat(num.toFixed(places));
}

export function isFirstPartyUrl(url: string, pageUrl: string): boolean {
  var tls = getTopLevelSegment(pageUrl);
  if (!tls) {
    return false;
  }

  try {
    var hostname = new URL(url).hostname;
    if (!hostname) {
      return false;
    }
    return hostname.indexOf(tls) >= 0;
  }
  catch (e: any) {
    Logger.error(e, `Problem parsing first party url: ${url}`)
    return false;
  }
}

var reservedTLDs = ["com", "net", "gov", "edu", "org"];

export function getTopLevelSegment(pageUrl: string): string {
  try {
    if (!pageUrl || pageUrl.indexOf("http") !== 0) {
      return null;
    }
    var url = new URL(pageUrl);
    var hostname = url.hostname;
    if (!hostname) {
      return null;
    }

    var segments = hostname.split(".");

    // ignore last segment, should be .com or whatever cute tld they use
    var firstSegment = segments.pop();
    if (firstSegment === "localhost") {
      return firstSegment;
    }

    if (hostname === "127.0.0.1") {
      return hostname;
    }

    var lastSegment = segments.pop();

    // If it's something like co.uk or mn.us
    if (lastSegment.length === 2) {
      lastSegment = segments.pop();
    }

    // Something like com.au
    if (reservedTLDs.indexOf(lastSegment) >= 0) {
      lastSegment = segments.pop();
    }

    return `${lastSegment}.`;

  }
  catch (e: any) {
    Logger.error(e, `Page Url: ${pageUrl}`)
    return null;
  }

}

export function describeElement(el: HTMLElement) : string {
  if (!el) { return null; }
  try {
    let outerHtml = el.outerHTML;
    return outerHtml.substring(0, outerHtml.indexOf(">")+1);
  }
  catch(e: any) {
    Logger.error(e, "failed to describe element");
    return null;
  }
}

/**
  * patch
  * Monkeypatch a method
  *
  * @param {Object} obj The object containing the method.
  * @param {String} name The name of the method
  * @param {Function} func A function to monkeypatch into the method. Will
  *         be called with the original function as the parameter.
  */
export function patch(obj : any, name : string, func) {
  var original = obj[name] || noop;
  obj[name] = func(original);
}

export function noop() {}

export function newTimeId() : number {
  return Math.floor((Date.now() + Math.random()) * 1000);
}

/**
  * has
  * Examines an object if it contains a nested addressable property. for
  * example, if you want to check if window.chrome.app exists, you can
  * check with has(window, "chrome.app");
  */
export function has(obj : any, path : string) : boolean {
  try {
    var segments = path.split('.');
    var root = obj;
    for (var idx = 0; idx < segments.length; idx++) {
      if (root[segments[idx]]) {
        root = root[segments[idx]];
      }
      else {
        return false;
      }
    }
    return true;
  }
  catch (e) {
    return false;
  }
}