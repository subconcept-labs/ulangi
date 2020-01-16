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
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { config } from '../../constants/config';
import { QuickTutorialScreenIds } from '../../constants/ids/QuickTutorialScreenIds';
import { QuickTutorialScreenDelegate } from '../../delegates/tip/QuickTutorialScreenDelegate';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';

const screenWidth = Dimensions.get('window').width;

export interface QuickTutorialScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableQuickTutorialScreen;
  screenDelegate: QuickTutorialScreenDelegate;
}

@observer
export class QuickTutorialScreen extends React.Component<
  QuickTutorialScreenProps
> {
  public render(): React.ReactElement<any> {
    return (
      <SafeAreaView
        style={styles.screen}
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
            sliderWidth={screenWidth}
            itemWidth={screenWidth}
          />
          <Pagination
            containerStyle={styles.pagination}
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
          <View style={styles.button_container}>
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
      <View style={styles.image_container}>
        <Image style={styles.image} source={item} resizeMode="contain" />
      </View>
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

  image_container: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  image: {
    flexShrink: 1,
  },

  button_container: {
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
