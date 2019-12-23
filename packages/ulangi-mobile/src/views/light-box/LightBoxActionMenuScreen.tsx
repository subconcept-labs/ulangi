/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableDarkModeStore,
  ObservableLightBox,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { NavigatorDelegate } from '../../delegates/navigator/NavigatorDelegate';
import { LightBoxActionMenu } from './LightBoxActionMenu';
import { LightBoxAnimatableView } from './LightBoxAnimatableView';
import { LightBoxTouchableBackground } from './LightBoxTouchableBackground';

export interface LightBoxActionMenuScreenProps {
  darkModeStore: ObservableDarkModeStore;
  observableLightBox: ObservableLightBox;
  navigatorDelegate: NavigatorDelegate;
}

@observer
export class LightBoxActionMenuScreen extends React.Component<
  LightBoxActionMenuScreenProps
> {
  private close(): void {
    this.props.navigatorDelegate.dismissLightBox();
  }

  public componentWillUnmount(): void {
    if (
      this.props.observableLightBox.actionMenu !== null &&
      typeof this.props.observableLightBox.actionMenu.onClose !== 'undefined'
    ) {
      this.props.observableLightBox.actionMenu.onClose();
    }
  }

  public render(): null | React.ReactElement<any> {
    if (this.props.observableLightBox.actionMenu === null) {
      return null;
    } else {
      return (
        <LightBoxTouchableBackground
          observableLightBox={this.props.observableLightBox}
          style={styles.light_box_container}
          enabled={true}
          activeOpacity={0.2}
          onPress={(): void => this.close()}>
          <LightBoxAnimatableView
            observableLightBox={this.props.observableLightBox}
            style={styles.inner_container}>
            <LightBoxActionMenu
              theme={this.props.darkModeStore.theme}
              actionMenu={this.props.observableLightBox.actionMenu}
            />
          </LightBoxAnimatableView>
        </LightBoxTouchableBackground>
      );
    }
  }
}

const styles = StyleSheet.create({
  light_box_container: {
    justifyContent: 'center',
    paddingVertical: 150,
  },

  inner_container: {
    flexShrink: 1,
  },
});
