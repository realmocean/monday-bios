import { Text, UIController, UIRoute, UIRouteOutlet, UIRoutes, UIView } from "@tuval/forms"



class KontDrakula extends UIController {
    LoadView(): UIView {
        return (
            UIRouteOutlet().width('100%').height('100%')
        )
    }
}
class AddController extends UIController {
    LoadView(): UIView {
        return (
           Text('asdfdf')
        )
    }
}
export const Routes = () => {
    return (
        UIRoutes(
            UIRoute('/', KontDrakula).children(
                UIRoute('/add', AddController)
            )
        )
    )


}