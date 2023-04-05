import { UIController, UIRouteOutlet, UIScene, UIView, DialogContainer } from "@tuval/forms";

export class LayoutController extends UIController {


    public BindRouterParams() {

    }
    public LoadView(): UIView {
        return (
            UIScene(
                UIRouteOutlet().width('100%').height('100%')
            )
        )
    }
}