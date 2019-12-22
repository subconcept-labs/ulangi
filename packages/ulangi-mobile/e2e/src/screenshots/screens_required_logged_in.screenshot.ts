import { device } from '../adapters/Device';
import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { atomScreen } from '../screen-objects/AtomScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { discoverScreen } from '../screen-objects/DiscoverScreen';
import { learnScreen } from '../screen-objects/LearnScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { moreScreen } from '../screen-objects/MoreScreen';
import { publicSetDetailScreen } from '../screen-objects/PublicSetDetailScreen';
import { playScreen } from '../screen-objects/PlayScreen';
import { quizScreen } from '../screen-objects/QuizScreen';
import { reflexScreen } from '../screen-objects/ReflexScreen';
import { setUpAccountScreen } from '../screen-objects/SetUpAccountScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';
import { spacedRepetitionFAQScreen } from '../screen-objects/SpacedRepetitionFAQScreen';
import { spacedRepetitionScreen } from '../screen-objects/SpacedRepetitionScreen';
import { spacedRepetitionSettingsScreen } from '../screen-objects/SpacedRepetitionSettingsScreen';
import { quizSettingsScreen } from '../screen-objects/quizSettingsScreen';

describe('Screens required logged in', (): void => {
  describe('Start at ManageScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'Vietnamese',
          'English'
        );
      }
    );

    fit('DiscoverScreenWithTerms', async (): Promise<void> => {
      await manageScreen.navigateToDiscoverScreen();
      await discoverScreen.search("hello\n");
      await discoverScreen.showTranslationAndSearchVocabularyResult();
      await discoverScreen.expectTranslationAndPublicVocabularyListToExist();
      await device.takeScreenshot('DiscoverScreenWithTerms');
    });

    fit('DiscoverScreenWithSets', async (): Promise<void> => {
      await manageScreen.navigateToDiscoverScreen();
      await discoverScreen.search("animals\n");
      await discoverScreen.showSearchSetResult();
      await discoverScreen.expectPublicSetListToExist();
      await device.takeScreenshot('DiscoverScreenWithSets');
    });

    it('PublicSetDetailScreen', async (): Promise<void> => {
      await manageScreen.navigateToDiscoverScreen();
      await discoverScreen.search("animals\n");
      await discoverScreen.showSearchSetResult();
      await discoverScreen.viewPublicSetDetail('Baby animals');
      await publicSetDetailScreen.expectToExist();
      await device.takeScreenshot('PublicSetDetailScreen');
    });

    it('LearnScreen', async (): Promise<void> => {
      await manageScreen.navigateToLearnScreen();
      await device.takeScreenshot('LearnScreen');
    });

    it('PlayScreen', async (): Promise<void> => {
      await manageScreen.navigateToPlayScreen();
      await device.takeScreenshot('PlayScreen');
    });

    it('MoreScreen', async (): Promise<void> => {
      await manageScreen.navigateToMoreScreen();
      await device.takeScreenshot('MoreScreen');
    });

    it('AddVocabularyScreen', async (): Promise<void> => {
      await manageScreen.navigateToAddVocabularyScreen();
      await addVocabularyScreen.fillVocabularyText('giúp', true, true);
      await addVocabularyScreen.fillDefinitions([
        "[v] to help\n[example: giúp tôi với]",
        "[v] to aid"
      ], true);
      await addVocabularyScreen.editCategory("Basic");
      await device.takeScreenshot('AddVocabularyScreen');
    });

    it('AddVocabularyScreenWithDictionary', async (): Promise<void> => {
      await manageScreen.navigateToAddVocabularyScreen();
      await addVocabularyScreen.fillVocabularyText('giúp', true, true);
      await addVocabularyScreen.lookUp();
      await addVocabularyScreen.translate();
      await device.takeScreenshot('AddVocabularyScreenWithDictionary');
    });

    it('SetUpAccountScreen', async (): Promise<void> => {
      await manageScreen.navigateToMoreScreen();
      await moreScreen.navigateToSetUpAccountScreen();
      await setUpAccountScreen.expectToExist();
      await device.takeScreenshot('SetUpAccountScreen');
    });

    it('SpacedRepetitionScreen', async (): Promise<void> => {
      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToSpacedRepetitionScreen();
      await spacedRepetitionScreen.expectToExist();
      await device.takeScreenshot('SpacedRepetitionScreen');
    });

    it('SpacedRepetitionSettingsScreen', async (): Promise<void> => {
      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToSpacedRepetitionScreen();
      await spacedRepetitionScreen.navigateToSpacedRepetitionSettingsScreen();
      await spacedRepetitionSettingsScreen.expectToExist();
      await device.takeScreenshot('SpacedRepetitionSettingsScreen');
    });

    it('SpacedRepetitionFAQScreen', async (): Promise<void> => {
      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToSpacedRepetitionScreen();
      await spacedRepetitionScreen.navigateToSpacedRepetitionFAQScreen();
      await spacedRepetitionFAQScreen.expectToExist();
      await device.takeScreenshot('SpacedRepetitionFAQScreen');
    });

    it('QuizScreen', async (): Promise<void> => {
      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToQuizScreen();
      await quizScreen.expectToExist();
      await device.takeScreenshot('QuizScreen');
    });

    it('QuizSettingsScreen', async (): Promise<void> => {
      await manageScreen.navigateToLearnScreen();
      await learnScreen.navigateToQuizScreen();
      await quizScreen.navigateToQuizSettingsScreen();
      await quizSettingsScreen.expectToExist();
      await device.takeScreenshot('QuizSettingsScreen');
    });

    it('ReflexScreen', async (): Promise<void> => {
      await manageScreen.navigateToPlayScreen();
      await playScreen.navigateToReflexScreen();
      await reflexScreen.expectToExist();
      await device.takeScreenshot('ReflexScreen');
    });

    it('AtomicWordScreen', async (): Promise<void> => {
      await manageScreen.navigateToPlayScreen();
      await playScreen.navigateToAtomScreen();
      await atomScreen.expectToExist();
      await device.takeScreenshot('AtomicWordScreen');
    });
  });
});
