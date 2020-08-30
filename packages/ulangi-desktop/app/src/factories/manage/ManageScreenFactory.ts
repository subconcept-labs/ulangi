import { ManageScreenDelegate } from '../../delegates/manage/ManageScreenDelegate';
import { ObservableManageScreen } from "@ulangi/ulangi-observable"
import { VocabularyBulkEditDelegate, CategorySelectionDelegate, CategoryListDelegate, WritingSettingsDelegate, SpacedRepetitionSettingsDelegate, SyncDelegate } from "@ulangi/ulangi-delegate"
import { CategoryActionDelegate } from "../../delegates/category/CategoryActionDelegate"
import { SetSelectionMenuDelegate } from "../../delegates/set/SetSelectionMenuDelegate"
import { ScreenFactory } from '../ScreenFactory';
import { LevelBreakdownDelegate } from "../../delegates/level/LevelBreakdownDelegate"
import { AutorunDelegate } from '../../delegates/autorun/AutorunDelegate';
import { config } from "../../constants/config"

export class ManageScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableManageScreen
  ): ManageScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate()

    const dialogDelegate = this.createDialogDelegate();

    const selectionMenuDelegate = this.createSelectionMenuDelegate()

    const levelBreakdownDelegate = new LevelBreakdownDelegate(
      navigatorDelegate
    )

    const spacedRepetitionSettingsDelegate = new SpacedRepetitionSettingsDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      config.spacedRepetition
    )

    const writingSettingsDelegate = new WritingSettingsDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      config.writing
    )

    const categoryListDelegate = new CategoryListDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.observableConverter,
      observableScreen.categoryListState,
      spacedRepetitionSettingsDelegate,
      writingSettingsDelegate
    )

    const setSelectionMenuDelegate = new SetSelectionMenuDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      selectionMenuDelegate,
      navigatorDelegate
    )

    const syncDelegate = new SyncDelegate(
      this.eventBus
    )

    const autorunDelegate = new AutorunDelegate(
      this.eventBus,
      this.observer,
      this.props.rootStore.userStore,
      syncDelegate,
      dialogDelegate,
      navigatorDelegate,
    );

    const categorySelectionDelegate = new CategorySelectionDelegate(
      observableScreen.categoryListState
    )

    const vocabularyBulkEditDelegate = new VocabularyBulkEditDelegate(
      this.eventBus
    )

    const categoryActionDelegate = new CategoryActionDelegate(
      this.props.rootStore.setStore,
      categorySelectionDelegate,
      vocabularyBulkEditDelegate,
      setSelectionMenuDelegate,
      dialogDelegate,
      navigatorDelegate
    );

    return new ManageScreenDelegate(
      this.eventBus,
      observableScreen,
      categoryListDelegate,
      categoryActionDelegate,
      setSelectionMenuDelegate,
      levelBreakdownDelegate,
      autorunDelegate
    );
  }
}
