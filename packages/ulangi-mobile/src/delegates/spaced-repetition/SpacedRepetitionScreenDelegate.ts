/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ButtonSize, ErrorCode, ScreenName } from '@ulangi/ulangi-common/enums';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableSetStore,
  ObservableSpacedRepetitionScreen,
  ObservableVocabulary,
} from '@ulangi/ulangi-observable';
import { AnalyticsAdapter } from '@ulangi/ulangi-saga';
import { boundClass } from 'autobind-decorator';
import { observable, toJS } from 'mobx';

import { config } from '../../constants/config';
import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { ErrorConverter } from '../../converters/ErrorConverter';
import { LinkingDelegate } from '../../delegates/linking/LinkingDelegate';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { CategoryMessageDelegate } from '../category/CategoryMessageDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { SpacedRepetitionSettingsDelegate } from './SpacedRepetitionSettingsDelegate';

@boundClass
export class SpacedRepetitionScreenDelegate {
  private errorConverter = new ErrorConverter();

  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private observableConverter: ObservableConverter;
  private observableScreen: ObservableSpacedRepetitionScreen;
  private spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private categoryMessageDelegate: CategoryMessageDelegate;
  private linkingDelegate: LinkingDelegate;
  private analytics: AnalyticsAdapter;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    observableConverter: ObservableConverter,
    observableScreen: ObservableSpacedRepetitionScreen,
    spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate,
    navigatorDelegate: NavigatorDelegate,
    categoryMessageDelegate: CategoryMessageDelegate,
    linkingDelegate: LinkingDelegate,
    analytics: AnalyticsAdapter,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableConverter = observableConverter;
    this.observableScreen = observableScreen;
    this.spacedRepetitionSettingsDelegate = spacedRepetitionSettingsDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.categoryMessageDelegate = categoryMessageDelegate;
    this.linkingDelegate = linkingDelegate;
    this.analytics = analytics;
  }

  public startLesson(includeFromOtherCategories: boolean): void {
    this.analytics.logEvent('start_spaced_repetition');
    const {
      initialInterval,
      limit,
    } = this.spacedRepetitionSettingsDelegate.getCurrentSettings();

    this.eventBus.pubsub(
      createAction(ActionType.SPACED_REPETITION__FETCH_VOCABULARY, {
        setId: this.setStore.existingCurrentSetId,
        initialInterval,
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
                startLesson: (): void => this.startLesson(false),
              },
            );
          },
        ),
        once(
          ActionType.SPACED_REPETITION__FETCH_VOCABULARY_FAILED,
          ({ errorCode }): void => {
            if (
              errorCode === ErrorCode.SPACED_REPETITION__INSUFFICIENT_VOCABULARY
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
              this.showPrepareFailedDialog(errorCode);
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

  public showSelectSpecificCategoryMessage(): void {
    this.categoryMessageDelegate.showSelectSpecificCategoryMessage();
  }

  public showSpacedRepetitionExplanationVideo(): void {
    this.linkingDelegate.openLink(
      'https://www.youtube.com/watch?v=cVf38y07cfk',
    );
  }

  private showPreparingDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        message: 'Preparing. Please wait...',
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showNotEnoughTermsForSelectedCategoriesDialog(): void {
    this.navigatorDelegate.showDialog(
      {
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
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showNotEnoughTermsDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.FAILED_DIALOG,
        message: `Not enough terms (min is ${
          config.spacedRepetition.minPerLesson
        }). If you just learned all of them, please add new terms or wait for next review.`,
        title: 'FAILED TO START',
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showPrepareFailedDialog(errorCode: string): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.FAILED_DIALOG,
        message: this.errorConverter.convertToMessage(errorCode),
        title: 'FAILED TO START',
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }
}
