/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDimensions,
  ObservableQuickTutorialScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, Platform, SafeAreaView, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { config } from '../../constants/config';
import { QuickTutorialScreenIds } from '../../constants/ids/QuickTutorialScreenIds';
import { QuickTutorialScreenDelegate } from '../../delegates/tip/QuickTutorialScreenDelegate';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import {
  QuickTutorialScreenStyles,
  darkStyles,
  lightStyles,
} from './QuickTutorialScreen.style';

export interface QuickTutorialScreenProps {
  themeStore: ObservableThemeStore;
  observableDimensions: ObservableDimensions;
  observableScreen: ObservableQuickTutorialScreen;
  screenDelegate: QuickTutorialScreenDelegate;
}

@observer
export class QuickTutorialScreen extends React.Component<
  QuickTutorialScreenProps
> {
  private get styles(): QuickTutorialScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    const windowWidth = this.props.observableDimensions.windowWidth;

    return (
      <SafeAreaView
        style={this.styles.screen}
        testID={QuickTutorialScreenIds.SCREEN}>
        <React.Fragment>
          <Carousel
            layout={Platform.select({
              ios: 'stack',
              android: 'default',
            })}
            data={this.props.observableScreen.images}
            onSnapToItem={this.props.screenDelegate.setSlideIndex}
            renderItem={this.renderItem}
            sliderWidth={windowWidth}
            itemWidth={windowWidth}
          />
          <DefaultText style={this.styles.note}>
            Note: The tutorial above is for the mobile version. The layout of
            the tablet version is similar.
          </DefaultText>
          <Pagination
            containerStyle={this.styles.pagination}
            activeDotIndex={this.props.observableScreen.currentIndex}
            dotsLength={this.props.observableScreen.images.length}
            dotColor={
              this.props.themeStore.theme === Theme.LIGHT
                ? config.styles.light.primaryTextColor
                : config.styles.dark.primaryTextColor
            }
            inactiveDotColor={
              this.props.themeStore.theme
                ? config.styles.light.secondaryTextColor
                : config.styles.dark.secondaryTextColor
            }
          />
          <View style={this.styles.button_container}>
            <DefaultButton
              text="Close"
              styles={FullRoundedButtonStyle.getFullGreyBackgroundStyles(
                ButtonSize.NORMAL,
              )}
              onPress={this.props.screenDelegate.back}
            />
          </View>
        </React.Fragment>
      </SafeAreaView>
    );
  }

  @boundMethod
  private renderItem({ item }: { item: any }): React.ReactElement<any> {
    return (
      <View style={this.styles.image_container}>
        <Image style={this.styles.image} source={item} resizeMode="contain" />
      </View>
    );
  }
}
