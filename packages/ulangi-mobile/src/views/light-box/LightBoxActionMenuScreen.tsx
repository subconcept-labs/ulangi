/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableLightBox,
  ObservableScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { NavigatorDelegate } from '../../delegates/navigator/NavigatorDelegate';
import { Screen } from '../common/Screen';
import { LightBoxActionMenu } from './LightBoxActionMenu';
import {
  LightBoxActionMenuScreenStyles,
  lightBoxActionMenuScreenResponsiveStyles,
} from './LightBoxActionMenuScreen.style';
import { LightBoxAnimatableView } from './LightBoxAnimatableView';
import { LightBoxTouchableBackground } from './LightBoxTouchableBackground';

export interface LightBoxActionMenuScreenProps {
  themeStore: ObservableThemeStore;
  observableLightBox: ObservableLightBox;
  observableScreen: ObservableScreen;
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

  private get styles(): LightBoxActionMenuScreenStyles {
    return lightBoxActionMenuScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): null | React.ReactElement<any> {
    if (this.props.observableLightBox.actionMenu === null) {
      return null;
    } else {
      return (
        <Screen
          useSafeAreaView={false}
          observableScreen={this.props.observableScreen}
          style={this.styles.screen}>
          <LightBoxTouchableBackground
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            observableLightBox={this.props.observableLightBox}
            style={this.styles.light_box_container}
            enabled={true}
            activeOpacity={0.2}
            onPress={(): void => this.close()}>
            <LightBoxAnimatableView
              observableLightBox={this.props.observableLightBox}
              style={this.styles.inner_container}>
              <LightBoxActionMenu
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                actionMenu={this.props.observableLightBox.actionMenu}
              />
            </LightBoxAnimatableView>
          </LightBoxTouchableBackground>
        </Screen>
      );
    }
  }
}
