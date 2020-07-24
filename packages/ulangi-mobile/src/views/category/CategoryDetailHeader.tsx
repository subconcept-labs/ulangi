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
  VocabularySortType,
} from '@ulangi/ulangi-common/enums';
import { ObservableCategory } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { config } from '../../constants/config';
import { CategoryDetailScreenIds } from '../../constants/ids/CategoryDetailScreenIds';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import {
  CategoryDetailHeaderStyles,
  darkStyles,
  lightStyles,
} from './CategoryDetailHeader.style';

export interface CategoryDetailHeaderProps {
  theme: Theme;
  category: ObservableCategory;
  selectedFilterType: IObservableValue<VocabularyFilterType>;
  selectedSortType: IObservableValue<VocabularySortType>;
  showVocabularySortMenu: () => void;
  showVocabularyFilterMenu: () => void;
  styles?: {
    light: CategoryDetailHeaderStyles;
    dark: CategoryDetailHeaderStyles;
  };
}

@observer
export class CategoryDetailHeader extends React.Component<
  CategoryDetailHeaderProps
> {
  public get styles(): CategoryDetailHeaderStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }
  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <TouchableOpacity
          testID={CategoryDetailScreenIds.SHOW_VOCABULARY_SORT_MENU_BTN}
          onPress={this.props.showVocabularySortMenu}
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
          style={this.styles.button}>
          <DefaultText
            ellipsizeMode="tail"
            numberOfLines={1}
            style={this.styles.button_text}>
            {_.upperFirst(
              config.category.sortMap[this.props.selectedSortType.get()].name,
            )}
          </DefaultText>
        </TouchableOpacity>
        <DefaultButton
          testID={CategoryDetailScreenIds.SHOW_VOCABULARY_FILTER_MENU_BTN}
          text={_.upperFirst(
            config.vocabulary.filterMap[this.props.selectedFilterType.get()]
              .shortName,
          )}
          onPress={this.props.showVocabularyFilterMenu}
          styles={FullRoundedButtonStyle.getOutlineStyles(
            ButtonSize.SMALL,
            this.getColorByStatus(this.props.selectedFilterType.get()),
          )}
        />
      </View>
    );
  }

  private getColorByStatus(selectedFilterType: VocabularyFilterType): string {
    return config.vocabulary.filterMap[selectedFilterType].textColor;
  }
}
