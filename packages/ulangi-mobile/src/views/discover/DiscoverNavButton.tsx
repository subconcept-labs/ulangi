/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import * as React from 'react';
import { TouchableOpacity } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  DiscoverNavButtonStyles,
  darkStyles,
  lightStyles,
} from './DiscoverNavButton.style';

export interface DiscoverNavButtonProps {
  theme: Theme;
  testID: string;
  isSelected: boolean;
  onPress: () => void;
  text: string;
  count: null | number;
  styles?: {
    light: DiscoverNavButtonStyles;
    dark: DiscoverNavButtonStyles;
  };
}

export class DiscoverNavButton extends React.Component<DiscoverNavButtonProps> {
  public get styles(): DiscoverNavButtonStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={[
          this.styles.touchable,
          this.props.isSelected ? this.styles.selected_touchable : null,
        ]}
        onPress={this.props.onPress}
      >
        <DefaultText
          style={[
            this.styles.text,
            this.props.isSelected ? this.styles.selected_text : null,
          ]}
        >
          {this.props.text}
        </DefaultText>
      </TouchableOpacity>
    );
  }
}
