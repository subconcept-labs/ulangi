/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableAtomTutorialScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { AtomTutorialScreenIds } from '../../constants/ids/AtomTutorialScreenIds';
import { AtomTutorialScreenDelegate } from '../../delegates/atom/AtomTutorialScreenDelegate';
import { AtomArcs } from './AtomArcs';
import { AtomOrigin } from './AtomOrigin';
import { AtomParticles } from './AtomParticles';
import { AtomShell } from './AtomShell';
import { AtomTopBar } from './AtomTopBar';
import { AtomTutorialContent } from './AtomTutorialContent';

export interface AtomTutorialScreenProps {
  observableScreen: ObservableAtomTutorialScreen;
  screenDelegate: AtomTutorialScreenDelegate;
}

@observer
export class AtomTutorialScreen extends React.Component<
  AtomTutorialScreenProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.screen} testID={AtomTutorialScreenIds.SCREEN}>
        <View style={styles.container}>
          {this.props.observableScreen.shells.map(
            (shell): React.ReactElement<any> => {
              return <AtomShell key={shell.shellType} shell={shell} />;
            },
          )}
          <AtomArcs arcs={this.props.observableScreen.arcs} />
          <AtomParticles
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
            origin={this.props.observableScreen.origin}
            gameStats={this.props.observableScreen.gameStats}
          />
          <AtomTopBar
            iconTestID={AtomTutorialScreenIds.BACK_BTN}
            iconType="back"
            onPress={this.props.screenDelegate.back}
            gameStats={this.props.observableScreen.gameStats}
          />
          <AtomTutorialContent
            currentStep={this.props.observableScreen.currentStep}
            back={this.props.screenDelegate.back}
          />
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
