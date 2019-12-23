/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AtomShellType } from '@ulangi/ulangi-common/enums';
import { ObservableParticle } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import * as uuid from 'uuid';

import { config } from '../../constants/config';

export class ParticleFactory {
  public make(
    characterPool: string[],
    centerOrigin: { x: number; y: number },
  ): ObservableParticle[] {
    const particles: ObservableParticle[] = [];

    const currentIndex = {
      outerShell: 0,
      innerShell: 0,
    };

    characterPool.forEach(
      (character): void => {
        const randomShellType = this.getBiasedRandomShellTypes();
        let index: number;
        if (randomShellType === AtomShellType.OUTER) {
          index = currentIndex.outerShell;
          currentIndex.outerShell++;
        } else {
          index = currentIndex.innerShell;
          currentIndex.innerShell++;
        }
        particles.push(
          new ObservableParticle(
            uuid.v4(),
            true,
            character,
            {
              x: centerOrigin.x - config.atom.particleSize / 2,
              y: centerOrigin.y - config.atom.particleSize / 2,
            },
            randomShellType,
            index,
            'normal',
          ),
        );
      },
    );

    return particles;
  }

  private getBiasedRandomShellTypes(): AtomShellType {
    // biased random
    const random = _.random(0, 3);
    return random !== 3 ? AtomShellType.OUTER : AtomShellType.INNER;
  }
}
