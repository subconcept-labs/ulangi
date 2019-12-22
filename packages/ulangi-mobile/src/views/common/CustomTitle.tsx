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
import { Keyboard, TouchableOpacity, View } from 'react-native';

import { Container } from '../../Container';
import {
  CustomTitleStyles,
  darkStyles,
  lightStyles,
} from './CustomTitle.styles';
import { DefaultText } from './DefaultText';

export interface CustomTitlePassedProps {
  readonly screenName: ScreenName;
  readonly styles?: {
    light: CustomTitleStyles;
    dark: CustomTitleStyles;
  };
}

@observer
export class CustomTitle extends Container<CustomTitlePassedProps> {
  protected onThemeChanged(): void {
    _.noop();
  }

  public get styles(): CustomTitleStyles {
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
      this.props.passedProps.screenName
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
            }}
          >
            {this.renderTitleContent(screenTitle.title, screenTitle.subtitle)}
          </TouchableOpacity>
        );
      } else {
        return (
          <View testID={screenTitle.testID} style={this.styles.title_container}>
            {this.renderTitleContent(screenTitle.title, screenTitle.subtitle)}
          </View>
        );
      }
    } else {
      return null;
    }
  }

  private renderTitleContent(
    title: undefined | string,
    subtitle: undefined | string
  ): null | React.ReactElement<any> {
    if (typeof title !== 'undefined') {
      return (
        <React.Fragment>
          <DefaultText
            style={this.styles.title}
            allowFontScaling={false}
            numberOfLines={1}
          >
            {title}
          </DefaultText>
          {typeof subtitle !== 'undefined' ? (
            <View style={this.styles.subtitle_container}>
              <DefaultText
                style={this.styles.subtitle}
                allowFontScaling={false}
                numberOfLines={1}
              >
                {subtitle}
              </DefaultText>
            </View>
          ) : null}
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

export function customTitle(
  screenName: ScreenName,
  styles?: {
    light: CustomTitleStyles;
    dark: CustomTitleStyles;
  }
): OptionsTopBarTitle {
  return {
    component: {
      name: CustomViewName.CUSTOM_TITLE,
      alignment: 'center',
      passProps: {
        get passedProps(): CustomTitlePassedProps {
          return {
            screenName,
            styles,
          };
        },
      },
    },
  };
}
