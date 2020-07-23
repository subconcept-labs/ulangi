/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
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
import { when } from 'mobx';

import { CategoryActionMenuIds } from '../../constants/ids/CategoryActionMenuIds';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { SetSelectionMenuDelegate } from '../set/SetSelectionMenuDelegate';
import { SpacedRepetitionSettingsDelegate } from '../spaced-repetition/SpacedRepetitionSettingsDelegate';
import { VocabularyBulkEditDelegate } from '../vocabulary/VocabularyBulkEditDelegate';
import { WritingSettingsDelegate } from '../writing/WritingSettingsDelegate';
import { CategorySelectionDelegate } from './CategorySelectionDelegate';

export class CategoryActionMenuDelegate {
  private setStore: ObservableSetStore;
  private observer: Observer;
  private observableLightBox: ObservableLightBox;
  private categorySelectionDelegate: undefined | CategorySelectionDelegate;
  private setSelectionMenuDelegate: SetSelectionMenuDelegate;
  private vocabularyBulkEditDelegate: VocabularyBulkEditDelegate;
  private spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate;
  private writingSettingsDelegate: WritingSettingsDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private styles: {
    light: Options;
    dark: Options;
  };

  public constructor(
    setStore: ObservableSetStore,
    observer: Observer,
    observableLightBox: ObservableLightBox,
    categorySelectionDelegate: undefined | CategorySelectionDelegate,
    setSelectionMenuDelegate: SetSelectionMenuDelegate,
    vocabularyBulkEditDelegate: VocabularyBulkEditDelegate,
    spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate,
    writingSettingsDelegate: WritingSettingsDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
    styles: {
      light: Options;
      dark: Options;
    },
  ) {
    this.setStore = setStore;
    this.observer = observer;
    this.observableLightBox = observableLightBox;
    this.categorySelectionDelegate = categorySelectionDelegate;
    this.setSelectionMenuDelegate = setSelectionMenuDelegate;
    this.vocabularyBulkEditDelegate = vocabularyBulkEditDelegate;
    this.spacedRepetitionSettingsDelegate = spacedRepetitionSettingsDelegate;
    this.writingSettingsDelegate = writingSettingsDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.styles = styles;
  }

  public show(
    category: ObservableCategory,
    filterType: VocabularyFilterType,
    options: {
      hideReviewBySpacedRepetitionButton: boolean;
      hideReviewByWritingButton: boolean;
      hideQuizButton: boolean;
      hidePlayReflexButton: boolean;
      hidePlayAtomButton: boolean;
      hideViewDetailButton: boolean;
    },
  ): void {
    const items: SelectionItem[] = [];

    if (typeof this.categorySelectionDelegate !== 'undefined') {
      items.push(this.getToggleSelectButton(category.categoryName));
    }

    if (options.hideViewDetailButton === false) {
      items.push(this.getViewDetailButton(category, filterType));
    }

    items.push(this.getAddTermsButton(category.categoryName));

    items.push(
      this.getRecategorizeAllTermsButton(category.categoryName, filterType),
    );

    items.push(this.getMoveAllTermsButton(category.categoryName, filterType));

    switch (filterType) {
      case VocabularyFilterType.ACTIVE:
      case VocabularyFilterType.DUE_BY_SPACED_REPETITION:
      case VocabularyFilterType.DUE_BY_WRITING:
        items.push(
          this.getArchiveAllTermsButton(category.categoryName, filterType),
        );
        items.push(
          this.getDeleteAllTermsButton(category.categoryName, filterType),
        );
        break;

      case VocabularyFilterType.ARCHIVED:
        items.push(
          this.getRestoreAllTermsButton(category.categoryName, filterType),
        );
        items.push(
          this.getDeleteAllTermsButton(category.categoryName, filterType),
        );
        break;

      case VocabularyFilterType.DELETED:
        items.push(
          this.getRestoreAllTermsButton(category.categoryName, filterType),
        );
        items.push(
          this.getArchiveAllTermsButton(category.categoryName, filterType),
        );
        break;
    }

    if (options.hideReviewBySpacedRepetitionButton === false) {
      items.push(this.getReviewBySpacedRepetitionBtn(category.categoryName));
    }

    if (options.hideReviewByWritingButton === false) {
      items.push(this.getReviewByWritingBtn(category.categoryName));
    }

    if (options.hideQuizButton === false) {
      items.push(this.getQuizBtn(category.categoryName));
    }

    if (options.hidePlayReflexButton === false) {
      items.push(this.getPlayReflexBtn(category.categoryName));
    }

    if (options.hidePlayAtomButton === false) {
      items.push(this.getPlayAtomBtn(category.categoryName));
    }

    this.observableLightBox.actionMenu = {
      testID: CategoryActionMenuIds.ACTION_MENU,
      title: 'Action',
      items,
    };

    this.navigatorDelegate.showLightBox(
      ScreenName.LIGHT_BOX_ACTION_MENU_SCREEN,
      {},
      this.styles,
    );
  }

  private getToggleSelectButton(categoryName: string): SelectionItem {
    const categorySelectionDelegate = assertExists(
      this.categorySelectionDelegate,
      'categorySelectionDelegate is required to render toggle select button',
    );
    return {
      testID: CategoryActionMenuIds.TOGGLE_SELECT_BTN,
      text: 'Select',
      onPress: (): void => {
        categorySelectionDelegate.toggleSelection(categoryName);
        this.navigatorDelegate.dismissLightBox();
      },
    };
  }

  private getViewDetailButton(
    category: ObservableCategory,
    selectedFilterType: VocabularyFilterType,
  ): SelectionItem {
    return {
      testID: CategoryActionMenuIds.VIEW_DETAIL_BTN,
      text: 'View detail',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.CATEGORY_DETAIL_SCREEN, {
          selectedFilterType,
          category,
        });
      },
    };
  }

  private getAddTermsButton(categoryName: string): SelectionItem {
    return {
      testID: CategoryActionMenuIds.ADD_TERMS_BTN,
      text: 'Add new terms',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.ADD_VOCABULARY_SCREEN, {
          categoryName,
          closeOnSaveSucceeded: false,
        });
      },
    };
  }

  private getRecategorizeAllTermsButton(
    categoryName: string,
    filterType: VocabularyFilterType,
  ): SelectionItem {
    return {
      testID: CategoryActionMenuIds.RECATEGORIZE_TERMS_BTN,
      text: `Recategorize all ${this.getAdjectiveByFilterType(
        filterType,
      )} terms`,
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.showModal(ScreenName.CATEGORY_SELECTOR_SCREEN, {
          screenTitle: 'Recategorize',
          initialCategoryName: categoryName,
          onSelect: (newCategoryName): void => {
            this.vocabularyBulkEditDelegate.bulkEdit(
              this.generateCondition(filterType, categoryName),
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
    categoryName: string,
    filterType: VocabularyFilterType,
  ): SelectionItem {
    return {
      testID: CategoryActionMenuIds.MOVE_TERMS_BTN,
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
                  this.generateCondition(filterType, categoryName),
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
    categoryName: string,
    filterType: VocabularyFilterType,
  ): SelectionItem {
    return {
      testID: CategoryActionMenuIds.RESTORE_TERMS_BTN,
      text: `Restore all ${this.getAdjectiveByFilterType(filterType)} terms`,
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.vocabularyBulkEditDelegate.bulkEdit(
          this.generateCondition(filterType, categoryName),
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
    categoryName: string,
    filterType: VocabularyFilterType,
  ): SelectionItem {
    return {
      testID: CategoryActionMenuIds.ARCHIVE_TERMS_BTN,
      text: `Archive all ${this.getAdjectiveByFilterType(filterType)} terms`,
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.vocabularyBulkEditDelegate.bulkEdit(
          this.generateCondition(filterType, categoryName),
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
    categoryName: string,
    filterType: VocabularyFilterType,
  ): SelectionItem {
    return {
      testID: CategoryActionMenuIds.ARCHIVE_TERMS_BTN,
      text: `Delete all ${this.getAdjectiveByFilterType(filterType)} terms`,
      textColor: 'red',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();

        this.vocabularyBulkEditDelegate.bulkEdit(
          this.generateCondition(filterType, categoryName),
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

  private getReviewBySpacedRepetitionBtn(categoryName: string): SelectionItem {
    return {
      testID: CategoryActionMenuIds.LEARN_WITH_SPACED_REPPETITION_BTN,
      text: 'Review by Spaced Repetition',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.SPACED_REPETITION_SCREEN, {
          selectedCategoryNames: [categoryName],
        });
      },
    };
  }

  private getReviewByWritingBtn(categoryName: string): SelectionItem {
    return {
      testID: CategoryActionMenuIds.LEARN_WITH_WRITING_BTN,
      text: 'Review by Writing',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.WRITING_SCREEN, {
          selectedCategoryNames: [categoryName],
        });
      },
    };
  }

  private getQuizBtn(categoryName: string): SelectionItem {
    return {
      testID: CategoryActionMenuIds.QUIZ_BTN,
      text: 'Quiz',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.QUIZ_SCREEN, {
          selectedCategoryNames: [categoryName],
        });
      },
    };
  }

  private getPlayReflexBtn(categoryName: string): SelectionItem {
    return {
      testID: CategoryActionMenuIds.PLAY_WITH_REFLEX,
      text: 'Play Reflex',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        // Wait for light box to closed first, otherwise app will crash
        when(
          (): boolean => this.observableLightBox.state === 'unmounted',
          (): void => {
            this.navigatorDelegate.push(ScreenName.REFLEX_SCREEN, {
              selectedCategoryNames: [categoryName],
            });
          },
        );
      },
    };
  }

  private getPlayAtomBtn(categoryName: string): SelectionItem {
    return {
      testID: CategoryActionMenuIds.PLAY_WITH_ATOM,
      text: 'Play Atom',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        // Wait for light box to closed first, otherwise app will crash
        when(
          (): boolean => this.observableLightBox.state === 'unmounted',
          (): void => {
            this.navigatorDelegate.push(ScreenName.ATOM_SCREEN, {
              selectedCategoryNames: [categoryName],
            });
          },
        );
      },
    };
  }

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
    categoryName: string,
  ): VocabularyFilterCondition {
    switch (filterType) {
      case VocabularyFilterType.DUE_BY_SPACED_REPETITION:
        return {
          filterBy: 'VocabularyDueType',
          setId: this.setStore.existingCurrentSetId,
          dueType: VocabularyDueType.DUE_BY_SPACED_REPETITION,
          initialInterval: this.spacedRepetitionSettingsDelegate.getCurrentSettings()
            .initialInterval,
          categoryNames: [categoryName],
        };

      case VocabularyFilterType.DUE_BY_WRITING:
        return {
          filterBy: 'VocabularyDueType',
          setId: this.setStore.existingCurrentSetId,
          dueType: VocabularyDueType.DUE_BY_WRITING,
          initialInterval: this.writingSettingsDelegate.getCurrentSettings()
            .initialInterval,
          categoryNames: [categoryName],
        };

      case VocabularyFilterType.ACTIVE:
        return {
          filterBy: 'VocabularyStatus',
          setId: this.setStore.existingCurrentSetId,
          vocabularyStatus: VocabularyStatus.ACTIVE,
          categoryNames: [categoryName],
        };

      case VocabularyFilterType.ARCHIVED:
        return {
          filterBy: 'VocabularyStatus',
          setId: this.setStore.existingCurrentSetId,
          vocabularyStatus: VocabularyStatus.ARCHIVED,
          categoryNames: [categoryName],
        };

      case VocabularyFilterType.DELETED:
        return {
          filterBy: 'VocabularyStatus',
          setId: this.setStore.existingCurrentSetId,
          vocabularyStatus: VocabularyStatus.DELETED,
          categoryNames: [categoryName],
        };
    }
  }

  public showBulkEditingDialog(): void {
    this.dialogDelegate.show({
      message: 'Editing',
    });
  }
}
