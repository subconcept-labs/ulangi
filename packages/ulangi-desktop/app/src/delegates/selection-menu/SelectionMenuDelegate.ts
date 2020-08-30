import { NavigatorDelegate } from "../navigator/NavigatorDelegate"
import { SelectionMenu } from "@ulangi/ulangi-common/interfaces"
import { ObservableLightBox } from "@ulangi/ulangi-observable"
import { ScreenName } from "@ulangi/ulangi-common/enums"

export class SelectionMenuDelegate {

  private observableLightBox: ObservableLightBox
  private navigatorDelegate: NavigatorDelegate

  public constructor(
    observableLightBox: ObservableLightBox,
    navigatorDelegate: NavigatorDelegate
  ) {
    this.observableLightBox = observableLightBox
    this.navigatorDelegate = navigatorDelegate
  }

  public show(selectionMenu: SelectionMenu<any>): void {
    this.observableLightBox.selectionMenu = selectionMenu;

    this.navigatorDelegate.showLightBox(
      ScreenName.LIGHT_BOX_SELECTION_MENU_SCREEN,
      {}
    );
  }
}
