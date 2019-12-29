/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AtomShellType } from '@ulangi/ulangi-common/enums';
import { ObservableParticle, ObservableShell } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { AtomParticle } from './AtomParticle';

export interface AtomParticlesProps {
  particles: ObservableParticle[];
  getShellByPosition: (position: {
    x: number;
    y: number;
  }) => ObservableShell | undefined;
  transferParticleToSameShell: (
    particle: ObservableParticle,
    position: { x: number; y: number },
    isUserMove: boolean,
  ) => void;
  transferParticleToAnotherShell: (
    particle: ObservableParticle,
    position: { x: number; y: number },
    newShell: AtomShellType,
    isUserMove: boolean,
  ) => void;
  isMaxReached: (shell: AtomShellType) => boolean;
}

@observer
export class AtomParticles extends React.Component<AtomParticlesProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        {this.props.particles.map(
          (particle): React.ReactElement<any> => {
            return (
              <AtomParticle
                key={particle.id}
                particle={particle}
                getShellByPosition={this.props.getShellByPosition}
                transferParticleToAnotherShell={
                  this.props.transferParticleToAnotherShell
                }
                transferParticleToSameShell={
                  this.props.transferParticleToSameShell
                }
                isMaxReached={this.props.isMaxReached}
              />
            );
          },
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
