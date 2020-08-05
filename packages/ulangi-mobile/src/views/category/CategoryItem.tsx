/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ButtonSize,
  Theme,
  VocabularyFilterType,
} from '@ulangi/ulangi-common/enums';
import {
  ObservableCategory,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { CategoryItemIds } from '../../constants/ids/CategoryItemIds';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
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
  selectedFilterType: IObservableValue<VocabularyFilterType>;
  isSelectionModeOn?: IObservableValue<boolean>;
  toggleSelection: (categoryName: string) => void;
  showCategoryDetail: (
    category: ObservableCategory,
    filterType: VocabularyFilterType,
  ) => void;
  showCategoryActionMenu: (
    category: ObservableCategory,
    filterType: VocabularyFilterType,
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
              this.props.selectedFilterType.get(),
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
                {this.props.selectedFilterType
                  ? config.vocabulary.filterMap[
                      this.props.selectedFilterType.get()
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
                'SR',
                this.props.category.totalCount,
                this.props.category.srLevel0Count,
                this.props.category.srLevel1To3Count,
                this.props.category.srLevel4To6Count,
                this.props.category.srLevel7To8Count,
                this.props.category.srLevel9To10Count,
                this.props.showLevelBreakdownForSR,
                this.props.reviewBySpacedRepetition,
              )
            : null}
          {this.props.shouldShowLevelProgressForWR === true
            ? this.renderLevelProgress(
                'WR',
                this.props.category.totalCount,
                this.props.category.wrLevel0Count,
                this.props.category.wrLevel1To3Count,
                this.props.category.wrLevel4To6Count,
                this.props.category.wrLevel7To8Count,
                this.props.category.wrLevel9To10Count,
                this.props.showLevelBreakdownForWR,
                this.props.reviewByWriting,
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
    review: () => void,
  ): React.ReactElement<any> {
    return (
      <TouchableOpacity
        style={this.styles.stats_container}
        onPress={(): void => showLevelBreakdown(this.props.category)}>
        <View style={this.styles.stats_label_container}>
          <DefaultText style={this.styles.stats_label}>{label}</DefaultText>
        </View>
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
        <View style={this.styles.review_btn_container}>
          <DefaultButton
            styles={
              this.props.theme === Theme.LIGHT
                ? fullRoundedButtonStyles.getGreyOutlineStyles(
                    ButtonSize.X_SMALL,
                    this.props.theme,
                    this.props.screenLayout,
                  )
                : fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
                    ButtonSize.X_SMALL,
                    this.props.theme,
                    this.props.screenLayout,
                  )
            }
            text="Review"
            onPress={review}
          />
        </View>
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
          onPress={(): void =>
            this.props.toggleSelection(this.props.category.categoryName)
          }
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
              this.props.selectedFilterType.get(),
            )
          }>
          <Image source={Images.HORIZONTAL_DOTS_GREY_22X22} />
        </TouchableOpacity>
      );
    }
  }
}
