import { VocabularyStatus, CategorySortType } from '@ulangi/ulangi-common/enums';
import { on } from "@ulangi/ulangi-event";
import { ActionType } from "@ulangi/ulangi-action"
import { Category } from '@ulangi/ulangi-common/interfaces';
import { ObservableCategory } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { CategoryListDelegate } from "@ulangi/ulangi-delegate"
import { CategoryActionDelegate } from "../category/CategoryActionDelegate"
import { ObservableManageScreen } from "@ulangi/ulangi-observable"
import { SetSelectionMenuDelegate } from "../../delegates/set/SetSelectionMenuDelegate"
import { LevelBreakdownDelegate } from "../../delegates/level/LevelBreakdownDelegate"
import { AutorunDelegate } from "../../delegates/autorun/AutorunDelegate"
import { EventBus } from "@ulangi/ulangi-event"

@boundClass
export class ManageScreenDelegate {
  private eventBus: EventBus
  private observableScreen: ObservableManageScreen
  private categoryListDelegate: CategoryListDelegate
  private categoryActionDelegate: CategoryActionDelegate
  private setSelectionMenuDelegate: SetSelectionMenuDelegate
  private levelBreakdownDelegate: LevelBreakdownDelegate
  private autorunDelegate: AutorunDelegate

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableManageScreen,
    categoryListDelegate: CategoryListDelegate,
    categoryActionDelegate: CategoryActionDelegate,
    setSelectionMenuDelegate: SetSelectionMenuDelegate,
    levelBreakdownDelegate: LevelBreakdownDelegate,
    autorunDelegate: AutorunDelegate
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen
    this.categoryListDelegate = categoryListDelegate
    this.categoryActionDelegate = categoryActionDelegate
    this.setSelectionMenuDelegate = setSelectionMenuDelegate
    this.levelBreakdownDelegate = levelBreakdownDelegate
    this.autorunDelegate = autorunDelegate
  }

  public selectLayout(layout: 'table' | 'list'): void {
    this.observableScreen.selectedLayout.set(layout)
  }

  public selectSortType(sortType: CategorySortType): void {
    this.observableScreen.selectedSortType.set(sortType)
    this.refresh();
  }

  public selectFilterType(vocabularyStatus: VocabularyStatus): void {
    this.observableScreen.selectedVocabularyStatus.set(vocabularyStatus)
    this.refresh();
  }

  public prepareAndFetch(): void {
    this.categoryListDelegate.prepareAndFetch(
      this.observableScreen.selectedVocabularyStatus.get(),
      this.observableScreen.selectedSortType.get(),
    );
  }

  public fetch(): void {
    this.categoryListDelegate.fetch(
      this.observableScreen.selectedVocabularyStatus.get() ===
        VocabularyStatus.ACTIVE,
    );
  }

  public clearFetch(): void {
    this.categoryListDelegate.clearFetch();
  }

  public refresh(): void {
    this.categoryListDelegate.refresh(
      this.observableScreen.selectedVocabularyStatus.get(),
      this.observableScreen.selectedSortType.get(),
    );
  }

  public refreshIfEmpty(): void {
    this.categoryListDelegate.refreshIfEmpty(
      this.observableScreen.selectedVocabularyStatus.get(),
      this.observableScreen.selectedSortType.get(),
    );
  }

  public showSetSelectionMenu(): void {
    this.setSelectionMenuDelegate.showActiveSetsForSetSelection()
  }

  public showCategoryBulkActionMenu(): void {}

  public autoRefreshOnMultipleEdit(): void {
    this.eventBus.subscribe(
      on(
        [
          ActionType.VOCABULARY__ADD_MULTIPLE_SUCCEEDED,
          ActionType.VOCABULARY__EDIT_MULTIPLE_SUCCEEDED,
          ActionType.VOCABULARY__BULK_EDIT_SUCCEEDED,
        ],
        (): void => {
          this.refresh();
        },
      ),
    );
  }

  public autoShowRefreshNotice(): void {}

  public autoShowSyncingInProgress(): void {}

  public autoRefreshOnSetChange(): void {
    this.eventBus.subscribe(
      on(
        ActionType.SET__SELECT,
        (): void => {
          this.refresh();
        },
      ),
    );
  }

  public autoUpdateDueAndNewCounts(): void {
    this.categoryListDelegate.autoUpdateSpacedRepetitionDueAndNewCounts();
    this.categoryListDelegate.autoUpdateWritingDueAndNewCounts();
  }

  public showQuickTutorial(): void {}

  public goToAddVocabulary(): void {}

  public goToSearchVocabulary(): void {}

  public autorun(): void {
    this.autorunDelegate.autorun()
  }

  public showLevelBreakdownForSR(category: Category): void {
    this.levelBreakdownDelegate.show({
      totalCount: category.totalCount,
      level0Count: category.srLevel0Count,
      level1To3Count: category.srLevel1To3Count,
      level4To6Count: category.srLevel4To6Count,
      level7To8Count: category.srLevel7To8Count,
      level9To10Count: category.srLevel9To10Count,
    });
  }

  public showLevelBreakdownForWR(category: Category): void {
    this.levelBreakdownDelegate.show({
      totalCount: category.totalCount,
      level0Count: category.wrLevel0Count,
      level1To3Count: category.wrLevel1To3Count,
      level4To6Count: category.wrLevel4To6Count,
      level7To8Count: category.wrLevel7To8Count,
      level9To10Count: category.wrLevel9To10Count,
    });
  }

  public shouldShowLevelProgressForSR(): boolean {
    return true;
  }

  public shouldShowLevelProgressForWR(): boolean {
    return true;
  }

  public setSelection(categoryName: string, selection: boolean): void {
    this.categoryActionDelegate.setSelection(categoryName, selection)
  }

  public clearSelections(): void {
    this.categoryActionDelegate.clearSelections()
  }

  public selectAll(): void {
    this.categoryActionDelegate.selectAll()
  }

  public viewDetail(
    category: ObservableCategory,
    selectedVocabularyStatus: VocabularyStatus,
  ): void {
    this.categoryActionDelegate.viewDetail(category, selectedVocabularyStatus)
  }

  public addTerms(categoryName: string): void {
    this.categoryActionDelegate.addTerms(categoryName)
  }

  public recategorize(
    categoryNames: string[],
    vocabularyStatus: VocabularyStatus,
  ): void {
    this.categoryActionDelegate.recategorize(categoryNames, vocabularyStatus)
  }

  public move(
    categoryNames: string[],
    vocabularyStatus: VocabularyStatus,
  ): void {
    this.categoryActionDelegate.move(categoryNames, vocabularyStatus)
  }

  public restore(
    categoryNames: string[],
    vocabularyStatus: VocabularyStatus,
  ): void {
    this.categoryActionDelegate.restore(categoryNames, vocabularyStatus)
  }

  public archive(
    categoryNames: string[],
    vocabularyStatus: VocabularyStatus,
  ): void {
    this.categoryActionDelegate.archive(categoryNames, vocabularyStatus)
  }

  public delete(
    categoryNames: string[],
    vocabularyStatus: VocabularyStatus,
  ): void {
    this.categoryActionDelegate.delete(categoryNames, vocabularyStatus)
  }

  public reviewBySpacedRepetition(categoryNames: string[]): void {
    this.categoryActionDelegate.reviewBySpacedRepetition(categoryNames)
  }

  public reviewByWriting(categoryNames: string[]): void {
    this.categoryActionDelegate.reviewByWriting(categoryNames)
  }

  public quiz(categoryNames: string[]): void {
    this.categoryActionDelegate.quiz(categoryNames)
  }

  public playReflex(categoryNames: string[]): void {
    this.categoryActionDelegate.playReflex(categoryNames)
  }

  public playAtom(categoryNames: string[]): void {
    this.categoryActionDelegate.playAtom(categoryNames)
  }

}
