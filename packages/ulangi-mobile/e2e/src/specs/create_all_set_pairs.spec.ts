import * as _ from 'lodash';

import { LearningLanguageName } from '../enums/LearningLanguageName';
import { TranslatedIntoLanguageName } from '../enums/TranslatedIntoLanguageName';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Create all set pairs', (): void => {
  describe('Tests start at CreateFirstSetScreen', (): void => {
    beforeEach(
      async (): Promise<void> => {
        await welcomeScreen.tapYes();
      }
    );

    for (const learningLanguageName of _.values(LearningLanguageName)) {
      for (const translatedIntoLanguageName of _.values(
        TranslatedIntoLanguageName
      )) {
        it(`create ${learningLanguageName} - ${translatedIntoLanguageName} set`, async (): Promise<
          void
        > => {
          await createFirstSetScreen.selectLanguagesAndSubmit(
            learningLanguageName,
            translatedIntoLanguageName
          );
          await manageScreen.expectToExist();
        });
      }
    }
  });
});
