import { WelcomeScreenIds } from "../../../src/constants/ids/WelcomeScreenIds";
import { Screen } from "./Screen";
import { Element } from "../adapters/Element";

export class WelcomeScreen extends Screen {

  public getScreenElement(): Element {
    return Element.byId(WelcomeScreenIds.SCREEN)
  }

  public async tapYes(): Promise<void> {
    await Element.byId(WelcomeScreenIds.YES_BTN).tap()
  }

  public async tapNo(): Promise<void> {
    await Element.byId(WelcomeScreenIds.NO_BTN).tap()
  }
}

export const welcomeScreen = new WelcomeScreen()
