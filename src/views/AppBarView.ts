import { EventBus, is } from "@tuval/core";
import { HStack, cLeading, Icon, VStack, Text, TextField, Spacer, cTopLeading, ForEach, UIRouteLink, Color, OverlayPanel, UIAvatar, Icons, MenuButton } from "@tuval/forms";

export interface IAppBarMenuItem {
    title?: string;
    url?: string;
    onClick?: Function;
    template?: any;

}
const menu: IAppBarMenuItem[] = [
    {
        template: () => (
            HStack({ alignment: cLeading, spacing: 10 })(
                //Icon(IconLibrary.AccountCircle).size(40),
                VStack({ alignment: cLeading })(
                    Text('stanoncloud').fontSize(16),
                    Text('Owner')
                )
            ).padding()
        )

    },
    {
        title: 'Switch Organization',
        url: '/newconsole/organizations/switch'

    },
    {
        title: 'Create a organization',
        url: '/newconsole/organizations/add'

    },
    {
        title: 'Sign Out',
        onClick: () => window.location.href = '/logout'

    }
]
export const AppBar = () => (

    HStack({ spacing: 10 })(
        TextField().placeholder('Search by resource by name').fontSize(16)
            .onChange((e) => {
                setTimeout(() => {
                    EventBus.Default.fire('event.search.resource', { text: e })
                }, 100)
            }),
        Spacer(),
        MenuButton(),
        // Avatar
        OverlayPanel(
            HStack(
                UIAvatar(
                    Text('ST')
                ),
                // Icon(Icons.Academy).size(20)
            ).width(32).height(32).cursor('pointer')
        )(
            VStack({ alignment: cTopLeading })(
                ...ForEach(menu)(item =>
                    item.template != null ?
                        item.template()
                        :
                        UIRouteLink(item.url)(
                            HStack({ alignment: cLeading })(

                                Text(item.title)
                            )
                                .foregroundColor({ hover: '#031b4e' })
                                .background({ hover: '#e5e8ed' })
                                .padding()
                                .height()
                        ).width('100%')
                    // .onClick(() => is.function(item.onClick) ? item.onClick() : void 0)
                )
                //SlideMenuView().viewportHeight(250)

            ).width(200).cursor('pointer')
        )

    )
        .height(60)
        .shadow('rgb(0 0 0 / 3%) 1px 2px 4px 0px')
        .background(Color.white)
        .borderBottom('1px solid rgb(241, 241, 241)')
        .padding('0px 1.5rem')
)