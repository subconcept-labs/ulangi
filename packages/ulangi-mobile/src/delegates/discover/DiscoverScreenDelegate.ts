/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType } from '@ulangi/ulangi-action';
import {
  ButtonSize,
  DiscoverListType,
  ErrorCode,
  ScreenName,
} from '@ulangi/ulangi-common/enums';
import {
  ButtonStyles,
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
import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
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
    this.clearAllList();
    this.setListTypeByCurrentInput();
    this.refreshCurrentList();
  }

  public setInputAndRefresh(term: string): void {
    this.observableScreen.searchInput.set(term);
    this.setListTypeByCurrentInput();
    this.refreshCurrentList();
  }

  public prepareAndSearch(): void {
    if (
      this.observableScreen.listType.get() ===
      DiscoverListType.TRANSLATION_AND_PUBLIC_VOCABULARY_LIST
    ) {
      this.translationListDelegate.translateBidrection(
        this.observableScreen.searchInput.get(),
      );
      this.publicVocabularyListDelegate.prepareAndSearch(
        this.observableScreen.searchInput.get(),
      );
    } else if (
      this.observableScreen.listType.get() ===
        DiscoverListType.PREMADE_SET_LIST ||
      this.observableScreen.listType.get() === DiscoverListType.PUBLIC_SET_LIST
    ) {
      this.publicSetListDelegate.prepareAndSearch(
        this.observableScreen.searchInput.get(),
      );
    }
  }

  public setListTypeByCurrentInput(): void {
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

    this.observableScreen.listType.set(listType);
  }

  public setListTypeAndRefresh(listType: null | DiscoverListType): void {
    this.observableScreen.listType.set(listType);
    this.refreshCurrentList();
  }

  public focusSearchInput(): void {
    this.observableScreen.shouldFocusSearchInput.set(true);
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
        this.observableScreen.searchInput.set('');
        this.setListTypeByCurrentInput();
        this.refreshCurrentList();
        this.observableScreen.searchInputAutoFocus.set(true);
      },
    );
  }

  public clearAllList(): void {
    this.publicSetListDelegate.clearSearch();
    this.publicVocabularyListDelegate.clearSearch();
    this.translationListDelegate.clearBidirectionalTranslations();
  }

  public refreshCurrentList(): void {
    if (
      this.observableScreen.listType.get() ===
      DiscoverListType.TRANSLATION_AND_PUBLIC_VOCABULARY_LIST
    ) {
      this.publicVocabularyListDelegate.refresh(
        this.observableScreen.searchInput.get(),
      );
      if (this.translationListDelegate.canTranslate() === false) {
        this.translationListDelegate.clearTranslations();
      } else {
        this.translationListDelegate.refreshBidirectionalTranslations(
          this.observableScreen.searchInput.get(),
        );
      }
    } else if (
      this.observableScreen.listType.get() ===
        DiscoverListType.PREMADE_SET_LIST ||
      this.observableScreen.listType.get() === DiscoverListType.PUBLIC_SET_LIST
    ) {
      this.publicSetListDelegate.refresh(
        this.observableScreen.searchInput.get(),
      );
    }
  }

  public addVocabularyFromPublicVocabulary(
    publicVocabulary: PublicVocabulary,
    checkDuplicate: boolean = true,
  ): void {
    this.addVocabularyDelegate.addVocabularyFromPublicVocabulary(
      publicVocabulary,
      undefined,
      checkDuplicate,
      {
        onAdding: this.showAddingDialog,
        onAddSucceeded: this.showAddSucceededDialog,
        onAddFailed: (errorBag): void => {
          this.showAddFailedDialogWithRetry(
            errorBag,
            (shouldCheckDuplicate: boolean): void => {
              this.addVocabularyFromPublicVocabulary(
                publicVocabulary,
                shouldCheckDuplicate,
              );
            },
          );
        },
      },
    );
  }

  public addVocabularyFromTranslation(
    translation: TranslationWithLanguages,
    checkDuplicate: boolean = true,
  ): void {
    this.addVocabularyDelegate.addVocabularyFromTranslation(
      translation,
      checkDuplicate,
      {
        onAdding: this.showAddingDialog,
        onAddSucceeded: this.showAddSucceededDialog,
        onAddFailed: (errorBag): void => {
          this.showAddFailedDialogWithRetry(
            errorBag,
            (shouldCheckDuplicate: boolean): void => {
              this.addVocabularyFromTranslation(
                translation,
                shouldCheckDuplicate,
              );
            },
          );
        },
      },
    );
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

  public showPublicVocabularyDetail(vocabulary: PublicVocabulary): void {
    this.navigatorDelegate.showModal(
      ScreenName.PUBLIC_VOCABULARY_DETAIL_SCREEN,
      {
        vocabulary,
      },
    );
  }

  public autoRefreshOnSetChange(): void {
    this.eventBus.subscribe(
      on(
        ActionType.SET__SELECT,
        (): void => {
          this.clearAllList();
          this.setListTypeByCurrentInput();
          this.refreshCurrentList();
        },
      ),
    );
  }

  public openLink(link: string): void {
    Linking.openURL(link).catch(
      (err): void => console.error('An error occurred', err),
    );
  }

  public showTipScreen(): void {
    RemoteLogger.logEvent('show_discover_tip');
    this.navigatorDelegate.push(ScreenName.DISCOVER_FAQ_SCREEN, {});
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

  private showAddFailedDialogWithRetry(
    errorBag: ErrorBag,
    retry: (checkDuplicate: boolean) => void,
  ): void {
    if (errorBag.errorCode === ErrorCode.VOCABULARY__DUPLICATE_TERM) {
      this.dialogDelegate.show({
        testID: LightBoxDialogIds.SUCCESS_DIALOG,
        message:
          'You have added this term before. Do you want to add it again?',
        onBackgroundPress: (): void => {
          this.dialogDelegate.dismiss();
        },
        buttonList: [
          {
            testID: LightBoxDialogIds.CANCEL_BTN,
            text: 'NO',
            onPress: (): void => {
              this.dialogDelegate.dismiss();
            },
            styles: (theme, layout): ButtonStyles =>
              fullRoundedButtonStyles.getSolidPrimaryBackgroundStyles(
                ButtonSize.SMALL,
                theme,
                layout,
              ),
          },
          {
            testID: LightBoxDialogIds.OKAY_BTN,
            text: 'YES',
            onPress: (): void => {
              retry(false);
            },
            styles: (theme, layout): ButtonStyles =>
              fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
                ButtonSize.SMALL,
                theme,
                layout,
              ),
          },
        ],
      });
    } else {
      this.dialogDelegate.showFailedDialog(errorBag, {
        title: 'ADD FAILED',
      });
    }
  }
}
