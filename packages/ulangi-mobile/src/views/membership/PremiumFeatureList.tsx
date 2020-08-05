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
  PremiumFeatureListStyles,
  premiumFeatureListResponsiveStyles,
} from './PremiumFeatureList.style';

export interface PremiumFeatureListProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
}

@observer
export class PremiumFeatureList extends React.Component<
  PremiumFeatureListProps
> {
  private get styles(): PremiumFeatureListStyles {
    return premiumFeatureListResponsiveStyles.compile(
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
              Ads will not appear in the app.
            </DefaultText>
          </View>
        </View>
        <View style={this.styles.feature_container}>
          <Image style={this.styles.bullet} source={Images.STAR_BLUE_12X12} />
          <View style={this.styles.text_container}>
            <DefaultText style={this.styles.text}>
              Support development and maintenance through a one-time purchase.
            </DefaultText>
          </View>
        </View>
      </View>
    );
  }
}
