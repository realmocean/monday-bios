import { isWorker, patch, roundToDecimal, truncateUrl } from "./utils";

const RM_STATE_NAME = '__rm_state__';
const MIN_ENTRIES_FOR_SEND = 10;

class _ApiObserver {

  private apiEntries : any[] = [];
  private options : any;

  install(options : any) {
    this.options = options;
    this.wrapFetch();
    this.wrapXhr();
  }

  getApis(lastChance = false) : any[] {
    if (lastChance || this.apiEntries.length >= MIN_ENTRIES_FOR_SEND) {
      var result = this.apiEntries;
      this.apiEntries = [];
      return result;
    }
    return [];
  }

  private addEntry = (entry :  any) => {
    if (!entry.url || entry.url.indexOf("http") !== 0) {
      return;
    }

    if (!this.options.monitorSelfCalls && entry.url.indexOf(this.options.ingestUrl) === 0) {
      // We don't want to include our own ingest API in the reports.
      return;
    }

    this.apiEntries.push(entry);
  }

  private wrapFetch() {
    var _this = this;
    patch(global, 'fetch', function(previous) {
      return function(url, options) {
        // NOTE [Todd Gardner] the fetch method can take lots of different shapes:
        //      - (string, [object])
        //      - (url, [object])
        //      - (Request)
        //      We need to figure out what the URL and method are in the various shapes.
        var reqUrl = (url instanceof Request) ? url['url'] : url;
        var reqMethod = (url instanceof Request) ? url['method'] : (options || {})['method'] || 'GET';

        var fetching = previous.apply(global, arguments);
        fetching[RM_STATE_NAME] = {
          'source': isWorker() ? 'worker' : 'fetch',
          'startedOn': roundToDecimal(performance.now()),
          'method': reqMethod,
          'pageUrl': truncateUrl(self.location.toString())
        } as Partial<any>;

        return fetching.then(function(response) {
          var startInfo = fetching[RM_STATE_NAME];

          if (startInfo) {
            var completedOn = performance.now();
            var apiEntry = Object.assign(startInfo, {
              'duration': roundToDecimal(completedOn) - startInfo.startedOn,
              'statusCode': response.status,
              'contentLength': response.headers.get('content-length'),
              'contentType': response.headers.get('content-type'),
              'url': response.url
            }) as any;

            _this.addEntry(apiEntry);
          }
          return response;
        });
      };
    });
  }

  private wrapXhr() {
    if (isWorker()) { return; }

    var _this = this;
    patch(XMLHttpRequest.prototype, 'open', function(previous) {
      return function(method, url) {
        var xhr = this;

        xhr[RM_STATE_NAME] = {
          'source': 'xhr',
          'method': method
        } as Partial<any>;

        return previous.apply(xhr, arguments);
      };
    });

    patch(XMLHttpRequest.prototype, 'send', function(previous) {
      return function() {
        var xhr = this;
        var startInfo = xhr[RM_STATE_NAME];

        if (!startInfo) {
          return previous.apply(xhr, arguments);
        }

        xhr[RM_STATE_NAME] = Object.assign(startInfo, {
          'startedOn': roundToDecimal(performance.now()),
          'pageUrl': truncateUrl(self.location.toString())
        } as Partial<any>)

        xhr.addEventListener("readystatechange", function () {
          if (xhr.readyState === 4) {

            var startInfo = xhr[RM_STATE_NAME];
            var completedOn = performance.now();
            var apiEntry = Object.assign(startInfo, {
              'duration': roundToDecimal(completedOn) - startInfo.startedOn,
              'statusCode': xhr.status,
              'url': xhr.responseURL,
              'contentLength': xhr.getResponseHeader('content-length'),
              'contentType': xhr.getResponseHeader('content-type')
            } as Partial<any>);

            _this.addEntry(apiEntry);
          }
        }, true);

        return previous.apply(xhr, arguments);

      };
    });
  }

}

export const ApiObserver = new _ApiObserver();