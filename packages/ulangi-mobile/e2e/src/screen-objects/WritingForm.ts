import { Feedback } from '@ulangi/ulangi-common/enums';
import * as _ from 'lodash';

import { WritingFormIds } from '../../../src/constants/ids/WritingFormIds';
import { Element } from '../adapters/Element';
import { reviewFeedbackBar } from './ReviewFeedbackBar';

export class WritingForm {
  public async autoAnswerAndSelectFeedbackForAll(
    vocabularyList: readonly {
      vocabularyText: string;
      definitions: readonly string[];
    }[]
  ): Promise<void> {
    let done = false;
    while (done === false) {
      if (await this.hasAnswerInput()) {
        await this.autoAnswer(vocabularyList);
        await reviewFeedbackBar.select(Feedback.GOOD);
      } else {
        done = true;
      }
    }
  }

  public async autoAnswerAndNextForAll(
    vocabularyList: readonly {
      vocabularyText: string;
      definitions: readonly string[];
    }[]
  ): Promise<void> {
    let done = false;
    while (done === false) {
      if (await this.hasAnswerInput()) {
        await this.autoAnswer(vocabularyList);
        await this.next();
      } else {
        done = true;
      }
    }
  }

  public async autoAnswer(
    vocabularyList: readonly {
      vocabularyText: string;
      definitions: readonly string[];
    }[]
  ): Promise<string> {
    // Convert to [ vocabularyText, definition ] tuples
    const vocabularyDefinitionTuples = _.flatMap(
      vocabularyList,
      (vocabulary): readonly [string, string][] => {
        return vocabulary.definitions.map(
          (definition): [string, string] => [
            vocabulary.vocabularyText,
            definition,
          ]
        );
      }
    );

    let i = 0;
    let answer = null;
    while (answer === null && i < vocabularyDefinitionTuples.length) {
      const [vocabularyText] = vocabularyDefinitionTuples[i];
      await Element.byId(WritingFormIds.ANSWER_INPUT).replaceText(
        vocabularyText
      );

      // If answer is correct, then tap next. Otherwise, try another answer
      if (await this.isAnswerCorrect(200)) {
        answer = vocabularyText;
      } else {
        i++;
      }
    }

    return answer;
  }

  public async hasAnswerInput(): Promise<boolean> {
    return Element.byId(WritingFormIds.ANSWER_INPUT).isExisting();
  }

  public async isAnswerCorrect(waitTimeout?: number): Promise<boolean> {
    return Element.byId(WritingFormIds.ANSWER_IS_CORRECT).isExisting(
      waitTimeout
    );
  }

  public async next(): Promise<void> {
    await Element.byId(WritingFormIds.NEXT_BTN).tap();
  }

  public async disableAll(): Promise<void> {
    let done = false;
    while (done === false) {
      if (await this.isDisableButtonExisting()) {
        await this.disable();
      } else {
        done = true;
      }
    }
  }

  public async disable(): Promise<void> {
    await Element.byId(WritingFormIds.DISABLE_BTN).tap();
    await Element.byId(WritingFormIds.CONFIRM_DISABLE_BTN).tap();
  }

  public async isDisableButtonExisting(): Promise<boolean> {
    return Element.byId(WritingFormIds.DISABLE_BTN).isExisting();
  }

  public async skipAll(): Promise<void> {
    let done = false;
    while (done === false) {
      const existing = await this.isSkipButtonExisting();
      if (existing) {
        await this.skip();
      } else {
        done = true;
      }
    }
  }

  public async skip(): Promise<void> {
    await Element.byId(WritingFormIds.SKIP_BTN).tap();
  }

  public async isSkipButtonExisting(): Promise<boolean> {
    return Element.byId(WritingFormIds.SKIP_BTN).isExisting();
  }

  public async expectAnswerInputToExist(): Promise<void> {
    await Element.byId(WritingFormIds.ANSWER_INPUT).expectToExist();
  }
}

export const writingForm = new WritingForm();
