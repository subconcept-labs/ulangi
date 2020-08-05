/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableAtomTutorialScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { AtomTutorialScreenIds } from '../../constants/ids/AtomTutorialScreenIds';
import { AtomTutorialScreenDelegate } from '../../delegates/atom/AtomTutorialScreenDelegate';
import { Screen } from '../common/Screen';
import { AtomArcs } from './AtomArcs';
import { AtomOrigin } from './AtomOrigin';
import { AtomParticles } from './AtomParticles';
import { AtomShell } from './AtomShell';
import { AtomTopBar } from './AtomTopBar';
import { AtomTutorialContent } from './AtomTutorialContent';

export interface AtomTutorialScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableAtomTutorialScreen;
  screenDelegate: AtomTutorialScreenDelegate;
}

@observer
export class AtomTutorialScreen extends React.Component<
  AtomTutorialScreenProps
> {
  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={styles.screen}
        testID={AtomTutorialScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <View style={styles.container}>
          {this.props.observableScreen.shells.map(
            (shell): React.ReactElement<any> => {
              return (
                <AtomShell
                  key={shell.shellType}
                  screenLayout={this.props.observableScreen.screenLayout}
                  shell={shell}
                />
              );
            },
          )}
          <AtomArcs
            screenLayout={this.props.observableScreen.screenLayout}
            arcs={this.props.observableScreen.arcs}
          />
          <AtomParticles
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            particles={this.props.observableScreen.particles}
            getShellByPosition={this.props.screenDelegate.getShellByPosition}
            transferParticleToSameShell={
              this.props.screenDelegate.transferParticleToSameShell
            }
            transferParticleToAnotherShell={
              this.props.screenDelegate.transferParticleToAnotherShell
            }
            isMaxReached={this.props.screenDelegate.isMaxReached}
          />
          <AtomOrigin
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            origin={this.props.observableScreen.origin}
            gameStats={this.props.observableScreen.gameStats}
          />
          <AtomTopBar
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            iconTestID={AtomTutorialScreenIds.BACK_BTN}
            iconType="back"
            onPress={this.props.screenDelegate.back}
            gameStats={this.props.observableScreen.gameStats}
          />
          <AtomTutorialContent
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            currentStep={this.props.observableScreen.currentStep}
            back={this.props.screenDelegate.back}
          />
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    flex: 1,
  },
});
