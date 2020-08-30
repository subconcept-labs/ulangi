/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyStatus } from '@ulangi/ulangi-common/enums';
import {
  ObservableCategory,
  ObservableCategoryListState,
} from '@ulangi/ulangi-observable';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { CategoryItem } from './CategoryItem';
import { List, SpinnerContainer, LoadMoreButtonContainer } from './CategoryList.style';
import { Spinner } from "../common/Spinner"
import { LoadMoreButton } from "./LoadMoreButton"
import InfiniteScroll from "react-infinite-scroll-component"

export interface CategoryListProps {
  categoryListState: ObservableCategoryListState;
  selectedVocabularyStatus: IObservableValue<VocabularyStatus>;
  showLevelBreakdownForSR: (category: ObservableCategory) => void;
  showLevelBreakdownForWR: (category: ObservableCategory) => void;
  shouldShowLevelProgressForSR: boolean;
  shouldShowLevelProgressForWR: boolean;
  refresh: () => void;
  fetchNext: () => void;

  viewDetail: (category: ObservableCategory, vocabularyStatus: VocabularyStatus) => void;
  setSelection: (categoryName: string, selection: boolean) => void;
  addTerms: (categoryName: string) => void;
  recategorize: (categoryNames: string[], vocabularyStatus: VocabularyStatus) => void;
  move: (categoryNames: string[], vocabularyStatus: VocabularyStatus) => void;
  restore: (categoryNames: string[], vocabularyStatus: VocabularyStatus) => void;
  archive: (categoryNames: string[], vocabularyStatus: VocabularyStatus) => void;
  delete: (categoryNames: string[], vocabularyStatus: VocabularyStatus) => void;
  reviewBySpacedRepetition: (categoryNames: string[]) => void;
  reviewByWriting: (categoryNames: string[]) => void;
  quiz: (categoryNames: string[]) => void;
  playReflex: (categoryNames: string[]) => void;
  playAtom: (categoryNames: string[]) => void;
}

export const CategoryList = observer(
  (props: CategoryListProps): React.ReactElement => {
    const categoryList = props.categoryListState.categoryList
      ? Array.from(props.categoryListState.categoryList)
      : [];

    return (
      <List id="category-list">
        <InfiniteScroll
          dataLength={categoryList.length}
          next={props.fetchNext}
          loader={ 
            <SpinnerContainer> <Spinner /> </SpinnerContainer>
          }
          hasMore={!props.categoryListState.noMore}
          scrollableTarget="category-list"
          style={{ 
            overflow: 'visible',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
        {categoryList.map(
          ([, category]): React.ReactElement => (
            <CategoryItem
              key={category.categoryName}
              category={category}
              selectedVocabularyStatus={props.selectedVocabularyStatus}
              isSelectionModeOn={props.categoryListState.isSelectionModeOn}
              showLevelBreakdownForSR={props.showLevelBreakdownForSR}
              showLevelBreakdownForWR={props.showLevelBreakdownForWR}
              shouldShowLevelProgressForSR={
                props.shouldShowLevelProgressForSR
              }
              shouldShowLevelProgressForWR={
                props.shouldShowLevelProgressForWR
              }

              viewDetail={props.viewDetail}
              setSelection={props.setSelection}
              addTerms={props.addTerms}
              recategorize={props.recategorize}
              move={props.move}
              restore={props.restore}
              archive={props.archive}
              delete={props.delete}
              reviewBySpacedRepetition={props.reviewBySpacedRepetition}
              reviewByWriting={props.reviewByWriting}
              quiz={props.quiz}
              playReflex={props.playReflex}
              playAtom={props.playAtom}
            />
          ),
        )}
        </InfiniteScroll>
        {
          props.categoryListState.noMore === false
          ? <LoadMoreButtonContainer>
              <LoadMoreButton fetchNext={props.fetchNext} />
            </LoadMoreButtonContainer>
          : null
        }
      </List>
    );
  },
);
