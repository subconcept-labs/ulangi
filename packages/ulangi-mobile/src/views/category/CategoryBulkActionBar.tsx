/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize } from '@ulangi/ulangi-common/enums';
import { ObservableCategoryListState } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { config } from '../../constants/config';
import { CategoryBulkActionBarIds } from '../../constants/ids/CategoryBulkActionBarIds';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';

export interface CategoryBulkActionBarProps {
  categoryListState: ObservableCategoryListState;
  clearSelections: () => void;
  showCategoryBulkActionMenu: () => void;
}

@observer
export class CategoryBulkActionBar extends React.Component<
  CategoryBulkActionBarProps
> {
  public render(): null | React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <DefaultText style={styles.selection_text} numberOfLines={1}>
          <DefaultText style={styles.number_of_selected}>
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
        <View style={styles.buttons}>
          <View style={styles.button_container}>
            <DefaultButton
              testID={CategoryBulkActionBarIds.CLEAR_BTN}
              text="CLEAR"
              styles={FullRoundedButtonStyle.getFullBackgroundStyles(
                ButtonSize.SMALL,
                'white',
                config.styles.darkPrimaryColor
              )}
              onPress={this.props.clearSelections}
            />
          </View>
          <View style={styles.button_container}>
            <DefaultButton
              testID={CategoryBulkActionBarIds.BULK_ACTION_BTN}
              text="ACTION"
              styles={FullRoundedButtonStyle.getFullBackgroundStyles(
                ButtonSize.SMALL,
                'white',
                config.styles.darkPrimaryColor
              )}
              onPress={this.props.showCategoryBulkActionMenu}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    backgroundColor: config.styles.primaryColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  selection_text: {
    flexShrink: 1,
    fontSize: 15,
    color: 'white',
  },

  number_of_selected: {
    fontWeight: 'bold',
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button_container: {
    paddingLeft: 12,
  },
});
