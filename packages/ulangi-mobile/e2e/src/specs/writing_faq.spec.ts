import { learnScreen } from '../screen-objects/LearnScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { writingFAQScreen } from '../screen-objects/WritingFAQScreen';
import { writingScreen } from '../screen-objects/WritingScreen';
import { createFirstSetScreen } from '../screen-objects/createFirstSetScreen';
import { welcomeScreen } from '../screen-objects/welcomeScreen';

describe('Writing faq', (): void => {
  describe('Tests start at WritingScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
        await createFirstSetScreen.selectLanguagesAndSubmit(
          'English',
          'English'
        );
        await manageScreen.navigateToLearnScreen();
        await learnScreen.navigateToWritingScreen();
      }
    );

    it('navigate to faq and back', async (): Promise<void> => {
      await writingScreen.navigateToWritingFAQScreen();
      await writingFAQScreen.back();
      await writingFAQScreen.expectToNotExist();
    });
  });
});
