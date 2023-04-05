import { HttpClient, int } from "@tuval/core";
import { IUploadFileReady } from "@tuval/forms";
import { ConfigService } from './ConfigService';

export const BrokersClient = {
     CreateBroker : async (organization_id: string, broker_qualified_name: string,
        broker_display_name: string,
        broker_link: string,
        broker_short_description: string, broker_full_description: string,
        icon_link: string, broker_vendor: string,
        free_or_paid: string): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('organization_id', organization_id);
            form.append('broker_qualified_name', broker_qualified_name);
            form.append('broker_display_name', broker_display_name);
            form.append('broker_link', broker_link);
            form.append('broker_short_description', broker_short_description);
            form.append('broker_full_description', broker_full_description);
            form.append('icon_link', icon_link);
            form.append('broker_vendor', broker_vendor);
            form.append('free_or_paid', free_or_paid);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'CreateBroker', form)
                .then(response => {
                    resolve(response.data);
                });
        });
    },

    GetOrganizationBrokers : async (organization_id: string): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('organization_id', organization_id);
            

        

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetOrganizationBrokers', form)
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
    },

    CreateBrokerSettingDialog : async (organization_id: string, broker_id: string, description: string, dialog_code: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('organization_id', organization_id);
            form.append('broker_id', broker_id);
            form.append('description', description);
            form.append('dialog_code', dialog_code);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'CreateBrokerSettingDialog', form)
                .then(response => {
                    resolve(response.data);
                });
        });
    },
    GetBrokerSettingDialog : async (broker_id: string): Promise<any> => {
        const form = new FormData();
        form.append('broker_id', broker_id);


        return new Promise((resolve, reject) => {
            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetBrokerSettingDialog', form)
                .then(response => {
                    resolve(response.data);
                });
        });
    }
}