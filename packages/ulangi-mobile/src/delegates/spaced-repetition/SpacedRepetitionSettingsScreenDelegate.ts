/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ReviewStrategy, ScreenName } from '@ulangi/ulangi-common/enums';
import { ErrorBag, SelectionItem } from '@ulangi/ulangi-common/interfaces';
import { ObservableSpacedRepetitionSettingsScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { config } from '../../constants/config';
import { SpacedRepetitionSettingsScreenIds } from '../../constants/ids/SpacedRepetitionSettingsScreenIds';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { SpacedRepetitionSettingsDelegate } from './SpacedRepetitionSettingsDelegate';

@boundClass
export class SpacedRepetitionSettingsScreenDelegate {
  private observableScreen: ObservableSpacedRepetitionSettingsScreen;
  private spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observableScreen: ObservableSpacedRepetitionSettingsScreen,
    spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.observableScreen = observableScreen;
    this.spacedRepetitionSettingsDelegate = spacedRepetitionSettingsDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public save(): void {
    this.spacedRepetitionSettingsDelegate.saveSettings(
      {
        initialInterval: this.observableScreen.selectedInitialInterval,
        limit: this.observableScreen.selectedLimit,
        reviewStrategy: this.observableScreen.selectedReviewStrategy,
      },
      {
        onSaving: this.showSavingDialog,
        onSaveSucceeded: this.showSaveSucceededDialog,
        onSaveFailed: this.showSaveFailedDialog,
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
                  testID: SpacedRepetitionSettingsScreenIds.SELECT_LIMIT_BTN_BY_LIMIT(
                    limit,
                  ),
                  text: limitText,
                  onPress: (): void => {
                    onSelect(limit);
                    this.dialogDelegate.dismiss();
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

  public showReviewStrategyMenu(
    valuePairs: readonly [ReviewStrategy, ReviewStrategy][],
    selectedReviewStrategy: ReviewStrategy,
    onSelect: (reviewStrategy: ReviewStrategy) => void,
  ): void {
    this.navigatorDelegate.showSelectionMenu(
      {
        items: new Map(
          valuePairs.map(
            ([reviewStrategy, reviewStrategyText]): [
              ReviewStrategy,
              SelectionItem
            ] => {
              return [
                reviewStrategy,
                {
                  testID: SpacedRepetitionSettingsScreenIds.SELECT_REVIEW_STRATEGY_BTN_BY_REVIEW_STRATEGY(
                    reviewStrategy,
                  ),
                  text: reviewStrategyText,
                  onPress: (): void => {
                    onSelect(reviewStrategy);
                    this.navigatorDelegate.dismissLightBox();
                  },
                },
              ];
            },
          ),
        ),
        selectedIds: [selectedReviewStrategy],
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
                  testID: SpacedRepetitionSettingsScreenIds.SELECT_INITIAL_INTERVAL_BTN_BY_INITIAL_INTERVAL(
                    initialInterval,
                  ),
                  text: initialIntervalText,
                  onPress: (): void => {
                    onSelect(initialInterval);
                    this.dialogDelegate.dismiss();
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

  public showIntervalsLightBox(): void {
    this.navigatorDelegate.showLightBox(
      ScreenName.INTERVALS_SCREEN,
      {
        initialInterval: this.observableScreen.selectedInitialInterval,
        range: [1, config.spacedRepetition.maxLevel - 1],
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
