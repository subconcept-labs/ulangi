/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableBrowserScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { BrowserScreenIds } from '../../constants/ids/BrowserScreenIds';
import { Screen } from '../common/Screen';
import {
  BrowserScreenStyles,
  browserScreenResponsiveStyles,
} from './BrowserScreen.style';

export interface BrowserScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableBrowserScreen;
}

@observer
export class BrowserScreen extends React.Component<BrowserScreenProps> {
  private get styles(): BrowserScreenStyles {
    return browserScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  @boundMethod
  private renderLoading(): React.ReactElement<any> {
    return (
      <View style={this.styles.loading_view}>
        <ActivityIndicator style={this.styles.spinner} size="small" />
      </View>
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={BrowserScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <WebView
          source={{ uri: this.props.observableScreen.link }}
          renderLoading={this.renderLoading}
          startInLoadingState={true}
        />
      </Screen>
    );
  }
}
