import { ObservableManageScreen, ObservableSetStore } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { ManageScreenDelegate } from '../../delegates/manage/ManageScreenDelegate';
import { CategoryList } from '../category/CategoryList';
import { VocabularyStatus } from "@ulangi/ulangi-common/enums";
import { CategoryTable } from '../category/CategoryTable';
import { TopBar } from '../common/TopBar';
import { SetSelectionButton } from '../set/SetSelectionButton';
import { AddButton } from './AddButton';
import { ManageBar } from './ManageBar';
import { Screen, EmptyContainer, EmptyText, BulkActionBarContainer } from './ManageScreen.style';
import { SearchButton } from './SearchButton';
import { SelectFilterType } from './SelectFilterType';
import { SelectSortType } from './SelectSortType';
import { SelectLayout } from './SelectLayout';
import { CategoryBulkActionBar } from "../category/CategoryBulkActionBar"

export interface ManageScreenProps {
  setStore: ObservableSetStore
  observableScreen: ObservableManageScreen;
  screenDelegate: ManageScreenDelegate;
}

@observer
export class ManageScreen extends React.Component<ManageScreenProps> {
  public render(): React.ReactElement {
    return (
      <Screen>
        {this.props.observableScreen.topBar !== null ? (
          <TopBar
            title={
              <SetSelectionButton 
                currentSetName={this.props.setStore.existingCurrentSet.setName}
                showMenu={this.props.screenDelegate.showSetSelectionMenu}
              />
            }
            leftButton={<SearchButton search={(): void => {}} />}
            rightButton={<AddButton add={(): void => {}} />}
          />
        ) : null}
        <ManageBar>
          <SelectLayout 
            selectedLayout={this.props.observableScreen.selectedLayout.get()} 
            selectLayout={this.props.screenDelegate.selectLayout}
          />
          <SelectSortType 
            selectedSortType={this.props.observableScreen.selectedSortType.get()} 
            selectSortType={this.props.screenDelegate.selectSortType}
          />
          <SelectFilterType 
            selectedFilterType={this.props.observableScreen.selectedVocabularyStatus.get()} 
            selectFilterType={this.props.screenDelegate.selectFilterType} 
          />
        </ManageBar>
        {this.renderBulkActionBar()}
        {this.renderCategoryList()}
      </Screen>
    );
  }

  private renderBulkActionBar(): null | React.ReactElement<any> {
    if (this.props.observableScreen.categoryListState.isSelectionModeOn.get()) {
      return (
        <BulkActionBarContainer>
          <CategoryBulkActionBar
            categoryListState={this.props.observableScreen.categoryListState}
            selectedVocabularyStatus={this.props.observableScreen.selectedVocabularyStatus.get()}
            clearSelections={this.props.screenDelegate.clearSelections}
            selectAll={this.props.screenDelegate.selectAll}
            recategorize={this.props.screenDelegate.recategorize}
            move={this.props.screenDelegate.move}
            restore={this.props.screenDelegate.restore}
            archive={this.props.screenDelegate.archive}
            delete={this.props.screenDelegate.delete}
            reviewBySpacedRepetition={this.props.screenDelegate.reviewBySpacedRepetition}
            reviewByWriting={this.props.screenDelegate.reviewByWriting}
            quiz={this.props.screenDelegate.quiz}
            playReflex={this.props.screenDelegate.playReflex}
            playAtom={this.props.screenDelegate.playAtom}
          />
        </BulkActionBarContainer>
      );
    } else {
      return null;
    }
  }

  private renderCategoryList(): React.ReactElement {
    if (
      this.props.observableScreen.categoryListState.categoryList !== null &&
      this.props.observableScreen.categoryListState.noMore === true &&
      this.props.observableScreen.categoryListState.categoryList.size === 0
    ) {
      return this.renderEmptyComponent();
    } else if (this.props.observableScreen.selectedLayout.get() === "table") {
      return (
        <CategoryTable
          categoryListState={this.props.observableScreen.categoryListState}
          selectedVocabularyStatus={
            this.props.observableScreen.selectedVocabularyStatus
          }
          fetchNext={this.props.screenDelegate.fetch}
          refresh={this.props.screenDelegate.refresh}
          showLevelBreakdownForSR={
            this.props.screenDelegate.showLevelBreakdownForSR
          }
          showLevelBreakdownForWR={
            this.props.screenDelegate.showLevelBreakdownForWR
          }
          shouldShowLevelProgressForSR={this.props.screenDelegate.shouldShowLevelProgressForSR()}
          shouldShowLevelProgressForWR={this.props.screenDelegate.shouldShowLevelProgressForWR()}

          viewDetail={this.props.screenDelegate.viewDetail}
          setSelection={this.props.screenDelegate.setSelection}
          selectAll={this.props.screenDelegate.selectAll}
          clearAll={this.props.screenDelegate.clearSelections}
          addTerms={this.props.screenDelegate.addTerms}
          recategorize={this.props.screenDelegate.recategorize}
          move={this.props.screenDelegate.move}
          restore={this.props.screenDelegate.restore}
          archive={this.props.screenDelegate.archive}
          delete={this.props.screenDelegate.delete}
          reviewBySpacedRepetition={this.props.screenDelegate.reviewBySpacedRepetition}
          reviewByWriting={this.props.screenDelegate.reviewByWriting}
          quiz={this.props.screenDelegate.quiz}
          playReflex={this.props.screenDelegate.playReflex}
          playAtom={this.props.screenDelegate.playAtom}
        />
      )
    } else {
      return (
        <CategoryList
          categoryListState={this.props.observableScreen.categoryListState}
          selectedVocabularyStatus={
            this.props.observableScreen.selectedVocabularyStatus
          }
          fetchNext={this.props.screenDelegate.fetch}
          refresh={this.props.screenDelegate.refresh}
          showLevelBreakdownForSR={
            this.props.screenDelegate.showLevelBreakdownForSR
          }
          showLevelBreakdownForWR={
            this.props.screenDelegate.showLevelBreakdownForWR
          }
          shouldShowLevelProgressForSR={this.props.screenDelegate.shouldShowLevelProgressForSR()}
          shouldShowLevelProgressForWR={this.props.screenDelegate.shouldShowLevelProgressForWR()}

          viewDetail={this.props.screenDelegate.viewDetail}
          setSelection={this.props.screenDelegate.setSelection}
          addTerms={this.props.screenDelegate.addTerms}
          recategorize={this.props.screenDelegate.recategorize}
          move={this.props.screenDelegate.move}
          restore={this.props.screenDelegate.restore}
          archive={this.props.screenDelegate.archive}
          delete={this.props.screenDelegate.delete}
          reviewBySpacedRepetition={this.props.screenDelegate.reviewBySpacedRepetition}
          reviewByWriting={this.props.screenDelegate.reviewByWriting}
          quiz={this.props.screenDelegate.quiz}
          playReflex={this.props.screenDelegate.playReflex}
          playAtom={this.props.screenDelegate.playAtom}
        />
      )
    }
  }

  private renderEmptyComponent(): React.ReactElement {
    return (
      <EmptyContainer>
        <EmptyText>
          {
          this.props.observableScreen.selectedVocabularyStatus.get() === VocabularyStatus.ACTIVE
            ? "Start collecting cards you want to memorize."
            : "Nothing here!"
          }
        </EmptyText>
      </EmptyContainer>
    )
  }
}
