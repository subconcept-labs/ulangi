import { Feedback } from '@ulangi/ulangi-common/enums';
import * as _ from 'lodash';

import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { learnScreen } from '../screen-objects/LearnScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { reviewFeedbackScreen } from '../screen-objects/ReviewFeedbackScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { spacedRepetitionLessonScreen } from '../screen-objects/SpacedRepetitionLessonScreen';
import { spacedRepetitionScreen } from '../screen-objects/SpacedRepetitionScreen';

describe('Spaced repetition lesson', (): void => {
  describe('Tests start at SpacedRepetitionScreen after adding 3 terms', (): void => {
    const vocabularyList = [
      {
        vocabularyText: 'vocabulary 1',
        definitions: ['meaning 1'],
      },
      {
        vocabularyText: 'vocabulary 2',
        definitions: ['meaning 2'],
      },
      {
        vocabularyText: 'vocabulary 3',
        definitions: ['meaning 3'],
      },
    ];

    const expectedResults = {
      [Feedback.POOR]: {
        nextLevel: 0,
        nextReview: 'Now',
      },
      [Feedback.FAIR]: {
        nextLevel: 0,
        nextReview: 'Now',
      },
      [Feedback.GOOD]: {
        nextLevel: 1,
        nextReview: 'In 12 hours',
      },
      [Feedback.GREAT]: {
        nextLevel: 2,
        nextReview: 'In a day',
      },
      [Feedback.SUPERB]: {
        nextLevel: 3,
        nextReview: 'In 2 days',
      },
    };

    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'English',
          'English'
        );
        await manageScreen.navigateToAddVocabularyScreen();
        await addVocabularyScreen.fillAndSaveMultpleTerms(vocabularyList);
        await lightBoxDialog.close();
        await manageScreen.navigateToLearnScreen();
        await learnScreen.navigateToSpacedRepetitionScreen();
      }
    );

    for (const feedback of _.values(Feedback)) {
      it(`can give feedback ${feedback}`, async (): Promise<void> => {
        await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();

        // eslint-disable-next-line
        for (const _ of vocabularyList) {
          await spacedRepetitionLessonScreen.showAnswer();
          await spacedRepetitionLessonScreen.goToNextItem();
          await spacedRepetitionLessonScreen.selectFeedback(
            feedback as Feedback
          );
        }

        await spacedRepetitionLessonScreen.viewAllFeedback();

        for (const vocabulary of vocabularyList) {
          await reviewFeedbackScreen.expectVocabularyToHaveFeedback(
            vocabulary.vocabularyText,
            feedback as Feedback
          );
          await reviewFeedbackScreen.expectVocabularyToHaveNextLevel(
            vocabulary.vocabularyText,
            expectedResults[feedback].nextLevel
          );
          await reviewFeedbackScreen.expectVocabularyToHaveNextReview(
            vocabulary.vocabularyText,
            expectedResults[feedback].nextReview
          );
        }
      });

      it(`change feedback to ${feedback} at ReviewFeedbackScreen`, async (): Promise<
        void
      > => {
        await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();
        await spacedRepetitionLessonScreen.showAnswer();
        await spacedRepetitionLessonScreen.goToNextItem();
        await spacedRepetitionLessonScreen.selectFeedback(Feedback.GOOD);
        await spacedRepetitionLessonScreen.showAnswer();
        await spacedRepetitionLessonScreen.goToNextItem();
        await spacedRepetitionLessonScreen.selectFeedback(Feedback.GREAT);
        await spacedRepetitionLessonScreen.showAnswer();
        await spacedRepetitionLessonScreen.goToNextItem();
        await spacedRepetitionLessonScreen.selectFeedback(Feedback.SUPERB);

        await spacedRepetitionLessonScreen.viewAllFeedback();

        for (const vocabulary of vocabularyList) {
          await reviewFeedbackScreen.setFeedbackForVocabulary(
            vocabulary.vocabularyText,
            feedback as Feedback
          );
          await reviewFeedbackScreen.expectVocabularyToHaveFeedback(
            vocabulary.vocabularyText,
            feedback as Feedback
          );
          await reviewFeedbackScreen.expectVocabularyToHaveNextLevel(
            vocabulary.vocabularyText,
            expectedResults[feedback].nextLevel
          );
          await reviewFeedbackScreen.expectVocabularyToHaveNextReview(
            vocabulary.vocabularyText,
            expectedResults[feedback].nextReview
          );
        }

        await reviewFeedbackScreen.save();
        await lightBoxDialog.close();

        await spacedRepetitionLessonScreen.viewAllFeedback();

        // Make sure feedback persists
        for (const vocabulary of vocabularyList) {
          await reviewFeedbackScreen.expectVocabularyToHaveFeedback(
            vocabulary.vocabularyText,
            feedback as Feedback
          );
          await reviewFeedbackScreen.expectVocabularyToHaveNextLevel(
            vocabulary.vocabularyText,
            expectedResults[feedback].nextLevel
          );
          await reviewFeedbackScreen.expectVocabularyToHaveNextReview(
            vocabulary.vocabularyText,
            expectedResults[feedback].nextReview
          );
        }
      });
    }

    it(`go to the previous item and change feedback`, async (): Promise<
      void
    > => {
      await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();

      await spacedRepetitionLessonScreen.showAnswer();
      await spacedRepetitionLessonScreen.goToNextItem();
      await spacedRepetitionLessonScreen.selectFeedback(Feedback.POOR);

      await spacedRepetitionLessonScreen.goToPreviousItem();
      await spacedRepetitionLessonScreen.showAnswer();
      await spacedRepetitionLessonScreen.goToNextItem();
      await spacedRepetitionLessonScreen.selectFeedback(Feedback.GOOD);

      await spacedRepetitionLessonScreen.showAnswer();
      await spacedRepetitionLessonScreen.goToNextItem();
      await spacedRepetitionLessonScreen.selectFeedback(Feedback.FAIR);

      await spacedRepetitionLessonScreen.goToPreviousItem();
      await spacedRepetitionLessonScreen.showAnswer();
      await spacedRepetitionLessonScreen.goToNextItem();
      await spacedRepetitionLessonScreen.selectFeedback(Feedback.GREAT);

      await spacedRepetitionLessonScreen.showAnswer();
      await spacedRepetitionLessonScreen.goToNextItem();
      await spacedRepetitionLessonScreen.selectFeedback(Feedback.SUPERB);

      await spacedRepetitionLessonScreen.viewAllFeedback();

      await reviewFeedbackScreen.expectVocabularyToHaveFeedback(
        vocabularyList[0].vocabularyText,
        Feedback.GOOD
      );
      await reviewFeedbackScreen.expectVocabularyToHaveFeedback(
        vocabularyList[1].vocabularyText,
        Feedback.GREAT
      );
      await reviewFeedbackScreen.expectVocabularyToHaveFeedback(
        vocabularyList[2].vocabularyText,
        Feedback.SUPERB
      );
    })

    it('complete the review and take another lesson should failed because no more terms to learn', async (): Promise<
      void
    > => {
      await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();
      await spacedRepetitionLessonScreen.autoCompleteReview();
      await spacedRepetitionLessonScreen.takeAnotherLesson();
      await lightBoxDialog.expectFailedDialogToExist();
    });

    it('complete the test and quit', async (): Promise<void> => {
      await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();
      await spacedRepetitionLessonScreen.autoCompleteReview();
      await spacedRepetitionLessonScreen.quit();
      await spacedRepetitionLessonScreen.expectToNotExist();
    });
  });
});
