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
import { LightBoxDialog } from './LightBoxDialog';
import {
  LightBoxDialogScreenStyles,
  lightBoxDialogScreenResponsiveStyles,
} from './LightBoxDialogScreen.style';
import { LightBoxTouchableBackground } from './LightBoxTouchableBackground';

export interface LightBoxDialogScreenProps {
  themeStore: ObservableThemeStore;
  observableLightBox: ObservableLightBox;
  observableScreen: ObservableScreen;
  navigatorDelegate: NavigatorDelegate;
}

@observer
export class LightBoxDialogScreen extends React.Component<
  LightBoxDialogScreenProps
> {
  private close(): void {
    this.props.navigatorDelegate.dismissLightBox();
  }

  private get styles(): LightBoxDialogScreenStyles {
    return lightBoxDialogScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public componentWillUnmount(): void {
    if (
      this.props.observableLightBox.dialog !== null &&
      typeof this.props.observableLightBox.dialog.onClose !== 'undefined'
    ) {
      this.props.observableLightBox.dialog.onClose();
    }
  }

  public render(): null | React.ReactElement<any> {
    if (this.props.observableLightBox.dialog === null) {
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
            enabled={this.isBackgroundTouchable()}
            onPress={(): void => this.onBackgroundPress()}
            activeOpacity={0.2}>
            <LightBoxAnimatableView
              observableLightBox={this.props.observableLightBox}
              style={this.styles.inner_container}>
              <LightBoxDialog
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                dialog={this.props.observableLightBox.dialog}
                close={(): void => this.close()}
              />
            </LightBoxAnimatableView>
          </LightBoxTouchableBackground>
        </Screen>
      );
    }
  }

  private isBackgroundTouchable(): boolean {
    const dialog = this.props.observableLightBox.dialog;
    return (
      dialog !== null &&
      (dialog.closeOnTouchOutside === true ||
        typeof dialog.onBackgroundPress !== 'undefined')
    );
  }

  private onBackgroundPress(): void {
    const dialog = this.props.observableLightBox.dialog;
    if (dialog !== null) {
      if (dialog.closeOnTouchOutside === true) {
        this.close();
      }

      if (typeof dialog.onBackgroundPress !== 'undefined') {
        dialog.onBackgroundPress();
      }
    }
  }
}
