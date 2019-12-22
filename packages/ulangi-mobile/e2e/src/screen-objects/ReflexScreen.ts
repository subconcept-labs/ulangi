import { ReflexScreenIds } from '../../../src/constants/ids/ReflexScreenIds';
import { Element } from '../adapters/Element';
import { Screen } from './Screen';

export class ReflexScreen extends Screen {
  public getScreenElement(): Element {
    return Element.byId(ReflexScreenIds.SCREEN);
  }

  public async answerCorrectly(): Promise<void> {
    await Element.byId(ReflexScreenIds.CORRECT_BTN).tap();
  }

  public async answerIncorrectly(): Promise<void> {
    await Element.byId(ReflexScreenIds.INCORRECT_BTN).tap();
  }

  public async isCorrectButtonExisting(): Promise<boolean> {
    return Element.byId(ReflexScreenIds.CORRECT_BTN).isExisting();
  }

  public async startGame(): Promise<void> {
    await Element.byId(ReflexScreenIds.START_BTN).tap();
  }

  public async back(): Promise<void> {
    await Element.byId(ReflexScreenIds.BACK_BTN).tap();
  }

  public async pause(): Promise<void> {
    await Element.byId(ReflexScreenIds.PAUSE_BTN).tap();
  }

  public async expectCorrectButtonToExist(): Promise<void> {
    await Element.byId(ReflexScreenIds.CORRECT_BTN).expectToExist();
  }
}

export const reflexScreen = new ReflexScreen();
