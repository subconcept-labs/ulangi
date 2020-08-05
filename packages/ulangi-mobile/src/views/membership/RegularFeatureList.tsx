/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, View } from 'react-native';

import { Images } from '../../constants/Images';
import { DefaultText } from '../common/DefaultText';
import {
  RegularFeatureListStyles,
  regularFeatureListResponsiveStyles,
} from './RegularFeatureList.style';

export interface RegularFeatureListProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  showAdsDialog: () => void;
}
@observer
export class RegularFeatureList extends React.Component<
  RegularFeatureListProps
> {
  private get styles(): RegularFeatureListStyles {
    return regularFeatureListResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.box}>
        <View
          style={[this.styles.feature_container, this.styles.no_top_border]}>
          <Image style={this.styles.bullet} source={Images.STAR_BLUE_12X12} />
          <View style={this.styles.text_container}>
            <DefaultText style={this.styles.text}>
              All features are freely accessible.
            </DefaultText>
          </View>
        </View>
        <View style={this.styles.feature_container}>
          <Image style={this.styles.bullet} source={Images.STAR_BLUE_12X12} />
          <View style={this.styles.text_container}>
            <DefaultText style={this.styles.text}>
              Support development and maintenance through ads.{' '}
              <DefaultText
                style={this.styles.highlighted}
                onPress={this.props.showAdsDialog}>
                See when we show ads.
              </DefaultText>
            </DefaultText>
          </View>
        </View>
      </View>
    );
  }
}
