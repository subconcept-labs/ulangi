/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize } from '@ulangi/ulangi-common/enums';
import {
  ObservableThemeScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Platform } from 'react-native';

import { ThemeScreenIds } from '../../constants/ids/ThemeScreenIds';
import { ThemeScreenDelegate } from '../../delegates/theme/ThemeScreenDelegate';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { Screen } from '../common/Screen';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  ThemeScreenStyles,
  themeScreenResponsiveStyles,
} from './ThemeScreen.style';

export interface ThemeScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableThemeScreen;
  screenDelegate: ThemeScreenDelegate;
}

@observer
export class ThemeScreen extends React.Component<ThemeScreenProps> {
  public get styles(): ThemeScreenStyles {
    return themeScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={ThemeScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        {this.renderSection()}
      </Screen>
    );
  }

  private renderSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}>
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Theme Mode"
          customRight={
            <DefaultButton
              testID={ThemeScreenIds.SHOW_THEME_SELECTION_MENU_BTN}
              text={this.props.observableScreen.settings.trigger}
              styles={fullRoundedButtonStyles.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
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
