/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableScreen,
  ObservableThemeStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { SecurityScreenIds } from '../../constants/ids/SecurityScreenIds';
import { SecurityScreenDelegate } from '../../delegates/account/SecurityScreenDelegate';
import { Screen } from '../common/Screen';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  SecurityScreenStyles,
  securityScreenResponsiveStyles,
} from './SecurityScreen.style';

export interface SecurityScreenProps {
  themeStore: ObservableThemeStore;
  userStore: ObservableUserStore;
  observableScreen: ObservableScreen;
  screenDelegate: SecurityScreenDelegate;
}

@observer
export class SecurityScreen extends React.Component<SecurityScreenProps> {
  private get styles(): SecurityScreenStyles {
    return securityScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={SecurityScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <View style={this.styles.section_list}>{this.renderSections()}</View>
      </Screen>
    );
  }

  private renderSections(): readonly React.ReactElement<any>[] {
    return [this.renderAccountSection()];
  }

  private renderAccountSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}
        key="ulangi-account"
        header="ULANGI ACCOUNT">
        <SectionRow
          testID={SecurityScreenIds.CHANGE_EMAIL_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          key="change-email"
          leftText="Change Email"
          rightText={this.props.userStore.existingCurrentUser.email}
          showArrow={true}
          shrink="right"
          onPress={this.props.screenDelegate.navigateToChangeEmailScreen}
        />
        <SectionRow
          testID={SecurityScreenIds.CHANGE_PASSWORD_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          key="change-password"
          leftText="Change Password"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToChangePasswordScreen}
        />
      </SectionGroup>
    );
  }
}
