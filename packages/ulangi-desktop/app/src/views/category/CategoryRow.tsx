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
import { Images } from "../../constants/Images"

import { config } from '../../constants/config';
import { Spinner } from '../common/Spinner';
import { LevelBar } from '../level/LevelBar';
import {
  ActionButtonContainer,
  SpacedRepetitionProgressContainer,
  WritingProgressContainer,
  CheckBoxContainer,
  CategoryName,
  CountContainer,
  Count,
  RowContainer,
  NotApplicable,
  ProgressContainer,
  ProgressText,
  DueAndNewCountContainer,
  StatsContainer,
  Terms,
  CategoryNameContainer,
} from './CategoryRow.style';
import { CategoryActionMenuButton } from "./CategoryActionMenuButton"
import { DueAndNewCount } from './DueAndNewCount';
import Checkbox from '@material-ui/core/Checkbox';

export interface CategoryRowProps {
  category: ObservableCategory;
  selectedVocabularyStatus: IObservableValue<VocabularyStatus>;
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
export class CategoryRow extends React.Component<CategoryRowProps> {
  public render(): React.ReactElement<any> {
    const category = this.props.category
    const vocabularyStatus = this.props.selectedVocabularyStatus.get()
    return (
      <RowContainer>
        <CheckBoxContainer>
          <Checkbox
            checked={category.isSelected.get()}
            icon={<img src={Images.CHECKBOX_UNCHECKED_GREY_18X18} />}
            checkedIcon={<img src={Images.CHECKBOX_CHECKED_PRIMARY_18X18} />}
            onChange={(event): void => {
              this.props.setSelection(
                category.categoryName,
                event.target.checked
              )
            }}
          />
        </CheckBoxContainer>
        <CategoryNameContainer
          onClick={(): void => this.props.viewDetail(category, vocabularyStatus) }>
            <CategoryName>{category.categoryName}</CategoryName>
        </CategoryNameContainer>
        <CountContainer>
          <Count>{category.totalCount}</Count>
          <Terms>
            {
              config.vocabulary.statusMap[
                this.props.selectedVocabularyStatus.get()
              ].shortName
            }
          </Terms>
        </CountContainer>
        <SpacedRepetitionProgressContainer>
          {this.props.shouldShowLevelProgressForSR === true
            ? this.renderLevelProgress(
                'Progress',
                this.props.category.totalCount,
                this.props.category.srLevel0Count,
                this.props.category.srLevel1To3Count,
                this.props.category.srLevel4To6Count,
                this.props.category.srLevel7To8Count,
                this.props.category.srLevel9To10Count,
                this.props.showLevelBreakdownForSR,
                (): void => this.props.reviewBySpacedRepetition([category.categoryName]),
                this.props.category.spacedRepetitionCounts,
              )
            : null}
        </SpacedRepetitionProgressContainer>
        <WritingProgressContainer>
          {this.props.shouldShowLevelProgressForWR === true
            ? this.renderLevelProgress(
                'Progress',
                this.props.category.totalCount,
                this.props.category.wrLevel0Count,
                this.props.category.wrLevel1To3Count,
                this.props.category.wrLevel4To6Count,
                this.props.category.wrLevel7To8Count,
                this.props.category.wrLevel9To10Count,
                this.props.showLevelBreakdownForWR,
                (): void => this.props.reviewByWriting([category.categoryName]),
                this.props.category.writingCounts,
              )
            : null}
        </WritingProgressContainer>
        <ActionButtonContainer>
          <CategoryActionMenuButton 
            category={this.props.category} 
            viewDetail={(): void => this.props.viewDetail(category, vocabularyStatus)}
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
        </ActionButtonContainer>
      </RowContainer>
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
      <DueAndNewCountContainer
        disabled={typeof startReview === 'undefined'}
        onClick={startReview}>
        {this.props.selectedVocabularyStatus.get() !==
        VocabularyStatus.ACTIVE ? (
          <NotApplicable>N/A</NotApplicable>
        ) : typeof counts !== 'undefined' ? (
          <DueAndNewCount counts={counts} />
        ) : (
          <Spinner size="small" />
        )}
      </DueAndNewCountContainer>
    );
  }
}
