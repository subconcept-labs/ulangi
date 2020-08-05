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
import { View } from 'react-native';

import { ReflexPausedScreenIds } from '../../constants/ids/ReflexPausedScreenIds';
import { reflexMenuButtonStyles } from '../../styles/ReflexStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { LightBoxAnimatableView } from '../light-box/LightBoxAnimatableView';
import { LightBoxTouchableBackground } from '../light-box/LightBoxTouchableBackground';
import {
  ReflexPausedScreenStyles,
  reflexPausedScreenResponsiveStyles,
} from './ReflexPausedScreen.style';

export interface ReflexPausedScreenProps {
  themeStore: ObservableThemeStore;
  observableLightBox: ObservableLightBox;
  observableScreen: ObservableScreen;
  continue: () => void;
  restart: () => void;
  quit: () => void;
}

@observer
export class ReflexPausedScreen extends React.Component<
  ReflexPausedScreenProps
> {
  private get styles(): ReflexPausedScreenStyles {
    return reflexPausedScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        useSafeAreaView={false}
        observableScreen={this.props.observableScreen}
        style={this.styles.screen}>
        <LightBoxTouchableBackground
          testID={ReflexPausedScreenIds.SCREEN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          observableLightBox={this.props.observableLightBox}
          enabled={true}
          activeOpacity={0.2}
          style={this.styles.light_box_container}
          onPress={(): void => this.props.continue()}>
          <LightBoxAnimatableView
            testID={ReflexPausedScreenIds.CONTAINER}
            observableLightBox={this.props.observableLightBox}
            style={this.styles.inner_container}>
            <View style={this.styles.title_container}>
              <DefaultText style={this.styles.title}>Paused</DefaultText>
            </View>
            <DefaultButton
              testID={ReflexPausedScreenIds.CONTINUE_BTN}
              text="Continue"
              styles={reflexMenuButtonStyles.compile(
                this.props.observableScreen.screenLayout,
                this.props.themeStore.theme,
              )}
              onPress={this.props.continue}
            />
            <DefaultButton
              testID={ReflexPausedScreenIds.RESTART_BTN}
              text="Restart"
              styles={reflexMenuButtonStyles.compile(
                this.props.observableScreen.screenLayout,
                this.props.themeStore.theme,
              )}
              onPress={this.props.restart}
            />
            <DefaultButton
              testID={ReflexPausedScreenIds.QUIT_BTN}
              text="Quit"
              styles={reflexMenuButtonStyles.compile(
                this.props.observableScreen.screenLayout,
                this.props.themeStore.theme,
              )}
              onPress={this.props.quit}
            />
            <View style={this.styles.spacer} />
          </LightBoxAnimatableView>
        </LightBoxTouchableBackground>
      </Screen>
    );
  }
}
