import { Element } from '../adapters/Element';

export abstract class Screen {
  public abstract getScreenElement(): Element;

  public async expectToExist(): Promise<void> {
    await this.getScreenElement().expectToExist();
  }

  public async expectToNotExist(): Promise<void> {
    await this.getScreenElement().expectToNotExist();
  }
}
