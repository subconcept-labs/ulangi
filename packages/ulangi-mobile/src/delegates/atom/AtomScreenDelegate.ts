/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { ObservableAtomScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { observable } from 'mobx';

import { RemoteLogger } from '../../RemoteLogger';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { FetchVocabularyDelegate } from './FetchVocabularyDelegate';
import { PrepareFetchVocabularyDelegate } from './PrepareFetchVocabularyDelegate';

@boundClass
export class AtomScreenDelegate {
  private observableScreen: ObservableAtomScreen;
  private prepareFetchVocabularyDelegate: PrepareFetchVocabularyDelegate;
  private fetchVocabularyDelegate: FetchVocabularyDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observableScreen: ObservableAtomScreen,
    prepareFetchVocabularyDelegate: PrepareFetchVocabularyDelegate,
    fetchVocabularyDelegate: FetchVocabularyDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.observableScreen = observableScreen;
    this.prepareFetchVocabularyDelegate = prepareFetchVocabularyDelegate;
    this.fetchVocabularyDelegate = fetchVocabularyDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public startGame(): void {
    RemoteLogger.logEvent('start_atom');
    this.prepareFetchVocabularyDelegate.prepareFetch({
      onPreparing: this.showPreparingDialog,
      onPrepareSucceeded: (): void => {
        this.fetchVocabularyDelegate.fetch({
          onFetching: this.showPreparingDialog,
          onFetchSucceeded: (vocabularyList, noMore): void => {
            this.dialogDelegate.dismiss();
            this.navigatorDelegate.push(ScreenName.ATOM_PLAY_SCREEN, {
              firstVocabularyBatch: vocabularyList,
              noMoreVocabulary: noMore,
              startGame: this.startGame,
            });
          },
          onFetchFailed: (errorBag): void => {
            this.fetchVocabularyDelegate.clearFetch();
            this.showFailedToStartDialog(errorBag);
          },
        });
      },
      onPrepareFailed: (errorBag): void => {
        this.fetchVocabularyDelegate.clearFetch();
        this.showFailedToStartDialog(errorBag);
      },
    });
  }

  public showPreparingDialog(): void {
    this.dialogDelegate.show({
      message: 'Preparing. Please wait...',
    });
  }

  public showFailedToStartDialog(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag, {
      title: 'FAILED TO START',
    });
  }

  public goToTutorial(): void {
    this.navigatorDelegate.push(ScreenName.ATOM_TUTORIAL_SCREEN, {});
  }

  public back(): void {
    this.navigatorDelegate.dismissScreen();
  }

  public selectCategory(): void {
    this.navigatorDelegate.showModal(ScreenName.CATEGORY_SELECTOR_SCREEN, {
      initialCategoryName: undefined,
      onSelect: (categoryName): void => {
        this.observableScreen.selectedCategoryNames = observable.array([
          categoryName,
        ]);
      },
    });
  }
}
