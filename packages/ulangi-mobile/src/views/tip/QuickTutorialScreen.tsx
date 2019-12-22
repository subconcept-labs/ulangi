/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDarkModeStore,
  ObservableQuickTutorialScreen,
} from '@ulangi/ulangi-observable';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import * as React from 'react';
import {
  Image,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { config } from '../../constants/config';
import { QuickTutorialScreenIds } from '../../constants/ids/QuickTutorialScreenIds';
import { QuickTutorialScreenDelegate } from '../../delegates/tip/QuickTutorialScreenDelegate';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';

export interface QuickTutorialScreenProps {
  darkModeStore: ObservableDarkModeStore;
  observableScreen: ObservableQuickTutorialScreen;
  screenDelegate: QuickTutorialScreenDelegate;
}

@observer
export class QuickTutorialScreen extends React.Component<
  QuickTutorialScreenProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View
        onLayout={this.onLayout}
        style={styles.screen}
        testID={QuickTutorialScreenIds.SCREEN}
      >
        {typeof this.props.observableScreen.sliderHeight !== 'undefined' &&
        typeof this.props.observableScreen.sliderWidth !== 'undefined' ? (
          <React.Fragment>
            <Carousel
              layout={Platform.select({
                ios: 'stack',
                android: 'default',
              })}
              contentContainerCustomStyle={{
                height: this.props.observableScreen.sliderHeight,
              }}
              data={this.props.observableScreen.images}
              onSnapToItem={this.props.screenDelegate.setSlideIndex}
              renderItem={this.renderItem}
              sliderWidth={this.props.observableScreen.sliderWidth}
              itemWidth={this.props.observableScreen.imageWidth}
            />
            {Platform.select({
              ios: (
                <View style={styles.button_container}>
                  <DefaultButton
                    text="Close"
                    styles={FullRoundedButtonStyle.getFullGreyBackgroundStyles(
                      ButtonSize.NORMAL
                    )}
                    onPress={this.props.screenDelegate.back}
                  />
                </View>
              ),
              android: (
                <Pagination
                  containerStyle={styles.pagination}
                  activeDotIndex={this.props.observableScreen.currentIndex}
                  dotsLength={this.props.observableScreen.images.length}
                  dotColor={
                    this.props.darkModeStore.theme === Theme.LIGHT
                      ? config.styles.light.primaryTextColor
                      : config.styles.dark.primaryTextColor
                  }
                  inactiveDotColor={
                    this.props.darkModeStore.theme
                      ? config.styles.light.secondaryTextColor
                      : config.styles.dark.secondaryTextColor
                  }
                />
              ),
            })}
          </React.Fragment>
        ) : null}
      </View>
    );
  }

  @boundMethod
  private onLayout(e: LayoutChangeEvent): void {
    const { width, height } = e.nativeEvent.layout;
    this.props.screenDelegate.setSliderDimension(width, height - 50);
  }

  @boundMethod
  private renderItem({ item }: { item: any }): React.ReactElement<any> {
    return (
      <Image
        style={[
          styles.image,
          {
            height: this.props.observableScreen.imageHeight,
            width: this.props.observableScreen.imageWidth,
          },
        ]}
        source={item}
        resizeMode="contain"
      />
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },

  carousel: {
    alignItems: 'center',
  },

  pagination: {
    height: 50,
    paddingVertical: 0,
  },

  image: {},

  button_container: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
