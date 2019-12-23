/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { DefaultText } from '../common/DefaultText';

export interface RegularFeatureListProps {
  showAdsDialog: () => void;
}
@observer
export class RegularFeatureList extends React.Component<
  RegularFeatureListProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.box}>
        <View style={[styles.feature_container, styles.no_top_border]}>
          <Image style={styles.bullet} source={Images.STAR_BLUE_12X12} />
          <View style={styles.text_container}>
            <DefaultText style={styles.text}>
              All features are freely accessible.
            </DefaultText>
          </View>
        </View>
        <View style={styles.feature_container}>
          <Image style={styles.bullet} source={Images.STAR_BLUE_12X12} />
          <View style={styles.text_container}>
            <DefaultText style={styles.text}>
              Support development and maintenance through ads.{' '}
              <DefaultText
                style={styles.highlighted}
                onPress={this.props.showAdsDialog}>
                See when and where we show ads.
              </DefaultText>
            </DefaultText>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    marginHorizontal: 16,
    paddingHorizontal: 18,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 0.5,
    shadowOpacity: 0.2,
    elevation: 1,
    borderTopColor: '#aaa',
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  no_top_border: {
    borderTopWidth: 0,
  },

  feature_container: {
    alignSelf: 'stretch',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#cecece',
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
  },

  bullet: {
    marginRight: 8,
  },

  text_container: {
    flexShrink: 1,
    paddingVertical: 8,
  },

  text: {
    fontSize: 15,
    color: '#333',
    lineHeight: 19,
  },

  highlighted: {
    color: config.styles.primaryColor,
  },
});
