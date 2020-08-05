/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableCategoryListState,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { config } from '../../constants/config';
import { CategoryBulkActionBarIds } from '../../constants/ids/CategoryBulkActionBarIds';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import {
  CategoryBulkActionBarStyles,
  categoryBulkActionBarResponsiveStyles,
} from './CategoryBulkActionBar.style';

export interface CategoryBulkActionBarProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  categoryListState: ObservableCategoryListState;
  clearSelections: () => void;
  showCategoryBulkActionMenu: () => void;
}

@observer
export class CategoryBulkActionBar extends React.Component<
  CategoryBulkActionBarProps
> {
  private get styles(): CategoryBulkActionBarStyles {
    return categoryBulkActionBarResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): null | React.ReactElement<any> {
    return (
      <View
        style={[
          this.styles.container,
          {
            width: this.props.screenLayout.width,
          },
        ]}>
        <DefaultText style={this.styles.selection_text} numberOfLines={1}>
          <DefaultText style={this.styles.number_of_selected}>
            {this.props.categoryListState.numOfCategoriesSelected}
          </DefaultText>
          <DefaultText>
            {' '}
            {this.props.categoryListState.numOfCategoriesSelected === 1
              ? 'category'
              : 'categories'}{' '}
            selected
          </DefaultText>
        </DefaultText>
        <View style={this.styles.buttons}>
          <View style={this.styles.button_container}>
            <DefaultButton
              testID={CategoryBulkActionBarIds.CLEAR_BTN}
              text="CLEAR"
              styles={fullRoundedButtonStyles.getSolidBackgroundStyles(
                ButtonSize.SMALL,
                'white',
                config.styles.darkPrimaryColor,
                this.props.theme,
                this.props.screenLayout,
              )}
              onPress={this.props.clearSelections}
            />
          </View>
          <View style={this.styles.button_container}>
            <DefaultButton
              testID={CategoryBulkActionBarIds.BULK_ACTION_BTN}
              text="ACTION"
              styles={fullRoundedButtonStyles.getSolidBackgroundStyles(
                ButtonSize.SMALL,
                'white',
                config.styles.darkPrimaryColor,
                this.props.theme,
                this.props.screenLayout,
              )}
              onPress={this.props.showCategoryBulkActionMenu}
            />
          </View>
        </View>
      </View>
    );
  }
}
