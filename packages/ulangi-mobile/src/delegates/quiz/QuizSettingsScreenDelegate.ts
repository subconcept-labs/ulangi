/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorBag, SelectionItem } from '@ulangi/ulangi-common/interfaces';
import { ObservableQuizSettingsScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { QuizSettingsScreenIds } from '../../constants/ids/QuizSettingsScreenIds';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { QuizSettingsDelegate } from './QuizSettingsDelegate';

@boundClass
export class QuizSettingsScreenDelegate {
  private observableScreen: ObservableQuizSettingsScreen;
  private quizSettingsDelegate: QuizSettingsDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observableScreen: ObservableQuizSettingsScreen,
    quizSettingsDelegate: QuizSettingsDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.observableScreen = observableScreen;
    this.quizSettingsDelegate = quizSettingsDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public save(): void {
    this.quizSettingsDelegate.saveSettings(
      {
        vocabularyPool: this.observableScreen.selectedVocabularyPool,
        multipleChoiceQuizLimit: this.observableScreen
          .selectedMultipleChoiceQuizLimit,
        writingQuizLimit: this.observableScreen.selectedWritingQuizLimit,
      },
      {
        onSaving: this.showSavingDialog,
        onSaveSucceeded: this.showSaveSucceededDialog,
        onSaveFailed: this.showSaveFailedDialog,
      },
    );
  }

  public showMultipleChoiceQuizLimitMenu(
    valuePairs: readonly [number, string][],
    selectedLimit: number,
    onSelect: (limit: number) => void,
  ): void {
    this.navigatorDelegate.showSelectionMenu(
      {
        items: new Map(
          valuePairs.map(
            ([limit, limitText]): [number, SelectionItem] => {
              return [
                limit,
                {
                  testID: QuizSettingsScreenIds.SELECT_MULTIPLE_CHOICE_QUIZ_LIMIT_BTN_BY_LIMIT(
                    limit,
                  ),
                  text: limitText,
                  onPress: (): void => {
                    onSelect(limit);
                    this.navigatorDelegate.dismissLightBox();
                  },
                },
              ];
            },
          ),
        ),
        selectedIds: [selectedLimit],
        title: 'Select',
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  public showWritingQuizLimitMenu(
    valuePairs: readonly [number, string][],
    selectedLimit: number,
    onSelect: (limit: number) => void,
  ): void {
    this.navigatorDelegate.showSelectionMenu(
      {
        items: new Map(
          valuePairs.map(
            ([limit, limitText]): [number, SelectionItem] => {
              return [
                limit,
                {
                  testID: QuizSettingsScreenIds.SELECT_WRITING_QUIZ_LIMIT_BTN_BY_LIMIT(
                    limit,
                  ),
                  text: limitText,
                  onPress: (): void => {
                    onSelect(limit);
                    this.navigatorDelegate.dismissLightBox();
                  },
                },
              ];
            },
          ),
        ),
        selectedIds: [selectedLimit],
        title: 'Select',
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  public showVocabularyPoolMenu(
    valuePairs: readonly ['learned' | 'active', string][],
    selectedVocabularyPool: 'learned' | 'active',
    onSelect: (vocabularyPool: 'learned' | 'active') => void,
  ): void {
    this.navigatorDelegate.showSelectionMenu(
      {
        items: new Map(
          valuePairs.map(
            ([vocabularyPool, vocabularyPoolName]): [string, SelectionItem] => {
              return [
                vocabularyPool,
                {
                  testID: QuizSettingsScreenIds.SELECT_VOCABULARY_POOL_BTN_BY_VOCABULARY_POOL_NAME(
                    vocabularyPoolName,
                  ),
                  text: vocabularyPoolName,
                  onPress: (): void => {
                    onSelect(vocabularyPool);
                    this.navigatorDelegate.dismissLightBox();
                  },
                },
              ];
            },
          ),
        ),
        selectedIds: [selectedVocabularyPool],
        title: 'Select',
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showSavingDialog(): void {
    this.dialogDelegate.show({
      message: 'Saving. Please wait...',
    });
  }

  private showSaveSucceededDialog(): void {
    this.dialogDelegate.showSuccessDialog({
      message: 'Saved successfully.',
      onClose: (): void => {
        this.navigatorDelegate.pop();
      },
    });
  }

  private showSaveFailedDialog(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag, {
      title: 'SAVE FAILED',
    });
  }
}
