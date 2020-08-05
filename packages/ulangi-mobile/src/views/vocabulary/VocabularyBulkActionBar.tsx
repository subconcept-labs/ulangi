/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreenLayout,
  ObservableVocabularyListState,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { config } from '../../constants/config';
import { VocabularyBulkActionBarIds } from '../../constants/ids/VocabularyBulkActionBarIds';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import {
  VocabularyBulkActionBarStyles,
  vocabularyBulkActionBarResponsiveStyles,
} from './VocabularyBulkActionBar.style';

export interface VocabularyBulkActionBarProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  vocabularyListState: ObservableVocabularyListState;
  clearSelections: () => void;
  showVocabularyBulkActionMenu: () => void;
}

@observer
export class VocabularyBulkActionBar extends React.Component<
  VocabularyBulkActionBarProps
> {
  private get styles(): VocabularyBulkActionBarStyles {
    return vocabularyBulkActionBarResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
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
            {this.props.vocabularyListState.numOfVocabularySelected}
          </DefaultText>
          <DefaultText> term(s) selected</DefaultText>
        </DefaultText>
        <View style={this.styles.buttons}>
          <View style={this.styles.button_container}>
            <DefaultButton
              testID={VocabularyBulkActionBarIds.CLEAR_BTN}
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
              testID={VocabularyBulkActionBarIds.BULK_ACTION_BTN}
              text="ACTION"
              styles={fullRoundedButtonStyles.getSolidBackgroundStyles(
                ButtonSize.SMALL,
                'white',
                config.styles.darkPrimaryColor,
                this.props.theme,
                this.props.screenLayout,
              )}
              onPress={this.props.showVocabularyBulkActionMenu}
            />
          </View>
        </View>
      </View>
    );
  }
}
