import { is } from '@tuval/core';

export class ConfigService {
    public static GetRealmOceanBrokerUrl(): string {
       /*  let url = '';
        debugger;
        if (is.localhost()) {
            url = 'http://localhost:5002/v1/';
        } else {
            url = 'https://bpmgenesis.com/broker/realm/v1/';
        } */

        const url = window.location.origin + '/api/';
        console.log(url);

        return url;

        return url;
    }

    public static GetErrorMonitorBrokerUrl(): string {
         let url = '';
         debugger;
         if (is.localhost()) {
             url = 'https://api.apirealm.com/tracker'// 'http://localhost:5002/v1/';
         } else {
             url = 'https://api.apirealm.com/tracker';
         }


         return url;
     }
}