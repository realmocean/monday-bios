import { HttpClient, int } from "@tuval/core";
import { IUploadFileReady } from "@tuval/forms";
import { ConfigService } from './ConfigService';

export const AppsClient = {
     CreateApp : async (organization_id: string, app_qualified_name: string, app_description: string, app_vendor: string, app_version: string, app_file: IUploadFileReady,
        free_or_paid: string): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('organization_id', organization_id);
            form.append('app_qualified_name', app_qualified_name);
            form.append('app_description', app_description);
            form.append('app_vendor', app_vendor);
            form.append('app_icon', app_vendor);
            form.append('free_or_paid', free_or_paid);
           /*  form.append('app_version', app_version);
            form.append('app_file', app_file.file, app_file.fileName); */

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'CreateApp', form)
                .then(response => {
                    resolve(response.data);
                });
        });
    },

    CreateRelease : async (organization_id: string, app_id: string,  release_track: string, release_name: string, release_tag: string, 
        release_description: string, release_icon: string, release_bundle: IUploadFileReady): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('organization_id', organization_id);
            form.append('app_id', app_id);
            form.append('release_track', release_track);
            form.append('release_name', release_name);
            form.append('release_tag', release_tag);

            
            form.append('release_description', release_description);
            form.append('release_icon', release_icon);
            form.append('release_bundle', release_bundle.file, release_bundle.fileName); 

           /*  form.append('app_version', app_version);
            */

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'CreateRelease', form)
                .then(response => {
                    resolve(response.data);
                });
        });
    },

    GetApps : async (session_id: string): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('session_id', session_id);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetApps', form)
                .then(response => {
                    resolve(response.data);
                });
        });
    },

    GetAppsByOrganizationId : async (organization_id: string): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('organization_id', organization_id);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetAppsByOrganizationId', form)
                .then(response => {
                    resolve(response.data);
                });
        });
    },

    GetAppById : async (app_id: string): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('app_id', app_id);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetAppById', form)
                .then(response => {
                    resolve(response.data);
                });
        });
    },

    GetAppReleases : async (organization_id: string, app_id: string, release_track: string): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('organization_id', organization_id);
            form.append('app_id', app_id);
            form.append('release_track', release_track);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetAppReleases', form)
                .then(response => {
                    resolve(response.data);
                });
        });
    },

    UpdateMainStoreInfo : async (organization_id: string, app_id: string,app_display_name: string, app_short_description: string, app_full_description: string,
        app_icon: string, app_feature_graphic: string ): Promise<any> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('organization_id', organization_id);
            form.append('app_id', app_id);
            form.append('app_display_name', app_display_name);
            form.append('app_short_description', app_short_description);
            form.append('app_full_description', app_full_description);
            form.append('app_icon', app_icon);
            form.append('app_feature_graphic', app_feature_graphic);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'UpdateMainStoreInfo', form)
                .then(response => {
                    resolve(response.data);
                });
        });
    },
    GetMainStoreInfo : async (organization_id: string, app_id: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('organization_id', organization_id);
            form.append('app_id', app_id);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetMainStoreInfo', form)
                .then(response => {
                    resolve(response.data);
                });
        });
    }
}