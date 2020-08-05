/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableAtomPlayScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { AtomPlayScreenIds } from '../../constants/ids/AtomPlayScreenIds';
import { AtomPlayScreenDelegate } from '../../delegates/atom/AtomPlayScreenDelegate';
import { Screen } from '../common/Screen';
import { AtomArcs } from './AtomArcs';
import { AtomOrigin } from './AtomOrigin';
import { AtomParticles } from './AtomParticles';
import {
  AtomPlayScreenStyles,
  atomPlayScreenResponsiveStyles,
} from './AtomPlayScreen.style';
import { AtomQuestion } from './AtomQuestion';
import { AtomShell } from './AtomShell';
import { AtomTopBar } from './AtomTopBar';

export interface AtomPlayScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableAtomPlayScreen;
  screenDelegate: AtomPlayScreenDelegate;
}

@observer
export class AtomPlayScreen extends React.Component<AtomPlayScreenProps> {
  private get styles(): AtomPlayScreenStyles {
    return atomPlayScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={AtomPlayScreenIds.SCREEN}
        useSafeAreaView={true}
        observableScreen={this.props.observableScreen}>
        <View style={this.styles.container}>
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
            transferParticleToAnotherShell={
              this.props.screenDelegate.transferParticleToAnotherShell
            }
            transferParticleToSameShell={
              this.props.screenDelegate.transferParticleToSameShell
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
            iconTestID={AtomPlayScreenIds.PAUSE_BTN}
            iconType="pause"
            onPress={this.props.screenDelegate.pause}
            gameStats={this.props.observableScreen.gameStats}
          />
          <AtomQuestion
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            question={this.props.observableScreen.question}
          />
        </View>
      </Screen>
    );
  }
}
