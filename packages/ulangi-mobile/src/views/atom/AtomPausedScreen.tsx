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
import { Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { AtomPausedScreenIds } from '../../constants/ids/AtomPausedScreenIds';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { LightBoxAnimatableView } from '../light-box/LightBoxAnimatableView';
import { LightBoxTouchableBackground } from '../light-box/LightBoxTouchableBackground';
import {
  AtomPausedScreenStyles,
  atomPausedScreenResponsiveStyles,
} from './AtomPausedScreen.style';

export interface AtomPausedScreenProps {
  themeStore: ObservableThemeStore;
  observableLightBox: ObservableLightBox;
  observableScreen: ObservableScreen;
  restart: () => void;
  quit: () => void;
  close: () => void;
  onClose?: () => void;
}

@observer
export class AtomPausedScreen extends React.Component<AtomPausedScreenProps> {
  private close(): void {
    this.props.close();
    if (typeof this.props.onClose !== 'undefined') {
      this.props.onClose();
    }
  }

  private get styles(): AtomPausedScreenStyles {
    return atomPausedScreenResponsiveStyles.compile(
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
          testID={AtomPausedScreenIds.SCREEN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          observableLightBox={this.props.observableLightBox}
          style={this.styles.light_box_container}
          enabled={true}
          activeOpacity={0.2}
          onPress={(): void => this.close()}>
          <LightBoxAnimatableView
            testID={AtomPausedScreenIds.CONTAINER}
            observableLightBox={this.props.observableLightBox}>
            <View style={this.styles.inner_container}>
              <View style={this.styles.title_container}>
                <DefaultText style={this.styles.title_text}>PAUSED</DefaultText>
              </View>
              <View style={this.styles.content_container}>
                <TouchableOpacity
                  testID={AtomPausedScreenIds.QUIT_BTN}
                  style={this.styles.button_touchable}
                  onPress={this.props.quit}>
                  <Image source={Images.CROSS_GREY_40X40} />
                  <DefaultText style={this.styles.button_text}>
                    Quit
                  </DefaultText>
                </TouchableOpacity>
                <TouchableOpacity
                  testID={AtomPausedScreenIds.RESTART_BTN}
                  style={this.styles.button_touchable}
                  onPress={this.props.restart}>
                  <Image source={Images.REFRESH_GREY_40X40} />
                  <DefaultText style={this.styles.button_text}>
                    Restart
                  </DefaultText>
                </TouchableOpacity>
              </View>
            </View>
          </LightBoxAnimatableView>
        </LightBoxTouchableBackground>
      </Screen>
    );
  }
}
