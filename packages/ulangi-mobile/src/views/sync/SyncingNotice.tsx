/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { DefaultText } from '../common/DefaultText';

export interface SyncingNoticeProps {
  shouldShowSyncingNotice: IObservableValue<boolean>;
  shouldShowRefreshNotice: IObservableValue<boolean>;
  refresh: () => void;
}

@observer
export class SyncingNotice extends React.Component<SyncingNoticeProps> {
  public render(): null | React.ReactElement<any> {
    if (
      this.props.shouldShowSyncingNotice.get() === true ||
      this.props.shouldShowRefreshNotice.get() === true
    ) {
      return (
        <Animatable.View
          style={styles.container}
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
        style={styles.content_container}>
        {this.props.shouldShowSyncingNotice.get() ? (
          <>
            <Animatable.View
              animation="rotate"
              easing="linear"
              iterationCount="infinite"
              useNativeDriver={true}>
              <Image style={styles.icon} source={Images.SYNC_WHITE_20X20} />
            </Animatable.View>
            <DefaultText
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.text}>
              <DefaultText>Syncing</DefaultText>
            </DefaultText>
          </>
        ) : (
          <DefaultText
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.text}>
            <DefaultText>Tap to refresh</DefaultText>
          </DefaultText>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  content_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 15,
    backgroundColor: config.styles.primaryColor,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
    shadowOpacity: 0.15,
    elevation: 3,
    marginBottom: -3,
  },

  icon: {},

  text: {
    marginLeft: 4,
    textAlign: 'center',
    fontSize: 13,
    color: '#fff',
  },

  dot: {
    fontWeight: '700',
  },

  highlighted_text: {
    fontWeight: '700',
  },
});
