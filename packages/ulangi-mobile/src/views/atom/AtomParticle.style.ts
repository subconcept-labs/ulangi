/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface AtomParticleStyles {
  particle_container: ViewStyle;
  character: TextStyle;
}

export class AtomParticleResponsiveStyles extends ResponsiveStyleSheet<
  AtomParticleStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): AtomParticleStyles {
    return {
      particle_container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowRadius: 0.8,
        shadowOpacity: 0.2,
      },

      character: {
        color: '#fff',
        fontSize: scaleByFactor(15),
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<AtomParticleStyles> {
    return {};
  }

  public darkStyles(): Partial<AtomParticleStyles> {
    return {};
  }
}

export const atomParticleResponsiveStyles = new AtomParticleResponsiveStyles();
