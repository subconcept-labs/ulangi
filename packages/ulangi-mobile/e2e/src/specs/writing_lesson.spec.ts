import { Feedback } from '@ulangi/ulangi-common/enums';
import * as _ from 'lodash';

import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { learnScreen } from '../screen-objects/LearnScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { reviewFeedbackScreen } from '../screen-objects/ReviewFeedbackScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { writingLessonScreen } from '../screen-objects/WritingLessonScreen';
import { writingScreen } from '../screen-objects/WritingScreen';

describe('Writing lesson', (): void => {
  describe('Tests start at WritingScreen after adding 3 terms', (): void => {
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
        await learnScreen.navigateToWritingScreen();
      }
    );

    for (const feedback of _.values(Feedback)) {
      it(`give feedback ${feedback} and display result correctly`, async (): Promise<
        void
      > => {
        await writingScreen.navigateToWritingLessonScreen();

        // eslint-disable-next-line
        for (const _ of vocabularyList) {
          await writingLessonScreen.autoAnswerAndSelectFeedback(
            vocabularyList,
            feedback as Feedback
          );
        }

        await writingLessonScreen.viewReviewFeedback();

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
        await writingScreen.navigateToWritingLessonScreen();
        await writingLessonScreen.autoAnswerAndSelectFeedback(
          vocabularyList,
          Feedback.GOOD
        );
        await writingLessonScreen.autoAnswerAndSelectFeedback(
          vocabularyList,
          Feedback.GREAT
        );
        await writingLessonScreen.autoAnswerAndSelectFeedback(
          vocabularyList,
          Feedback.SUPERB
        );

        await writingLessonScreen.viewReviewFeedback();

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

        await writingLessonScreen.viewReviewFeedback();

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

    it('disable all terms and view all feedback at the end', async (): Promise<
      void
    > => {
      await writingScreen.navigateToWritingLessonScreen();
      await writingLessonScreen.disableAll();
      await writingLessonScreen.expectToHaveTakeAnotherLessonButton();
      await writingLessonScreen.viewReviewFeedback();
      await reviewFeedbackScreen.expectVocabularyToNotExists('vocabulary 1');
      await reviewFeedbackScreen.expectVocabularyToNotExists('vocabulary 2');
      await reviewFeedbackScreen.expectVocabularyToNotExists('vocabulary 3');
    });

    it('complete the lesson and take another lesson should failed because no more terms to learn', async (): Promise<
      void
    > => {
      await writingScreen.navigateToWritingLessonScreen();
      await writingLessonScreen.autoAnswerAndSelectFeedbackForAll(
        vocabularyList
      );
      await writingLessonScreen.takeAnotherLesson();
      await lightBoxDialog.expectFailedDialogToExist();
    });

    it('complete the lesson and quit', async (): Promise<void> => {
      await writingScreen.navigateToWritingLessonScreen();
      await writingLessonScreen.autoAnswerAndSelectFeedbackForAll(
        vocabularyList
      );
      await writingLessonScreen.quit();
      await writingLessonScreen.expectToNotExist();
    });
  });
});
