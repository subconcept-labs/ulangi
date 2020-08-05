/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TouchableOpacity } from 'react-native';

import { Images } from '../../constants/Images';
import {
  AddDefinitionButtonStyles,
  addDefinitionButtonResponsiveStyles,
} from './AddDefinitionButton.style';

export interface AddDefinitionButtonProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  testID?: string;
  disabled?: boolean;
  isAdded?: boolean;
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
  private get styles(): AddDefinitionButtonStyles {
    return addDefinitionButtonResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <TouchableOpacity
        testID={this.props.testID}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        onPress={this.props.onPress}
        style={this.styles.add_button}
        disabled={this.props.disabled}>
        <Image
          source={
            this.props.isAdded === true
              ? Images.CHECK_GREEN_14X14
              : this.props.theme === Theme.LIGHT
              ? Images.ADD_BLACK_16X16
              : Images.ADD_MILK_16X16
          }
        />
      </TouchableOpacity>
    );
  }
}
