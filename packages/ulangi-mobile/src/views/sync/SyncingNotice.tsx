/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { Images } from '../../constants/Images';
import { DefaultText } from '../common/DefaultText';
import {
  SyncingNoticeStyles,
  syncingNoticeResponsiveStyles,
} from './SyncingNotice.style';

export interface SyncingNoticeProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  shouldShowSyncingNotice: IObservableValue<boolean>;
  shouldShowRefreshNotice: IObservableValue<boolean>;
  refresh: () => void;
}

@observer
export class SyncingNotice extends React.Component<SyncingNoticeProps> {
  private get styles(): SyncingNoticeStyles {
    return syncingNoticeResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): null | React.ReactElement<any> {
    if (
      this.props.shouldShowSyncingNotice.get() === true ||
      this.props.shouldShowRefreshNotice.get() === true
    ) {
      return (
        <Animatable.View
          style={this.styles.container}
          animation="slideInUp"
          useNativeDriver={true}>
          {this.renderContent()}
        </Animatable.View>
      );
    } else {
      return null;
    }
  }

  private renderContent(): React.ReactElement<any> {
    return (
      <TouchableOpacity
        onPress={this.props.refresh}
        style={this.styles.content_container}>
        {this.props.shouldShowSyncingNotice.get() ? (
          <>
            <Animatable.View
              animation="rotate"
              easing="linear"
              iterationCount="infinite"
              useNativeDriver={true}>
              <Image
                style={this.styles.icon}
                source={Images.SYNC_WHITE_20X20}
              />
            </Animatable.View>
            <DefaultText
              allowFontScaling={false}
              numberOfLines={1}
              style={this.styles.text}>
              <DefaultText>Syncing</DefaultText>
            </DefaultText>
          </>
        ) : (
          <DefaultText
            allowFontScaling={false}
            numberOfLines={1}
            style={this.styles.text}>
            <DefaultText>Tap to refresh</DefaultText>
          </DefaultText>
        )}
      </TouchableOpacity>
    );
  }
}
