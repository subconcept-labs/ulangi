/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { OptionsTopBarTitle } from '@ulangi/react-native-navigation';
import { CustomViewName, ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, Keyboard, TouchableOpacity, View } from 'react-native';

import { Container } from '../../Container';
import { Images } from '../../constants/Images';
import { DefaultText } from './DefaultText';
import {
  TouchableTitleStyles,
  darkStyles,
  lightStyles,
} from './TouchableTitle.style';

export interface TouchableTitlePassedProps {
  readonly screenName: ScreenName;
  readonly styles?: {
    readonly light: TouchableTitleStyles;
    readonly dark: TouchableTitleStyles;
  };
}

@observer
export class TouchableTitle extends Container<TouchableTitlePassedProps> {
  protected onThemeChanged(): void {
    _.noop();
  }

  public get styles(): TouchableTitleStyles {
    const light = this.props.passedProps.styles
      ? this.props.passedProps.styles.light
      : lightStyles;

    const dark = this.props.passedProps.styles
      ? this.props.passedProps.styles.dark
      : darkStyles;

    return this.props.rootStore.darkModeStore.theme === Theme.LIGHT
      ? light
      : dark;
  }

  public render(): null | React.ReactElement<any> {
    const observableScreen = this.props.observableScreenRegistry.getByScreenName(
      this.props.passedProps.screenName,
    );

    if (
      typeof observableScreen !== 'undefined' &&
      typeof observableScreen.screenTitle !== 'undefined'
    ) {
      const screenTitle = observableScreen.screenTitle;
      if (typeof screenTitle.onTitlePress !== 'undefined') {
        return (
          <TouchableOpacity
            testID={screenTitle.testID}
            style={this.styles.title_container}
            onPress={(): void => {
              Keyboard.dismiss();
              if (typeof screenTitle.onTitlePress !== 'undefined') {
                screenTitle.onTitlePress();
              }
            }}>
            {this.renderTitleContent(
              screenTitle.title,
              screenTitle.subtitle,
              screenTitle.icon,
            )}
          </TouchableOpacity>
        );
      } else {
        return (
          <View testID={screenTitle.testID} style={this.styles.title_container}>
            {this.renderTitleContent(
              screenTitle.title,
              screenTitle.subtitle,
              screenTitle.icon,
            )}
          </View>
        );
      }
    } else {
      return null;
    }
  }

  private renderTitleContent(
    title: undefined | string,
    subtitle: undefined | string,
    icon: undefined | any,
  ): null | React.ReactElement<any> {
    if (typeof title !== 'undefined') {
      return (
        <View style={this.styles.content_container}>
          {typeof icon !== 'undefined' ? (
            <Image style={this.styles.icon} source={icon} />
          ) : null}
          <DefaultText
            style={this.styles.title}
            allowFontScaling={false}
            numberOfLines={1}>
            {typeof subtitle !== 'undefined' ? subtitle : title}
          </DefaultText>
          <Image
            style={this.styles.caret}
            source={Images.CARET_DOWN_GREY_9X7}
          />
        </View>
      );
    } else {
      return null;
    }
  }
}

export function touchableTitle(
  screenName: ScreenName,
  styles?: {
    light: TouchableTitleStyles;
    dark: TouchableTitleStyles;
  },
): OptionsTopBarTitle {
  return {
    component: {
      name: CustomViewName.TOUCHABLE_TITLE,
      alignment: 'center',
      passProps: {
        get passedProps(): TouchableTitlePassedProps {
          return {
            screenName,
            styles,
          };
        },
      },
    },
  };
}
