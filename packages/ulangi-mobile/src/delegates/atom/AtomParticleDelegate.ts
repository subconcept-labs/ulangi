/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { BaseTransformer } from '@ulangi/ulangi-common/core';
import { AtomShellType } from '@ulangi/ulangi-common/enums';
import {
  ObservableAtomPlayScreen,
  ObservableCommandList,
  ObservableMoveToCommand,
  ObservableParticle,
  Observer,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';

import { config } from '../../constants/config';

export class AtomParticleDelegate {
  private observer: Observer;
  private observableScreen: ObservableAtomPlayScreen;

  public constructor(
    observer: Observer,
    observableScreen: ObservableAtomPlayScreen,
  ) {
    this.observer = observer;
    this.observableScreen = observableScreen;
  }

  public spreadParticlesByIndices(callback?: () => void): void {
    const commandList = new ObservableCommandList();
    this.observableScreen.particles.forEach(
      (particle): void => {
        const shell = assertExists(
          this.observableScreen.shells.find(
            (shell): boolean => particle.shellType === shell.shellType,
          ),
          'shell should not be null or undefined',
        );
        const radius = shell.diameter / 2;
        const angle = this.rotateLeft90Degrees(
          this.calculateAngleByIndex(
            particle.index,
            this.getParticleCountByShell(particle.shellType),
          ),
        );
        // The coordinates is calculated with respect to the center origin
        const transformedX = radius * Math.cos(angle);
        const transformedY = radius * Math.sin(angle);
        // Tranform the coordicates back to use the top left origin
        const position = BaseTransformer.reverseTransform(
          this.observableScreen.origin.position,
          { x: transformedX, y: transformedY },
        );
        const centerX = position.x - config.atom.particleSize / 2;
        const centerY = position.y - config.atom.particleSize / 2;
        const newPosition = { x: centerX, y: centerY };
        const command = new ObservableMoveToCommand(newPosition, 'incompleted');
        particle.commandList.commands.push(command);
        commandList.commands.push(command);
      },
    );

    if (typeof callback !== 'undefined') {
      this.observer.when(
        (): boolean => commandList.areAllCompleted(),
        callback,
      );
    }
  }

  public moveAllParticlesToOrigin(callback?: () => void): void {
    const commandList = new ObservableCommandList();
    const originPosition = this.observableScreen.origin.position;

    this.observableScreen.particles.forEach(
      (particle: ObservableParticle): void => {
        const command = new ObservableMoveToCommand({
          x: originPosition.x - config.atom.particleSize / 2,
          y: originPosition.y - config.atom.particleSize / 2,
        });
        commandList.commands.push(command);
        particle.commandList.commands.push(command);
      },
    );

    if (typeof callback !== 'undefined') {
      this.observer.when(
        (): boolean => commandList.areAllCompleted(),
        callback,
      );
    }
  }

  public transferParticleToAnotherShell(
    particle: ObservableParticle,
    newPosition: { x: number; y: number },
    newShell: AtomShellType,
    callback?: () => void,
  ): void {
    const oldShellType = particle.shellType;
    particle.shellType = newShell;

    // Get all particles in the new shell
    const particlesInNewShell = this.getParticlesInShell(newShell);

    particlesInNewShell.forEach(
      (tempParticle): void => {
        if (tempParticle.id === particle.id) {
          tempParticle.newPosition = newPosition;
        } else {
          tempParticle.newPosition = tempParticle.position;
        }
      },
    );

    // Get all particles in the old shell
    const particlesInOldShell = this.getParticlesInShell(oldShellType);

    particlesInOldShell.forEach(
      (tempParticle: ObservableParticle): void => {
        tempParticle.newPosition = tempParticle.position;
      },
    );

    this.refactorIndicesByNewPositions(particlesInNewShell);
    this.refactorIndicesByNewPositions(particlesInOldShell);

    this.spreadParticlesByIndices(callback);
  }

  // Only invoke callback when indices change
  public transferParticleToSameShell(
    particle: ObservableParticle,
    newPosition: { x: number; y: number },
    callback?: () => void,
  ): void {
    // Get particles in the same shell
    const particlesInShell = this.getParticlesInShell(particle.shellType);

    particlesInShell.forEach(
      (tempParticle: ObservableParticle): void => {
        if (tempParticle.id === particle.id) {
          tempParticle.newPosition = newPosition;
        } else {
          tempParticle.newPosition = tempParticle.position;
        }
      },
    );

    const indiceChanged = this.refactorIndicesByNewPositions(particlesInShell);

    if (indiceChanged) {
      this.spreadParticlesByIndices(callback);
    } else {
      this.spreadParticlesByIndices();
    }
  }

  public changeParticleColors(
    particles: ObservableParticle[],
    color: 'highlighted' | 'normal',
  ): void {
    particles.forEach(
      (particle): void => {
        particle.color = color;
      },
    );
  }

  public isMaxReached(shellType: AtomShellType): boolean {
    const shell = assertExists(
      this.observableScreen.shells.find(
        (shell): boolean => shell.shellType === shellType,
      ),
      'shell should not be null or undefined',
    );
    const particlesInShell = this.observableScreen.particles.filter(
      (particle): boolean => particle.shellType === shellType,
    );

    return shell.max === particlesInShell.length;
  }

  public getParticleByCharacter(character: string): ObservableParticle {
    return assertExists(
      this.observableScreen.particles.find(
        (particle): boolean => particle.character === character,
      ),
      'particle should not be null or undefined',
    );
  }

  public getParticlesInShell(
    shellType: AtomShellType,
    _particles?: ObservableParticle[],
  ): ObservableParticle[] {
    const particles = _particles || this.observableScreen.particles;
    return particles.filter(
      (particle): boolean => particle.shellType === shellType,
    );
  }

  public reverseSortByIndex(particles: ObservableParticle[]): void {
    particles.sort(
      (particle1, particle2): number => {
        if (particle1.index > particle2.index) {
          return -1;
        } else if (particle1.index < particle2.index) {
          return 1;
        } else {
          return 0;
        }
      },
    );
  }

  public areParticlesInOneShellOnly(particles: ObservableParticle[]): boolean {
    const firstParticle = _.first(particles);
    // array is empty, return true
    if (typeof firstParticle === 'undefined') {
      return true;
    } else {
      return _.every(
        particles,
        (particle: ObservableParticle): boolean => {
          return particle.shellType === firstParticle.shellType;
        },
      );
    }
  }

  private getParticleCountByShell(shellType: AtomShellType): number {
    return this.observableScreen.particles.filter(
      (particle): boolean => shellType === particle.shellType,
    ).length;
  }

  private refactorIndicesByNewPositions(
    particles: ObservableParticle[],
  ): boolean {
    // Sort the list by angles
    particles.sort(
      (particle1, particle2): number => {
        const particle1_newPosition = assertExists(
          particle1.newPosition,
          "particle 1's new position should not be null or undefined",
        );
        const particle2_newPosition = assertExists(
          particle2.newPosition,
          "particle 2's new position should not be null or undefined",
        );

        // Because all particles are rotated left before, we have to rotate them back
        const angle1 = this.rotateRight90Degrees(
          this.calculateAngleByPosition(particle1_newPosition),
        );
        const angle2 = this.rotateRight90Degrees(
          this.calculateAngleByPosition(particle2_newPosition),
        );
        if (angle1 < angle2) {
          return -1;
        } else if (angle1 > angle2) {
          return 1;
        } else {
          return 0;
        }
      },
    );

    let hasChanged = false;
    // Reassign indices
    particles.forEach(
      (particle, index): void => {
        if (particle.index !== index) {
          particle.index = index;
          hasChanged = true;
        }
      },
    );

    return hasChanged;
  }

  private calculateAngleByPosition(position: { x: number; y: number }): number {
    const { x, y } = BaseTransformer.transformBase(
      this.observableScreen.origin.position,
      position,
    );
    const angle = Math.atan2(y, x);
    return angle < 0 ? angle + 2 * Math.PI : angle;
  }

  private calculateAngleByIndex(index: number, total: number): number {
    return (index / total) * 2 * Math.PI;
  }

  private rotateLeft90Degrees(angle: number): number {
    return (angle + Math.PI / 2) % (2 * Math.PI);
  }

  private rotateRight90Degrees(angle: number): number {
    return (angle - Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
  }
}
