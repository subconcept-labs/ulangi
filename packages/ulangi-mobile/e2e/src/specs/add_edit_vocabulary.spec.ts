import { AddEditVocabularyScreen } from '../screen-objects/AddEditVocabularyScreen';
import {
  AddVocabularyScreen,
  addVocabularyScreen,
} from '../screen-objects/AddVocabularyScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { EditVocabularyScreen } from '../screen-objects/EditVocabularyScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Add and edit vocabulary', (): void => {
  for (const action of ['add', 'edit']) {
    describe(`Test starts at ${
      action === 'add' ? 'AddVocabularyScreen' : 'EditVocabularyScreen'
    }`, (): void => {
      let screen: AddEditVocabularyScreen;

      beforeEach(
        async (): Promise<void> => {
          await welcomeScreen.tapYes();
          await createFirstSetScreen.selectLanguagesAndSubmit(
            'Vietnamese',
            'English'
          );

          if (action === 'add') {
            screen = new AddVocabularyScreen();
            await manageScreen.navigateToAddVocabularyScreen();
          } else {
            screen = new EditVocabularyScreen();
            await manageScreen.navigateToAddVocabularyScreen();
            await addVocabularyScreen.fillAndSaveTerm({
              vocabularyText: 'old vocabulary 1',
              definitions: ['old meaning 1'],
            });
            await lightBoxDialog.close();
            await manageScreen.showVocabularyList();
            await manageScreen.editVocabulary('old vocabulary 1');
          }
        }
      );

      it(`${action} vocabulary with multiple definitions`, async (): Promise<
        void
      > => {
        await screen.fillVocabularyText('vocabulary 1');
        await screen.fillDefinitions(['meaning 1', 'meaning 2', 'meaning 3']);
        await screen.save();
        await lightBoxDialog.expectSuccessDialogToExist();
      });

      it(`${action} vocabulary with extra fields`, async (): Promise<
        void
      > => {
        await screen.clearVocabularyText();
        await screen.fillVocabularyText('vocabulary 1', false, true);
        await screen.showExtraFieldsPickerForTerm();
        await screen.addExtraFieldForTerm("+ [ipa: ]", "ipa_value")
        await screen.fillDefinitions(['meaning 1']);
        await screen.save();
        await lightBoxDialog.expectSuccessDialogToExist();
        await lightBoxDialog.close();
        await manageScreen.showVocabularyList();
        await manageScreen.expectVocabularyToExist("vocabulary 1")
        await manageScreen.expectVocabularyHaveExtraField("vocabulary 1", "IPA", "ipa_value")
      });

      it(`${action} vocabulary with definition extra fields`, async (): Promise<
        void
      > => {
        await screen.clearVocabularyText();
        await screen.fillVocabularyText('vocabulary 1');
        await screen.clearDefinition(0);
        await screen.fillDefinitions(['meaning 1'], false, true);
        await screen.showExtraFieldsPickerForDefinition(0);
        await screen.addExtraFieldForDefinitionAtIndex(0, "+ [example: ]", "example_value")
        await screen.save();
        await lightBoxDialog.expectSuccessDialogToExist();
        await lightBoxDialog.close();
        await manageScreen.showVocabularyList();
        await manageScreen.expectVocabularyToExist("vocabulary 1")
        await manageScreen.expectVocabularyToHaveDefinitionExtraFieldAtIndex("vocabulary 1", 0, "Example", "example_value")
      });

      it(`${action} vocabulary with definition with word classes`, async (): Promise<
        void
      > => {
        await screen.clearVocabularyText();
        await screen.fillVocabularyText('vocabulary 1');
        await screen.clearDefinition(0);
        await screen.fillDefinitions(['meaning 1'], false, true);
        await screen.showExtraFieldsPickerForDefinition(0);
        await screen.addExtraFieldForDefinitionAtIndex(0, "+ [n]")
        await screen.addExtraFieldForDefinitionAtIndex(0, "+ [v]")
        await screen.closePicker();
        await screen.save();
        await lightBoxDialog.expectSuccessDialogToExist();
        await lightBoxDialog.close();
        await manageScreen.showVocabularyList();
        await manageScreen.expectVocabularyToExist("vocabulary 1")
        await manageScreen.expectVocabularyToHaveWordClassAtIndex("vocabulary 1", 0, "n")
        await manageScreen.expectVocabularyToHaveWordClassAtIndex("vocabulary 1", 0, "v")
      });

      it(`${action} vocabulary with definition`, async (): Promise<
        void
      > => {
        await screen.fillVocabularyText('vocabulary 1');
        await screen.fillDefinitions(['meaning 1']);
        await screen.save();
        await lightBoxDialog.expectSuccessDialogToExist();
      });

      it(`${action} vocabulary with category`, async (): Promise<void> => {
        await screen.fillVocabularyText('vocabulary 1');
        await screen.fillDefinitions(['meaning 1']);
        await screen.editCategory('category');
        await screen.save();
        await lightBoxDialog.expectSuccessDialogToExist();
      });

      it(`${action} vocabulary with definition from translation`, async (): Promise<
        void
      > => {
        await screen.fillVocabularyText('lo', false, true);
        await screen.lookUp();
        await screen.translate();
        await screen.addDefinitionFromTranslation(0);
        await screen.closePicker();

        await screen.save();
        await lightBoxDialog.expectSuccessDialogToExist();
      });

      it(`${action} vocabulary with definition from multiple translations`, async (): Promise<
        void
      > => {
        await screen.fillVocabularyText('lo', false, true);
        await screen.lookUp();
        await screen.translate();
        await screen.addDefinitionFromTranslation(0);
        await screen.closePicker();

        await screen.fillVocabularyText('to', false, true);
        await screen.lookUp();
        await screen.translate();
        await screen.addDefinitionFromTranslation(0);
        await screen.closePicker();

        await screen.save();
        await lightBoxDialog.expectSuccessDialogToExist();
      });

      it(`${action} vocabulary with definition from dictionary`, async (): Promise<
        void
      > => {
        await screen.fillVocabularyText('lo', false, true);
        await screen.lookUp();
        await screen.addDefinitionFromDictionary(0);
        await screen.closePicker();

        await screen.save();
        await lightBoxDialog.expectSuccessDialogToExist();
      });

      it(`${action} vocabulary with definition from multple dictionary entries`, async (): Promise<
        void
      > => {
        await screen.fillVocabularyText('lo', false, true);
        await screen.lookUp();
        await screen.addDefinitionFromDictionary(0);
        await screen.closePicker();

        await screen.fillVocabularyText('to', false, true);
        await screen.lookUp();
        await screen.addDefinitionFromDictionary(0);
        await screen.closePicker();

        await screen.save();
        await lightBoxDialog.expectSuccessDialogToExist();
      });

      it('show error message when vocabulary term is empty', async (): Promise<
        void
      > => {
        await screen.clearVocabularyText();
        await screen.fillDefinitions(['meaning 1']);
        await screen.save();
        await lightBoxDialog.expectFailedDialogToExist();
        await lightBoxDialog.expectToHaveMessage(
          'Vocabulary term cannot be empty.'
        );
        await lightBoxDialog.close();
      });

      it('show error message when there are no definitions', async (): Promise<
        void
      > => {
        await screen.fillVocabularyText('vocabulary 1');
        await screen.clearDefinition(0);
        await screen.save();
        await lightBoxDialog.expectFailedDialogToExist();
        await lightBoxDialog.expectToHaveMessage(
          'At least 1 definition is required.'
        );
        await lightBoxDialog.close();
      });

      it(`complex action: ${action} vocabulary, definition, defininition from dictionary and definition from translation`, async (): Promise<
        void
      > => {
        // Type vocabulary
        await screen.fillVocabularyText('lo');

        // Add/edit first meaning
        await screen.fillDefinitions(['new definition']);

        await screen.lookUp();
        // Add definition from dictionary
        await screen.addDefinitionFromDictionary(0);

        // Add definition from translation
        await screen.translate();
        await screen.addDefinitionFromTranslation(0);
        await screen.closePicker();

        await screen.save();
        await lightBoxDialog.expectSuccessDialogToExist();
        await lightBoxDialog.close();
      });
    });
  }
});
