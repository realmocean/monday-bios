import { HttpClient } from "@tuval/core";
import { ConfigService } from './ConfigService';

export const OrganizationClient = {
    CreateOrganization: async (organization_account_name: string, organization_display_name: string, description: string, url: string, contact_email: string, profile_picture: string): Promise<any> => {
        const form = new FormData();
        form.append('organization_account_name', organization_account_name);
        form.append('organization_display_name', organization_display_name);
        form.append('description', description);
        form.append('url', url);
        form.append('contact_email', contact_email);
        form.append('profile_picture', profile_picture);

        return new Promise((resolve, reject) => {
            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'CreateOrganization', form)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    if (error.response) {
                        //console.log(error.response.data);
                        console.log();
                        if (error.response.status === 401) {
                            window.location.href = '/logout'
                        }
                       // console.log(error.response.headers);
                    }
                });;
        })
    },

    AddMemberToOrganization: async (organization_id: string, account_id: string, role: string): Promise<any> => {
        const form = new FormData();
        form.append('organization_id', organization_id);
        form.append('account_id', account_id);
        form.append('role', role);


        return new Promise((resolve, reject) => {
            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'AddMemberToOrganization', form)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    if (error.response) {
                        //console.log(error.response.data);
                        console.log();
                        if (error.response.status === 401) {
                            window.location.href = '/logout'
                        }
                       // console.log(error.response.headers);
                    }
                });;
        })
    },
    GetOrganizationById: async (organization_id: string): Promise<any> => {
        const form = new FormData();
        form.append('organization_id', organization_id);


        return new Promise((resolve, reject) => {
            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetOrganizationById', form)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    if (error.response) {
                        //console.log(error.response.data);
                        console.log();
                        if (error.response.status === 401) {
                            window.location.href = '/logout'
                        }
                       // console.log(error.response.headers);
                    }
                });;
        })
    },
    GetOrganizationRealms: async (organization_id: string): Promise<any> => {
        const form = new FormData();
        form.append('organization_id', organization_id);

        return new Promise((resolve, reject) => {
            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetOrganizationRealms', form)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    if (error.response) {
                        //console.log(error.response.data);
                        console.log();
                        if (error.response.status === 401) {
                            window.location.href = '/logout'
                        }
                       // console.log(error.response.headers);
                    }
                });
        })
    },

    GetOrganizationMembers: async (organization_id: string): Promise<any> => {
        const form = new FormData();
        form.append('organization_id', organization_id);

        return new Promise((resolve, reject) => {
            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetOrganizationMembers', form)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    if (error.response) {
                        //console.log(error.response.data);
                        console.log();
                        if (error.response.status === 401) {
                            window.location.href = '/logout'
                        }
                       // console.log(error.response.headers);
                    }
                });;
        })
    }

}