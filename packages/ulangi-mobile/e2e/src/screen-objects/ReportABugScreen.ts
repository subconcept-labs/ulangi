import { ReportABugScreenIds } from '../../../src/constants/ids/ReportABugScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class ReportABugScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(ReportABugScreenIds.SCREEN);
  }

  public async setMessage(message: string): Promise<void> {
    await Element.byId(ReportABugScreenIds.TEXT_INPUT).replaceText(message);
  }

  public async send(): Promise<void> {
    await Element.byId(ReportABugScreenIds.SEND_BTN).tap();
  }
}

export const reportABugScreen = new ReportABugScreen();
