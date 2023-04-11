import { Convert, TCompress } from "@tuval/core";
import { Button, DialogView, EditableHeader, EditableHeadingSizes, Text, EditableHeadingTypes, HStack, Icon, Icons, TabList, UIImage, UIView, VStack, cTopLeading, ViewProperty, UICreateContext } from "@tuval/forms";
import { RealmDataContext, RealmOceanDataContext } from "./DataContext";
import { useSessionService } from "@realmocean/services";
import { getAppFullName } from "./BiosController";

declare var realmocean$imageeditor;

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

/**
 * Resize a base 64 Image
 * @param {String} base64 - The base64 string (must include MIME type)
 * @param {Number} newWidth - The width of the image in pixels
 * @param {Number} newHeight - The height of the image in pixels
 */
function resizeBase64Img(base64, scale) {
    return new Promise((resolve, reject) => {
        debugger



        let img = document.createElement("img");
        img.src = base64;
        img.onload = function () {
            const pixelCount = img.width * img.height;
            let scale = 0.8;

            if (pixelCount >= 8094400) {
                console.log('4K')
                scale = 0.4;
            } else if (pixelCount >= 2011840) {
                console.log('2K')
                scale = 0.6;
            }

            const newWidth = img.width * scale;
            const newHeight = img.height * scale
            var canvas = document.createElement("canvas");
            let context = canvas.getContext("2d");
            canvas.width = newWidth;
            canvas.height = newHeight;
            canvas.style.width = newWidth.toString() + "px";
            canvas.style.height = newHeight.toString() + "px";
            context.drawImage(img, 0, 0, newWidth, newHeight);
            context.scale(newWidth / img.width, newHeight / img.width,);

            resolve(canvas.toDataURL());
        }
    });
}


export class SupportDialog extends DialogView {
    @ViewProperty()
    title: string;

    @ViewProperty()
    screenShot: string;

    @ViewProperty()
    image: string;

    @ViewProperty()
    imageEditor: any;

    public constructor() {
        super();
        this.Header = 'Create ticket'
        this.Width = '80vw'
        this.Height = '80vh'
    }
    public BindRouterParams({ image }) {
        this.image = image
    }

    public OnOK() {
        this.ShowDialogAsyncResolve();

        this.Hide();
    }

    public OnCancel() {
        this.Hide();
    }

    public override LoadView(): UIView {
        return (
            RealmOceanDataContext(
                UICreateContext((create, isCreating) =>
                    VStack({ alignment: cTopLeading, spacing: 10 })(
                        HStack({ spacing: 10 })(
                            EditableHeader()
                                .placeholder('Enter a subject')
                                .type(EditableHeadingTypes.h2)
                                .width('100%')
                                .onChange((value) => this.title = value),
                            Button(
                                HStack({ spacing: 5 })(
                                    Icon(Icons.Send).fontSize(20),
                                    Text('Send')
                                )
                            ).onClick(() => {
                               
                                /* const blob = dataURItoBlob(this.image)
                                var arrayBuffer;
                                var fileReader = new FileReader();
                                fileReader.onload = function () {
                                    arrayBuffer = this.result;
                                    console.log(new Uint8Array(arrayBuffer));
                                };
                                fileReader.readAsArrayBuffer(blob); */
                                console.log(this.image)
                                this.imageEditor.okBtn();
                                this.imageEditor.toPngUrl().then((url) => {
                                   // console.log(url)
                                    resizeBase64Img(this.image, 0.5).then((result) => {
                                       // this.image = result as any;
                                        const self = this;
                                        const blob = dataURItoBlob(this.image)
                                        var arrayBuffer;
                                        var fileReader = new FileReader();
                                        fileReader.onload = function () {
                                            arrayBuffer = this.result;
                                            //debugger
                                            const screenShot = Convert.ToBase64String(new Uint8Array(arrayBuffer));
                                            //console.log(TCompress.CompressBytes(new Uint8Array(arrayBuffer)));

                                            self.SetValue('realm_id', useSessionService().RealmId);
                                            self.SetValue('tenant_id', useSessionService().TenantId);
                                            self.SetValue('tenant_name', useSessionService().TenantName);
                                            self.SetValue('app_id', getAppFullName());
                                            self.SetValue('user_id', useSessionService().AccountId);
                                            self.SetValue('user_name', useSessionService().AccountName);
                                            self.SetValue('title', self.title);
                                            self.SetValue('description', 'dsfsdf');
                                            self.SetValue('screen_shot', screenShot);
                                            
                                            self.SetValue('statu', 'Open');
            
                                            create();
                                        };
                                        fileReader.readAsArrayBuffer(blob);

                                    });
                                })

                                /*  resizeBase64Img(this.image, 0.5).then((result) => {
                                     this.image = result as any;
         
                                     const blob = dataURItoBlob(this.image)
                                     var arrayBuffer;
                                     var fileReader = new FileReader();
                                     fileReader.onload = function () {
                                         arrayBuffer = this.result;
                                         console.log(TCompress.CompressBytes(new Uint8Array(arrayBuffer)));
                                     };
                                     fileReader.readAsArrayBuffer(blob);
         
                                 }); */
                            })
                        ).allHeight(32),

                        TabList(
                            {
                                text: 'Screentshot'
                            },
                            {
                                text: 'Description'
                            }
                        ),
                        realmocean$imageeditor.UIImageEditor()
                            .self((imageEditor) => this.imageEditor = imageEditor)
                            .create((imageEditor) => {
                                imageEditor.open(this.image)
                            })
                        /*  UIImage(this.image).height().width('100%') */
                    ).padding()
                ).resource('tickets')
            )

        )
    }

    public static Show(image) {

        const dialog = new SupportDialog();
        dialog.BindRouterParams({ image })
        return dialog.ShowDialogAsync();
    }
}