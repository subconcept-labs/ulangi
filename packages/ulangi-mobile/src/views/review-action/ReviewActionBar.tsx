/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableReviewActionBarState } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import { SmartScrollView } from '../common/SmartScrollView';
import {
  ReviewActionBarStyles,
  darkStyles,
  lightStyles,
} from './ReviewActionBar.style';

export interface ReviewActionBarProps {
  theme: Theme;
  reviewActionBarState: ObservableReviewActionBarState;
  styles?: {
    light: ReviewActionBarStyles;
    dark: ReviewActionBarStyles;
  };
}

@observer
export class ReviewActionBar extends React.Component<ReviewActionBarProps> {
  public get styles(): ReviewActionBarStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    const chunks = _.chunk(this.props.reviewActionBarState.buttons, 3);
    return (
      <View style={this.styles.container}>
        {chunks.length > 1 ? (
          <DefaultText style={this.styles.message}>
            Swipe for more actions
          </DefaultText>
        ) : null}
        <SmartScrollView
          scrollEventThrottle={16}
          pagingEnabled={false}
          decelerationRate="fast"
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          snapToAlignment="start"
          snapToInterval={Dimensions.get('window').width}>
          {chunks.map(
            (chunk, index): React.ReactElement<any> => {
              return (
                <View key={index} style={this.styles.page}>
                  {chunk.map(
                    (button): React.ReactElement<any> => {
                      const disabledStyle = button.disabled
                        ? { opacity: 0.3 }
                        : {};
                      return (
                        <TouchableOpacity
                          key={[button.title, button.subtitle || ''].join(',')}
                          testID={button.testID}
                          onPress={(): void => button.onPress(button)}
                          style={[this.styles.action_btn, disabledStyle]}
                          disabled={button.disabled}>
                          <View style={this.styles.icon_container}>
                            <Image
                              source={
                                this.props.theme === Theme.LIGHT
                                  ? button.icon.light
                                  : button.icon.dark
                              }
                            />
                          </View>
                          <DefaultText style={this.styles.action_title}>
                            {button.title}
                          </DefaultText>
                          <DefaultText
                            style={this.styles.action_subtitle}
                            numberOfLines={1}
                            ellipsizeMode="middle">
                            {button.subtitle}
                          </DefaultText>
                        </TouchableOpacity>
                      );
                    },
                  )}
                </View>
              );
            },
          )}
        </SmartScrollView>
      </View>
    );
  }
}
