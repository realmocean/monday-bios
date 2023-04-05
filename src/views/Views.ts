import { is, int, Convert } from "@tuval/core"
import {
    TextAlignment, Text, HStack, cLeading, Color, cTop, cTopLeading, cTrailing,
    cVertical, ForEach, Icon, PositionTypes, ScrollView, UIScene,
    UIView, VStack, useState, useNavigate, Spacer, UIButton, TextField, useFormController,
    Dropdown, UITable, TableColumn, UIAppearance, ValidateRule, UIFileUpload, UIViewBuilder, UIImage, Spinner
} from "@tuval/forms"
import { AppBar } from "./AppBarView"

export namespace Views {

    export interface ILabeledFileUploadParams {
        label?: string;
        subTitle?: string;
        onUploadedFile?: (fileContent: string) => void;
        image?: string;
        allowedExtensions?: string;
    }

    export const GridActionButton = (icon) => (
        HStack(
            Icon(icon).size(22)
        )
            .width(35).height(35)
            .cornerRadius(20).background({ hover: '#EEE' })

    )


    export const LabeledFileUploadView1 = (params: ILabeledFileUploadParams) => (
        HStack({ alignment: cTopLeading, spacing: 5 })(
            Labels.FormLabel(params.label).width('33%'),
            UIFileUpload(
                VStack(
                    VStack(
                        HStack({ alignment: cTopLeading })(
                            // params.image != null ? UIImage(params.image).width(457).height(257) : null,
                            VStack({ spacing: 10 })(
                                UIImage(params.image).width(80).height(80),
                                Text(params.subTitle).fontSize('14px')
                                    .foregroundColor('#3c4043')
                                    .fontFamily("'Roboto', Arial, sans-serif")
                            )
                        )
                    )
                        .cursor('copy')
                        .backgroundColor({ hover: '#f5f5f5' })
                        .border('1px solid #dfdfdf'),
                )
            )
                .allowedExtensions(params.allowedExtensions)
                .marginTop('10px')
                .width('66%')
                .height(196)
                .maxWidth('900px')
                .onFileReady((e) => { params.onUploadedFile(convertToEncodedUrl(e.fileExt, e.fileAsByteArray))/*  console.log(CvsToJson.Convert(e.GetFileContentAsString(), { parseNumbers: true })) */ }),
        ).height().marginTop('20px')
    )


    export const PageTitle = (title: string) => (
        Text(title)
            .whiteSpace('nowrap')
            .fontFamily('"TuvalSans", "proxima nova", "helvetica neue", "helvetica", "arial", sans-serif')
            .foregroundColor('#444')
            .fontWeight('500')
            .fontSize(32)
        // .marginBottom('1.5rem')
    )

    export const PageTitleInfoLabel = (text: string) => (
        Text(text)
            .multilineTextAlignment(TextAlignment.leading)
            // .whiteSpace('nowrap')
            .fontFamily('Roboto,Arial,sans-serif')
            .foregroundColor('#5f6368')
            .fontWeight('400')
            .fontSize(14)
            .paddingTop('5px')
            .lineHeight('1.25rem')
    )

    export const PageTitleInfo = (title: string | UIView) => (
        title instanceof UIView ? title :
            PageTitleInfoLabel(title)
        //.render(RenderingTypes.Markdown)
        //.marginBottom('1.5rem')
    )

    export const PageSubTitle = (title: string) => (
        Text(title)
            .whiteSpace('nowrap')
            .fontFamily('"TuvalSans", "proxima nova", "helvetica neue", "helvetica", "arial", sans-serif')
            .foregroundColor('#202124')
            .fontWeight('500')
            .fontSize(24)

        // .marginBottom('1.5rem')
    )

    export const PageTitleBox = ({ title, info, button }: { title: string, info: string | UIView, button?: UIView }) => (
        HStack({ alignment: cLeading })(
            VStack({ alignment: cLeading })(
                Views.PageTitle(title),
                Views.PageTitleInfo(info)
            ).height(),
            Spacer(),
            button?.marginRight('50px')
        ).height().borderBottom('1px solid #dadce0').marginBottom('1rem').paddingBottom('1rem')
    )

    export const PageSubTitleBox = ({ title, info, content }: { title: string, info: string, content?: UIView }) => (
        VStack({ alignment: cTopLeading })(
            HStack({ alignment: cLeading })(
                Views.PageSubTitle(title),
            ).height(),
            Views.PageTitleInfo(info),
            content
        ).height().borderBottom('1px solid #dadce0').marginBottom('1rem').paddingBottom('1rem')
    )


    export const TabView = (tabModel: any[]) => {
        const bottomBorderColor = '#1a73e8';

        const [selectedIndex, setSelectedIndex] = useState(0)
        const [prevSelectedIndex, setPrevSelectedIndex] = useState(0)
        const [selectedTab, setSelectedTab] = useState(tabModel[0])

        return (
            VStack({ alignment: cTopLeading, spacing: 5 })(
                VStack({ spacing: 0 })(
                    HStack({ alignment: cLeading, spacing: 0 })(
                        ...ForEach(tabModel)((tab, index) =>
                            VStack(
                                HStack(
                                    Text(tab.title).fontSize(14).lineHeight('40px')
                                        .fontWeight(selectedTab?.title === tab?.title ? '500' : '400')
                                ),
                            ).background({ hover: selectedIndex === index ? '#E7EFFA' : '#EAEBEB' })
                                .foregroundColor(selectedIndex === index ? '#1a73e8' : '')
                                .cursor('pointer')
                                .width(160)
                                .onClick(() => { setSelectedTab(tab); setPrevSelectedIndex(selectedIndex); setSelectedIndex(index); tab?.onSelected?.() }),

                        ),
                        HStack(Text('')).background('#dadce0').height(1)
                            .position('absolute').bottom('0px')
                    ).height(40),
                    HStack(
                        HStack(Text(''))

                            .background(bottomBorderColor)
                            .height(4)
                            .width(160)
                            .position('absolute')
                            .top('-4px')
                            .initial({ left: (prevSelectedIndex * 160) + 'px' })
                            .animate({ left: (selectedIndex * 160) + 'px' }),
                    ).height()
                ).height(),
                VStack({ alignment: cTopLeading })(
                    ...ForEach(tabModel)((tab, index) => (
                        selectedIndex === index ? tab.view() : null
                    )
                    )
                ).paddingTop('10px')

            ).height()
        )
    }

    export const TeamName = (text: string) => (
        Text(text)
            .fontFamily('"proxima-nova", "proxima nova", "helvetica neue", "helvetica", "arial", sans-serif')
            .foregroundColor('#444')
            .fontWeight('400')
            .fontSize('1.7rem')
            .marginBottom('1.5rem')
    )

    export const Button = (label: string) => (
        UIButton(
            Text(label)
        )
            .background({ default: '#ececec', hover: '#dfdfdf' })
            .transition('all .2s ease-in-out')
            .foregroundColor('#676767')
            .border('1px solid #ececec')
            .padding('0 1.6rem')
            .fontSize('.9rem')
            .fontWeight('600')
            .lineHeight('3rem')
            .cornerRadius(3)
    )

    export const IconAcceptButton = (icon: string, label: string) => (
        UIButton(
            HStack({ spacing: 5 })(
                Icon(icon).size(22),
                Text(label).whiteSpace('nowrap')
            )
        )
            .cornerRadius(4)
            .fontFamily('TuvalSans,Roboto,Arial,sans-serif')
            .background({ default: '#1a73e8', hover: '#1B66CA' })
            .transition('border .28s cubic-bezier(.4,0,.2,1),box-shadow .28s cubic-bezier(.4,0,.2,1)')
            .foregroundColor('#fff')
            .border('1px solid #0069ff')
            .padding('0 1.6rem')
            .fontSize(14)
            .fontWeight('500')
            .lineHeight('1.25rem')
            .kerning('.0142857143em')
            .minWidth('64px')
            .padding('7px 15px')
            .shadow({ hover: '0 1px 2px 0 var(--gm-fillbutton-keyshadow-color, rgba(60,64,67,.3)),0 1px 3px 1px var(--gm-fillbutton-ambientshadow-color, rgba(60,64,67,.15))' })

    )
    export const AcceptButton = (label: string) => (
        UIButton(
            Text(label).whiteSpace('nowrap')
        )
            .cursor('pointer')
            .cornerRadius(4)
            .fontFamily('TuvalSans,Roboto,Arial,sans-serif')
            .background({ default: '#1a73e8', hover: '#1B66CA' })
            .transition('border .28s cubic-bezier(.4,0,.2,1),box-shadow .28s cubic-bezier(.4,0,.2,1)')
            .foregroundColor('#fff')
            .border('1px solid #0069ff')
            .padding('0 1.6rem')
            .fontSize(14)
            .fontWeight('500')
            .lineHeight('1.25rem')
            .kerning('.0142857143em')
            .minWidth('64px')
            .padding('7px 15px')
            .shadow({ hover: '0 1px 2px 0 var(--gm-fillbutton-keyshadow-color, rgba(60,64,67,.3)),0 1px 3px 1px var(--gm-fillbutton-ambientshadow-color, rgba(60,64,67,.15))' })

    )

    export const CancelButton = (label: string) => (
        UIButton(
            Text(label).whiteSpace('nowrap')
        )
            .cornerRadius(4)
            .fontFamily('TuvalSans,Roboto,Arial,sans-serif')
            .transition('border .28s cubic-bezier(.4,0,.2,1),box-shadow .28s cubic-bezier(.4,0,.2,1)')
            .foregroundColor('gray')
            .padding('0 1.6rem')
            .fontSize(14)
            .fontWeight('500')
            .lineHeight('1.25rem')
            .kerning('.0142857143em')
            .minWidth('64px')
            .padding('7px 15px')
    )

    export const LinkButton = (label: string, icon: any) => (

        HStack({ spacing: 3 })(
            Text(label).whiteSpace('nowrap'),
            Icon(icon).size(15).marginLeft('5px')
        )
            .cornerRadius(4)
            .fontFamily('TuvalSans,Roboto,Arial,sans-serif')
            .background({ default: '', hover: '#F6FAFE' })
            .foregroundColor({ default: '#1a73e8', hover: '#174ea6' })
            .fontSize(14)
            .fontWeight('500')
            .lineHeight('1.25rem')
            .kerning('.0142857143em')
            .padding('7px 15px')
            .width('fit-content')

    )

    export const StrongLabel = (label: string) => (
        Text(label)
            .fontFamily('"proxima-nova", "proxima nova", "helvetica neue", "helvetica", "arial", sans-serif')
            .fontSize(16)
            .foregroundColor('#676767')
            .fontWeight('600')
    )

    export const Label = (label: string) => (
        Text(label)
            .fontFamily('"proxima-nova", "proxima nova", "helvetica neue", "helvetica", "arial", sans-serif')
            .fontSize(16)
            .foregroundColor('#676767')
            .fontWeight('400')
    )

    export const SearchBox = (placeholder: string, width?: string | int) => (

        HStack({ spacing: 5 })(
            //Icon(IconLibrary.Search).size(26),
            TextField().fontSize('1rem')
                .foregroundColor('#444')
                .placeholder(placeholder)
        )
            .width(width as any)
            .tabIndex(0)
            .paddingLeft('10px')
            .border({ default: "1px solid #dfdfdf", focus: "1px solid  #0069ff" })
            .height('3rem')
            .cornerRadius(3)
            .transition('all .2s ease-in-out')
            .fontFamily('"proxima-nova", "proxima nova", "helvetica neue", "helvetica", "arial", sans-serif')
    )

    export namespace Labels {
        export const FormLabel = (value: string) => (
            Text(value)
                .fontSize('14px')
                .kerning('.0142857143em')
                .fontFamily('Roboto,Arial,sans-serif')
                .fontWeight('400')
                .lineHeight('1.25rem')
                .foregroundColor('#3c4043')
        )
    }

    export const LabeledFormInputView = ({ label, placeholder = '', fieldName, rules = [], multiline = false }: { label: string, placeholder?: string, fieldName: string, rules?: ValidateRule[], multiline?: boolean }) => {

        const formController = useFormController();

        const TextBoxView = () => (
            VStack({ alignment: cLeading })(
                /*  !multiline && Text(placeholder)
                      .foregroundColor('#676767')
                      .fontWeight('700')
                      .fontFamily('"proxima-nova", "proxima nova", "helvetica neue", "helvetica", "arial", sans-serif')
                      .fontSize(is.nullOrEmpty(formController.GetValue(fieldName)) ? 0 : 11)
                      .transition('all .2s ease-in-out')
                  , */
                TextField()
                    .formField(fieldName, rules)
                    .shadow({ focus: 'none' })
                    //.padding('0px')
                    // .padding(cVertical, is.nullOrEmpty(formController.GetValue(fieldName)) ? '10px' : '5px')
                    //.border('none')
                    .fontFamily('"proxima-nova", "proxima nova", "helvetica neue", "helvetica", "arial", sans-serif')
                    .placeholder(is.nullOrEmpty(formController.GetValue(fieldName)) ? placeholder : '')
                    .fontSize(14)
                    .foregroundColor('#444')
                    //.value(formController.GetValue(fieldName))
                    .transition('all .2s ease-in-out')
                    .multiline(multiline)
                    .height(multiline ? 180 : 45)

            )
            /*  )
                 .height(multiline ? 200 : 50)
                 .border('1px solid #dfdfdf')
                 .paddingLeft('10px')
                 .cornerRadius(5)
                 .foregroundColor('#444').transition('all .2s ease-in-out') */
        )

        return (
            HStack({ alignment: multiline ? cTopLeading : cLeading, spacing: 5 })(
                Labels.FormLabel(label).width('33%'),
                TextBoxView().width('66%')
            ).height().maxWidth('900px').paddingBottom('24px')
        )
    }

    export const LabeledFormDropDownView = ({ label, placeholder, fields, items, fieldName, rules }: { label: string, placeholder: string, items: any[], fields: { text: string, value: string }, fieldName: string, rules?: ValidateRule[] }) => {

        const formController = useFormController();

        const TextBoxView = () => (
            Dropdown(selectedItem =>
                Text(selectedItem[fields.text])
            )(item =>
                Text(item[fields.text])

            )
                .model(items)
                .fields(fields)
                .formField(fieldName, rules)
                // .shadow({ focus: 'none' })
                .padding('0px')
                .border('none')
                .fontFamily('"proxima-nova", "proxima nova", "helvetica neue", "helvetica", "arial", sans-serif')
                .placeholder(is.nullOrEmpty(formController.GetValue(fieldName)) ? placeholder : '')
                .fontSize('1rem')
                .foregroundColor('#444')
                .transition('all .2s ease-in-out')
                .height(45)


        )

        return (
            HStack({ alignment: cLeading, spacing: 5 })(
                Labels.FormLabel(label).width('33%'),
                TextBoxView().width('66%')
            ).height().maxWidth('900px').paddingBottom('24px')
        )
    }



    export const LabeledTextInputView1 = (value: string, placeholder: string,
        text: string, onTextChanged: Function, autofocus: boolean = false, invalid: boolean = false) => {

        const TextBoxView = (placeholder: string, text: string, onTextChanged: Function) => (
            VStack({ alignment: cLeading })(
                TextField()
                    .fontFamily('"proxima-nova", "proxima nova", "helvetica neue", "helvetica", "arial", sans-serif')
                    .autofocus(autofocus)
                    .placeholder(is.nullOrEmpty(text) ? placeholder : '')
                    .fontSize('1rem')
                    .foregroundColor('#444')
                    .value(text)
                    .onChange((value) => { onTextChanged(value); })

            ).border(invalid ? '1px solid red' : '1px solid #dfdfdf').height('3rem')
                .cornerRadius(5).paddingLeft('10px')
                .foregroundColor('#444').transition('all .2s ease-in-out')
        )

        return (
            HStack({ alignment: cLeading, spacing: 5 })(
                Labels.FormLabel(value).width('33%'),
                TextBoxView(placeholder, text, onTextChanged).width('66%')
            ).height().maxWidth('900px').paddingBottom('24px')
        )
    }


    const _image = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHRpdGxlPkZpbGVVcGxvYWRlckljb25AMng8L3RpdGxlPjxkZWZzPjxsaW5lYXJHcmFkaWVudCB4MT0iNTAlIiB5MT0iMCUiIHgyPSI1MCUiIHkyPSIxMDAlIiBpZD0iYSI+PHN0b3Agc3RvcC1jb2xvcj0iI0RBRENFMCIgb2Zmc2V0PSIwJSIvPjxzdG9wIHN0b3AtY29sb3I9IiNCREMxQzYiIG9mZnNldD0iMTAwJSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI1MCUiIHkxPSIwJSIgeDI9IjUwJSIgeTI9IjEwMCUiIGlkPSJjIj48c3RvcCBzdG9wLWNvbG9yPSIjRThFQUVEIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI0RBRENFMCIgb2Zmc2V0PSIxMDAlIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBkPSJNMTkgMTBoNDFhNCA0IDAgMCAxIDQgNHY0NC41NjNBMiAyIDAgMCAxIDYzLjM5IDYwbC05Ljc3IDkuNDM3YTIgMiAwIDAgMS0xLjM4OS41NjJIMTlhNCA0IDAgMCAxLTQtNFYxNGE0IDQgMCAwIDEgNC00eiIgaWQ9ImIiLz48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTkgMTBoNDFhNCA0IDAgMCAxIDQgNHY1MmE0IDQgMCAwIDEtNCA0SDE5YTQgNCAwIDAgMS00LTRWMTRhNCA0IDAgMCAxIDQtNHoiIGZpbGw9InVybCgjYSkiIHRyYW5zZm9ybT0icm90YXRlKDE1IDM5LjUgNDApIi8+PG1hc2sgaWQ9ImQiIGZpbGw9IiNmZmYiPjx1c2UgeGxpbms6aHJlZj0iI2IiLz48L21hc2s+PHVzZSBmaWxsPSJ1cmwoI2MpIiB4bGluazpocmVmPSIjYiIvPjxwYXRoIGZpbGw9IiNFOEVBRUQiIG1hc2s9InVybCgjZCkiIGQ9Ik01MyA1OWgxMXYxMUg1M3oiLz48cGF0aCBmaWxsPSIjQkRDMUM2IiBvcGFjaXR5PSIuNSIgbWFzaz0idXJsKCNkKSIgZD0iTTUzIDU5djExSDQyeiIvPjwvZz48L3N2Zz4='




    const convertToEncodedUrl = (fileExt: string, fileAsByteArray: Uint8Array) => {
        let dataUrl = '';

        switch (fileExt) {
            case 'svg':
                dataUrl = 'data:image/svg+xml;base64,';
                break;
            case 'png':
                dataUrl = 'data:image/png;base64,';
                break;
            case 'jpeg':
                dataUrl = 'data:image/jpeg;base64,';
                break;
            case 'jpg':
                dataUrl = 'data:image/jpeg;base64,';
                break;


        }
        const encodedString = Convert.ToBase64String(fileAsByteArray);
        const url = `${dataUrl}${encodedString}`;
        return url;
    }

    export const TableCellText = (text: string) => (
        Text(text)
            .fontFamily('Roboto,Arial,sans-serif')
            .fontSize(14)
            .padding(10)
    )

    export const TableView = (columns: any[], data: any[]) => (
        UIViewBuilder(() => {
            const [test, setTest] = useState(true)
            return (
                UITable(
                    ...ForEach(columns)(column =>
                        TableColumn(
                            Text(column.title)
                                .fontFamily('Roboto,Arial,sans-serif')
                                .fontSize(12)
                                .fontWeight('500')
                                .padding(10)
                        )(row =>
                            column.view == null ?
                                HStack({ alignment: cLeading })(
                                    TableCellText(row[column.key])
                                ).height(38)
                                :
                                column.view(row)
                        ).width(column.width ?? '')
                    )
                )
                    .height()
                    .value(data)
                    .headerAppearance(UIAppearance().borderBottom('1px solid #dadce0'))
                    .rowAppearance(UIAppearance().borderBottom('1px solid #dadce0'))
            )
        }

        )

    )


    export const LoadingText = () => (

        HStack(Spinner())
       /*  HStack(
            Text('Loading...')
        )
            .background('#f9edbe')
            .cornerRadius(2)
            .fontWeight('600')
            .marginTop('20px')
            .padding('3px 9px')
            .shadow('0 2px 2px rgb(0 0 0 / 20%)')
            .width()
            .height() */

    )

    export const PageView = ({ loading, menu, title, subTitle, button, content, bottomContent }: { loading?: boolean, menu: UIView, title: string, subTitle?: string | UIView, button?: UIView, content: UIView, bottomContent?: UIView }) => (
        UIScene(

            HStack({ alignment: cTopLeading })(
                menu,
                VStack(
                    AppBar(),
                    VStack({ alignment: cTopLeading })(
                        Views.PageTitleBox({
                            title: title,
                            info: subTitle,
                            button: button

                        }),
                        ScrollView({ axes: cVertical, alignment: cTopLeading })(
                            loading ?
                                HStack(
                                    LoadingText()
                                ).height()
                                :
                                content
                        )
                    ).padding(20),
                    bottomContent != null ?
                        HStack({ alignment: cTrailing })(
                            bottomContent
                        ).shadow('0 -5px 5px -5px #999')
                            .background(Color.white)
                            .height(68)
                            //.position(PositionTypes.Fixed)
                            .left('0')
                            .right('0')
                            .bottom('0px').paddingRight('10px')
                        :
                        null
                )
            )
        ).background(Color.white)
    )

    export const SectionButton = () => (
        UIButton(
            Text('+').fontSize(26)
                .marginBottom('4px')
                .marginLeft('8px')
                .fontWeight('500')
        )
            .content({ before: "''" })
            .display({ before: 'block' })
            .position({ before: 'absolute' })
            .right({ before: '-0.85rem' })
            .top({ before: '0.18rem' })
            .height({ default: '1.8rem', before: '1.3rem' })
            .width({ default: '2.9rem', before: '1.5rem' })
            .background({ default: '#fff', before: '#fff' })
            .border({ default: '1px dashed #6a6f73', before: '1px dashed #6a6f73' })
            .borderBottom({ before: '0' })
            .borderLeft({ before: '0' })
            .borderRight({ default: '0' })
            .transform({ before: 'rotate(41deg) skew(-15deg)' })
            .opacity("var(--button-opacity)")
            .transition('opacity 400ms linear,transform 400ms cubic-bezier(.2,0,.38,.9)')
    )

    export namespace Dashboard {
        export const TileBox = (iconContent: UIView, content: UIView) => (
            VStack(
                HStack({ alignment: cTopLeading, spacing: 10 })(
                    iconContent,
                    content
                ).padding('1rem')
            )
                .fontFamily('Roboto,Arial,sans-serif')
                .foregroundColor('#3c4043')
                .height()
                .width()
                .cornerRadius(8)
                .shadow('0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)')
        )

        export const TileTitle = (text: string) => (
            Text(text)
                .fontFamily('TuvalSans,Roboto,Arial,sans-serif')
                .fontSize(18).fontWeight('500')
        )
        export const TileMeasureValueText = (text: string) => (
            Text(text)
                .fontFamily('TuvalSans,Roboto,Arial,sans-serif')
                .fontSize(28).fontWeight('400')
        )
    }
}