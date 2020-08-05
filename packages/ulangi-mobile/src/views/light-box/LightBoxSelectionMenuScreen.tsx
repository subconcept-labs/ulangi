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
import { LightBoxAnimatableView } from './LightBoxAnimatableView';
import { LightBoxSelectionMenu } from './LightBoxSelectionMenu';
import {
  LightBoxSelectionMenuScreenStyles,
  lightBoxSelectionMenuScreenResponsiveStyles,
} from './LightBoxSelectionMenuScreen.style';
import { LightBoxTouchableBackground } from './LightBoxTouchableBackground';

export interface LightBoxSelectionMenuScreenProps {
  themeStore: ObservableThemeStore;
  observableLightBox: ObservableLightBox;
  observableScreen: ObservableScreen;
  navigatorDelegate: NavigatorDelegate;
}

@observer
export class LightBoxSelectionMenuScreen extends React.Component<
  LightBoxSelectionMenuScreenProps
> {
  private close(): void {
    this.props.navigatorDelegate.dismissLightBox();
  }

  public componentWillUnmount(): void {
    if (
      this.props.observableLightBox.selectionMenu !== null &&
      typeof this.props.observableLightBox.selectionMenu.onClose !== 'undefined'
    ) {
      this.props.observableLightBox.selectionMenu.onClose();
    }
  }

  private get styles(): LightBoxSelectionMenuScreenStyles {
    return lightBoxSelectionMenuScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): null | React.ReactElement<any> {
    if (this.props.observableLightBox.selectionMenu === null) {
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
              style={this.styles.inner_container}
              observableLightBox={this.props.observableLightBox}>
              <LightBoxSelectionMenu
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                selectionMenu={this.props.observableLightBox.selectionMenu}
              />
            </LightBoxAnimatableView>
          </LightBoxTouchableBackground>
        </Screen>
      );
    }
  }
}
