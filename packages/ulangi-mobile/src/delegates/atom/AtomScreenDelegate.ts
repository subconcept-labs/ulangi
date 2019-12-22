/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { AnalyticsAdapter } from '@ulangi/ulangi-saga';
import { boundClass } from 'autobind-decorator';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { ErrorConverter } from '../../converters/ErrorConverter';
import { AtomStyle } from '../../styles/AtomStyle';
import { CategoryMessageDelegate } from '../category/CategoryMessageDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { FetchVocabularyDelegate } from './FetchVocabularyDelegate';
import { PrepareFetchVocabularyDelegate } from './PrepareFetchVocabularyDelegate';

@boundClass
export class AtomScreenDelegate {
  private errorConverter = new ErrorConverter();

  private prepareFetchVocabularyDelegate: PrepareFetchVocabularyDelegate;
  private fetchVocabularyDelegate: FetchVocabularyDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private categoryMessageDelegate: CategoryMessageDelegate;
  private analytics: AnalyticsAdapter;

  public constructor(
    prepareFetchVocabularyDelegate: PrepareFetchVocabularyDelegate,
    fetchVocabularyDelegate: FetchVocabularyDelegate,
    navigatorDelegate: NavigatorDelegate,
    categoryMessageDelegate: CategoryMessageDelegate,
    analytics: AnalyticsAdapter
  ) {
    this.prepareFetchVocabularyDelegate = prepareFetchVocabularyDelegate;
    this.fetchVocabularyDelegate = fetchVocabularyDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.categoryMessageDelegate = categoryMessageDelegate;
    this.analytics = analytics;
  }

  public startGame(): void {
    this.analytics.logEvent('start_atom');
    this.prepareFetchVocabularyDelegate.prepareFetch({
      onPreparing: this.showPreparingDialog,
      onPrepareSucceeded: (): void => {
        this.fetchVocabularyDelegate.fetch({
          onFetching: this.showPreparingDialog,
          onFetchSucceeded: (vocabularyList, noMore): void => {
            this.navigatorDelegate.dismissLightBox();
            this.navigatorDelegate.push(ScreenName.ATOM_PLAY_SCREEN, {
              firstVocabularyBatch: vocabularyList,
              noMoreVocabulary: noMore,
              startGame: this.startGame,
            });
          },
          onFetchFailed: (errorCode): void => {
            this.fetchVocabularyDelegate.clearFetch();
            this.showFailedToStartDialog(errorCode);
          },
        });
      },
      onPrepareFailed: (errorCode): void => {
        this.fetchVocabularyDelegate.clearFetch();
        this.showFailedToStartDialog(errorCode);
      },
    });
  }

  public showPreparingDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        message: 'Preparing. Please wait...',
      },
      AtomStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  public showFailedToStartDialog(errorCode: string): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.FAILED_DIALOG,
        message: this.errorConverter.convertToMessage(errorCode),
        title: 'FAILED TO START',
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      AtomStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  public goToTutorial(): void {
    this.navigatorDelegate.push(ScreenName.ATOM_TUTORIAL_SCREEN, {});
  }

  public back(): void {
    this.navigatorDelegate.pop();
  }

  public showSelectSpecificCategoryMessage(): void {
    this.categoryMessageDelegate.showSelectSpecificCategoryMessage();
  }
}
