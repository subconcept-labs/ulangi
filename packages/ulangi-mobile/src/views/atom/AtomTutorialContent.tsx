/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { config } from '../../constants/config';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import {
  AtomTutorialContentStyles,
  atomTutorialContentResponsiveStyles,
} from './AtomTutorialContent.style';

export interface AtomTutorialContentProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  currentStep: number;
  back: () => void;
}

@observer
export class AtomTutorialContent extends React.Component<
  AtomTutorialContentProps
> {
  private get styles(): AtomTutorialContentStyles {
    return atomTutorialContentResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.content_container}>
          {this.renderCurrentStep()}
        </View>
      </View>
    );
  }

  private steps: { content: JSX.Element }[] = [
    {
      content: (
        <DefaultText style={this.styles.content}>
          In this game, you must find the answer based on the vocabulary you
          learned. Assuming that the answer is{' '}
          <DefaultText key="answer" style={this.styles.highlighted}>
            ATOM
          </DefaultText>
          . Move{' '}
          <DefaultText key="T" style={this.styles.chracter}>
            T
          </DefaultText>{' '}
          in between{' '}
          <DefaultText key="A" style={this.styles.chracter}>
            A
          </DefaultText>{' '}
          and{' '}
          <DefaultText key="O" style={this.styles.chracter}>
            O
          </DefaultText>{' '}
          to form the word.
        </DefaultText>
      ),
    },
    {
      content: (
        <DefaultText style={this.styles.content}>
          Not done yet. You must also move redundant characters to the other
          shell. Move{' '}
          <DefaultText key="K" style={this.styles.chracter}>
            K
          </DefaultText>{' '}
          to the inner shell.
        </DefaultText>
      ),
    },
    {
      content: (
        <View>
          <DefaultText key="congratz" style={this.styles.content}>
            {"You're done! Here are some gotchas:"}
          </DefaultText>
          <DefaultText key="note-1" style={this.styles.content}>
            - The answer must be formed{' '}
            <DefaultText key="clockwise" style={this.styles.highlighted}>
              clockwise
            </DefaultText>
            .
          </DefaultText>
          <DefaultText key="note-2" style={this.styles.content}>
            - One shell contains the answer only (no other characters).
          </DefaultText>
          <DefaultText key="note-3" style={this.styles.content}>
            - The number at the origin is the number of moves left that you can
            make.
          </DefaultText>
          <View key="button_container" style={this.styles.button_container}>
            <DefaultButton
              text="DONE"
              onPress={this.props.back}
              styles={fullRoundedButtonStyles.getSolidBackgroundStyles(
                ButtonSize.SMALL,
                config.atom.primaryColor,
                config.atom.textColor,
                this.props.theme,
                this.props.screenLayout,
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
