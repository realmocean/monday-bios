import { EventBus, is } from "@tuval/core";
import {
    cLeading,
    cTop,
    cTopLeading,
    Desktop,
    DialogContainer,
    HStack,
    Icon,
    Icons,
    MenuButton,
    UIController, UIRouteLink, UIView, VStack, Text, UIRecordContext, BiosTheme, useBiosTheme, UIRoutes, UIRoute
} from "@tuval/forms";
import { RealmDataContext } from "./DataContext";
import { theme } from "./theme/theme";
import { AppTaskbar } from "./views/AppSelectMenu";
import { LeftSidemenu } from "./views/LeftSideMenu";

export function getAppFullName() {
    try {
        let regex = /\/app\/com\.([A-Za-z]+)\.([A-Za-z]+)\.([A-Za-z]+)/i;

        // Alternative syntax using RegExp constructor
        // const regex = new RegExp('(?:^\\/app\\/+|\\G(?!^)\\.)\\K\\w+', 'g')

        const str = window.location.href;


        const m = regex.exec(str);
        if (m.length !== 4) {
            return null
        }

        if (is.nullOrEmpty(m[3])) {
            return null;
        }
        //alert(`com.${m[1]}.${m[2]}.${m[3]}`)
        return `com.${m[1]}.${m[2]}.${m[3]}`;
    }
    catch {
        return null;
    }
}

export function getAppName() {
    try {
        let regex = /\/app\/com\.([A-Za-z]+)\.([A-Za-z]+)\.([A-Za-z]+)/i;

        // Alternative syntax using RegExp constructor
        // const regex = new RegExp('(?:^\\/app\\/+|\\G(?!^)\\.)\\K\\w+', 'g')

        const str = window.location.href;

        const m = regex.exec(str);
        return m[3];
    }
    catch {
        return '';
    }
}

const ComponentBios = () => {

}


export class BiosController extends UIController {
    public override LoadView(): UIView {
        const params: any = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop as any),
        });
        // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
        let embeded = params.embeded === 'true'; // "some_value"

        if (embeded) {
            return (
                VStack(
                    Desktop('')
                )
            )
        }

        return (

            BiosTheme({ thema: theme })(() => {
                return (RealmDataContext(
                    VStack(
                        HStack({ alignment: cLeading })(
                            UIRecordContext(({ data }) =>
                                HStack({ alignment: cLeading })(
                                    Text(data?.value + ' | ' + getAppName()).fontSize('1.5rem').padding().whiteSpace('nowrap')
                                ).height().width(600)
                            ).resource('realminfos').filter({ id: 'REALM_NAME' }),

                            AppTaskbar()
                        )
                            .fontSize('1.2rem')
                            .height(50).minHeight('50px')
                            .foregroundColor('white'),
                        HStack({ alignment: cTop })(
                            LeftSidemenu(false),
                            VStack({ alignment: cTopLeading })(
                                //DialogContainer(),
                                HStack(
                                    Desktop('')
                                    
                                )
                                    .overflow('hidden')
                                    .cornerRadius(20)
                            )
                                .cornerRadius(20)
                                .background('#F6F7FB')
                                .overflow('hidden')
                                .width('100%'),
                        )
                            .height('calc(100% - 50px)')
                    )
                        .background('var(--main-theme-color)')
                ))
            }

            )


            //.background('#292F4C')
        )
    }
}