/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import * as React from 'react';
import { Image, View, ViewProperties } from 'react-native';

import { Images } from '../../constants/Images';
import { DefaultText } from '../common/DefaultText';
import {
  LevelNetChangeStyles,
  levelNetChangeResponsiveStyles,
} from './LevelNetChange.style';

export interface LevelNetChangeProps extends ViewProperties {
  netChange: number;
  theme: Theme;
  screenLayout: ObservableScreenLayout;
}

export class LevelNetChange extends React.Component<LevelNetChangeProps> {
  private get styles(): LevelNetChangeStyles {
    return levelNetChangeResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={[this.styles.container, this.props.style]}>
        {this.renderContent()}
      </View>
    );
  }

  private renderContent(): React.ReactElement<any> {
    if (this.props.netChange >= 1) {
      return (
        <React.Fragment>
          <DefaultText style={this.styles.text_green}>(</DefaultText>
          <Image source={Images.ARROW_UP_GREEN_10X10} />
          <DefaultText style={this.styles.text_green}>
            {this.props.netChange}
          </DefaultText>
          <DefaultText style={this.styles.text_green}>)</DefaultText>
        </React.Fragment>
      );
    } else if (this.props.netChange === 0) {
      return (
        <DefaultText style={this.styles.text}>{`(${
          this.props.netChange
        })`}</DefaultText>
      );
    } else {
      return (
        <React.Fragment>
          <DefaultText style={this.styles.text_red}>(</DefaultText>
          <Image source={Images.ARROW_DOWN_RED_10X10} />
          <DefaultText style={this.styles.text_red}>
            {Math.abs(this.props.netChange)}
          </DefaultText>
          <DefaultText style={this.styles.text_red}>)</DefaultText>
        </React.Fragment>
      );
    }
  }
}
