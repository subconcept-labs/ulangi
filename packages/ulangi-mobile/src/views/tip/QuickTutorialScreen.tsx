/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableQuickTutorialScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, Platform, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { config } from '../../constants/config';
import { QuickTutorialScreenIds } from '../../constants/ids/QuickTutorialScreenIds';
import { QuickTutorialScreenDelegate } from '../../delegates/tip/QuickTutorialScreenDelegate';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import {
  QuickTutorialScreenStyles,
  quickTutorialScreenResponsiveStyles,
} from './QuickTutorialScreen.style';

export interface QuickTutorialScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableQuickTutorialScreen;
  screenDelegate: QuickTutorialScreenDelegate;
}

@observer
export class QuickTutorialScreen extends React.Component<
  QuickTutorialScreenProps
> {
  private get styles(): QuickTutorialScreenStyles {
    return quickTutorialScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    const windowWidth = this.props.observableScreen.screenLayout.width;

    return (
      <Screen
        style={this.styles.screen}
        testID={QuickTutorialScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        {windowWidth > 0 ? (
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
            <DefaultText style={this.styles.note}>
              Note: The tutorial above is for the mobile version. The layout of
              the tablet version is similar.
            </DefaultText>
            <View style={this.styles.button_container}>
              <DefaultButton
                text="Close"
                styles={fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
                  ButtonSize.NORMAL,
                  this.props.themeStore.theme,
                  this.props.observableScreen.screenLayout,
                )}
                onPress={this.props.screenDelegate.back}
              />
            </View>
          </React.Fragment>
        ) : null}
      </Screen>
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
