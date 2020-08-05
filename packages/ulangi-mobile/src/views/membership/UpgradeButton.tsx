/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreenLayout,
  ObservableUpgradeButtonState,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  UpgradeButtonStyles,
  upgradeButtonResponsiveStyles,
} from './UpgradeButton.style';

export interface UpgradeButtonProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  upgradeButtonState: ObservableUpgradeButtonState;
}

@observer
export class UpgradeButton extends React.Component<UpgradeButtonProps> {
  private get styles(): UpgradeButtonStyles {
    return upgradeButtonResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <TouchableOpacity
        onPress={this.props.upgradeButtonState.onPress}
        style={this.styles.button_container}
        disabled={typeof this.props.upgradeButtonState.onPress === 'undefined'}>
        <View style={this.styles.text_container}>
          <DefaultText style={this.styles.text}>
            {this.props.upgradeButtonState.text}
          </DefaultText>
        </View>
        {typeof this.props.upgradeButtonState.price !== 'undefined' ? (
          <View style={this.styles.price_container}>
            <DefaultText style={this.styles.price}>
              {this.props.upgradeButtonState.price}
            </DefaultText>
            {typeof this.props.upgradeButtonState.currency !== 'undefined' ? (
              <DefaultText style={this.styles.currency}>
                {this.props.upgradeButtonState.currency}
              </DefaultText>
            ) : null}
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }
}
