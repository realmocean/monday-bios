import { Agent } from "./Agent";
import { Logger } from "./Logger";
import { isWorker } from "./utils";


  export const CONSTANTS: {
    IS_PROD: boolean;
    VERSION: string;
  } = {
    IS_PROD : false,
    VERSION : '1.0'

  }


const sdk = {

  __agent: null,

  version: CONSTANTS.VERSION,

  install: (options: any) => {
    try {
      if (sdk.__agent) {
        console.warn("Request Metrics is already installed.");
        return;
      }

      // If we are loaded in Node, or in Server-Side Rendering like NextJS
      if (typeof self === "undefined") {
        console.warn("Request Metrics does not operate in this environment.");
        return;
      }

      if (!options || !options.token) {
        console.error("You must provide a token to install Request Metrics.")
        return;
      }

      Logger.token = options.token;

      sdk.__agent = new Agent(options);
    }
    catch (e: any) {
      Logger.error(e);
    }
  }
}

export const RM = sdk;

// Try to automatically install the agent for the default use case
/* (function () {
  try {
    if (isWorker()) { return; }
    if (!document.querySelector) { return; }

    var scriptEl = document.querySelector("[data-rm-token]");
    if (!scriptEl) { return; }

    var token = scriptEl.getAttribute("data-rm-token");
    if (!token) { return; }

    var tagString = scriptEl.getAttribute("data-rm-tags");
    var tags = (tagString || "").split(",").filter(x => x);

    Logger.token = token;

    sdk.install({
      token: token,
      ingestUrl: scriptEl.getAttribute("data-rm-ingest"),
      monitorSelfCalls: !!scriptEl.getAttribute("data-rm-monitor-self"),
      tags: tags
    });
  }
  catch (e: any) {
    Logger.error(e);
  }

})(); */