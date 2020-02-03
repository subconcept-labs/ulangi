/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableSetStore,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { LearnScreenIds } from '../../constants/ids/LearnScreenIds';
import { LearnScreenDelegate } from '../../delegates/learn/LearnScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { LearnList } from '../learn/LearnList';
import {
  LearnScreenStyles,
  darkStyles,
  lightStyles,
} from './LearnScreen.style';

export interface LearnScreenProps {
  setStore: ObservableSetStore;
  themeStore: ObservableThemeStore;
  screenDelegate: LearnScreenDelegate;
}

@observer
export class LearnScreen extends React.Component<LearnScreenProps> {
  public get styles(): LearnScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.screen} testID={LearnScreenIds.SCREEN}>
        <View style={this.styles.top_container}>
          <TouchableOpacity
            onPress={
              this.props.screenDelegate.navigateToFeatureManagementScreen
            }
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            style={this.styles.button}>
            <DefaultText style={this.styles.button_text}>
              Feature Management
            </DefaultText>
          </TouchableOpacity>
        </View>
        <LearnList
          theme={this.props.themeStore.theme}
          featureSettings={this.props.screenDelegate.getCurrentFeatureSettings()}
          navigateToSpacedRepetitionScreen={
            this.props.screenDelegate.navigateToSpacedRepetitionScreen
          }
          navigateToWritingScreen={
            this.props.screenDelegate.navigateToWritingScreen
          }
          navigateToQuizScreen={this.props.screenDelegate.navigateToQuizScreen}
          navigateToReflexScreen={
            this.props.screenDelegate.navigateToReflexScreen
          }
          navigateToAtomScreen={this.props.screenDelegate.navigateToAtomScreen}
        />
      </View>
    );
  }
}
