/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ButtonSize,
  ManageListType,
  Theme,
  VocabularyFilterType,
} from '@ulangi/ulangi-common/enums';
import * as _ from 'lodash';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { config } from '../../constants/config';
import { ManageScreenIds } from '../../constants/ids/ManageScreenIds';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { TopBar } from '../common/TopBar';
import { ManageBarStyles, darkStyles, lightStyles } from './ManageBar.style';

export interface ManageBarProps {
  theme: Theme;
  manageListType: IObservableValue<ManageListType>;
  selectedFilterType: IObservableValue<VocabularyFilterType>;
  showManageListSelectionMenu: () => void;
  showVocabularyFilterMenu: () => void;
  styles?: {
    light: ManageBarStyles;
    dark: ManageBarStyles;
  };
}

@observer
export class ManageBar extends React.Component<ManageBarProps> {
  public get styles(): ManageBarStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <TopBar theme={this.props.theme}>
        <View style={this.styles.inner_container}>
          <TouchableOpacity
            testID={ManageScreenIds.SHOW_MANAGE_LIST_SELECTION_MENU_BTN}
            onPress={this.props.showManageListSelectionMenu}
            hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
            style={this.styles.button}>
            <DefaultText
              ellipsizeMode="tail"
              numberOfLines={1}
              style={this.styles.button_text}>
              {this.getTitle()}
            </DefaultText>
          </TouchableOpacity>
          <DefaultButton
            testID={ManageScreenIds.SHOW_VOCABULARY_FILTER_MENU_BTN}
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
      </TopBar>
    );
  }

  private getColorByStatus(selectedFilterType: VocabularyFilterType): string {
    return config.vocabulary.filterMap[selectedFilterType].textColor;
  }

  private getTitle(): string {
    if (this.props.manageListType.get() === ManageListType.CATEGORY_LIST) {
      return 'Group by category';
    } else {
      return 'Show all terms';
    }
  }
}
