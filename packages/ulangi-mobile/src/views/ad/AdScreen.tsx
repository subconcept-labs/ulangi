/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize } from '@ulangi/ulangi-common/enums';
import {
  ObservableAdScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { AdScreenDelegate } from '../../delegates/ad/AdScreenDelegate';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { AdScreenStyles, adScreenResponsiveStyles } from './AdScreen.style';

export interface AdScreenProps {
  observableScreen: ObservableAdScreen;
  themeStore: ObservableThemeStore;
  screenDelegate: AdScreenDelegate;
}

@observer
export class AdScreen extends React.Component<AdScreenProps> {
  private get styles(): AdScreenStyles {
    return adScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        useSafeAreaView={true}
        observableScreen={this.props.observableScreen}>
        {this.props.observableScreen.closable === true
          ? this.renderCloseButton()
          : this.renderLoading()}
      </Screen>
    );
  }

  private renderCloseButton(): React.ReactElement<any> {
    return (
      <View style={this.styles.button_container}>
        <DefaultButton
          text="Close"
          styles={fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
            ButtonSize.LARGE,
            this.props.themeStore.theme,
            this.props.observableScreen.screenLayout,
          )}
          onPress={this.props.screenDelegate.back}
        />
      </View>
    );
  }

  private renderLoading(): React.ReactElement<any> {
    return (
      <React.Fragment>
        <ActivityIndicator />
        <DefaultText style={this.styles.text}>LOADING AD</DefaultText>
      </React.Fragment>
    );
  }
}
