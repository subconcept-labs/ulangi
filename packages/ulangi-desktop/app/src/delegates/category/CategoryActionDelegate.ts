import { VocabularyStatus, ScreenName } from "@ulangi/ulangi-common/enums"
import { NavigatorDelegate } from "../navigator/NavigatorDelegate"
import { VocabularyFilterCondition } from "@ulangi/ulangi-common/types"
import { ObservableCategory } from "@ulangi/ulangi-observable"
import { DialogDelegate } from "../dialog/DialogDelegate"
import { CategorySelectionDelegate, VocabularyBulkEditDelegate } from "@ulangi/ulangi-delegate"
import { SetSelectionMenuDelegate } from "../set/SetSelectionMenuDelegate"
import { ObservableSetStore } from "@ulangi/ulangi-observable"

export class CategoryActionDelegate {

  private setStore: ObservableSetStore
  private categorySelectionDelegate: CategorySelectionDelegate
  private vocabularyBulkEditDelegate: VocabularyBulkEditDelegate
  private setSelectionMenuDelegate: SetSelectionMenuDelegate
  private dialogDelegate: DialogDelegate
  private navigatorDelegate: NavigatorDelegate

  public constructor(
    setStore: ObservableSetStore,
    categorySelectionDelegate: CategorySelectionDelegate,
    vocabularyBulkEditDelegate: VocabularyBulkEditDelegate,
    setSelectionMenuDelegate: SetSelectionMenuDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate
  ) {
    this.setStore = setStore
    this.categorySelectionDelegate = categorySelectionDelegate
    this.vocabularyBulkEditDelegate = vocabularyBulkEditDelegate
    this.setSelectionMenuDelegate = setSelectionMenuDelegate
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate
  }

  public setSelection(categoryName: string, selection: boolean): void {
    this.categorySelectionDelegate.setSelection(categoryName, selection);
  }

  public clearSelections(): void {
    this.categorySelectionDelegate.clearSelections()
  }

  public selectAll(): void {
    this.categorySelectionDelegate.selectAll()
  }

  public viewDetail(
    category: ObservableCategory,
    selectedVocabularyStatus: VocabularyStatus,
  ): void {
    this.navigatorDelegate.push(ScreenName.CATEGORY_DETAIL_SCREEN, {
      selectedVocabularyStatus: selectedVocabularyStatus,
      category,
    });
  }

  public addTerms(categoryName: string): void {
    this.navigatorDelegate.push(ScreenName.ADD_VOCABULARY_SCREEN, {
      categoryName,
      closeOnSaveSucceeded: false,
    });
  }

  public recategorize(
    categoryNames: string[],
    vocabularyStatus: VocabularyStatus,
  ): void {
    this.navigatorDelegate.push(ScreenName.CATEGORY_SELECTOR_SCREEN, {
      screenTitle: 'Recategorize',
      onSelect: (newCategoryName): void => {
        this.vocabularyBulkEditDelegate.bulkEdit(
          this.generateCondition(vocabularyStatus, categoryNames),
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
      }
    })
  }

  public move(
    categoryNames: string[],
    vocabularyStatus: VocabularyStatus,
  ): void {
    this.setSelectionMenuDelegate.showActiveSets(
      (selectedSetId): void => {
        this.vocabularyBulkEditDelegate.bulkEdit(
          this.generateCondition(vocabularyStatus, categoryNames),
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
  }

  public restore(
    categoryNames: string[],
    vocabularyStatus: VocabularyStatus,
  ): void {
    this.vocabularyBulkEditDelegate.bulkEdit(
      this.generateCondition(vocabularyStatus, categoryNames),
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
  }

  public archive(
    categoryNames: string[],
    vocabularyStatus: VocabularyStatus,
  ): void {
    this.vocabularyBulkEditDelegate.bulkEdit(
      this.generateCondition(vocabularyStatus, categoryNames),
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
  }

  public delete(
    categoryNames: string[],
    vocabularyStatus: VocabularyStatus,
  ): void {
    this.vocabularyBulkEditDelegate.bulkEdit(
      this.generateCondition(vocabularyStatus, categoryNames),
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
  }

  public reviewBySpacedRepetition(categoryNames: string[]): void {
    this.navigatorDelegate.push(ScreenName.SPACED_REPETITION_SCREEN, {
      selectedCategoryNames: categoryNames,
    });
  }

  public reviewByWriting(categoryNames: string[]): void {
    this.navigatorDelegate.push(ScreenName.WRITING_SCREEN, {
      selectedCategoryNames: categoryNames,
    });
  }

  public quiz(categoryNames: string[]): void {
    this.navigatorDelegate.push(ScreenName.QUIZ_SCREEN, {
      selectedCategoryNames: categoryNames,
    });
  }

  public playReflex(categoryNames: string[]): void {
    this.navigatorDelegate.push(ScreenName.REFLEX_SCREEN, {
      selectedCategoryNames: categoryNames,
    });
  }

  public playAtom(categoryNames: string[]): void {
    this.navigatorDelegate.push(ScreenName.ATOM_SCREEN, {
      selectedCategoryNames: categoryNames,
    });
  }

  private generateCondition(
    vocabularyStatus: VocabularyStatus,
    categoryNames: string[],
  ): VocabularyFilterCondition {
    switch (vocabularyStatus) {
      case VocabularyStatus.ACTIVE:
        return {
          filterBy: 'VocabularyStatus',
          setId: this.setStore.existingCurrentSetId,
          vocabularyStatus: VocabularyStatus.ACTIVE,
          categoryNames,
        };

      case VocabularyStatus.ARCHIVED:
        return {
          filterBy: 'VocabularyStatus',
          setId: this.setStore.existingCurrentSetId,
          vocabularyStatus: VocabularyStatus.ARCHIVED,
          categoryNames,
        };

      case VocabularyStatus.DELETED:
        return {
          filterBy: 'VocabularyStatus',
          setId: this.setStore.existingCurrentSetId,
          vocabularyStatus: VocabularyStatus.DELETED,
          categoryNames,
        };
    }
  }
}
