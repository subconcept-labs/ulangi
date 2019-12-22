/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { SelectionItem } from '@ulangi/ulangi-common/interfaces';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { DefaultText } from '../common/DefaultText';
import {
  LightBoxSelectionItemStyles,
  darkStyles,
  lightStyles,
} from './LightBoxSelectionItem.style';

export interface LightBoxSelectionItemProps {
  theme: Theme;
  item: SelectionItem;
  isSelected: boolean;
  isLast: boolean;
}

@observer
export class LightBoxSelectionItem extends React.Component<
  LightBoxSelectionItemProps
> {
  public get styles(): LightBoxSelectionItemStyles {
    return this.props.theme === Theme.LIGHT ? lightStyles : darkStyles;
  }

  public render(): React.ReactElement<any> {
    const extra_style = this.props.isLast === true ? this.styles.last_item : {};
    return (
      <View style={[this.styles.item_container, extra_style]}>
        <TouchableOpacity
          testID={this.props.item.testID}
          style={this.styles.item_touchable}
          onPress={this.props.item.onPress}
        >
          {this.props.isSelected === true ? (
            <Image
              resizeMode="contain"
              style={this.styles.select_icon}
              source={Images.CHECK_BLUE_22X22}
            />
          ) : (
            <Image
              resizeMode="contain"
              style={this.styles.select_icon}
              source={Images.UNCHECK_GREY_22X22}
            />
          )}
          {typeof this.props.item.icon !== 'undefined' ? (
            <Image
              style={this.styles.item_icon}
              source={this.props.item.icon}
            />
          ) : null}
          <DefaultText
            style={[
              this.styles.text,
              this.props.item.textColor
                ? { color: this.props.item.textColor }
                : null,
            ]}
          >
            {this.props.item.text}
          </DefaultText>
        </TouchableOpacity>
      </View>
    );
  }
}
