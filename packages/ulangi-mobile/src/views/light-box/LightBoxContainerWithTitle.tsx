/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableLightBox } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import { LightBoxTouchableBackground } from '../light-box/LightBoxTouchableBackground';
import { LightBoxAnimatableView } from './LightBoxAnimatableView';
import {
  LightBoxContainerWithTitleStyles,
  darkStyles,
  lightStyles,
} from './LightBoxContainerWithTitle.style';

export interface LightBoxContainerWithTitleProps {
  testID?: string;
  theme: Theme;
  observableLightBox: ObservableLightBox;
  dismissLightBox: () => void;
  title: string;
  styles?: {
    light: LightBoxContainerWithTitleStyles;
    dark: LightBoxContainerWithTitleStyles;
  };
}

@observer
export class LightBoxContainerWithTitle extends React.Component<
  LightBoxContainerWithTitleProps
> {
  public get styles(): LightBoxContainerWithTitleStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <LightBoxTouchableBackground
        testID={this.props.testID}
        observableLightBox={this.props.observableLightBox}
        enabled={true}
        style={this.styles.light_box_container}
        onPress={this.props.dismissLightBox}
        activeOpacity={0.2}
      >
        <LightBoxAnimatableView
          observableLightBox={this.props.observableLightBox}
          style={this.styles.inner_container}
        >
          <View style={this.styles.title_container}>
            <DefaultText style={this.styles.title}>
              {this.props.title}
            </DefaultText>
          </View>
          <ScrollView>{this.props.children}</ScrollView>
        </LightBoxAnimatableView>
      </LightBoxTouchableBackground>
    );
  }
}
