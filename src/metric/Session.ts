import { EventObserver } from "./EventObserver";
import { isWorker, newTimeId, roundToDecimal } from "./utils";

const SESSION_KEY = '__rm_sid__';
const SESSION_TIMESTAMP = '__rm_sid_ts__';

export var Session = {

  _sessionId: 0,
  _storageDisabled: false,

  getSessionId() : number {
    // getSessionId is called before other browser compatibility checks, so we
    // need to short-circuit here too.
    if (!self.performance) { return 0; }

    var now = Date.now();
    var sessionTimestamp = 0;

    // storage blew up for some reason, so to prevent sending tons of session_start
    // events, let's save it off for at least the duration of this page view.
    if (this._storageDisabled && this._sessionId) {
      return this._sessionId;
    }

    try {
      this._sessionId = parseInt(localStorage.getItem(SESSION_KEY), 10);
      sessionTimestamp = parseInt(localStorage.getItem(SESSION_TIMESTAMP), 10);
    }
    catch(e) {
      this._storageDisabled = true;
    }

    if (!this._sessionId || this.isSessionExpired(now, sessionTimestamp)) {
      this._sessionId = newTimeId();

      // We're intentionally ignoring the case where the user leaves within the
      // session time, but comes in again with a new source. Google would create
      // a new session, we don't care (for now).
      EventObserver.addEvent({
        name: "session_start",
        time: roundToDecimal(performance.now()),
        pageUrl: self.location.toString(),
        referrer: isWorker() ? "" : document.referrer
      });

      try {
        localStorage.setItem(SESSION_KEY, this._sessionId.toString());
        this.refreshSession();
      }
      catch(e) {
        this._storageDisabled = true;
      }
    }

    return this._sessionId;
  },

  refreshSession(): void {
    try {
      localStorage.setItem(SESSION_TIMESTAMP, Date.now().toString());
    }
    catch(e) { /* localStorage is broken */}
  },

  isSessionExpired(now: number, timestamp: number) : boolean {
    const thirtyMinutes = 1_000 * 60 * 30;

    if (!timestamp) { return true; }
    return ((timestamp + thirtyMinutes) < now);
  }

};
