/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SelectionItem } from '@ulangi/ulangi-common/interfaces';
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
        multipleChoiceQuizSize: this.observableScreen.multipleChoiceSettings
          .selectedQuizSize,
        writingQuizSize: this.observableScreen.writingSettings.selectedQuizSize,
        writingAutoShowKeyboard: this.observableScreen.writingSettings
          .selectedAutoShowKeyboard,
      },
      {
        onSaving: (): void => this.dialogDelegate.showSavingDialog(),
        onSaveSucceeded: (): void =>
          this.dialogDelegate.showSaveSucceededDialog(),
        onSaveFailed: (errorBag): void =>
          this.dialogDelegate.showSaveFailedDialog(errorBag),
      },
    );
  }

  public showMultipleChoiceQuizSizeMenu(
    valuePairs: readonly [number, string][],
    selectedQuizSize: number,
    onSelect: (size: number) => void,
  ): void {
    this.navigatorDelegate.showSelectionMenu(
      {
        items: new Map(
          valuePairs.map(
            ([size, sizeText]): [number, SelectionItem] => {
              return [
                size,
                {
                  testID: QuizSettingsScreenIds.SELECT_MULTIPLE_CHOICE_QUIZ_SIZE_BTN(
                    size,
                  ),
                  text: sizeText,
                  onPress: (): void => {
                    onSelect(size);
                    this.navigatorDelegate.dismissLightBox();
                  },
                },
              ];
            },
          ),
        ),
        selectedIds: [selectedQuizSize],
        title: 'Select',
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  public showWritingQuizSizeMenu(
    valuePairs: readonly [number, string][],
    selectedQuizSize: number,
    onSelect: (size: number) => void,
  ): void {
    this.navigatorDelegate.showSelectionMenu(
      {
        items: new Map(
          valuePairs.map(
            ([size, sizeText]): [number, SelectionItem] => {
              return [
                size,
                {
                  testID: QuizSettingsScreenIds.SELECT_WRITING_QUIZ_SIZE_BTN(
                    size,
                  ),
                  text: sizeText,
                  onPress: (): void => {
                    onSelect(size);
                    this.navigatorDelegate.dismissLightBox();
                  },
                },
              ];
            },
          ),
        ),
        selectedIds: [selectedQuizSize],
        title: 'Select',
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  public showWritingAutoShowKeyboardMenu(
    valuePairs: readonly [boolean, string][],
    selectedAutoShowKeyboard: boolean,
    onSelect: (autoShowKeyboard: boolean) => void,
  ): void {
    this.navigatorDelegate.showSelectionMenu(
      {
        items: new Map(
          valuePairs.map(
            ([autoShowKeyboard, autoShowKeyboardText]): [
              boolean,
              SelectionItem
            ] => {
              return [
                autoShowKeyboard,
                {
                  testID: QuizSettingsScreenIds.SELECT_WRITING_AUTO_SHOW_KEYBOARD_BTN(
                    autoShowKeyboard,
                  ),
                  text: autoShowKeyboardText,
                  onPress: (): void => {
                    onSelect(autoShowKeyboard);
                    this.navigatorDelegate.dismissLightBox();
                  },
                },
              ];
            },
          ),
        ),
        selectedIds: [selectedAutoShowKeyboard],
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
                  testID: QuizSettingsScreenIds.SELECT_VOCABULARY_POOL_BTN(
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
}
