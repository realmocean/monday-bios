
import { ConfigService } from './ConfigService';
import { HttpClient, is } from '@tuval/core';
import { OrganizationClient } from './OrganizationClient';
import { AppsClient } from './AppsClient';
import { BrokersClient } from './BrokersClient';


export interface GetSessionInfoResponse {
    account_id: string;
    account_name: string;
}
export interface GetRealmInfoResponse {
    key: string;
    value: string;
}


export namespace RealmBrokerClient {
    const Login = async (user_email: string, password: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();

            form.append('user_email', user_email);
            form.append('password', password);
          
            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'LoginService', form)
                .then(response => {
                    resolve(response.data.sessionId);
                })
                .catch(error => {
                    /* console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers); */
                    reject(error.response.data?.detail)
                });
        });
    }

    export const GetSessionId = async (): Promise<string> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetSessionId', form)
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
        });
    }

    export const GetAccountRealms = async (): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetAccountRealms', form)
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
        });
    }

    export const CreateRealm = async (organization_id: string, realm_id: string, realm_name: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();

            form.append('organization_id', organization_id);
            form.append('realm_id', realm_id);
            form.append('realm_name', realm_name);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'CreateRealm', form)
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
        });
    }
    export const DeleteRealm = async (realm_id: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('realm_id', realm_id);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'DeleteRealm', form)
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
        });
    }
    export const GetTenantAccounts = async (session_id: string, tenant_id: string): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('session_id', session_id);
            form.append('tenant_id', tenant_id);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetTenantAccounts', form)
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
        });
    }
    export const GetAccounts = async (session_id: string): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('session_id', session_id);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetAccounts', form)
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
        });
    }

    export const GetAccountById = async (account_id: string): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('account_id', account_id);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetAccountById', form)
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
        });
    }

    export const GetAccountApps = async (): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetAccountApps', form)
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
        });
    }

   
    export const CreateTenant = async (session_id: string, tenant_name: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('session_id', session_id);
            form.append('tenant_name', tenant_name);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'CreateTenant', form)
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
        });
    }
    export const CreateAccount = async (session_id: string, account_name: string, account_password: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('session_id', session_id);
            form.append('account_name', account_name);
            form.append('account_password', account_password);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'CreateAccount', form)
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
        });
    }

    export const GetOrganizationsInvolved = async (account_id: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('account_id', account_id);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetOrganizationsInvolved', form)
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
        });
    }



    export const GetSessionInfo = async (): Promise<GetSessionInfoResponse> => {
        return new Promise((resolve, reject) => {
            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetSessionInfo')
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
        });
    }

    export const GetRealmInfo = async (session_id: string, key: string): Promise<GetRealmInfoResponse> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('session_id', session_id);
            form.append('key', key);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetRealmInfo', form)
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
        });
    }
    export const GetRealmInfos = async (session_id: string): Promise<GetRealmInfoResponse[]> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('session_id', session_id);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetRealmInfos', form)
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
        });
    }

  

    export const GetAppById = async (app_id: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('app_id', app_id);

            HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetAppById', form)
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
        });
    }

    export const Organizations = { ...OrganizationClient }
   // export const Email = { ...EmailClient }
    export const App = {...AppsClient}
    export const Broker = {...BrokersClient}
    export namespace Course {
        export const CreateCourse = async (course_name: string, course_description: string, course_vendor: string, preview_image: string): Promise<any> => {
            return new Promise((resolve, reject) => {
                const form = new FormData();
                form.append('course_name', course_name);
                form.append('course_description', course_description);
                form.append('course_vendor', course_vendor);


                HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'CreateCourse', form)
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
            });
        }

        export const UpdateCourse = async (course_id: string, course_name: string, course_description: string, course_subtitle: string, preview_image: string): Promise<any> => {
            return new Promise((resolve, reject) => {
                const form = new FormData();
                form.append('course_id', course_id);
                form.append('course_name', course_name);
                form.append('course_subtitle', course_subtitle);
                form.append('course_description', course_description);
                form.append('preview_image', preview_image);

                HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'UpdateCourse', form)
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
            });
        }

        export const GetAccountCourses = async (): Promise<any> => {
            return new Promise((resolve, reject) => {
                HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetAccountCourses')
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

        export const SaveCourse = async (course_id: string, course_content: string): Promise<any> => {
            const form = new FormData();
            form.append('course_id', course_id);
            form.append('course_content', course_content);

            return new Promise((resolve, reject) => {
                HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'SaveCourse', form)
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

        export const GetCourseById = async (course_id: string): Promise<any> => {
            const form = new FormData();
            form.append('course_id', course_id);

            return new Promise((resolve, reject) => {
                HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetCourseById', form)
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
        export const GetCourseContentById = async (course_id: string): Promise<any> => {
            const form = new FormData();
            form.append('course_id', course_id);

            return new Promise((resolve, reject) => {
                HttpClient.Post(ConfigService.GetRealmOceanBrokerUrl() + 'GetCourseContentById', form)
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
}