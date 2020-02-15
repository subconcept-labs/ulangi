/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Feedback, ScreenName } from '@ulangi/ulangi-common/enums';
import { SelectionItem } from '@ulangi/ulangi-common/interfaces';
import { ObservableWritingSettingsScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { config } from '../../constants/config';
import { WritingSettingsScreenIds } from '../../constants/ids/WritingSettingsScreenIds';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { ReviewFeedbackButtonDelegate } from '../review-feedback/ReviewFeedbackButtonDelegate';
import { WritingSettingsDelegate } from './WritingSettingsDelegate';

@boundClass
export class WritingSettingsScreenDelegate {
  private observableScreen: ObservableWritingSettingsScreen;
  private writingSettingsDelegate: WritingSettingsDelegate;
  private reviewFeedbackButtonDelegate: ReviewFeedbackButtonDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observableScreen: ObservableWritingSettingsScreen,
    writingSettingsDelegate: WritingSettingsDelegate,
    reviewFeedbackButtonDelegate: ReviewFeedbackButtonDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.observableScreen = observableScreen;
    this.writingSettingsDelegate = writingSettingsDelegate;
    this.reviewFeedbackButtonDelegate = reviewFeedbackButtonDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public save(): void {
    this.writingSettingsDelegate.saveSettings(
      {
        initialInterval: this.observableScreen.selectedInitialInterval,
        limit: this.observableScreen.selectedLimit,
        feedbackButtons: this.observableScreen.selectedFeedbackButtons,
        autoplayAudio: this.observableScreen.selectedAutoplayAudio,
        autoShowKeyboard: this.observableScreen.selectedAutoShowKeyboard,
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

  public showLimitMenu(
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
                  testID: WritingSettingsScreenIds.SELECT_LIMIT_BTN_BY_LIMIT(
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

  public showFeedbackButtonsMenu(
    valuePairs: readonly [3 | 4 | 5, string][],
    selectedFeedbackButtons: 3 | 4 | 5,
    onSelect: (feedbackButtons: 3 | 4 | 5) => void,
  ): void {
    this.navigatorDelegate.showSelectionMenu(
      {
        items: new Map(
          valuePairs.map(
            ([feedbackButtons, feedbackButtonsText]): [
              number,
              SelectionItem
            ] => {
              return [
                feedbackButtons,
                {
                  testID: WritingSettingsScreenIds.SELECT_FEEDBACK_BUTTONS_BTN_BY_FEEDBACK_BUTTONS(
                    feedbackButtons,
                  ),
                  text: feedbackButtonsText,
                  onPress: (): void => {
                    onSelect(feedbackButtons);
                    this.dialogDelegate.dismiss();
                  },
                },
              ];
            },
          ),
        ),
        selectedIds: [selectedFeedbackButtons],
        title: 'Select',
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  public showInitialIntervalMenu(
    valuePairs: readonly [number, string][],
    selectedLevel: number,
    onSelect: (initialInterval: number) => void,
  ): void {
    this.navigatorDelegate.showSelectionMenu(
      {
        items: new Map(
          valuePairs.map(
            ([initialInterval, initialIntervalText]): [
              number,
              SelectionItem
            ] => {
              return [
                initialInterval,
                {
                  testID: WritingSettingsScreenIds.SELECT_INITIAL_INTERVAL_BTN_BY_INITIAL_INTERVAL(
                    initialInterval,
                  ),
                  text: initialIntervalText,
                  onPress: (): void => {
                    onSelect(initialInterval);
                    this.navigatorDelegate.dismissLightBox();
                  },
                },
              ];
            },
          ),
        ),
        selectedIds: [selectedLevel],
        title: 'Select',
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  public getButtonsToShow(
    numberOfFeedbackButtons: 3 | 4 | 5,
  ): readonly Feedback[] {
    return this.reviewFeedbackButtonDelegate.getButtonsToShow(
      numberOfFeedbackButtons,
    );
  }

  public showAutoplayAudioMenu(
    valuePairs: readonly [boolean, string][],
    selectedAutoplayAudioMenu: boolean,
    onSelect: (autoplayAudio: boolean) => void,
  ): void {
    this.navigatorDelegate.showSelectionMenu(
      {
        items: new Map(
          valuePairs.map(
            ([autoplayAudio, autoplayAudioText]): [boolean, SelectionItem] => {
              return [
                autoplayAudio,
                {
                  testID: WritingSettingsScreenIds.SELECT_AUTOPLAY_AUDIO_BTN_BY_AUTOPLAY_AUDIO(
                    autoplayAudio,
                  ),
                  text: autoplayAudioText,
                  onPress: (): void => {
                    onSelect(autoplayAudio);
                    this.dialogDelegate.dismiss();
                  },
                },
              ];
            },
          ),
        ),
        selectedIds: [selectedAutoplayAudioMenu],
        title: 'Select',
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  public showAutoShowKeyboardMenu(
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
                  testID: WritingSettingsScreenIds.SELECT_AUTO_SHOW_KEYBOARD_BTN(
                    autoShowKeyboard,
                  ),
                  text: autoShowKeyboardText,
                  onPress: (): void => {
                    onSelect(autoShowKeyboard);
                    this.dialogDelegate.dismiss();
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

  public showIntervalsLightBox(): void {
    this.navigatorDelegate.showLightBox(
      ScreenName.INTERVALS_SCREEN,
      {
        initialInterval: this.observableScreen.selectedInitialInterval,
        range: [1, config.writing.maxLevel - 1],
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }
}
