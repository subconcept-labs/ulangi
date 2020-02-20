/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import {
  LightBoxState,
  ScreenName,
  VocabularyDueType,
  VocabularyFilterType,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { SelectionItem } from '@ulangi/ulangi-common/interfaces';
import { VocabularyFilterCondition } from '@ulangi/ulangi-common/types';
import {
  ObservableCategory,
  ObservableLightBox,
  ObservableSetStore,
  Observer,
} from '@ulangi/ulangi-observable';
import { ObservableMap, runInAction, when } from 'mobx';

import { CategoryBulkActionMenuIds } from '../../constants/ids/CategoryBulkActionMenuIds';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { SetSelectionMenuDelegate } from '../set/SetSelectionMenuDelegate';
import { SpacedRepetitionSettingsDelegate } from '../spaced-repetition/SpacedRepetitionSettingsDelegate';
import { VocabularyBulkEditDelegate } from '../vocabulary/VocabularyBulkEditDelegate';
import { WritingSettingsDelegate } from '../writing/WritingSettingsDelegate';

export class CategoryBulkActionMenuDelegate {
  private observer: Observer;
  private setStore: ObservableSetStore;
  private observableLightBox: ObservableLightBox;
  private vocabularyBulkEditDelegate: VocabularyBulkEditDelegate;
  private setSelectionMenuDelegate: SetSelectionMenuDelegate;
  private spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate;
  private writingSettingsDelegate: WritingSettingsDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private styles: {
    light: Options;
    dark: Options;
  };

  public constructor(
    observer: Observer,
    setStore: ObservableSetStore,
    observableLightBox: ObservableLightBox,
    vocabularyBulkEditDelegate: VocabularyBulkEditDelegate,
    setSelectionMenuDelegate: SetSelectionMenuDelegate,
    spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate,
    writingSettingsDelegate: WritingSettingsDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
    styles: {
      light: Options;
      dark: Options;
    },
  ) {
    this.observer = observer;
    this.setStore = setStore;
    this.observableLightBox = observableLightBox;
    this.vocabularyBulkEditDelegate = vocabularyBulkEditDelegate;
    this.setSelectionMenuDelegate = setSelectionMenuDelegate;
    this.spacedRepetitionSettingsDelegate = spacedRepetitionSettingsDelegate;
    this.writingSettingsDelegate = writingSettingsDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.styles = styles;
  }

  public show(
    filterType: VocabularyFilterType,
    categoryList: null | ObservableMap<string, ObservableCategory>,
    selectedCategoryNames: string[],
    options: {
      hideReviewBySpacedRepetitionButton: boolean;
      hideReviewByWritingButton: boolean;
      hideQuizButton: boolean;
      hidePlayReflexButton: boolean;
      hidePlayAtomButton: boolean;
    },
  ): void {
    const items: SelectionItem[] = [];

    items.push(this.getSelectAllFetchedCategoriesBtn(categoryList));

    items.push(
      this.getRecategorizeAllTermsButton(filterType, selectedCategoryNames),
    );

    items.push(this.getMoveAllTermsButton(filterType, selectedCategoryNames));

    switch (filterType) {
      case VocabularyFilterType.ACTIVE:
      case VocabularyFilterType.DUE_BY_SPACED_REPETITION:
      case VocabularyFilterType.DUE_BY_WRITING:
        items.push(
          this.getArchiveAllTermsButton(filterType, selectedCategoryNames),
        );
        items.push(
          this.getDeleteAllTermsButton(filterType, selectedCategoryNames),
        );
        break;

      case VocabularyFilterType.ARCHIVED:
        items.push(
          this.getRestoreAllTermsButton(filterType, selectedCategoryNames),
        );
        items.push(
          this.getDeleteAllTermsButton(filterType, selectedCategoryNames),
        );
        break;

      case VocabularyFilterType.DELETED:
        items.push(
          this.getRestoreAllTermsButton(filterType, selectedCategoryNames),
        );
        items.push(
          this.getArchiveAllTermsButton(filterType, selectedCategoryNames),
        );
        break;
    }

    if (options.hideReviewBySpacedRepetitionButton === false) {
      items.push(this.getReviewBySpacedRepetitionBtn(selectedCategoryNames));
    }

    if (options.hideReviewByWritingButton === false) {
      items.push(this.getReviewByWritingBtn(selectedCategoryNames));
    }

    if (options.hideQuizButton === false) {
      items.push(this.getQuizBtn(selectedCategoryNames));
    }

    if (options.hidePlayReflexButton === false) {
      items.push(this.getPlayReflex(selectedCategoryNames));
    }

    if (options.hidePlayAtomButton === false) {
      items.push(this.getPlayAtom(selectedCategoryNames));
    }

    this.observableLightBox.actionMenu = {
      testID: CategoryBulkActionMenuIds.ACTION_MENU,
      title: 'Action',
      items,
    };

    this.navigatorDelegate.showLightBox(
      ScreenName.LIGHT_BOX_ACTION_MENU_SCREEN,
      {},
      this.styles,
    );
  }

  private getSelectAllFetchedCategoriesBtn(
    categoryList: null | ObservableMap<string, ObservableCategory>,
  ): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.SELECT_ALL_FETCHED_CATEGORIES_BTN,
      text: 'Select all fetched categories',
      onPress: (): void => {
        runInAction(
          (): void => {
            if (categoryList !== null) {
              Array.from(categoryList.values()).forEach(
                (vocabulary): void => {
                  vocabulary.isSelected.set(true);
                },
              );
            }
          },
        );
        this.navigatorDelegate.dismissLightBox();
      },
    };
  }

  private getRecategorizeAllTermsButton(
    filterType: VocabularyFilterType,
    categoryNames: string[],
  ): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.RECATEGORIZE_TERMS_BTN,
      text: `Recategorize all ${this.getAdjectiveByFilterType(
        filterType,
      )} terms`,
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.CATEGORY_SELECTOR_SCREEN, {
          screenTitle: 'Recategorize',
          initialCategoryName: undefined,
          onSelect: (newCategoryName): void => {
            this.vocabularyBulkEditDelegate.bulkEdit(
              this.generateCondition(filterType, categoryNames),
              {
                type: 'recategorize',
                newCategoryName,
              },
              {
                onBulkEditing: (updatedCount): void => {
                  this.dialogDelegate.show({
                    message: `Categorizing ${updatedCount} terms...`,
                  });
                },
                onBulkEditSucceeded: (totalCount): void => {
                  this.dialogDelegate.showSuccessDialog({
                    message: `Categorized ${totalCount} terms successfully.`,
                  });
                },
                onBulkEditFailed: (errorBag): void => {
                  this.dialogDelegate.showFailedDialog(errorBag);
                },
              },
            );
          },
        });
      },
    };
  }

  private getMoveAllTermsButton(
    filterType: VocabularyFilterType,
    categoryNames: string[],
  ): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.MOVE_TERMS_BTN,
      text: `Move all ${this.getAdjectiveByFilterType(filterType)} terms`,
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();

        this.observer.when(
          (): boolean =>
            this.observableLightBox.state === LightBoxState.UNMOUNTED,
          (): void => {
            this.setSelectionMenuDelegate.showActiveSets(
              (selectedSetId): void => {
                this.vocabularyBulkEditDelegate.bulkEdit(
                  this.generateCondition(filterType, categoryNames),
                  {
                    type: 'moveToSet',
                    newSetId: selectedSetId,
                  },
                  {
                    onBulkEditing: (updatedCount): void => {
                      this.dialogDelegate.show({
                        message: `Moving ${updatedCount} terms...`,
                      });
                    },
                    onBulkEditSucceeded: (totalCount): void => {
                      this.dialogDelegate.showSuccessDialog({
                        message: `Moved ${totalCount} terms successfully.`,
                      });
                    },
                    onBulkEditFailed: (errorBag): void => {
                      this.dialogDelegate.showFailedDialog(errorBag);
                    },
                  },
                );
              },
              {
                title: 'Move to...',
                hideLeftButton: true,
                hideRightButton: true,
              },
            );
          },
        );
      },
    };
  }

  private getRestoreAllTermsButton(
    filterType: VocabularyFilterType,
    categoryNames: string[],
  ): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.RESTORE_TERMS_BTN,
      text: `Restore all ${this.getAdjectiveByFilterType(filterType)} terms`,
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.vocabularyBulkEditDelegate.bulkEdit(
          this.generateCondition(filterType, categoryNames),
          {
            type: 'changeStatus',
            newVocabularyStatus: VocabularyStatus.ACTIVE,
          },
          {
            onBulkEditing: (updatedCount): void => {
              this.dialogDelegate.show({
                message: `Restoring ${updatedCount} terms...`,
              });
            },
            onBulkEditSucceeded: (totalCount): void => {
              this.dialogDelegate.showSuccessDialog({
                message: `Restored ${totalCount} terms successfully.`,
              });
            },
            onBulkEditFailed: (errorBag): void => {
              this.dialogDelegate.showFailedDialog(errorBag);
            },
          },
        );
      },
    };
  }

  private getArchiveAllTermsButton(
    filterType: VocabularyFilterType,
    categoryNames: string[],
  ): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.ARCHIVE_TERMS_BTN,
      text: `Archive all ${this.getAdjectiveByFilterType(filterType)} terms`,
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.vocabularyBulkEditDelegate.bulkEdit(
          this.generateCondition(filterType, categoryNames),
          {
            type: 'changeStatus',
            newVocabularyStatus: VocabularyStatus.ARCHIVED,
          },
          {
            onBulkEditing: (updatedCount): void => {
              this.dialogDelegate.show({
                message: `Archiving ${updatedCount} terms...`,
              });
            },
            onBulkEditSucceeded: (totalCount): void => {
              this.dialogDelegate.showSuccessDialog({
                message: `Archived ${totalCount} terms successfully.`,
              });
            },
            onBulkEditFailed: (errorBag): void => {
              this.dialogDelegate.showFailedDialog(errorBag);
            },
          },
        );
      },
    };
  }

  private getDeleteAllTermsButton(
    filterType: VocabularyFilterType,
    categoryNames: string[],
  ): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.ARCHIVE_TERMS_BTN,
      text: `Delete all ${this.getAdjectiveByFilterType(filterType)} terms`,
      textColor: 'red',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.vocabularyBulkEditDelegate.bulkEdit(
          this.generateCondition(filterType, categoryNames),
          {
            type: 'changeStatus',
            newVocabularyStatus: VocabularyStatus.DELETED,
          },
          {
            onBulkEditing: (updatedCount): void => {
              this.dialogDelegate.show({
                message: `Deleting ${updatedCount} terms...`,
              });
            },
            onBulkEditSucceeded: (totalCount): void => {
              this.dialogDelegate.showSuccessDialog({
                message: `Deleted ${totalCount} terms successfully.`,
              });
            },
            onBulkEditFailed: (errorBag): void => {
              this.dialogDelegate.showFailedDialog(errorBag);
            },
          },
        );
      },
    };
  }

  private getReviewBySpacedRepetitionBtn(
    selectedCategoryNames: string[],
  ): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.LEARN_WITH_SPACED_REPPETITION_BTN,
      text: 'Review by Spaced Repetition',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.SPACED_REPETITION_SCREEN, {
          selectedCategoryNames: selectedCategoryNames.slice(),
        });
      },
    };
  }

  private getReviewByWritingBtn(
    selectedCategoryNames: string[],
  ): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.LEARN_WITH_WRITING_BTN,
      text: 'Review by Writing',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.WRITING_SCREEN, {
          selectedCategoryNames: selectedCategoryNames.slice(),
        });
      },
    };
  }

  private getQuizBtn(selectedCategoryNames: string[]): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.QUIZ_BTN,
      text: 'Quiz',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.QUIZ_SCREEN, {
          selectedCategoryNames: selectedCategoryNames.slice(),
        });
      },
    };
  }

  private getPlayReflex(selectedCategoryNames: string[]): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.PLAY_WITH_REFLEX_BTN,
      text: 'Play Reflex',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        // Wait for light box to closed first, otherwise app will crash
        when(
          (): boolean => this.observableLightBox.state === 'unmounted',
          (): void => {
            this.navigatorDelegate.push(ScreenName.REFLEX_SCREEN, {
              selectedCategoryNames: selectedCategoryNames.slice(),
            });
          },
        );
      },
    };
  }

  private getPlayAtom(selectedCategoryNames: string[]): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.PLAY_WITH_ATOM_BTN,
      text: 'Play Atom',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        // Wait for light box to closed first, otherwise app will crash
        when(
          (): boolean => this.observableLightBox.state === 'unmounted',
          (): void => {
            this.navigatorDelegate.push(ScreenName.ATOM_SCREEN, {
              selectedCategoryNames: selectedCategoryNames.slice(),
            });
          },
        );
      },
    };
  }

  /*
  private getAutoplayBtn(
    selectedCategoryNames: string[]
  ): SelectionItem {
    return {
      testID: CategoryBulkActionMenuIds.AUTOPLAY_BTN,
      text: 'Autoplay',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        // Wait for light box to closed first, otherwise app will crash
        when(
          (): boolean => this.observableLightBox.state === "unmounted",
          (): void => {
            this.navigatorDelegate.push(ScreenName.FLASHCARD_PLAYER_SCREEN, {
              selectedCategoryNames: selectedCategoryNames.slice(),
            });
          }
        )
      },
    };
  }
  */

  private getAdjectiveByFilterType(filterType: VocabularyFilterType): string {
    switch (filterType) {
      case VocabularyFilterType.ACTIVE:
        return 'active';

      case VocabularyFilterType.ARCHIVED:
        return 'archived';

      case VocabularyFilterType.DELETED:
        return 'archived';

      case VocabularyFilterType.DUE_BY_SPACED_REPETITION:
      case VocabularyFilterType.DUE_BY_WRITING:
        return 'due';
    }
  }

  private generateCondition(
    filterType: VocabularyFilterType,
    categoryNames: string[],
  ): VocabularyFilterCondition {
    switch (filterType) {
      case VocabularyFilterType.DUE_BY_SPACED_REPETITION:
        return {
          filterBy: 'VocabularyDueType',
          setId: this.setStore.existingCurrentSetId,
          dueType: VocabularyDueType.DUE_BY_SPACED_REPETITION,
          initialInterval: this.spacedRepetitionSettingsDelegate.getCurrentSettings()
            .initialInterval,
          categoryNames,
        };

      case VocabularyFilterType.DUE_BY_WRITING:
        return {
          filterBy: 'VocabularyDueType',
          setId: this.setStore.existingCurrentSetId,
          dueType: VocabularyDueType.DUE_BY_WRITING,
          initialInterval: this.writingSettingsDelegate.getCurrentSettings()
            .initialInterval,
          categoryNames,
        };

      case VocabularyFilterType.ACTIVE:
        return {
          filterBy: 'VocabularyStatus',
          setId: this.setStore.existingCurrentSetId,
          vocabularyStatus: VocabularyStatus.ACTIVE,
          categoryNames,
        };

      case VocabularyFilterType.ARCHIVED:
        return {
          filterBy: 'VocabularyStatus',
          setId: this.setStore.existingCurrentSetId,
          vocabularyStatus: VocabularyStatus.ARCHIVED,
          categoryNames,
        };

      case VocabularyFilterType.DELETED:
        return {
          filterBy: 'VocabularyStatus',
          setId: this.setStore.existingCurrentSetId,
          vocabularyStatus: VocabularyStatus.DELETED,
          categoryNames,
        };
    }
  }
}
