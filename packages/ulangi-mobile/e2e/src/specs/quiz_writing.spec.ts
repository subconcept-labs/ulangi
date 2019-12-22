import { addVocabularyScreen } from '../screen-objects/AddVocabularyScreen';
import { createFirstSetScreen } from '../screen-objects/CreateFirstSetScreen';
import { learnScreen } from '../screen-objects/LearnScreen';
import { lightBoxDialog } from '../screen-objects/LightBoxDialog';
import { manageScreen } from '../screen-objects/ManageScreen';
import { quizScreen } from '../screen-objects/QuizScreen';
import { quizSettingsScreen } from '../screen-objects/QuizSettingsScreen';
import { quizWritingScreen } from '../screen-objects/QuizWritingScreen';
import { welcomeScreen } from '../screen-objects/WelcomeScreen';

describe('Quiz writing', (): void => {
  describe('Tests start at QuizScreen after adding 3 terms and change vocabularyPool to active', (): void => {
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
        await learnScreen.navigateToQuizScreen();
        await quizScreen.navigateToQuizSettingsScreen();
        await quizSettingsScreen.changeVocabularyPool('Active');
        await quizSettingsScreen.save();
        await lightBoxDialog.close();
      }
    );

    it('complete the quiz and take another quiz', async (): Promise<void> => {
      await quizScreen.navigateToQuizWritingScreen();
      await quizWritingScreen.autoCompleteQuiz(vocabularyList);
      await quizWritingScreen.takeAnotherQuiz();
      await quizWritingScreen.expectAnswerInputToExist();
    });

    it('complete the quiz and quit', async (): Promise<void> => {
      await quizScreen.navigateToQuizWritingScreen();
      await quizWritingScreen.autoCompleteQuiz(vocabularyList);
      await quizWritingScreen.quit();
      await quizWritingScreen.expectToNotExist();
    });
  });
});
