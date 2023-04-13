import { isWorker, roundToDecimal } from "./utils";
import {onFCP, onLCP, onFID, onCLS, Metric} from 'web-vitals';

export class WebVitalsObserver {

  private vitalsSent = false;
  private metricQueue = new Set();

  constructor() {

    if (isWorker()) {
      return;
    }

    onCLS(this.addToQueue, {reportAllChanges: true});
    onFID(this.addToQueue, {reportAllChanges: true});
    onFCP(this.addToQueue, {reportAllChanges: true});
    onLCP(this.addToQueue, {reportAllChanges: true});
  }

  addToQueue = (metric) => {
    this.metricQueue.add(metric);
  }

  getVitals(url: string): any {
    if (this.vitalsSent) {
      return null;
    }

    if (this.metricQueue.size === 0) {
      return null;
    }

    var resultVitals: any = {
      url: url
    };

    this.metricQueue.forEach((metric: any) => {
      if (metric.name === "FCP") {
        resultVitals.fcp = roundToDecimal(metric.value);
      }
      if (metric.name === "LCP") {
        resultVitals.lcp = roundToDecimal(metric.value);
      }
      if (metric.name === "CLS") {
        resultVitals.cls = roundToDecimal(metric.value, 5);
      }
      if (metric.name === "FID") {
        resultVitals.fid = roundToDecimal(metric.value, 1);
      }
    });

    // The Web-Vital lib doesn't return a CLS if it is 0, but we know we are in
    // Chrome-land because we have an LCP.
    if (resultVitals.lcp && !resultVitals.cls) {
      resultVitals.cls = 0;
    }

    return resultVitals;
  }

  sentVitals() {
    this.vitalsSent = true;
  }
}
