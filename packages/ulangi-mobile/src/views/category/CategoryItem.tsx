/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme, VocabularyStatus } from '@ulangi/ulangi-common/enums';
import {
  ObservableCategory,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as numeral from 'numeral';
import * as React from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { CategoryItemIds } from '../../constants/ids/CategoryItemIds';
import { DefaultText } from '../common/DefaultText';
import { LevelBar } from '../level/LevelBar';
import {
  CategoryItemStyles,
  categoryItemResponsiveStyles,
} from './CategoryItem.style';

export interface CategoryItemProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  category: ObservableCategory;
  selectedVocabularyStatus: IObservableValue<VocabularyStatus>;
  isSelectionModeOn?: IObservableValue<boolean>;
  toggleSelection: (category: ObservableCategory) => void;
  showCategoryDetail: (
    category: ObservableCategory,
    vocabularyStatus: VocabularyStatus,
  ) => void;
  showCategoryActionMenu: (
    category: ObservableCategory,
    vocabularyStatus: VocabularyStatus,
  ) => void;
  reviewBySpacedRepetition: () => void;
  reviewByWriting: () => void;
  showLevelBreakdownForSR: (category: ObservableCategory) => void;
  showLevelBreakdownForWR: (category: ObservableCategory) => void;
  shouldShowLevelProgressForSR: boolean;
  shouldShowLevelProgressForWR: boolean;
  styles?: {
    light: CategoryItemStyles;
    dark: CategoryItemStyles;
  };
}

@observer
export class CategoryItem extends React.Component<CategoryItemProps> {
  private get styles(): CategoryItemStyles {
    return categoryItemResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.item_container}>
        <TouchableOpacity
          testID={CategoryItemIds.VIEW_DETAIL_BTN_BY_CATEGORY_NAME(
            this.props.category.categoryName,
          )}
          style={this.styles.top_container}
          onPress={(): void =>
            this.props.showCategoryDetail(
              this.props.category,
              this.props.selectedVocabularyStatus.get(),
            )
          }>
          <View style={this.styles.left}>
            <DefaultText style={this.styles.category_name}>
              {this.props.category.categoryName}
            </DefaultText>
            <DefaultText style={this.styles.category_meta}>
              Category
            </DefaultText>
          </View>
          <View style={this.styles.right}>
            <View
              style={[this.styles.right_item, this.styles.first_right_item]}>
              <DefaultText style={this.styles.count}>
                {this.props.category.totalCount}
              </DefaultText>
              <DefaultText style={this.styles.terms}>
                {this.props.selectedVocabularyStatus
                  ? config.vocabulary.statusMap[
                      this.props.selectedVocabularyStatus.get()
                    ].shortName
                  : 'Terms'}
              </DefaultText>
            </View>
            <View style={this.styles.right_item}>
              {this.renderRightButton()}
            </View>
          </View>
        </TouchableOpacity>
        <View style={this.styles.bottom_container}>
          {this.props.shouldShowLevelProgressForSR === true
            ? this.renderLevelProgress(
                'Spaced Repetition',
                this.props.category.totalCount,
                this.props.category.srLevel0Count,
                this.props.category.srLevel1To3Count,
                this.props.category.srLevel4To6Count,
                this.props.category.srLevel7To8Count,
                this.props.category.srLevel9To10Count,
                this.props.showLevelBreakdownForSR,
                this.props.reviewBySpacedRepetition,
                this.props.category.spacedRepetitionCounts,
              )
            : null}
          {this.props.shouldShowLevelProgressForWR === true
            ? this.renderLevelProgress(
                'Writing',
                this.props.category.totalCount,
                this.props.category.wrLevel0Count,
                this.props.category.wrLevel1To3Count,
                this.props.category.wrLevel4To6Count,
                this.props.category.wrLevel7To8Count,
                this.props.category.wrLevel9To10Count,
                this.props.showLevelBreakdownForWR,
                this.props.reviewByWriting,
                this.props.category.writingCounts,
              )
            : null}
        </View>
      </View>
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
    startReview: () => void,
    counts: undefined | { due: number; new: number },
  ): React.ReactElement<any> {
    return (
      <View style={this.styles.stats_container}>
        <TouchableOpacity
          style={this.styles.progress_container}
          onPress={(): void => showLevelBreakdown(this.props.category)}>
          <DefaultText style={this.styles.progress_text}>{label}</DefaultText>
          <LevelBar
            theme={this.props.theme}
            screenLayout={this.props.screenLayout}
            percentages={[
              level0Count / totalCount,
              level1To3Count / totalCount,
              level4To6Count / totalCount,
              level7To8Count / totalCount,
              level9To10Count / totalCount,
            ]}
          />
        </TouchableOpacity>
        {this.renderDueAndNewCount(startReview, counts)}
      </View>
    );
  }

  private renderDueAndNewCount(
    startReview: () => void,
    counts:
      | undefined
      | {
          due: number;
          new: number;
        },
  ): React.ReactElement<any> {
    return (
      <TouchableOpacity
        style={this.styles.review_btn}
        disabled={
          this.props.selectedVocabularyStatus.get() !== VocabularyStatus.ACTIVE
        }
        onPress={startReview}>
        {this.props.selectedVocabularyStatus.get() !==
        VocabularyStatus.ACTIVE ? (
          <DefaultText style={this.styles.not_applicable}>N/A</DefaultText>
        ) : typeof counts !== 'undefined' ? (
          <React.Fragment>
            <View style={this.styles.count_container}>
              <DefaultText
                style={[
                  this.styles.due_new_count,
                  counts.due > 0 ? this.styles.highlighted_count : {},
                ]}
                numberOfLines={1}
                ellipsizeMode="clip">
                {numeral(counts.due).format('0a')} due
              </DefaultText>
              <DefaultText
                style={[
                  this.styles.due_new_count,
                  counts.new > 0 ? this.styles.highlighted_count : {},
                ]}
                numberOfLines={1}
                ellipsizeMode="clip">
                {numeral(counts.new).format('0a')} new
              </DefaultText>
            </View>
            <Image
              style={this.styles.caret}
              source={Images.CARET_RIGHT_GREY_18X18}
            />
          </React.Fragment>
        ) : (
          <ActivityIndicator size="small" />
        )}
      </TouchableOpacity>
    );
  }

  private renderRightButton(): React.ReactElement<any> {
    if (
      typeof this.props.isSelectionModeOn !== 'undefined' &&
      this.props.isSelectionModeOn.get() === true
    ) {
      return (
        <TouchableOpacity
          testID={
            this.props.category.isSelected.get()
              ? CategoryItemIds.UNSELECT_BTN_BY_CATEGORY_NAME(
                  this.props.category.categoryName,
                )
              : CategoryItemIds.SELECT_BTN_BY_CATEGORY_NAME(
                  this.props.category.categoryName,
                )
          }
          hitSlop={{ top: 22, bottom: 22, right: 16, left: 16 }}
          onPress={(): void => this.props.toggleSelection(this.props.category)}
          style={this.styles.action_btn}>
          {this.props.category.isSelected.get() === true ? (
            <Image source={Images.CHECK_BLUE_22X22} />
          ) : (
            <Image source={Images.UNCHECK_GREY_22X22} />
          )}
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          testID={CategoryItemIds.SHOW_ACTION_MENU_BTN_BY_CATEGORY_NAME(
            this.props.category.categoryName,
          )}
          style={this.styles.action_btn}
          hitSlop={{ top: 22, bottom: 22, right: 16, left: 16 }}
          onPress={(): void =>
            this.props.showCategoryActionMenu(
              this.props.category,
              this.props.selectedVocabularyStatus.get(),
            )
          }>
          <Image source={Images.HORIZONTAL_DOTS_GREY_22X22} />
        </TouchableOpacity>
      );
    }
  }
}
