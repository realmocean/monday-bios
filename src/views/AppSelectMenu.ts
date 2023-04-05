import { EventBus, is } from "@tuval/core";
import { cTopLeading, cVertical, ForEach, HStack, ScrollView, Spinner, UIRecordsContext, VStack, Text, RecordsContextClass, UIImage, cTop, UIRouteLink, Button, cLeading, PositionTypes, cCenter, UIRecordContext, Fragment, useTheme, useBiosTheme, TooltipPositions } from "@tuval/forms";
import { getAppFullName } from "../BiosController";
import { RealmDataContext, RealmOceanDataContext } from "../DataContext";


export const runningApps = new Set();

export const AppTaskbar = () => {
   return ( RealmOceanDataContext(
        HStack({ spacing: 20 })(
            ...ForEach(Array.from(runningApps))(appName =>
                getAppFullName() !== '' ?
                UIRecordsContext(({ data, total, isLoading }) =>
                    isLoading ? Fragment() :
                        VStack({ alignment: cCenter, spacing: 2 })(

                            UIRouteLink(`/app/${appName}`)(
                                VStack(

                                    UIImage((is.array(data) && data.length > 0) ? data[0]?.app_icon : '').width(24).height(24)
                                )
                                .tooltip(data[0]?.app_display_name)
                                .tooltipPosition(TooltipPositions.BOTTOM)
                                    .height(36).width(36)
                                    .background({ hover: 'rgba(0,0,0,.6)', default: '' })
                                    .cornerRadius(8)
                                    .cursor('pointer')
                            ),

                            isLoading ? Fragment() : HStack().width(5).height(5).background('white').cornerRadius('50%')
                        ).width().height()
                ).height()
                    .resource('app-mainstore-settings').filter({ app_qualified_name: appName }) : Fragment(),
            )
        ).position(PositionTypes.Absolute)

    ))
                                }


export const AppSelectMenu = () => {
   
    return (
        RealmDataContext(
            UIRecordsContext(({ data, total, isLoading }) =>
                UIRecordsContext(({ data: tenantApps, total, isLoading }) =>
                    HStack(
                        isLoading ? HStack(Spinner()) :
                            VStack({ alignment: cTopLeading })(
                                HStack({ alignment: cLeading })(
                                    Text('Installed Apps').fontSize('1.2rem').fontWeight('600')
                                ).height(50),
                                ScrollView({ axes: cVertical, alignment: cTopLeading })(
                                    HStack({ alignment: cTopLeading, spacing: 5 })(
                                        ...ForEach(data)(item =>
                                            HStack(
                                                RealmOceanDataContext(
                                                    UIRecordContext(({ data: appInfo }) =>
                                                        UIRouteLink(`/app/${appInfo?.app_qualified_name}`)(
                                                            VStack({ alignment: cTop, spacing: 10 })(
                                                                UIImage(appInfo?.app_icon).width(56).height(56),
                                                                Text(appInfo?.app_display_name)
                                                            )
                                                                .width(90)
                                                                .height(120)
                                                                .cursor('pointer')
                                                        )
                                                    ).resource('app-mainstore-settings')
                                                        .filter({ id: item.app_id })
                                                )

                                            ).width().height()
                                        ),
                                        ...ForEach(tenantApps)(item =>
                                            HStack(
                                                RealmOceanDataContext(
                                                    UIRecordContext(({ data: appInfo }) =>
                                                        UIRouteLink(`/app/${appInfo?.app_qualified_name}`)(
                                                            VStack({ alignment: cTop, spacing: 10 })(
                                                                UIImage(appInfo?.app_icon).width(56).height(56),
                                                                Text(appInfo?.app_display_name)
                                                            )
                                                                .width(90)
                                                                .height(120)
                                                                .cursor('pointer')
                                                        )
                                                    ).resource('app-mainstore-settings')
                                                        .filter({ id: item.app_id })
                                                )

                                            ).width().height()
                                        )
                                    ).wrap('wrap')
                                ),
                                /*  UIRouteLink(`/app/com.tuvalsoft.app.organizationmanager/marketplace/apps`)(
                                     Button(
                                         Text('Install More Apps')
                                     )
                                 ),
                                 UIRouteLink(`/app/com.tuvalsoft.app.realmmanager`)(
                                     Button(
                                         Text('Install More Apps')
                                     )
                                 ) */
                            )
                    ).width(400).height(600)
                ).resource('tenant-default-apps')
            ).resource('realm-default-apps')
        ))
}

