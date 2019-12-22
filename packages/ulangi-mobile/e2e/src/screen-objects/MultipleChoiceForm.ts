import { MultipleChoiceFormIds } from '../../../src/constants/ids/MultipleChoiceFormIds';
import { Element } from '../adapters/Element';

export class MultipleChoiceForm {
  public async autoAnswerAll(): Promise<void> {
    let done = false;
    while (done === false) {
      const existing = await this.isCorrectAnswerExisting();
      if (existing) {
        await this.autoAnswer();
      } else {
        done = true;
      }
    }
  }

  public async autoAnswer(): Promise<void> {
    await Element.byId(MultipleChoiceFormIds.CORRECT_BTN).tap();
  }

  public async isCorrectAnswerExisting(): Promise<boolean> {
    return Element.byId(MultipleChoiceFormIds.CORRECT_BTN).isExisting();
  }

  public async expectToHaveCorrectAnswer(): Promise<void> {
    await Element.byId(MultipleChoiceFormIds.CORRECT_BTN).expectToExist();
  }
}

export const multipleChoiceForm = new MultipleChoiceForm();
