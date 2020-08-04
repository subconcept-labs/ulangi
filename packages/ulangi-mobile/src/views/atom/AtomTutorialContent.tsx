/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize } from '@ulangi/ulangi-common/enums';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { config } from '../../constants/config';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { ls, ss } from '../../utils/responsive';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';

export interface AtomTutorialContentProps {
  currentStep: number;
  back: () => void;
}

@observer
export class AtomTutorialContent extends React.Component<
  AtomTutorialContentProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <View style={styles.content_container}>{this.renderCurrentStep()}</View>
      </View>
    );
  }

  private steps: { content: JSX.Element }[] = [
    {
      content: (
        <DefaultText style={styles.content}>
          In this game, you must find the answer based on the vocabulary you
          learned. Assuming that the answer is{' '}
          <DefaultText key="answer" style={styles.highlighted}>
            ATOM
          </DefaultText>
          . Move{' '}
          <DefaultText key="T" style={styles.chracter}>
            T
          </DefaultText>{' '}
          in between{' '}
          <DefaultText key="A" style={styles.chracter}>
            A
          </DefaultText>{' '}
          and{' '}
          <DefaultText key="O" style={styles.chracter}>
            O
          </DefaultText>{' '}
          to form the word.
        </DefaultText>
      ),
    },
    {
      content: (
        <DefaultText style={styles.content}>
          Not done yet. You must also move redundant characters to the other
          shell. Move{' '}
          <DefaultText key="K" style={styles.chracter}>
            K
          </DefaultText>{' '}
          to the inner shell.
        </DefaultText>
      ),
    },
    {
      content: (
        <View>
          <DefaultText key="congratz" style={styles.content}>
            {"You're done! Here are some gotchas:"}
          </DefaultText>
          <DefaultText key="note-1" style={styles.content}>
            - The answer must be formed{' '}
            <DefaultText key="clockwise" style={styles.highlighted}>
              clockwise
            </DefaultText>
            .
          </DefaultText>
          <DefaultText key="note-2" style={styles.content}>
            - One shell contains the answer only (no other characters).
          </DefaultText>
          <DefaultText key="note-3" style={styles.content}>
            - The number at the origin is the number of moves left that you can
            make.
          </DefaultText>
          <View key="button_container" style={styles.button_container}>
            <DefaultButton
              text="DONE"
              onPress={this.props.back}
              styles={FullRoundedButtonStyle.getFullBackgroundStyles(
                ButtonSize.SMALL,
                config.atom.primaryColor,
                config.atom.textColor,
              )}
            />
          </View>
        </View>
      ),
    },
  ];

  private renderCurrentStep(): React.ReactElement<any> {
    return this.steps[this.props.currentStep].content;
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ls(16),
  },

  content_container: {},

  content: {
    fontSize: ss(15),
    color: config.atom.textColor,
    lineHeight: ss(19),
  },

  highlighted: {
    color: '#06d3c2',
    fontWeight: 'bold',
  },

  chracter: {
    color: '#06d3c2',
    fontWeight: 'bold',
  },

  button_container: {
    marginTop: ss(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
