/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableScreen,
  ObservableSetStore,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { LearnScreenIds } from '../../constants/ids/LearnScreenIds';
import { LearnScreenDelegate } from '../../delegates/learn/LearnScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { LearnList } from '../learn/LearnList';
import {
  LearnScreenStyles,
  learnScreenResponsiveStyles,
} from './LearnScreen.style';

export interface LearnScreenProps {
  observableScreen: ObservableScreen;
  setStore: ObservableSetStore;
  themeStore: ObservableThemeStore;
  screenDelegate: LearnScreenDelegate;
}

@observer
export class LearnScreen extends React.Component<LearnScreenProps> {
  public get styles(): LearnScreenStyles {
    return learnScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={LearnScreenIds.SCREEN}
        useSafeAreaView={false}
        observableScreen={this.props.observableScreen}>
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
          screenLayout={this.props.observableScreen.screenLayout}
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
      </Screen>
    );
  }
}
