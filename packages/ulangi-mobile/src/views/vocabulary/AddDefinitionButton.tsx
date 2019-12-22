/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TouchableOpacity } from 'react-native';

import { Images } from '../../constants/Images';
import {
  AddDefinitionButtonStyles,
  darkStyles,
  lightStyles,
} from './AddDefinitionButton.style';

export interface AddDefinitionButtonProps {
  theme: Theme;
  testID?: string;
  disabled?: boolean;
  onPress: () => void;
  styles?: {
    light: AddDefinitionButtonStyles;
    dark: AddDefinitionButtonStyles;
  };
}

@observer
export class AddDefinitionButton extends React.Component<
  AddDefinitionButtonProps
> {
  public get styles(): AddDefinitionButtonStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <TouchableOpacity
        testID={this.props.testID}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        onPress={this.props.onPress}
        style={this.styles.add_button}
        disabled={this.props.disabled}
      >
        <Image
          source={
            this.props.theme === Theme.LIGHT
              ? Images.ADD_BLACK_16X16
              : Images.ADD_MILK_16X16
          }
        />
      </TouchableOpacity>
    );
  }
}
