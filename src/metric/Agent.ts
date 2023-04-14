import { useSessionService } from "@realmocean/services";
import { CONSTANTS } from ".";
import { ApiObserver } from "./ApiObserver";
import { EventObserver } from "./EventObserver";
import { Logger } from "./Logger";
import { PageService } from "./PageService";
import { ResourceService } from "./ResourceService";
import { Session } from "./Session";
import { isFirstPartyUrl, isURLSupported, isWorker, newTimeId, roundToDecimal, truncateUrl } from "./utils";
import { WebVitalsObserver } from "./WebVitalsObserver";
import { getAppFullName } from "../BiosController";

const SEND_ENDPOINT_THRESHOLD: number = 10;
const MAX_ENDPOINT_LIMIT: number = 50;
const MAX_SENDS: number = 60; // we send every minute, so this is sending for an hour.


export class Agent {

  static defaults: any = {
    token: null,
   // ingestUrl: "https://in.requestmetrics.com/v1",
    ingestUrl: "/realmocean/tracker:metric",
    monitorSelfCalls: false,
    tags: []
  };

  public options: any;
  private timeOrigin = null;
  private entryHash = {};
  public endpoints: any[] = [];
  private webVitalsObserver: WebVitalsObserver;
  private pageService = new PageService();
  private resourceService = new ResourceService();
  private shutdownSend = false;
  private sendCount = 0;
  private pageViewId = newTimeId();
  private sessionId = Session.getSessionId();

  getIngestUrl = () => `${this.options.ingestUrl}?token=${this.options.token}&v=${CONSTANTS.VERSION}`;

  constructor(options: any) {
    // NOTE Safari <12 has performance but not `getEntriesByType`
    if (!self.performance || !self.performance.getEntriesByType || !isURLSupported()) {
      return;
    }

    // NOTE Mobile Safari <=7 and other old mobile browsers have a performance
    // object but no timings.
    var navEntry = performance.getEntriesByType("navigation") || [];
    if (!isWorker() && !navEntry.length && !performance.timing) {
      return;
    }

    // IE11 doesn't support Object.assign, so here is a naive polyfill for our use-case.
    this.options = Object.keys(Agent.defaults).reduce((result, key) => {
      result[key] = options[key] || Agent.defaults[key];
      return result;
    }, {}) as any;

    // NOTE Safari doesn't support timeOrigin yet. It doesn't have timing in workers.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Performance/timeOrigin
    this.timeOrigin = performance.timeOrigin || (performance.timing || {}).navigationStart || new Date().getTime();

    ApiObserver.install(this.options);
    EventObserver.install(this.options, this.timeOrigin);

    this.manageResourceBuffer();

    (function (ready) {
      if (isWorker() || document.readyState === "complete") {
        ready();
      } else {
        document.addEventListener('readystatechange', (event) => {
          if (document.readyState === "complete") {
            ready();
          }
        });
      }
    })(() => { /* the document is now ready. */
      try {
        this.webVitalsObserver = new WebVitalsObserver();
        Session.refreshSession();

        setTimeout(() => this.checkAndSend(), 10_000);
        setInterval(() => this.checkAndSend(), 60 * 1000);

        self.addEventListener("pagehide", () => {
          EventObserver.addEvent({
            name: "page_leave",
            time: roundToDecimal(performance.now()),
            pageUrl: self.location.toString()
          });
    
          this.sendBeacon()
        });
        self.addEventListener("visibilitychange", () => {
          if (!isWorker() && document.visibilityState === 'hidden') {
            this.sendBeacon();
          }
          else if(!isWorker() && document.visibilityState === 'visible') {
            this.sessionId = Session.getSessionId();
          }
        });
      }
      catch (e: any) {
        Logger.error(e);
      }
    });
  }

  getEndpointEntries(): any[] {
    var result: any[] = [];

    ResourceService.getAllResources().forEach((entry: PerformanceResourceTiming) => {

      if (Object.keys(this.entryHash).length >= MAX_ENDPOINT_LIMIT) {
        return;
      }
      // Duration is negative if the request is still in flight. This happens because duration is calculated by
      // entry.responseEnd - entry.startTime. While the request is in progress, this will result in "-startTime".
      // We want to exclude this *before* entering it in our hash so that we can capture it later, when it completes.
      if (entry.duration <= 0) {
        return;
      }

      if (entry.initiatorType !== "xmlhttprequest" && entry.initiatorType !== "fetch") {
        return;
      }

      var entryUrl = truncateUrl(entry.name);

      if (!isFirstPartyUrl(entryUrl, self.location.toString())) {
        return;
      }

      var entryKey = entryUrl + entry.startTime;
      if (this.entryHash[entryKey]) { return; }

      if (!this.options.monitorSelfCalls && this.getIngestUrl().indexOf(entryUrl) === 0) {
        // We don't want to include our own ingest API in the reports.
        return;
      }
      if (Logger.errorCount > 0 && Logger.getErrorUrl().indexOf(entryUrl) === 0) {
        return;
      }
      this.entryHash[entryKey] = true;

      result.push({
        url: entryUrl,
        start: roundToDecimal(entry.startTime),
        duration: roundToDecimal(entry.duration)
      });

    });
    return result;
  }

  getDevice(): any {
    try {
      if (/Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return "mobile";
      }
    }
    catch (e) {/* don't care */ }

    return "desktop";
  }

  getNetworkType(): string {
    try {
      var connection = (navigator as any)?.connection;
      if (!connection) {
        return null;
      }
      return `${connection.effectiveType}:${connection.downlink}:${connection.rtt}`;
    }
    catch (e) {
      return null;
    }
  }

  getPayload(lastChance = false): any {
    this.endpoints = this.endpoints.concat(this.getEndpointEntries());

    var payload = {
      realm_id: useSessionService().RealmId,
      tenant_id: useSessionService().TenantId,
      tenant_name: useSessionService().TenantName,
      user_id: useSessionService().AccountId,
      user_name: useSessionService().AccountName,
      user_session_id: useSessionService().SessionId,
      app_id: getAppFullName(),
      userAgent: navigator.userAgent,
      token: this.options.token,
      timeOrigin: new Date(this.timeOrigin).toISOString(),
      timeSent: new Date().toISOString(),
      device: this.getDevice(),
      pageViewId: this.pageViewId,
      sessionId: this.sessionId,
      page: this.pageService.getPageEntry(),
      endpoints: [...this.endpoints],
      vitals: this.webVitalsObserver?.getVitals(this.pageService.getPageUrl()),
      resources: this.resourceService.getResources(),
      tags: this.options.tags,
      networkType: this.getNetworkType(),
      api: ApiObserver.getApis(lastChance),
      events: EventObserver.getEvents(lastChance),
      js: this.resourceService.getAllThirdPartyJs(),
      env: {
        lang: navigator.language,
        width: isWorker() ? null : screen?.width,
        height: isWorker() ? null : screen?.height,
        dpr: isWorker() ? null : window?.devicePixelRatio
      }
    };

    return payload;
  }

  payloadHasData(payload: any): boolean {
    if (this.shutdownSend) {
      return false;
    }
    if (this.sendCount >= MAX_SENDS) {
      return false;
    }
    if (!payload) {
      return false;
    }
    if (payload.page || payload.endpoints.length || payload.vitals || payload.resources || payload.api.length || payload.events.length || payload.js.length) {
      return true;
    }
    return false;
  }

  shouldSendInterval(payload:any): boolean {
    if (!this.payloadHasData(payload)) {
      return false;
    }
    if (payload.page || payload.vitals || payload.resources || isWorker() || payload.endpoints.length >= SEND_ENDPOINT_THRESHOLD || payload.api.length > 0 || payload.events.length > 0 || payload.js.length > 0) {
      return true;
    }
    return false;
  }

  checkAndSend() {
    try {
      var payload = this.getPayload();
      payload.source = "polling";

      if (!this.shouldSendInterval(payload)) {
        return;
      }

      this.clearPayloadAfterSend(payload);

      // NOTE [Todd] We used to use Fetch here, but it had a high failure rate of
      // aborted attempts that resulted in "Failed to fetch" warnings in TrackJS.
      // We're not entirely sure why this happens, but there are no errors with XHR.
      // This might be silently failing as well, but we don't want users seeing it
      // regardless, so sticking with XHR. FTW.
      var xhr = new XMLHttpRequest();
      xhr.open("POST", this.getIngestUrl());
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.addEventListener("load", () => {
        if (xhr.status >= 400) {
          this.shutdownSend = true;
        }
      })
      xhr.send(JSON.stringify(payload));
    }
    catch (e: any) {
      Logger.error(e);
    }
  }

  sendBeacon = () => {
    try {
      var payload = this.getPayload(true);
      payload.source = "beacon";
      if (navigator.sendBeacon && this.payloadHasData(payload)) {
        this.clearPayloadAfterSend(payload);
        var url = this.getIngestUrl();
        var data = JSON.stringify(payload);
        try {
          navigator.sendBeacon(url, data);
        }
        catch (e) { /* Something broke the browser beacon API */ }
      }
    }
    catch (e: any) {
      Logger.error(e);
    }
  }

  clearPayloadAfterSend(payload: any) {
    this.sendCount++;
    this.endpoints.length = 0;
    if (payload.page) {
      this.pageService.sentPage();
    }
    if (payload.vitals) {
      this.webVitalsObserver?.sentVitals();
    }
    if (payload.resources) {
      this.resourceService.sentResources();
    }
  }

  manageResourceBuffer(): void {
    if (performance.setResourceTimingBufferSize) {
      performance.setResourceTimingBufferSize(1000);
    }

    var handleResourceTimingBufferFullEvt = (evt) => {
      this.resourceService.cacheResources();
      performance.clearResourceTimings();
    }

    if (performance.addEventListener) {
      try {
        performance.addEventListener("resourcetimingbufferfull", handleResourceTimingBufferFullEvt);
      }
      catch (e) {
        // Firefox 82 blows up when calling performance.addEventListener in a web worker.
        // For now, we're just ignoring the error and not cleaning up the buffer.
        // @see https://bugzilla.mozilla.org/show_bug.cgi?id=1674254
      }

    }
    else {
      // TODO later, pass through to other listeners?
      performance.onresourcetimingbufferfull = handleResourceTimingBufferFullEvt;
    }


    // NOTE: Maybe in the future we should clear the entry hash/lookup if we
    // are in a situation where there are lots of resources doing lots of things. AKA a shitty site.
  }

}