/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDarkModeScreen,
  ObservableDarkModeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Platform, View } from 'react-native';

import { DarkModeScreenIds } from '../../constants/ids/DarkModeScreenIds';
import { DarkModeScreenDelegate } from '../../delegates/dark-mode/DarkModeScreenDelegate';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  DarkModeScreenStyles,
  darkStyles,
  lightStyles,
} from './DarkModeScreen.style';

export interface DarkModeScreenProps {
  darkModeStore: ObservableDarkModeStore;
  observableScreen: ObservableDarkModeScreen;
  screenDelegate: DarkModeScreenDelegate;
}

@observer
export class DarkModeScreen extends React.Component<DarkModeScreenProps> {
  public get styles(): DarkModeScreenStyles {
    return this.props.darkModeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.screen} testID={DarkModeScreenIds.SCREEN}>
        {this.renderSection()}
      </View>
    );
  }

  private renderSection(): React.ReactElement<any> {
    return (
      <SectionGroup theme={this.props.darkModeStore.theme}>
        <SectionRow
          theme={this.props.darkModeStore.theme}
          leftText="Dark mode"
          customRight={
            <DefaultButton
              testID={DarkModeScreenIds.SHOW_DARK_MODE_SELECTION_MENU_BTN}
              text={this.props.observableScreen.settings.trigger}
              styles={FullRoundedButtonStyle.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
              )}
              onPress={this.props.screenDelegate.showDarkModeSelectionMenu}
            />
          }
          description={`Select 'System' to automatically adjust mode based on OS setting which is only available on ${
            Platform.OS === 'ios' ? 'iOS 13+' : 'Android 10+'
          }.`}
        />
      </SectionGroup>
    );
  }
}
