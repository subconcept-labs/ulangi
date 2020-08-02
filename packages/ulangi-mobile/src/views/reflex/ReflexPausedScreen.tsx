/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableDimensions,
  ObservableLightBox,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { ReflexPausedScreenIds } from '../../constants/ids/ReflexPausedScreenIds';
import { ReflexStyle } from '../../styles/ReflexStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { LightBoxAnimatableView } from '../light-box/LightBoxAnimatableView';
import { LightBoxTouchableBackground } from '../light-box/LightBoxTouchableBackground';

export interface ReflexPausedScreenProps {
  observableLightBox: ObservableLightBox;
  observableDimensions: ObservableDimensions;
  continue: () => void;
  restart: () => void;
  quit: () => void;
}

@observer
export class ReflexPausedScreen extends React.Component<
  ReflexPausedScreenProps
> {
  public render(): React.ReactElement<any> {
    return (
      <LightBoxTouchableBackground
        testID={ReflexPausedScreenIds.SCREEN}
        observableLightBox={this.props.observableLightBox}
        observableDimensions={this.props.observableDimensions}
        enabled={true}
        activeOpacity={0.2}
        style={styles.light_box_container}
        onPress={(): void => this.props.continue()}>
        <LightBoxAnimatableView
          testID={ReflexPausedScreenIds.CONTAINER}
          observableLightBox={this.props.observableLightBox}
          style={styles.inner_container}>
          <View style={styles.title_container}>
            <DefaultText style={styles.title}>Paused</DefaultText>
          </View>
          <DefaultButton
            testID={ReflexPausedScreenIds.CONTINUE_BTN}
            text="Continue"
            styles={ReflexStyle.getMenuButtonStyles()}
            onPress={this.props.continue}
          />
          <DefaultButton
            testID={ReflexPausedScreenIds.RESTART_BTN}
            text="Restart"
            styles={ReflexStyle.getMenuButtonStyles()}
            onPress={this.props.restart}
          />
          <DefaultButton
            testID={ReflexPausedScreenIds.QUIT_BTN}
            text="Quit"
            styles={ReflexStyle.getMenuButtonStyles()}
            onPress={this.props.quit}
          />
          <View style={styles.spacer} />
        </LightBoxAnimatableView>
      </LightBoxTouchableBackground>
    );
  }
}

const styles = StyleSheet.create({
  light_box_container: {
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  inner_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  title_container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  title: {
    fontSize: 34,
    fontFamily: 'Raleway-Black',
    color: '#fff',
  },

  spacer: {
    height: 30,
  },
});
