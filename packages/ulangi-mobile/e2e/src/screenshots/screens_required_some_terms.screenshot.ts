import { device } from '../adapters/Device';
import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { atomPlayScreen } from '../screen-objects/AtomPlayScreen';
import { atomScreen } from '../screen-objects/AtomScreen';
import { categoryDetailScreen } from '../screen-objects/CategoryDetailScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { learnScreen } from '../screen-objects/LearnScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { playScreen } from '../screen-objects/PlayScreen';
import { reviewFeedbackScreen } from '../screen-objects/ReviewFeedbackScreen';
import { searchScreen } from '../screen-objects/SearchScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { spacedRepetitionLessonScreen } from '../screen-objects/SpacedRepetitionLessonScreen';
import { spacedRepetitionScreen } from '../screen-objects/SpacedRepetitionScreen';
import { vocabularyDetailScreen } from '../screen-objects/VocabularyDetailScreen';

describe('Screens required some terms', (): void => {
  describe('Start at ManageScreen after adding some terms', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Vietnamese',
          'English'
        );
        await manageScreen.navigateToAddVocabularyScreen();
        await addVocabularyScreen.fillAndSaveMultpleTerms(
          [
            {
              vocabularyText: 'xin chào',
              category: 'Greetings',
              definitions: ['(formal) hello'],
            },
            {
              vocabularyText: 'con voi',
              category: 'Animals',
              definitions: ['an elephant (mammal)'],
            },
            {
              vocabularyText: 'cú mèo',
              category: 'Animals',
              definitions: ['a true owl'],
            },
            {
              vocabularyText: 'học sinh',
              category: 'Occupations',
              definitions: ['(education) pupil; primary/secondary student'],
            },
            {
              vocabularyText: 'vui vẻ',
              category: 'Emotions',
              definitions: ['happy; joyful'],
            },
          ],
          true,
        );
        await lightBoxDialog.close();

        // Refresh category list
        await manageScreen.showCategoryList();
      }
    );

    it('ManageScreen', async (): Promise<void> => {
      await manageScreen.expectCategoryToExist('Emotions');
      await device.takeScreenshot('ManageScreen');
    });

    it('ManageScreenWithSelectedTerms', async (): Promise<void> => {
      await manageScreen.showVocabularyList();
      await manageScreen.selectVocabulary("vui vẻ")
      await device.takeScreenshot('ManageScreenWithSelectedTerms');
    });

    it('CategoryDetailScreen', async (): Promise<void> => {
      await manageScreen.viewCategoryDetail('Emotions');
      await categoryDetailScreen.expectToExist();
      await device.takeScreenshot('CategoryDetailScreen');
    });

    it('VocabularyDetailScreen', async (): Promise<void> => {
      await manageScreen.viewCategoryDetail('Occupations');
      await manageScreen.viewVocabularyDetail('học sinh');
      await vocabularyDetailScreen.expectToExist();

      await device.takeScreenshot('VocabularyDetailScreen');
    });

    it('SearchScreen', async (): Promise<void> => {
      await manageScreen.navigateToSearchScreen();
      await searchScreen.search('elephant\n');
      await searchScreen.expectVocabularyToExist('con voi');
      await device.takeScreenshot('SearchScreen');
    });

    it('SpacedRepetitionLessonScreen', async (): Promise<void> => {
      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToSpacedRepetitionScreen();
      await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();
      await spacedRepetitionLessonScreen.expectToExist();
      await spacedRepetitionLessonScreen.showAnswer();
      await spacedRepetitionLessonScreen.goToNextItem();
      await device.takeScreenshot('SpacedRepetitionLessonScreen');
    });

    it('ReviewFeedbackScreen', async (): Promise<void> => {
      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToSpacedRepetitionScreen();
      await spacedRepetitionScreen.navigateToSpacedRepetitionLessonScreen();
      await spacedRepetitionLessonScreen.autoCompleteReview();
      await spacedRepetitionLessonScreen.viewAllFeedback();
      await reviewFeedbackScreen.expectToExist();
      await device.takeScreenshot('ReviewFeedbackScreen');
    });

    it('AtomPlayScreen', async (): Promise<void> => {
      await manageScreen.navigateToPlayScreen();
      await playScreen.navigateToAtomScreen();
      await atomScreen.navigateToAtomPlayScreen();
      await atomPlayScreen.expectToExist();
      await device.takeScreenshot('AtomPlayScreen');
    });
  });
});
