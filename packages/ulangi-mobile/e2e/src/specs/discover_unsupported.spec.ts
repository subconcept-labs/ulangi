import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { discoverScreen } from '../screen-objects/DiscoverScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Discover unsupported', (): void => {
  it('show discover is not supported if Any Language is selected as learning language', async (): Promise<
    void
  > => {
    await welcomeScreen.tapYes();
    await createFirstSetScreen.selectLanguagesAndSubmit(
      'Any Language',
      'English'
    );
    await manageScreen.navigateToDiscoverScreen();
    await discoverScreen.expectToBeUnsupported();
  });

  it('show discover is not supported if Any Language is selected as translated into language', async (): Promise<
    void
  > => {
    await welcomeScreen.tapYes();
    await createFirstSetScreen.selectLanguagesAndSubmit(
      'English',
      'Any Language'
    );
    await manageScreen.navigateToDiscoverScreen();
    await discoverScreen.expectToBeUnsupported();
  });

  it('show discover is not supported if both are Any Language', async (): Promise<
    void
  > => {
    await welcomeScreen.tapYes();
    await createFirstSetScreen.selectLanguagesAndSubmit(
      'Any Language',
      'Any Language'
    );
    await manageScreen.navigateToDiscoverScreen();
    await discoverScreen.expectToBeUnsupported();
  });
});
