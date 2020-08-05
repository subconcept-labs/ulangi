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

import { AtomGameOverScreenIds } from '../../constants/ids/AtomGameOverScreenIds';
import { AtomStyle } from '../../styles/AtomStyle';
import { ls, ss } from '../../utils/responsive';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { LightBoxAnimatableView } from '../light-box/LightBoxAnimatableView';
import { LightBoxTouchableBackground } from '../light-box/LightBoxTouchableBackground';

export interface AtomGameOverScreenProps {
  observableLightBox: ObservableLightBox;
  observableDimensions: ObservableDimensions;
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
  public render(): React.ReactElement<any> {
    return (
      <LightBoxTouchableBackground
        testID={AtomGameOverScreenIds.SCREEN}
        observableLightBox={this.props.observableLightBox}
        observableDimensions={this.props.observableDimensions}
        style={styles.light_box_container}
        enabled={true}
        onPress={(): void => this.props.quit()}
        activeOpacity={0.2}>
        <LightBoxAnimatableView
          observableLightBox={this.props.observableLightBox}>
          <View style={styles.inner_container}>
            <View style={styles.title_container}>
              <DefaultText style={styles.title_text}>
                {this.props.title}
              </DefaultText>
            </View>
            <View style={styles.content_container}>
              <View style={styles.result_container}>
                <View style={styles.score_container}>
                  <DefaultText style={styles.score_text}>SCORE</DefaultText>
                  <DefaultText style={styles.score_number}>
                    {this.props.score}
                  </DefaultText>
                </View>
                <View style={styles.score_container}>
                  <DefaultText style={styles.score_text}>CORRECT</DefaultText>
                  <DefaultText style={styles.score_number}>
                    {this.props.correctCount}
                  </DefaultText>
                </View>
              </View>
              <View style={styles.button_container}>
                <DefaultButton
                  text="Quit"
                  styles={AtomStyle.getLightBoxSecondaryButtonStyles()}
                  onPress={this.props.quit}
                />
                <DefaultButton
                  text="Restart"
                  styles={AtomStyle.getLightBoxPrimaryButtonStyles()}
                  onPress={this.props.restart}
                />
              </View>
            </View>
          </View>
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
    alignSelf: 'stretch',
    marginHorizontal: ls(16),
    marginVertical: ss(16),
    borderRadius: ss(16),
    backgroundColor: '#f8f3d4',
    overflow: 'hidden',
  },

  title_container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: ss(16),
    borderBottomColor: '#a6a28d',
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#e3dec1',
  },

  title_text: {
    fontSize: ss(20),
    fontFamily: 'JosefinSans-Bold',
    textAlign: 'center',
    color: '#444',
  },

  content_container: {
    paddingVertical: ss(20),
  },

  result_container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  score_container: {
    height: ss(100),
    width: ss(100),
    borderRadius: ss(100) / 2,
    borderColor: '#ccc99b',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: ss(6),
  },

  score_text: {
    fontSize: ss(12),
    fontWeight: 'bold',
    color: '#444',
  },

  score_number: {
    fontSize: ss(18),
    fontFamily: 'JosefinSans-Bold',
    color: '#444',
  },

  button_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: ss(16),
    paddingHorizontal: ss(8),
  },
});
