import { ReflexGameOverScreenIds } from '../../../src/constants/ids/ReflexGameOverScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from '../screen-objects/Screen';

export class ReflexGameOverScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(ReflexGameOverScreenIds.SCREEN);
  }

  public async quit(): Promise<void> {
    await Element.byId(ReflexGameOverScreenIds.QUIT_BTN).tap();
  }

  public async restart(): Promise<void> {
    await Element.byId(ReflexGameOverScreenIds.RESTART_BTN).tap();
  }
}

export const reflexGameOverScreen = new ReflexGameOverScreen();
