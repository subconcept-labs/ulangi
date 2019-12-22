/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ReadonlyTuple } from '@ulangi/extended-types';
import { Theme, VocabularyFilterType } from '@ulangi/ulangi-common/enums';
import {
  ObservableCategory,
  ObservableCategoryListState,
} from '@ulangi/ulangi-observable';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { CategoryItem } from '../category/CategoryItem';
import { DefaultActivityIndicator } from '../common/DefaultActivityIndicator';
import { SynchronizableListHeader } from '../common/SynchronizableListHeader';

export interface CategoryListProps {
  testID: string;
  theme: Theme;
  categoryListState: ObservableCategoryListState;
  selectedFilterType: IObservableValue<VocabularyFilterType>;
  toggleSelection: (categoryName: string) => void;
  showCategoryDetail: (category: ObservableCategory) => void;
  showCategoryActionMenu: (
    category: ObservableCategory,
    filterType: VocabularyFilterType
  ) => void;
  goToSpacedRepetition: (selectedCategoryNames: string[]) => void;
  goToWriting: (selectedCategoryNames: string[]) => void;
  showLevelBreakdownForSR: (category: ObservableCategory) => void;
  showLevelBreakdownForWR: (category: ObservableCategory) => void;
  refresh: () => void;
  fetchNext: () => void;
  hideSyncingNotice?: boolean;
}

@observer
export class CategoryList extends React.Component<CategoryListProps> {
  public keyExtractor = (item: any): string => item[0];

  public render(): React.ReactElement<any> {
    return (
      <View style={styles.list_container}>
        <FlatList
          testID={this.props.testID}
          contentContainerStyle={styles.list}
          data={
            this.props.categoryListState.categoryList
              ? Array.from(this.props.categoryListState.categoryList)
              : []
          }
          renderItem={({
            item,
          }: {
            item: ReadonlyTuple<string, ObservableCategory>;
          }): React.ReactElement<any> => {
            const [, category] = item;
            return (
              <CategoryItem
                theme={this.props.theme}
                category={category}
                selectedFilterType={this.props.selectedFilterType}
                isSelectionModeOn={
                  this.props.categoryListState.isSelectionModeOn
                }
                toggleSelection={this.props.toggleSelection}
                showCategoryDetail={this.props.showCategoryDetail}
                showCategoryActionMenu={this.props.showCategoryActionMenu}
                reviewWithSpacedRepetition={(): void =>
                  this.props.goToSpacedRepetition([category.categoryName])
                }
                reviewWithWriting={(): void =>
                  this.props.goToWriting([category.categoryName])
                }
                showLevelBreakdownForSR={this.props.showLevelBreakdownForSR}
                showLevelBreakdownForWR={this.props.showLevelBreakdownForWR}
              />
            );
          }}
          keyExtractor={this.keyExtractor}
          onEndReachedThreshold={0.5}
          onEndReached={(): void => this.props.fetchNext()}
          onRefresh={this.props.refresh}
          refreshing={this.props.categoryListState.isRefreshing.get()}
          stickyHeaderIndices={this.props.hideSyncingNotice === true ? [] : [0]}
          ListHeaderComponent={
            this.props.hideSyncingNotice === true ? null : (
              <SynchronizableListHeader
                shouldShowSyncingNotice={
                  this.props.categoryListState.shouldShowSyncingNotice
                }
                shouldShowSyncCompletedNotice={
                  this.props.categoryListState.shouldShowSyncCompletedNotice
                }
                refresh={this.props.refresh}
              />
            )
          }
          ListFooterComponent={
            <DefaultActivityIndicator
              activityState={this.props.categoryListState.fetchState}
              isRefreshing={this.props.categoryListState.isRefreshing}
              size="small"
              style={styles.activity_indicator}
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  activity_indicator: {
    marginBottom: 16,
  },

  list_container: {
    flex: 1,
  },

  list: {
    paddingTop: 10,
    paddingBottom: 74,
  },
});
