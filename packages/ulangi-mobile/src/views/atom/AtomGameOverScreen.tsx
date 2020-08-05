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

import { AtomGameOverScreenIds } from '../../constants/ids/AtomGameOverScreenIds';
import { atomLightBoxButtonStyles } from '../../styles/AtomStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { LightBoxAnimatableView } from '../light-box/LightBoxAnimatableView';
import { LightBoxTouchableBackground } from '../light-box/LightBoxTouchableBackground';
import {
  AtomGameOverScreenStyles,
  atomGameOverScreenResponsiveStyles,
} from './AtomGameOverScreen.style';

export interface AtomGameOverScreenProps {
  themeStore: ObservableThemeStore;
  observableLightBox: ObservableLightBox;
  observableScreen: ObservableScreen;
  title: string;
  score: number;
  correctCount: number;
  quit: () => void;
  restart: () => void;
}

@observer
export class AtomGameOverScreen extends React.Component<
  AtomGameOverScreenProps
> {
  private get styles(): AtomGameOverScreenStyles {
    return atomGameOverScreenResponsiveStyles.compile(
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
          testID={AtomGameOverScreenIds.SCREEN}
          theme={this.props.themeStore.theme}
          observableLightBox={this.props.observableLightBox}
          screenLayout={this.props.observableScreen.screenLayout}
          style={this.styles.light_box_container}
          enabled={true}
          onPress={(): void => this.props.quit()}
          activeOpacity={0.2}>
          <LightBoxAnimatableView
            observableLightBox={this.props.observableLightBox}>
            <View style={this.styles.inner_container}>
              <View style={this.styles.title_container}>
                <DefaultText style={this.styles.title_text}>
                  {this.props.title}
                </DefaultText>
              </View>
              <View style={this.styles.content_container}>
                <View style={this.styles.result_container}>
                  <View style={this.styles.score_container}>
                    <DefaultText style={this.styles.score_text}>
                      SCORE
                    </DefaultText>
                    <DefaultText style={this.styles.score_number}>
                      {this.props.score}
                    </DefaultText>
                  </View>
                  <View style={this.styles.score_container}>
                    <DefaultText style={this.styles.score_text}>
                      CORRECT
                    </DefaultText>
                    <DefaultText style={this.styles.score_number}>
                      {this.props.correctCount}
                    </DefaultText>
                  </View>
                </View>
                <View style={this.styles.button_container}>
                  <DefaultButton
                    text="Quit"
                    styles={atomLightBoxButtonStyles.getLightBoxSecondaryButtonStyles(
                      this.props.observableScreen.screenLayout,
                      this.props.themeStore.theme,
                    )}
                    onPress={this.props.quit}
                  />
                  <DefaultButton
                    text="Restart"
                    styles={atomLightBoxButtonStyles.getLightBoxPrimaryButtonStyles(
                      this.props.observableScreen.screenLayout,
                      this.props.themeStore.theme,
                    )}
                    onPress={this.props.restart}
                  />
                </View>
              </View>
            </View>
          </LightBoxAnimatableView>
        </LightBoxTouchableBackground>
      </Screen>
    );
  }
}
