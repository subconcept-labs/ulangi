/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize } from '@ulangi/ulangi-common/enums';
import { ObservableAdScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AdScreenDelegate } from '../../delegates/ad/AdScreenDelegate';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';

export interface AdScreenProps {
  observableScreen: ObservableAdScreen;
  screenDelegate: AdScreenDelegate;
}

@observer
export class AdScreen extends React.Component<AdScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.screen}>
        {this.props.observableScreen.closable === true
          ? this.renderCloseButton()
          : this.renderLoading()}
      </View>
    );
  }

  private renderCloseButton(): React.ReactElement<any> {
    return (
      <View style={styles.button_container}>
        <DefaultButton
          text="Close"
          styles={FullRoundedButtonStyle.getFullGreyBackgroundStyles(
            ButtonSize.LARGE,
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
        <DefaultText style={styles.text}>LOADING AD</DefaultText>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button_container: {
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },

  text: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    paddingTop: 10,
  },
});
