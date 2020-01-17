/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableThemeScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Platform, View } from 'react-native';

import { ThemeScreenIds } from '../../constants/ids/ThemeScreenIds';
import { ThemeScreenDelegate } from '../../delegates/theme/ThemeScreenDelegate';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  ThemeScreenStyles,
  darkStyles,
  lightStyles,
} from './ThemeScreen.style';

export interface ThemeScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableThemeScreen;
  screenDelegate: ThemeScreenDelegate;
}

@observer
export class ThemeScreen extends React.Component<ThemeScreenProps> {
  public get styles(): ThemeScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.screen} testID={ThemeScreenIds.SCREEN}>
        {this.renderSection()}
      </View>
    );
  }

  private renderSection(): React.ReactElement<any> {
    return (
      <SectionGroup theme={this.props.themeStore.theme}>
        <SectionRow
          theme={this.props.themeStore.theme}
          leftText="Theme Mode"
          customRight={
            <DefaultButton
              testID={ThemeScreenIds.SHOW_THEME_SELECTION_MENU_BTN}
              text={this.props.observableScreen.settings.trigger}
              styles={FullRoundedButtonStyle.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
              )}
              onPress={this.props.screenDelegate.showThemeSelectionMenu}
            />
          }
          description={`Select 'System' to automatically adjust theme based on OS setting which is only available on ${
            Platform.OS === 'ios' ? 'iOS 13+' : 'Android 10+'
          }.`}
        />
      </SectionGroup>
    );
  }
}
