/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { ObservableCategory } from '@ulangi/ulangi-observable';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { Spinner } from '../common/Spinner';
import { LevelBar } from '../level/LevelBar';
import {
  BottomContainer,
  CategoryName,
  Count,
  FirstRightItem,
  ItemContainer,
  LeftContainer,
  NotApplicable,
  ProgressContainer,
  ProgressText,
  ReviewButton,
  RightCaret,
  RightContainer,
  RightItem,
  StatsContainer,
  Terms,
  TopContainer,
} from './CategoryItem.style';
import { DueAndNewCount } from './DueAndNewCount';
import { CategoryActionMenuButton } from "./CategoryActionMenuButton"
import Checkbox from '@material-ui/core/Checkbox';

export interface CategoryItemProps {
  category: ObservableCategory;
  selectedVocabularyStatus: IObservableValue<VocabularyStatus>;
  isSelectionModeOn?: IObservableValue<boolean>;
  showLevelBreakdownForSR: (category: ObservableCategory) => void;
  showLevelBreakdownForWR: (category: ObservableCategory) => void;
  shouldShowLevelProgressForSR: boolean;
  shouldShowLevelProgressForWR: boolean;

  setSelection: (categoryName: string, selection: boolean) => void;
  viewDetail: (category: ObservableCategory, vocabularyStatus: VocabularyStatus) => void;
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

@observer
export class CategoryItem extends React.Component<CategoryItemProps> {
  public render(): React.ReactElement<any> {
    const category = this.props.category
    const vocabularyStatus = this.props.selectedVocabularyStatus.get()

    return (
      <ItemContainer>
        <TopContainer>
          <LeftContainer>
            <CategoryName>{category.categoryName}</CategoryName>
          </LeftContainer>
          <RightContainer>
            <FirstRightItem>
              <Count onClick={(): void => this.props.viewDetail(category, vocabularyStatus)}>
                {category.totalCount}
              </Count>
              <Terms>
                {
                  config.vocabulary.statusMap[
                    this.props.selectedVocabularyStatus.get()
                  ].shortName
                }
              </Terms>
            </FirstRightItem>
            <RightItem>{this.renderRightButton()}</RightItem>
          </RightContainer>
        </TopContainer>
        <BottomContainer>
          {this.props.shouldShowLevelProgressForSR === true
            ? this.renderLevelProgress(
                'Spaced Repetition',
                category.totalCount,
                category.srLevel0Count,
                category.srLevel1To3Count,
                category.srLevel4To6Count,
                category.srLevel7To8Count,
                category.srLevel9To10Count,
                this.props.showLevelBreakdownForSR,
                (): void => this.props.reviewBySpacedRepetition([category.categoryName]),
                category.spacedRepetitionCounts,
              )
            : null}
          {this.props.shouldShowLevelProgressForWR === true
            ? this.renderLevelProgress(
                'Writing',
                category.totalCount,
                category.wrLevel0Count,
                category.wrLevel1To3Count,
                category.wrLevel4To6Count,
                category.wrLevel7To8Count,
                category.wrLevel9To10Count,
                this.props.showLevelBreakdownForWR,
                (): void => this.props.reviewByWriting([category.categoryName]),
                category.writingCounts,
              )
            : null}
        </BottomContainer>
      </ItemContainer>
    );
  }

  private renderLevelProgress(
    label: string,
    totalCount: number,
    level0Count: number,
    level1To3Count: number,
    level4To6Count: number,
    level7To8Count: number,
    level9To10Count: number,
    showLevelBreakdown: (category: ObservableCategory) => void,
    startReview: undefined | (() => void),
    counts: undefined | { due: number; new: number },
  ): React.ReactElement<any> {
    return (
      <StatsContainer>
        <ProgressContainer
          onClick={(): void => showLevelBreakdown(this.props.category)}>
          <ProgressText>{label}</ProgressText>
          <LevelBar
            percentages={[
              level0Count / totalCount,
              level1To3Count / totalCount,
              level4To6Count / totalCount,
              level7To8Count / totalCount,
              level9To10Count / totalCount,
            ]}
          />
        </ProgressContainer>
        {this.renderDueAndNewCount(startReview, counts)}
      </StatsContainer>
    );
  }

  private renderDueAndNewCount(
    startReview: undefined | (() => void),
    counts:
      | undefined
      | {
          due: number;
          new: number;
        },
  ): React.ReactElement {
    return (
      <ReviewButton
        disabled={typeof startReview === 'undefined'}
        onClick={startReview}>
        {this.props.selectedVocabularyStatus.get() !==
        VocabularyStatus.ACTIVE ? (
          <NotApplicable>N/A</NotApplicable>
        ) : typeof counts !== 'undefined' ? (
          <>
            <DueAndNewCount counts={counts} />
            <RightCaret src={Images.CARET_RIGHT_GREY_18X18} />
          </>
        ) : (
          <Spinner size="small" />
        )}
      </ReviewButton>
    );
  }

  private renderRightButton(): React.ReactElement<any> {
    const category = this.props.category
    const vocabularyStatus = this.props.selectedVocabularyStatus.get()

    if (
      typeof this.props.isSelectionModeOn !== 'undefined' &&
      this.props.isSelectionModeOn.get() === true
    ) {
      return (
        <Checkbox
          checked={category.isSelected.get()}
          icon={<img src={Images.CIRCLE_UNCHECKED_GREY_24X24} />}
          checkedIcon={<img src={Images.CIRCLE_CHECKED_PRIMARY_24X24} />}
          onChange={(event): void => {
            this.props.setSelection(
              category.categoryName,
              event.target.checked
            )
          }}
        />
      );
    } else {
      return (
        <CategoryActionMenuButton 
          category={category} 
          viewDetail={(): void => this.props.viewDetail(category, vocabularyStatus)}
          select={
            category.isSelected.get() === false
              ? (): void => this.props.setSelection(category.categoryName, true)
              : undefined
          }
          unselect={
            category.isSelected.get() === true
              ? (): void => this.props.setSelection(category.categoryName, false)
              : undefined
          }
          addTerms={(): void => this.props.addTerms(category.categoryName)}
          recategorize={(): void => this.props.recategorize([category.categoryName], vocabularyStatus)}
          move={(): void => this.props.move([category.categoryName], vocabularyStatus)}
          restore={
            vocabularyStatus !== VocabularyStatus.ACTIVE
              ? (): void => this.props.restore([category.categoryName], vocabularyStatus)
              : undefined
          }
          archive={
            vocabularyStatus !== VocabularyStatus.ARCHIVED
              ? (): void => this.props.archive([category.categoryName], vocabularyStatus)
              : undefined
          }
          delete={
            vocabularyStatus !== VocabularyStatus.DELETED
              ? (): void => this.props.delete([category.categoryName], vocabularyStatus)
              : undefined
          }
          reviewBySpacedRepetition={
            vocabularyStatus === VocabularyStatus.ACTIVE
              ? (): void => this.props.reviewBySpacedRepetition([category.categoryName])
              : undefined
          }
          reviewByWriting={
            vocabularyStatus === VocabularyStatus.ACTIVE
              ? (): void => this.props.reviewByWriting([category.categoryName])
              : undefined
          }
        />
      );
    }
  }
}
