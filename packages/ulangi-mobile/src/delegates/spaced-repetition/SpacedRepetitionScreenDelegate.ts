/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  ButtonSize,
  ErrorCode,
  ReviewPriority,
  ScreenName,
} from '@ulangi/ulangi-common/enums';
import { ButtonStyles, ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { SpacedRepetitionSettingsDelegate } from '@ulangi/ulangi-delegate';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableSetStore,
  ObservableSpacedRepetitionScreen,
  ObservableVocabulary,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { observable, toJS } from 'mobx';

import { RemoteLogger } from '../../RemoteLogger';
import { config } from '../../constants/config';
import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { SpacedRepetitionCountsDelegate } from './SpacedRepetitionCountsDelegate';

@boundClass
export class SpacedRepetitionScreenDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private observableConverter: ObservableConverter;
  private observableScreen: ObservableSpacedRepetitionScreen;
  private spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate;
  private spacedRepetitionCountsDelegate: SpacedRepetitionCountsDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    observableConverter: ObservableConverter,
    observableScreen: ObservableSpacedRepetitionScreen,
    spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate,
    spacedRepetitionCountsDelegate: SpacedRepetitionCountsDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableConverter = observableConverter;
    this.observableScreen = observableScreen;
    this.spacedRepetitionSettingsDelegate = spacedRepetitionSettingsDelegate;
    this.spacedRepetitionCountsDelegate = spacedRepetitionCountsDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public startLesson(
    includeFromOtherCategories: boolean,
    reviewPriority: undefined | ReviewPriority,
  ): void {
    RemoteLogger.logEvent('start_spaced_repetition');
    const {
      initialInterval,
      limit,
      reviewPriority: defaultReviewPriority,
    } = this.spacedRepetitionSettingsDelegate.getCurrentSettings();

    this.eventBus.pubsub(
      createAction(ActionType.SPACED_REPETITION__FETCH_VOCABULARY, {
        setId: this.setStore.existingCurrentSetId,
        initialInterval,
        reviewPriority:
          typeof reviewPriority !== 'undefined'
            ? reviewPriority
            : defaultReviewPriority,
        limit,
        selectedCategoryNames: toJS(
          this.observableScreen.selectedCategoryNames,
        ),
        includeFromOtherCategories,
      }),
      group(
        on(
          ActionType.SPACED_REPETITION__FETCHING_VOCABULARY,
          this.showPreparingDialog,
        ),
        once(
          ActionType.SPACED_REPETITION__FETCH_VOCABULARY_SUCCEEDED,
          ({ vocabularyList }): void => {
            this.navigatorDelegate.dismissLightBox();
            this.navigatorDelegate.push(
              ScreenName.SPACED_REPETITION_LESSON_SCREEN,
              {
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
                currentCategoryNames: toJS(
                  this.observableScreen.selectedCategoryNames,
                ),
                startLesson: (
                  overrideReviewPriority: undefined | ReviewPriority,
                ): void => {
                  this.startLesson(
                    false,
                    typeof overrideReviewPriority !== 'undefined'
                      ? overrideReviewPriority
                      : reviewPriority,
                  );
                },
              },
            );
          },
        ),
        once(
          ActionType.SPACED_REPETITION__FETCH_VOCABULARY_FAILED,
          (errorBag): void => {
            if (
              errorBag.errorCode ===
              ErrorCode.SPACED_REPETITION__INSUFFICIENT_VOCABULARY
            ) {
              if (
                typeof this.observableScreen.selectedCategoryNames !==
                  'undefined' &&
                includeFromOtherCategories === false
              ) {
                this.showNotEnoughTermsForSelectedCategoriesDialog(
                  reviewPriority,
                );
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
    this.navigatorDelegate.push(
      ScreenName.SPACED_REPETITION_SETTINGS_SCREEN,
      {},
    );
  }

  public showFAQ(): void {
    this.navigatorDelegate.push(ScreenName.SPACED_REPETITION_FAQ_SCREEN, {});
  }

  public showSpacedRepetitionExplanationVideo(): void {
    this.navigatorDelegate.showModal(ScreenName.BROWSER_SCREEN, {
      link: 'https://www.youtube.com/watch?v=cVf38y07cfk',
      screenTitle: 'Spaced Repetition',
    });
  }

  public selectCategory(): void {
    this.navigatorDelegate.showModal(ScreenName.CATEGORY_SELECTOR_SCREEN, {
      initialCategoryName: undefined,
      onSelect: (categoryName): void => {
        this.observableScreen.selectedCategoryNames = observable.array([
          categoryName,
        ]);

        this.refreshDueAndNewCounts();
      },
    });
  }

  public refreshDueAndNewCounts(): void {
    this.spacedRepetitionCountsDelegate.refreshDueAndNewCounts(
      typeof this.observableScreen.selectedCategoryNames !== 'undefined'
        ? this.observableScreen.selectedCategoryNames.slice()
        : undefined,
      (dueCount, newCount): void => {
        this.observableScreen.counts = {
          due: dueCount,
          new: newCount,
        };
      },
    );
  }

  public clearDueAndNewCounts(): void {
    this.observableScreen.counts = undefined;
    this.spacedRepetitionCountsDelegate.clearDueAndNewCounts();
  }

  private showPreparingDialog(): void {
    this.dialogDelegate.show({
      message: 'Preparing. Please wait...',
    });
  }

  private showNotEnoughTermsForSelectedCategoriesDialog(
    reviewPriority: undefined | ReviewPriority,
  ): void {
    this.dialogDelegate.show({
      testID: LightBoxDialogIds.FAILED_DIALOG,
      message: `Not enough terms for selected categories (minimum is ${
        config.spacedRepetition.minPerLesson
      }). Do you want to include terms from other categories?`,
      title: 'FAILED TO START',
      buttonList: [
        {
          testID: LightBoxDialogIds.CANCEL_BTN,
          text: 'CANCEL',
          onPress: (): void => {
            this.navigatorDelegate.dismissLightBox();
          },
          responsiveStyles: (theme, layout): ButtonStyles =>
            fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
              ButtonSize.SMALL,
              theme,
              layout,
            ),
        },
        {
          testID: LightBoxDialogIds.OKAY_BTN,
          text: 'OKAY',
          onPress: (): void => {
            this.startLesson(true, reviewPriority);
          },
          responsiveStyles: (theme, layout): ButtonStyles =>
            fullRoundedButtonStyles.getSolidPrimaryBackgroundStyles(
              ButtonSize.SMALL,
              theme,
              layout,
            ),
        },
      ],
    });
  }

  private showNotEnoughTermsDialog(): void {
    this.dialogDelegate.show({
      testID: LightBoxDialogIds.FAILED_DIALOG,
      message: `Not enough terms (min is ${
        config.spacedRepetition.minPerLesson
      }). If you just learned all of them, please add new terms or wait for next review.`,
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
