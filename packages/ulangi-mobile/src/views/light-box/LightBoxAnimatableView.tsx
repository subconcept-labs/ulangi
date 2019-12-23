/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableLightBox } from '@ulangi/ulangi-observable';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Platform, ViewProperties } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { config } from '../../constants/config';

export interface LightBoxAnimatableViewProps extends ViewProperties {
  observableLightBox: ObservableLightBox;
}

@observer
export class LightBoxAnimatableView extends React.Component<
  LightBoxAnimatableViewProps
> {
  private animationContainerRef?: any;
  private animationHandler?: () => void;

  public componentDidMount(): void {
    this.animationHandler = autorun(
      (): void => {
        if (
          this.props.observableLightBox.state === 'willDismiss' &&
          this.animationContainerRef
        ) {
          this.props.observableLightBox.pendingAnimations.push('fading view');

          // Due to animdation bug in Android Pie, we use fadeOutDownBig instead
          const fadeOutAnimation =
            Platform.OS === 'android'
              ? this.animationContainerRef.fadeOutDownBig(400)
              : this.animationContainerRef.fadeOutDown(200);

          fadeOutAnimation.then(
            (): void => {
              this.props.observableLightBox.removePendingAnimation(
                'fading view',
              );
            },
          );
        }
      },
    );
  }

  public componentWillUnmount(): void {
    if (typeof this.animationHandler !== 'undefined') {
      this.animationHandler();
    }
  }

  public render(): React.ReactElement<any> {
    return (
      <Animatable.View
        testID={this.props.testID}
        ref={(ref: any): void => {
          this.animationContainerRef = ref;
        }}
        animation="fadeInUp"
        duration={config.lightBox.animationDuration}
        useNativeDriver
        style={this.props.style}>
        {this.props.children}
      </Animatable.View>
    );
  }
}
