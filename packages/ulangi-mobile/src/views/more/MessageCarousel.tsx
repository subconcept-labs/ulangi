/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableCarouselMessage } from '@ulangi/ulangi-observable';
import { IObservableArray, IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { config } from '../../constants/config';
import { RoundedCornerButtonStyle } from '../../styles/RoundedCornerButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';

const screenWidth = Dimensions.get('window').width;

export interface MessageCarouselProps {
  theme: Theme;
  messages: IObservableArray<ObservableCarouselMessage>;
  currentMessageIndex: IObservableValue<number>;
}

@observer
export class MessageCarousel extends React.Component<MessageCarouselProps> {
  public render(): null | React.ReactElement<any> {
    if (this.props.messages.length > 0) {
      return (
        <View>
          <Carousel
            layout="default"
            data={this.props.messages}
            renderItem={this.renderItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth}
            autoplay={true}
            onSnapToItem={(index): void =>
              this.props.currentMessageIndex.set(index)
            }
            autoplayInterval={5000}
            loop={true}
          />
          <Pagination
            containerStyle={styles.pagination}
            activeDotIndex={this.props.currentMessageIndex.get()}
            dotsLength={this.props.messages.length}
            dotColor={
              this.props.theme === Theme.LIGHT
                ? config.styles.light.primaryTextColor
                : config.styles.dark.primaryTextColor
            }
            inactiveDotColor={
              this.props.theme
                ? config.styles.light.secondaryTextColor
                : config.styles.dark.secondaryTextColor
            }
          />
        </View>
      );
    } else {
      return null;
    }
  }

  private renderItem({
    item,
  }: {
    item: ObservableCarouselMessage;
  }): React.ReactElement<any> {
    return (
      <View style={styles.item_container}>
        <View
          style={[
            styles.inner_container,
            { backgroundColor: item.backgroundColor },
          ]}>
          <DefaultText style={styles.title}>{item.title}</DefaultText>
          <DefaultText style={styles.message}>{item.message}</DefaultText>
          <View style={styles.button_container}>
            <DefaultButton
              text={item.buttonText}
              styles={RoundedCornerButtonStyle.getFullBackgroundStyles(
                ButtonSize.NORMAL,
                4,
                '#fff',
                item.buttonTextColor,
              )}
              onPress={item.onPress}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item_container: {
    width: screenWidth,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  inner_container: {
    backgroundColor: '#777',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff85',
  },

  message: {
    paddingTop: 14,
    fontSize: 15,
    color: '#fff',
  },

  button_container: {
    marginTop: 16,
    marginBottom: 2,
    flexDirection: 'row',
  },

  pagination: {
    paddingTop: 20,
    paddingBottom: 10,
  },
});
