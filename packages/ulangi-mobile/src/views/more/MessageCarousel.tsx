/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableCarouselMessage,
  ObservableDimensions,
} from '@ulangi/ulangi-observable';
import { boundMethod } from 'autobind-decorator';
import { IObservableArray, IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { config } from '../../constants/config';
import { RoundedCornerButtonStyle } from '../../styles/RoundedCornerButtonStyle';
import { ls, ss } from '../../utils/responsive';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';

export interface MessageCarouselProps {
  theme: Theme;
  observableDimensions: ObservableDimensions;
  messages: IObservableArray<ObservableCarouselMessage>;
  currentMessageIndex: IObservableValue<number>;
}

@observer
export class MessageCarousel extends React.Component<MessageCarouselProps> {
  public render(): null | React.ReactElement<any> {
    if (this.props.messages.length > 0) {
      const windowWidth = this.props.observableDimensions.windowWidth;

      return (
        <View>
          <Carousel
            layout="default"
            data={this.props.messages}
            renderItem={this.renderItem}
            sliderWidth={windowWidth}
            itemWidth={windowWidth}
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

  @boundMethod
  private renderItem({
    item,
  }: {
    item: ObservableCarouselMessage;
  }): React.ReactElement<any> {
    return (
      <View
        style={[
          styles.item_container,
          {
            width: this.props.observableDimensions.windowWidth,
          },
        ]}>
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
    paddingHorizontal: ls(16),
    paddingTop: ss(16),
  },

  inner_container: {
    backgroundColor: '#777',
    borderRadius: ss(4),
    paddingHorizontal: ss(16),
    paddingVertical: ss(16),
  },

  title: {
    fontSize: ss(13),
    fontWeight: 'bold',
    color: '#ffffff85',
  },

  message: {
    paddingTop: ss(14),
    fontSize: ss(15),
    color: '#fff',
  },

  button_container: {
    marginTop: ss(16),
    marginBottom: ss(2),
  },

  pagination: {
    paddingTop: ss(20),
    paddingBottom: ss(10),
  },
});
