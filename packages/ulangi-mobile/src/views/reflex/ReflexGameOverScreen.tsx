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

import { ReflexGameOverScreenIds } from '../../constants/ids/ReflexGameOverScreenIds';
import { reflexMenuButtonStyles } from '../../styles/ReflexStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { LightBoxAnimatableView } from '../light-box/LightBoxAnimatableView';
import { LightBoxTouchableBackground } from '../light-box/LightBoxTouchableBackground';
import {
  ReflexGameOverScreenStyles,
  reflexGameOverScreenResponsiveStyles,
} from './ReflexGameOverScreen.style';

export interface ReflexGameOverScreenProps {
  themeStore: ObservableThemeStore;
  observableLightBox: ObservableLightBox;
  observableScreen: ObservableScreen;
  title: string;
  score: number;
  restart: () => void;
  quit: () => void;
}

@observer
export class ReflexGameOverScreen extends React.Component<
  ReflexGameOverScreenProps
> {
  private get styles(): ReflexGameOverScreenStyles {
    return reflexGameOverScreenResponsiveStyles.compile(
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
          testID={ReflexGameOverScreenIds.SCREEN}
          observableLightBox={this.props.observableLightBox}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          style={this.styles.light_box_container}
          enabled={true}
          activeOpacity={0.2}
          onPress={(): void => this.props.quit()}>
          <LightBoxAnimatableView
            testID={ReflexGameOverScreenIds.CONTAINER}
            observableLightBox={this.props.observableLightBox}
            style={this.styles.inner_container}>
            <View style={this.styles.title_container}>
              <DefaultText style={this.styles.title}>
                {this.props.title}
              </DefaultText>
            </View>
            <View style={this.styles.score_container}>
              <DefaultText style={this.styles.score_text}>
                {this.props.score}
              </DefaultText>
            </View>
            <DefaultButton
              testID={ReflexGameOverScreenIds.RESTART_BTN}
              text="Restart"
              styles={reflexMenuButtonStyles.compile(
                this.props.observableScreen.screenLayout,
                this.props.themeStore.theme,
              )}
              onPress={this.props.restart}
            />
            <DefaultButton
              testID={ReflexGameOverScreenIds.QUIT_BTN}
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
