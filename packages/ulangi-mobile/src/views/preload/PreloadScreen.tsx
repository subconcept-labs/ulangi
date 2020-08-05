/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservablePreloadScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ActivityIndicator } from 'react-native';

import { PreloadScreenIds } from '../../constants/ids/PreloadScreenIds';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import {
  PreloadScreenStyles,
  preloadScreenResponsiveStyles,
} from './PreloadScreen.style';

export interface PreloadScreenProps {
  observableScreen: ObservablePreloadScreen;
  themeStore: ObservableThemeStore;
  shouldRenderMessage: boolean;
}

@observer
export class PreloadScreen extends React.Component<PreloadScreenProps> {
  private get styles(): PreloadScreenStyles {
    return preloadScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={PreloadScreenIds.SCREEN}
        useSafeAreaView={true}
        observableScreen={this.props.observableScreen}>
        <ActivityIndicator color="white" />
        <DefaultText style={this.styles.message}>
          {this.props.shouldRenderMessage === true
            ? this.props.observableScreen.message
            : ''}
        </DefaultText>
      </Screen>
    );
  }
}
