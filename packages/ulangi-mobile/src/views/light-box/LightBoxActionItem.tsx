/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ActionItem } from '@ulangi/ulangi-common/interfaces';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  LightBoxActionItemStyles,
  darkStyles,
  lightStyles,
} from './LightBoxActionItem.style';

export interface LightBoxActionItemProps {
  theme: Theme;
  isLast: boolean;
  item: ActionItem;
}

export class LightBoxActionItem extends React.Component<
  LightBoxActionItemProps
> {
  public get styles(): LightBoxActionItemStyles {
    return this.props.theme === Theme.LIGHT ? lightStyles : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <View
        style={[
          this.styles.item_container,
          this.props.isLast ? this.styles.last_item_style : null,
        ]}>
        <TouchableOpacity
          testID={this.props.item.testID}
          style={this.styles.item_button}
          onPress={this.props.item.onPress}>
          <DefaultText
            style={[
              this.styles.item_text,
              this.props.item.textColor
                ? { color: this.props.item.textColor }
                : null,
            ]}>
            {this.props.item.text}
          </DefaultText>
        </TouchableOpacity>
      </View>
    );
  }
}
