import { learnScreen } from '../screen-objects/LearnScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { spacedRepetitionFAQScreen } from '../screen-objects/SpacedRepetitionFAQScreen';
import { spacedRepetitionScreen } from '../screen-objects/SpacedRepetitionScreen';
import { createFirstSetScreen } from '../screen-objects/createFirstSetScreen';
import { welcomeScreen } from '../screen-objects/welcomeScreen';

describe('Spaced repetition faq', (): void => {
  describe('Tests start at SpacedRepetitionScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'English',
          'English'
        );
        await manageScreen.navigateToLearnScreen();
        await learnScreen.navigateToSpacedRepetitionScreen();
      }
    );

    it('navigate to faq and back', async (): Promise<void> => {
      await spacedRepetitionScreen.navigateToSpacedRepetitionFAQScreen();
      await spacedRepetitionFAQScreen.back();
      await spacedRepetitionFAQScreen.expectToNotExist();
    });
  });
});
