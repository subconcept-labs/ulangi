/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import { TipBarStyles, darkStyles, lightStyles } from './TipBar.style';
import { TopBar } from './TopBar';

export interface TipBarProps {
  theme: Theme;
  navigateToWhatToUseScreen: () => void;
  styles?: {
    light: TipBarStyles;
    dark: TipBarStyles;
  };
}

export class TipBar extends React.Component<TipBarProps> {
  public get styles(): TipBarStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }
  public render(): React.ReactElement<any> {
    return (
      <TopBar theme={this.props.theme}>
        <View style={this.styles.inner_container}>
          <TouchableOpacity
            onPress={this.props.navigateToWhatToUseScreen}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            style={this.styles.button}>
            <DefaultText style={this.styles.button_text}>
              Tips on what to use
            </DefaultText>
          </TouchableOpacity>
        </View>
      </TopBar>
    );
  }
}
