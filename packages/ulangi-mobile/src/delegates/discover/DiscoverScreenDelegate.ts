/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType } from '@ulangi/ulangi-action';
import { DiscoverListType, ScreenName } from '@ulangi/ulangi-common/enums';
import {
  ErrorBag,
  PublicVocabulary,
  TranslationWithLanguages,
} from '@ulangi/ulangi-common/interfaces';
import { EventBus, on } from '@ulangi/ulangi-event';
import {
  ObservableDiscoverScreen,
  ObservablePublicSet,
  ObservableSetStore,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { runInAction } from 'mobx';
import { Linking } from 'react-native';

import { RemoteLogger } from '../../RemoteLogger';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { TranslationListDelegate } from '../translation/TranslationListDelegate';
import { AddVocabularyDelegate } from './AddVocabularyDelegate';
import { PublicSetListDelegate } from './PublicSetListDelegate';
import { PublicVocabularyActionMenuDelegate } from './PublicVocabularyActionMenuDelegate';
import { PublicVocabularyListDelegate } from './PublicVocabularyListDelegate';
import { TranslationActionMenuDelegate } from './TranslationActionMenuDelegate';

@boundClass
export class DiscoverScreenDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private observableScreen: ObservableDiscoverScreen;
  private addVocabularyDelegate: AddVocabularyDelegate;
  private publicSetListDelegate: PublicSetListDelegate;
  private publicVocabularyListDelegate: PublicVocabularyListDelegate;
  private publicVocabularyActionMenuDelegate: PublicVocabularyActionMenuDelegate;
  private translationListDelegate: TranslationListDelegate;
  private translationActionMenuDelegate: TranslationActionMenuDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    observableScreen: ObservableDiscoverScreen,
    addVocabularyDelegate: AddVocabularyDelegate,
    publicSetListDelegate: PublicSetListDelegate,
    publicVocabularyListDelegate: PublicVocabularyListDelegate,
    publicVocabularyActionMenuDelegate: PublicVocabularyActionMenuDelegate,
    translationListDelegate: TranslationListDelegate,
    translationActionMenuDelegate: TranslationActionMenuDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableScreen = observableScreen;
    this.addVocabularyDelegate = addVocabularyDelegate;
    this.publicSetListDelegate = publicSetListDelegate;
    this.publicVocabularyListDelegate = publicVocabularyListDelegate;
    this.publicVocabularyActionMenuDelegate = publicVocabularyActionMenuDelegate;
    this.translationListDelegate = translationListDelegate;
    this.translationActionMenuDelegate = translationActionMenuDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public handleInputEnded(): void {
    this.clearAndSearch();
  }

  public clearAndSearch(term?: string): void {
    if (typeof term !== 'undefined') {
      this.observableScreen.searchInput.set(term);
    }

    this.clearAllList();

    let listType;
    if (this.observableScreen.searchInput.get() === '') {
      if (
        this.setStore.existingCurrentSet.shouldShowPremadeFlashcards === true
      ) {
        listType = DiscoverListType.PREMADE_SET_LIST;
      } else {
        listType = null;
      }
    } else {
      listType = DiscoverListType.TRANSLATION_AND_PUBLIC_VOCABULARY_LIST;
    }

    this.setListTypeAndRefresh(listType);
  }

  public focusSearchInput(): void {
    this.observableScreen.shouldFocusSearchInput.set(true);
  }

  public setListTypeAndRefresh(listType: null | DiscoverListType): void {
    this.observableScreen.listType.set(listType);
    this.refresh();
  }

  public getPublicSetCount(): void {
    this.publicSetListDelegate.getPublicSetCount();
  }

  public searchPublicSets(): void {
    this.publicSetListDelegate.search();
  }

  public searchPublicVocabulary(): void {
    this.publicVocabularyListDelegate.search();
  }

  public clearSearchInput(): void {
    this.clearAllList();
    runInAction(
      (): void => {
        this.clearAndSearch('');
        this.observableScreen.searchInputAutoFocus.set(true);
      },
    );
  }

  public clearAllList(): void {
    this.publicSetListDelegate.clearSearch();
    this.publicVocabularyListDelegate.clearSearch();
    this.translationListDelegate.clearBidirectionalTranslations();
  }

  public refresh(): void {
    if (this.observableScreen.listType.get() !== null) {
      this.refreshCurrentList();
    }
  }

  private refreshCurrentList(): void {
    if (
      this.observableScreen.listType.get() ===
      DiscoverListType.TRANSLATION_AND_PUBLIC_VOCABULARY_LIST
    ) {
      this.publicVocabularyListDelegate.refresh(
        this.observableScreen.searchInput.get(),
      );
      if (this.translationListDelegate.canTranslate() === false) {
        this.translationListDelegate.clearTranslations;
      } else {
        this.translationListDelegate.refreshBidirectionalTranslations(
          this.observableScreen.searchInput.get(),
        );
      }
    } else {
      this.publicSetListDelegate.refresh(
        this.observableScreen.searchInput.get(),
      );
    }
  }

  public addVocabularyFromPublicVocabulary(
    publicVocabulary: PublicVocabulary,
  ): void {
    this.addVocabularyDelegate.addVocabularyFromPublicVocabulary(
      publicVocabulary,
      undefined,
      {
        onAdding: this.showAddingDialog,
        onAddSucceeded: this.showAddSucceededDialog,
        onAddFailed: this.showAddFailedDialog,
      },
    );
  }

  public addVocabularyFromTranslation(
    translation: TranslationWithLanguages,
  ): void {
    this.addVocabularyDelegate.addVocabularyFromTranslation(translation, {
      onAdding: this.showAddingDialog,
      onAddSucceeded: this.showAddSucceededDialog,
      onAddFailed: this.showAddFailedDialog,
    });
  }

  public showSetDetailModal(publicSet: ObservablePublicSet): void {
    this.navigatorDelegate.push(ScreenName.PUBLIC_SET_DETAIL_SCREEN, {
      publicSet: {
        ...publicSet,
        vocabularyList: publicSet.vocabularyList.map(
          (vocabulary): PublicVocabulary => {
            return {
              ...vocabulary,
              definitions: vocabulary.definitions.slice(),
            };
          },
        ),
      },
    });
  }

  public autoRefreshOnSetChange(): void {
    this.eventBus.subscribe(
      on(
        ActionType.SET__SELECT,
        (): void => {
          this.clearAndSearch();
        },
      ),
    );
  }

  public openLink(link: string): void {
    Linking.openURL(link).catch(
      (err): void => console.error('An error occurred', err),
    );
  }

  public showTip(): void {
    RemoteLogger.logEvent('show_search_set_tip');
    this.dialogDelegate.show({
      title: 'TIP',
      message:
        'You can search dictionary or search for categories. For example, type hello to know what it is in your learning language, or type Animals to search all animal related categories.',
      closeOnTouchOutside: true,
      showCloseButton: true,
    });
  }

  public showPublicVocabularyActionMenu(vocabulary: PublicVocabulary): void {
    this.publicVocabularyActionMenuDelegate.show(vocabulary);
  }

  public showTranslationActionMenu(
    translation: TranslationWithLanguages,
  ): void {
    this.translationActionMenuDelegate.show(translation);
  }

  private showAddingDialog(): void {
    this.dialogDelegate.show({
      message: 'Adding. Please wait...',
    });
  }

  private showAddSucceededDialog(): void {
    this.dialogDelegate.showSuccessDialog({
      message: 'Added successfully.',
    });
  }

  private showAddFailedDialog(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag, {
      title: 'ADD FAILED',
    });
  }
}
