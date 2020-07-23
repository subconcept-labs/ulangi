/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableTopBarButton } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import {
  Image,
  Keyboard,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import { Container } from '../../Container';
import { Images } from '../../constants/Images';
import { DefaultText } from '../common/DefaultText';
import { TopBarStyles, darkStyles, lightStyles } from './TopBar.style';

export interface TopBarPassedProps {
  readonly screenName: ScreenName;
  readonly styles: {
    readonly light: TopBarStyles;
    readonly dark: TopBarStyles;
  };
}

@observer
export class TopBar extends Container<TopBarPassedProps> {
  protected onThemeChanged(): void {
    _.noop();
  }

  public get styles(): TopBarStyles {
    const light = this.props.passedProps.styles
      ? this.props.passedProps.styles.light
      : lightStyles;

    const dark = this.props.passedProps.styles
      ? this.props.passedProps.styles.dark
      : darkStyles;

    return this.props.rootStore.themeStore.theme === Theme.LIGHT ? light : dark;
  }

  public render(): null | React.ReactElement<any> {
    const observableScreen = this.props.observableScreenRegistry.getByScreenName(
      this.props.passedProps.screenName,
    );

    if (
      typeof observableScreen !== 'undefined' &&
      observableScreen.topBar !== null
    ) {
      const topBar = observableScreen.topBar;
      return (
        <Animatable.View
          style={this.styles.top_bar_container}
          animation={Platform.select({ ios: 'fadeIn', android: 'fadeIn' })}
          useNativeDriver
          duration={500}>
          <View style={this.styles.button_container}>
            {topBar.leftButton !== null
              ? this.renderButton(topBar.leftButton, 'left')
              : null}
          </View>
          <View style={this.styles.middle_container}>
            {topBar.kind === 'touchable'
              ? this.renderTouchable(
                  topBar.testID,
                  topBar.text,
                  topBar.icon,
                  topBar.onPress,
                )
              : this.renderTitle(topBar.title)}
          </View>
          <View style={this.styles.button_container}>
            {topBar.rightButton !== null
              ? this.renderButton(topBar.rightButton, 'right')
              : null}
          </View>
        </Animatable.View>
      );
    } else {
      return null;
    }
  }

  private renderButton(
    button: ObservableTopBarButton,
    side: 'left' | 'right',
  ): React.ReactElement<any> {
    return (
      <TouchableOpacity
        hitSlop={{ top: 16, bottom: 16, right: 16, left: 16 }}
        style={[
          this.styles.button,
          side === 'left' ? this.styles.left_button : this.styles.right_button,
          button.text !== null ? this.styles.button_text_container : null,
        ]}
        onPress={(): void => button.onPress()}>
        {button.text !== null ? (
          <DefaultText
            style={this.styles.button_text}
            allowFontScaling={false}
            numberOfLines={1}>
            {button.text}
          </DefaultText>
        ) : button.icon !== null ? (
          <Image
            style={this.styles.button_icon}
            source={
              this.props.rootStore.themeStore.theme === Theme.LIGHT
                ? button.icon.light
                : button.icon.dark
            }
          />
        ) : null}
      </TouchableOpacity>
    );
  }

  private renderTouchable(
    testID: string,
    title: string,
    icon: undefined | any,
    onPress: Function,
  ): React.ReactElement<any> {
    return (
      <TouchableOpacity
        hitSlop={{ top: 16, bottom: 16, right: 10, left: 10 }}
        testID={testID}
        style={this.styles.touchable}
        onPress={(): void => {
          Keyboard.dismiss();
          onPress();
        }}>
        {typeof icon !== 'undefined' ? (
          <Image style={this.styles.touchable_icon} source={icon} />
        ) : null}
        <DefaultText
          style={this.styles.touchable_text}
          allowFontScaling={false}
          numberOfLines={1}>
          {title}
        </DefaultText>
        <Image
          style={this.styles.touchable_caret}
          source={Images.CARET_DOWN_GREY_10X10}
        />
      </TouchableOpacity>
    );
  }

  private renderTitle(title: string): React.ReactElement<any> {
    return (
      <DefaultText
        style={this.styles.title}
        allowFontScaling={false}
        numberOfLines={1}>
        {title}
      </DefaultText>
    );
  }
}
