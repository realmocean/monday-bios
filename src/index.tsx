import { EventBus, instance as container } from '@tuval/core';
import { StartBios, Tracker } from '@tuval/forms';

import { BiosController } from './BiosController';
import { RealmBrokerClient } from './client/RealmBrokerClient';
import './css/global.scss';
import { StateService } from './StateService';
import { useSessionService } from '@realmocean/services';
import { RM } from './metric';


(function (history: any) {
    var pushState = history.pushState;
    history.pushState = function (state) {
       
      
        const result =  pushState.apply(history, arguments);

        if (typeof history.onpushstate == "function") {
            history.onpushstate({ state: state });
        }

        return result;
    }
})(window.history);


window.onpopstate = (history as any).onpushstate = function (e) {
    EventBus.Default.fire('history.changed', { url: window.location.href })
};


//RM.install({
  //  token: 'a2kx9xb:n9iz4ut',
//    ingestUrl: 'https://in.requestmetrics.com/v1'
    /* ingestUrl: scriptEl.getAttribute("data-rm-ingest"),
    monitorSelfCalls: !!scriptEl.getAttribute("data-rm-monitor-self"),
    tags: tags */
 // });


window.addEventListener("load", (event) => {

    RealmBrokerClient.GetSessionInfo().then((session_info: any) => {
        StateService.SetStateVariable('session', session_info);
        StateService.SetSessionId(session_info.session_id);

        container.register('IStateService', { useValue: StateService });

        Tracker.configure({
            userId: session_info.account_id,
            sessionId: session_info.session_id
        });

        
        Tracker.addMetadata('realm',useSessionService().RealmId);
        Tracker.addMetadata('tenant',useSessionService().TenantId);

       
        StartBios(BiosController);

    })


});

//StartBios(BiosController)