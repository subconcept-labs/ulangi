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

import { config } from '../../constants/config';
import { ReflexGameOverScreenIds } from '../../constants/ids/ReflexGameOverScreenIds';
import { ReflexStyle } from '../../styles/ReflexStyle';
import { ss } from '../../utils/responsive';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { LightBoxAnimatableView } from '../light-box/LightBoxAnimatableView';
import { LightBoxTouchableBackground } from '../light-box/LightBoxTouchableBackground';

export interface ReflexGameOverScreenProps {
  observableLightBox: ObservableLightBox;
  observableDimensions: ObservableDimensions;
  title: string;
  score: number;
  restart: () => void;
  quit: () => void;
}

@observer
export class ReflexGameOverScreen extends React.Component<
  ReflexGameOverScreenProps
> {
  public render(): React.ReactElement<any> {
    return (
      <LightBoxTouchableBackground
        testID={ReflexGameOverScreenIds.SCREEN}
        observableLightBox={this.props.observableLightBox}
        observableDimensions={this.props.observableDimensions}
        style={styles.light_box_container}
        enabled={true}
        activeOpacity={0.2}
        onPress={(): void => this.props.quit()}>
        <LightBoxAnimatableView
          testID={ReflexGameOverScreenIds.CONTAINER}
          observableLightBox={this.props.observableLightBox}
          style={styles.inner_container}>
          <View style={styles.title_container}>
            <DefaultText style={styles.title}>{this.props.title}</DefaultText>
          </View>
          <View style={styles.score_container}>
            <DefaultText style={styles.score_text}>
              {this.props.score}
            </DefaultText>
          </View>
          <DefaultButton
            testID={ReflexGameOverScreenIds.RESTART_BTN}
            text="Restart"
            styles={ReflexStyle.getMenuButtonStyles()}
            onPress={this.props.restart}
          />
          <DefaultButton
            testID={ReflexGameOverScreenIds.QUIT_BTN}
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
  },

  inner_container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ss(16),
    marginTop: ss(-30),
  },

  title_container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ss(8),
  },

  title: {
    fontSize: ss(34),
    fontFamily: 'Raleway-Black',
    textAlign: 'center',
    color: '#fff',
  },

  score_container: {
    borderColor: config.reflex.backgroundColor,
    borderWidth: ss(3),
    height: ss(100),
    width: ss(100),
    borderRadius: ss(50),
    marginVertical: ss(10),
    justifyContent: 'center',
    alignItems: 'center',
  },

  score_text: {
    fontFamily: 'Raleway-Black',
    fontSize: 30,
    color: config.reflex.backgroundColor,
  },

  spacer: {
    height: 30,
  },
});
