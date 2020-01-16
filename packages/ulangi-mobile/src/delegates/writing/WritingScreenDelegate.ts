/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ButtonSize, ErrorCode, ScreenName } from '@ulangi/ulangi-common/enums';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableSetStore,
  ObservableVocabulary,
  ObservableWritingScreen,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { observable, toJS } from 'mobx';

import { RemoteLogger } from '../../RemoteLogger';
import { config } from '../../constants/config';
import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { CategoryMessageDelegate } from '../category/CategoryMessageDelegate';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { WritingSettingsDelegate } from './WritingSettingsDelegate';

@boundClass
export class WritingScreenDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private observableConverter: ObservableConverter;
  private observableScreen: ObservableWritingScreen;
  private writingSettingsDelegate: WritingSettingsDelegate;
  private categoryMessageDelegate: CategoryMessageDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    observableConverter: ObservableConverter,
    observableScreen: ObservableWritingScreen,
    writingSettingsDelegate: WritingSettingsDelegate,
    categoryMessageDelegate: CategoryMessageDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableConverter = observableConverter;
    this.observableScreen = observableScreen;
    this.writingSettingsDelegate = writingSettingsDelegate;
    this.categoryMessageDelegate = categoryMessageDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public startLesson(includeFromOtherCategories: boolean): void {
    RemoteLogger.logEvent('start_writing');
    const {
      initialInterval,
      limit,
    } = this.writingSettingsDelegate.getCurrentSettings();

    this.eventBus.pubsub(
      createAction(ActionType.WRITING__FETCH_VOCABULARY, {
        setId: this.setStore.existingCurrentSetId,
        initialInterval,
        limit,
        selectedCategoryNames: toJS(
          this.observableScreen.selectedCategoryNames,
        ),
        includeFromOtherCategories,
      }),
      group(
        on(ActionType.WRITING__FETCH_VOCABULARY, this.showPreparingDialog),
        once(
          ActionType.WRITING__FETCH_VOCABULARY_SUCCEEDED,
          ({ vocabularyList }): void => {
            this.dialogDelegate.dismiss();
            this.navigatorDelegate.push(ScreenName.WRITING_LESSON_SCREEN, {
              vocabularyList: observable.map(
                vocabularyList.map(
                  (vocabulary): [string, ObservableVocabulary] => {
                    return [
                      vocabulary.vocabularyId,
                      this.observableConverter.convertToObservableVocabulary(
                        vocabulary,
                      ),
                    ];
                  },
                ),
              ),
              startLesson: (): void => this.startLesson(false),
            });
          },
        ),
        once(
          ActionType.WRITING__FETCH_VOCABULARY_FAILED,
          (errorBag): void => {
            if (
              errorBag.errorCode === ErrorCode.WRITING__INSUFFICIENT_VOCABULARY
            ) {
              if (
                typeof this.observableScreen.selectedCategoryNames !==
                  'undefined' &&
                includeFromOtherCategories === false
              ) {
                this.showNotEnoughTermsForSelectedCategoriesDialog();
              } else {
                this.showNotEnoughTermsDialog();
              }
            } else {
              this.showPrepareFailedDialog(errorBag);
            }
          },
        ),
      ),
    );
  }

  public showSettings(): void {
    this.navigatorDelegate.push(ScreenName.WRITING_SETTINGS_SCREEN, {});
  }

  public showFAQ(): void {
    this.navigatorDelegate.push(ScreenName.WRITING_FAQ_SCREEN, {});
  }

  public showSelectSpecificCategoryMessage(): void {
    this.categoryMessageDelegate.showSelectSpecificCategoryMessage();
  }

  private showPreparingDialog(): void {
    this.dialogDelegate.show({
      message: 'Preparing. Please wait...',
    });
  }

  private showNotEnoughTermsForSelectedCategoriesDialog(): void {
    this.dialogDelegate.show({
      testID: LightBoxDialogIds.FAILED_DIALOG,
      message: `Not enough terms for selected categories (minimum is ${
        config.writing.minPerLesson
      }). Do you want to include terms from other categories?`,
      title: 'FAILED TO START',
      buttonList: [
        {
          testID: LightBoxDialogIds.CANCEL_BTN,
          text: 'CANCEL',
          onPress: (): void => {
            this.navigatorDelegate.dismissLightBox();
          },
          styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
        {
          testID: LightBoxDialogIds.OKAY_BTN,
          text: 'OKAY',
          onPress: (): void => {
            this.startLesson(true);
          },
          styles: FullRoundedButtonStyle.getFullPrimaryBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
      ],
    });
  }

  private showNotEnoughTermsDialog(): void {
    this.dialogDelegate.show({
      testID: LightBoxDialogIds.FAILED_DIALOG,
      message: `Not enough terms (min is ${
        config.writing.minPerLesson
      }). If you just written all of them, please add new terms or wait for next review.`,
      title: 'FAILED TO START',
      showCloseButton: true,
      closeOnTouchOutside: true,
    });
  }

  private showPrepareFailedDialog(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag, {
      title: 'FAILED TO START',
    });
  }
}
