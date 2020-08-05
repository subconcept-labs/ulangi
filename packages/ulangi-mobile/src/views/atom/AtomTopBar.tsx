/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableAtomGameStats,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { DefaultText } from '../common/DefaultText';
import {
  AtomTopBarStyles,
  atomTopBarResponsiveStyles,
} from './AtomTopBar.style';

export interface AtomTopBarProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  iconTestID: string;
  iconType: 'back' | 'pause';
  gameStats?: ObservableAtomGameStats;
  onPress: () => void;
}

@observer
export class AtomTopBar extends React.Component<AtomTopBarProps> {
  private get styles(): AtomTopBarStyles {
    return atomTopBarResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  private renderIcon(): React.ReactElement<any> {
    if (this.props.iconType === 'pause') {
      return <Image source={Images.PAUSE_GREEN_22X22} />;
    } else {
      return <Image source={Images.ARROW_LEFT_GREEN_22X22} />;
    }
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <TouchableOpacity
          testID={this.props.iconTestID}
          hitSlop={{ top: 10, bottom: 10, left: 25, right: 25 }}
          style={this.styles.button}
          onPress={this.props.onPress}>
          {this.renderIcon()}
        </TouchableOpacity>
        {typeof this.props.gameStats !== 'undefined' ? (
          <View style={this.styles.score_container}>
            <DefaultText style={this.styles.score_text}>
              {this.props.gameStats.score}
            </DefaultText>
          </View>
        ) : null}
      </View>
    );
  }
}
