/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

import { env } from '../../constants/env';
import { PrivacyPolicyScreenIds } from '../../constants/ids/PrivacyPolicyScreenIds';
import { Screen } from '../common/Screen';
import {
  PrivacyPolicyScreenStyles,
  privacyPolicyScreenResponsiveStyles,
} from './PrivacyPolicyScreen.style';

export interface PrivacyPolicyScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableScreen;
}

@observer
export class PrivacyPolicyScreen extends React.Component<
  PrivacyPolicyScreenProps
> {
  private get styles(): PrivacyPolicyScreenStyles {
    return privacyPolicyScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  private renderLoading(): React.ReactElement<any> {
    return <ActivityIndicator style={this.styles.spinner} size="small" />;
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={PrivacyPolicyScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <WebView
          source={{ uri: env.PRIVACY_POLICY_URL }}
          renderLoading={this.renderLoading}
          startInLoadingState={true}
        />
      </Screen>
    );
  }
}
