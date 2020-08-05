/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableCarouselMessage,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { boundMethod } from 'autobind-decorator';
import { IObservableArray, IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { config } from '../../constants/config';
import { roundedCornerButtonStyles } from '../../styles/RoundedCornerButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import {
  MessageCarouselStyles,
  messageCarouselResponsiveStyles,
} from './MessageCarousel.style';

export interface MessageCarouselProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  messages: IObservableArray<ObservableCarouselMessage>;
  currentMessageIndex: IObservableValue<number>;
}

@observer
export class MessageCarousel extends React.Component<MessageCarouselProps> {
  private get styles(): MessageCarouselStyles {
    return messageCarouselResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): null | React.ReactElement<any> {
    const windowWidth = this.props.screenLayout.width;
    if (this.props.messages.length > 0 && windowWidth) {
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
            containerStyle={this.styles.pagination}
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
          this.styles.item_container,
          {
            width: this.props.screenLayout.width,
          },
        ]}>
        <View
          style={[
            this.styles.inner_container,
            { backgroundColor: item.backgroundColor },
          ]}>
          <DefaultText style={this.styles.title}>{item.title}</DefaultText>
          <DefaultText style={this.styles.message}>{item.message}</DefaultText>
          <View style={this.styles.button_container}>
            <DefaultButton
              text={item.buttonText}
              styles={roundedCornerButtonStyles.getSolidBackgroundStyles(
                ButtonSize.NORMAL,
                4,
                '#fff',
                item.buttonTextColor,
                this.props.theme,
                this.props.screenLayout,
              )}
              onPress={item.onPress}
            />
          </View>
        </View>
      </View>
    );
  }
}
