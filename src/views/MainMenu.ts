import { cLeading, HStack, UIRouteLink, Text, useParams, useState, VStack, cTop, Icon, Icons, UIRecordContext, ForEach, cTopLeading } from "@tuval/forms";
import { RealmOceanDataContext } from "../DataContext";



const getMenu = (organization_id: string) => {

    return ([
        {
            title: 'insights',
            items: [
                {
                    title: 'Overview',
                    icon: '\\e5c3',
                    link: `/newconsole/organization/${organization_id}/overview`
                }
            ]
        },
        {
            title: 'Realm Management',
            items: [
                {
                    title: 'All Realms',
                    icon: '\\e1a0',
                    link: `/newconsole/organization/${organization_id}/realms/list`
                },
                {
                    view: () => (
                        UIRouteLink(`/newconsole/organization/${organization_id}/realms/add`)(
                            HStack({ alignment: cLeading })(
                                Text('+ New Realm').foregroundColor('#00d7d2').padding('10px 20px')
                                    .fontSize(16)
                            ).height()
                        ).width('100%')
                    )
                }
            ]
        },
        {
            title: 'App Management',
            items: [
                {
                    title: 'Apps',
                    icon: '\\e5c3',
                    link: `/newconsole/organization/${organization_id}/app/list`
                },
                {
                    title: 'Brokers',
                    icon: '\\e5c3',
                    link: `/newconsole/organization/${organization_id}/broker/list`
                },
                {
                    view: () => (
                        UIRouteLink(`/newconsole/organization/${organization_id}/app/add`)(
                            HStack({ alignment: cLeading })(
                                Text('+ New App').foregroundColor('#00d7d2').padding('10px 20px')
                                    .fontSize(16)
                            ).height()
                        ).width('100%')
                    )
                }
            ]
        },
        {
            title: 'License Management',
            items: [
                {
                    title: 'Dashboard',
                    icon: '\\e871',
                    link: `/newconsole/organization/${organization_id}/app/list`
                },
                {
                    title: 'Products',
                    icon: '\\d276',
                    link: `/newconsole/organization/${organization_id}/license/product/list`
                },
                {
                    title: 'Customers',
                    icon: '\\d22f',
                    link: `/newconsole/organization/${organization_id}/broker/list`
                },
            ]
        },
        {
            title: 'API Management',
            items: [
                {
                    title: 'Apis',
                    icon: '\\e5c3',
                    link: ''
                },
                {
                    view: () => (
                        UIRouteLink(`/apps/add`)(
                            HStack({ alignment: cLeading })(
                                Text('+ New App').foregroundColor('#00d7d2').padding('10px 20px')
                                    .fontSize(16)
                            ).height()
                        ).width('100%')
                    )
                }
            ]
        },
        {
            title: 'Course Management',
            items: [
                {
                    title: 'Courses',
                    icon: '\\e5c3',
                    link: '/newconsole/course/list'
                },
                {
                    view: () => (
                        UIRouteLink(`/console/course/add`)(
                            HStack({ alignment: cLeading })(
                                Text('+ New Course').foregroundColor('#00d7d2').padding('10px 20px')
                                    .fontSize(16)
                            ).height()
                        ).width('100%')
                    )
                }
            ]
        },
        {
            title: 'Other',
            items: [
                {
                    title: 'Members',
                    icon: '\\e8b8',
                    link: `/newconsole/organization/${organization_id}/members`
                },
                {
                    title: 'Notifications',
                    icon: '\\e7f4',
                    link: '/realms_/settings/team'
                },
                {
                    title: 'Settings',
                    icon: '\\e8b8',
                    link: '/newconsole/settings/team'
                },
            ]
        }
    ]
    )
}

export const MainMenu = (selected: string) => {

    const { organization_id } = useParams();
   /*  if (organization_id == null) {
        return null
    } */

    const [selectedRealm, setSelectedRealm] = useState();
    const [organizationName, setOrganizationName] = useState('');

    return (
        VStack({ alignment: cTop })(
            HStack({ alignment: cLeading, spacing: 10 })(
                Icon(Icons.Academy).size(30).paddingLeft('15px')
                    .onClick(() => window.location.href = '/'),
                RealmOceanDataContext(
                    UIRecordContext(({ data }) =>
                        Text(data?.organization_display_name).textTransform('uppercase').fontSize(16).foregroundColor("white")
                    ).resource('organizations').filter({ id: organization_id })
                )
                //Text(organizationName).textTransform('uppercase').fontSize(16).foregroundColor(Color.white)
            ).paddingTop('10px').foregroundColor('rgb(161,170,189)').height(),
            ...ForEach(getMenu(organization_id))(item =>
                VStack({ alignment: cTopLeading })(
                    Text(item.title)
                        .textTransform('uppercase')
                        .fontSize(13)
                        .padding('25px 20px 15px'),
                    ...ForEach(item.items)(subItem =>
                        subItem.view == null ?
                            UIRouteLink(subItem.link ?? '')(
                                HStack({ alignment: cLeading, spacing: 8 })(
                                    //subItem.icon ? Icon(subItem.icon).size(22).foregroundColor("white") : null,
                                    Text(subItem.title).foregroundColor("white")
                                )
                                    .height().padding('10px 20px')
                                    .transition('background 0.2s ease 0s')
                                    .background({ default: selected === subItem.title ? 'rgba(255,255,255,0.2)' : '', hover: 'rgba(255,255,255,0.2)' })
                            ).width('100%') :
                            subItem.view()
                    )
                ).borderBottom('1px solid rgba(180,188,199,.32)').height()
                    .paddingBottom('20px')
            )
        ).foregroundColor('white')
            .background('#212932'/* '#031b4d' */).width(200).minWidth('250px')

    )
}