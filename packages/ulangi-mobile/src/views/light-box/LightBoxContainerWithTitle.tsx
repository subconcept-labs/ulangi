/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableLightBox,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import { LightBoxTouchableBackground } from '../light-box/LightBoxTouchableBackground';
import { LightBoxAnimatableView } from './LightBoxAnimatableView';
import {
  LightBoxContainerWithTitleResponsiveStyles,
  LightBoxContainerWithTitleStyles,
  lightBoxContainerWithTitleResponsiveStyles,
} from './LightBoxContainerWithTitle.style';

export interface LightBoxContainerWithTitleProps {
  testID?: string;
  theme: Theme;
  observableLightBox: ObservableLightBox;
  screenLayout: ObservableScreenLayout;
  dismissLightBox: () => void;
  title: string;
  styles?: LightBoxContainerWithTitleResponsiveStyles;
}

@observer
export class LightBoxContainerWithTitle extends React.Component<
  LightBoxContainerWithTitleProps
> {
  public get styles(): LightBoxContainerWithTitleStyles {
    return this.props.styles
      ? this.props.styles.compile(this.props.screenLayout, this.props.theme)
      : lightBoxContainerWithTitleResponsiveStyles.compile(
          this.props.screenLayout,
          this.props.theme,
        );
  }

  public render(): React.ReactElement<any> {
    return (
      <LightBoxTouchableBackground
        testID={this.props.testID}
        theme={this.props.theme}
        observableLightBox={this.props.observableLightBox}
        screenLayout={this.props.screenLayout}
        enabled={true}
        style={this.styles.light_box_container}
        onPress={this.props.dismissLightBox}
        activeOpacity={0.2}>
        <LightBoxAnimatableView
          observableLightBox={this.props.observableLightBox}
          style={this.styles.inner_container}>
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
