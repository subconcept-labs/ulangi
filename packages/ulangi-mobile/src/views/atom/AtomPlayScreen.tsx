/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableAtomPlayScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { AtomPlayScreenIds } from '../../constants/ids/AtomPlayScreenIds';
import { AtomPlayScreenDelegate } from '../../delegates/atom/AtomPlayScreenDelegate';
import { AtomArcs } from './AtomArcs';
import { AtomOrigin } from './AtomOrigin';
import { AtomParticles } from './AtomParticles';
import { AtomQuestion } from './AtomQuestion';
import { AtomShell } from './AtomShell';
import { AtomTopBar } from './AtomTopBar';

export interface AtomPlayScreenProps {
  observableScreen: ObservableAtomPlayScreen;
  screenDelegate: AtomPlayScreenDelegate;
}

@observer
export class AtomPlayScreen extends React.Component<AtomPlayScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.screen} testID={AtomPlayScreenIds.SCREEN}>
        <View style={styles.container}>
          {this.props.observableScreen.shells.map(
            (shell): React.ReactElement<any> => {
              return <AtomShell key={shell.shellType} shell={shell} />;
            }
          )}
          <AtomArcs arcs={this.props.observableScreen.arcs} />
          <AtomParticles
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
            origin={this.props.observableScreen.origin}
            gameStats={this.props.observableScreen.gameStats}
          />
          <AtomTopBar
            iconTestID={AtomPlayScreenIds.PAUSE_BTN}
            iconType="pause"
            onPress={this.props.screenDelegate.pause}
            gameStats={this.props.observableScreen.gameStats}
          />
          <AtomQuestion question={this.props.observableScreen.question} />
        </View>
      </View>
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
