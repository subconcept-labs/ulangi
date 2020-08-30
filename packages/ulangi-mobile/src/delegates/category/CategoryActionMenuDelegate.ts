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
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { SelectionItem } from '@ulangi/ulangi-common/interfaces';
import { VocabularyFilterCondition } from '@ulangi/ulangi-common/types';
import {
  CategorySelectionDelegate,
  VocabularyBulkEditDelegate,
} from '@ulangi/ulangi-delegate';
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

export class CategoryActionMenuDelegate {
  private setStore: ObservableSetStore;
  private observer: Observer;
  private observableLightBox: ObservableLightBox;
  private categorySelectionDelegate: undefined | CategorySelectionDelegate;
  private setSelectionMenuDelegate: SetSelectionMenuDelegate;
  private vocabularyBulkEditDelegate: VocabularyBulkEditDelegate;
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
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.styles = styles;
  }

  public show(
    category: ObservableCategory,
    vocabularyStatus: VocabularyStatus,
    options: {
      hideCategorizeButton: boolean;
      hideMoveButton: boolean;
      hideRestoreButton: boolean;
      hideArchiveButton: boolean;
      hideDeleteButton: boolean;
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
      items.push(this.getToggleSelectButton(category));
    }

    if (options.hideViewDetailButton === false) {
      items.push(this.getViewDetailButton(category, vocabularyStatus));
    }

    items.push(this.getAddTermsButton(category.categoryName));

    if (options.hideCategorizeButton === false) {
      items.push(
        this.getRecategorizeAllTermsButton(
          category.categoryName,
          vocabularyStatus,
        ),
      );
    }

    if (options.hideMoveButton === false) {
      items.push(
        this.getMoveAllTermsButton(category.categoryName, vocabularyStatus),
      );
    }

    switch (vocabularyStatus) {
      case VocabularyStatus.ACTIVE:
        if (options.hideArchiveButton === false) {
          items.push(
            this.getArchiveAllTermsButton(
              category.categoryName,
              vocabularyStatus,
            ),
          );
        }

        if (options.hideDeleteButton === false) {
          items.push(
            this.getDeleteAllTermsButton(
              category.categoryName,
              vocabularyStatus,
            ),
          );
        }
        break;

      case VocabularyStatus.ARCHIVED:
        if (options.hideRestoreButton === false) {
          items.push(
            this.getRestoreAllTermsButton(
              category.categoryName,
              vocabularyStatus,
            ),
          );
        }

        if (options.hideDeleteButton === false) {
          items.push(
            this.getDeleteAllTermsButton(
              category.categoryName,
              vocabularyStatus,
            ),
          );
        }
        break;

      case VocabularyStatus.DELETED:
        if (options.hideRestoreButton === false) {
          items.push(
            this.getRestoreAllTermsButton(
              category.categoryName,
              vocabularyStatus,
            ),
          );
        }

        if (options.hideArchiveButton === false) {
          items.push(
            this.getArchiveAllTermsButton(
              category.categoryName,
              vocabularyStatus,
            ),
          );
        }
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

  private getToggleSelectButton(category: ObservableCategory): SelectionItem {
    const categorySelectionDelegate = assertExists(
      this.categorySelectionDelegate,
      'categorySelectionDelegate is required to render toggle select button',
    );

    return {
      testID: CategoryActionMenuIds.TOGGLE_SELECT_BTN,
      text: category.isSelected.get() ? 'Unselect' : 'Select',
      onPress: (): void => {
        categorySelectionDelegate.setSelection(
          category.categoryName,
          !category.isSelected.get(),
        );

        this.navigatorDelegate.dismissLightBox();
      },
    };
  }

  private getViewDetailButton(
    category: ObservableCategory,
    selectedVocabularyStatus: VocabularyStatus,
  ): SelectionItem {
    return {
      testID: CategoryActionMenuIds.VIEW_DETAIL_BTN,
      text: 'View detail',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.CATEGORY_DETAIL_SCREEN, {
          selectedVocabularyStatus: selectedVocabularyStatus,
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
    vocabularyStatus: VocabularyStatus,
  ): SelectionItem {
    return {
      testID: CategoryActionMenuIds.RECATEGORIZE_TERMS_BTN,
      text: 'Recategorize/Rename',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.showModal(ScreenName.CATEGORY_SELECTOR_SCREEN, {
          screenTitle: 'Recategorize',
          initialCategoryName: categoryName,
          onSelect: (newCategoryName): void => {
            this.vocabularyBulkEditDelegate.bulkEdit(
              this.generateCondition(vocabularyStatus, categoryName),
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
    vocabularyStatus: VocabularyStatus,
  ): SelectionItem {
    return {
      testID: CategoryActionMenuIds.MOVE_TERMS_BTN,
      text: 'Move',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();

        this.observer.when(
          (): boolean =>
            this.observableLightBox.state === LightBoxState.UNMOUNTED,
          (): void => {
            this.setSelectionMenuDelegate.showActiveSets(
              (selectedSetId): void => {
                this.vocabularyBulkEditDelegate.bulkEdit(
                  this.generateCondition(vocabularyStatus, categoryName),
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
    vocabularyStatus: VocabularyStatus,
  ): SelectionItem {
    return {
      testID: CategoryActionMenuIds.RESTORE_TERMS_BTN,
      text: 'Restore',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.vocabularyBulkEditDelegate.bulkEdit(
          this.generateCondition(vocabularyStatus, categoryName),
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
    vocabularyStatus: VocabularyStatus,
  ): SelectionItem {
    return {
      testID: CategoryActionMenuIds.ARCHIVE_TERMS_BTN,
      text: 'Archive',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.vocabularyBulkEditDelegate.bulkEdit(
          this.generateCondition(vocabularyStatus, categoryName),
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
    vocabularyStatus: VocabularyStatus,
  ): SelectionItem {
    return {
      testID: CategoryActionMenuIds.ARCHIVE_TERMS_BTN,
      text: 'Delete',
      textColor: 'red',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();

        this.vocabularyBulkEditDelegate.bulkEdit(
          this.generateCondition(vocabularyStatus, categoryName),
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

  /*
  private getAdjectiveByVocabularyStatus(vocabularyStatus: VocabularyStatus): string {
    switch (vocabularyStatus) {
      case VocabularyStatus.ACTIVE:
        return 'active';

      case VocabularyStatus.ARCHIVED:
        return 'archived';

      case VocabularyStatus.DELETED:
        return 'archived';
    }
  }
  */

  private generateCondition(
    vocabularyStatus: VocabularyStatus,
    categoryName: string,
  ): VocabularyFilterCondition {
    switch (vocabularyStatus) {
      case VocabularyStatus.ACTIVE:
        return {
          filterBy: 'VocabularyStatus',
          setId: this.setStore.existingCurrentSetId,
          vocabularyStatus: VocabularyStatus.ACTIVE,
          categoryNames: [categoryName],
        };

      case VocabularyStatus.ARCHIVED:
        return {
          filterBy: 'VocabularyStatus',
          setId: this.setStore.existingCurrentSetId,
          vocabularyStatus: VocabularyStatus.ARCHIVED,
          categoryNames: [categoryName],
        };

      case VocabularyStatus.DELETED:
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
