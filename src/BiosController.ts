import { EventBus, TCompress, is } from "@tuval/core";
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
    UIController, UIRouteLink, UIView, VStack, Text, UIRecordContext, BiosTheme,
    useBiosTheme, UIRoutes, UIRoute, Button, useState, UIImage, useNavigate, UIWidget, Spacer, useParams, DataProtocol
} from "@tuval/forms";
import { RealmDataContext } from "./DataContext";
import { theme } from "./theme/theme";
import { AppTaskbar } from "./views/AppSelectMenu";
import { LeftSidemenu } from "./views/LeftSideMenu";
import html2canvas from 'html2canvas';
import { SupportDialog } from "./SupportDialog";
import { Routes } from "./Routes";
import { useSessionService } from "@realmocean/services";

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

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new Blob([ab], { type: mimeString });


}

/* var blob = dataURItoBlob(someDataUrl);
var fd = new FormData(document.forms[0]);
var xhr = new XMLHttpRequest();

fd.append("myFile", blob);
xhr.open('POST', '/', true);
xhr.send(fd);
 */


export class BiosController extends UIController {

    public override LoadView(): UIView {

        const [screenShut, setScreenShut] = useState(false);
        const [defaultAppStarted, setDefaultAppStarted] = useState(false);

        const navigate = useNavigate();

        if (!defaultAppStarted && getAppFullName() == null) {
            setTimeout(() => navigate('/app/com.tuvalsoft.app.stream'), 200)

            setDefaultAppStarted(true)
        }



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

        const { space_id, folder_id, item_id } = useParams();

        return (
            DataProtocol('com.tuvalsoft.provider.tasks')(() =>
                BiosTheme({ thema: theme })(() => {
                    return (RealmDataContext(
                        VStack(

                            HStack(
                                Button(
                                    Icon(Icons.Add).fontSize(20)
                                )
                                    .loading(screenShut)
                                    .width(50).height(50)
                                    .cornerRadius('50%')
                                    .onClick(() => {
                                        setScreenShut(true);
                                        html2canvas(document.body).then(function (canvas) {
                                            var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
                                            SupportDialog.Show(image);
                                            setScreenShut(false);
                                        });
                                    })
                            ).width().height().position('absolute').right('10px').bottom('10px')
                                //.tooltip('Create support ticker')
                                .zIndex(100000),
                            HStack({ alignment: cLeading })(
                                UIRecordContext(({ data }) =>
                                    HStack({ alignment: cLeading })(
                                        Text(data?.value + ' | ' + getAppName()).fontSize('1.5rem').padding().whiteSpace('nowrap')
                                    ).height().width(600)
                                ).resource('realminfos').filter({ id: 'REALM_NAME' }),

                                AppTaskbar(),
                                Spacer(),
                                UIWidget().qn('com.tuvalsoft.widget.digitalclock')
                                    .config({
                                        title: 'App Starts',
                                        footer: 'Performence is OK'
                                    })
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
            ).config({
                variables: {

                    tenant_id: useSessionService().TenantId,
                    account_id: useSessionService().AccountId,
                    app_id: 'com.tuvalsoft.app.workbench',
                    space_id: space_id,
                    folder_id: folder_id,
                    item_id: item_id
                }
            })


            //.background('#292F4C')
        )
    }
}