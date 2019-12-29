/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableAtomTutorialScreen } from '@ulangi/ulangi-observable';

import { AtomAnswerDelegate } from '../../delegates/atom/AtomAnswerDelegate';
import { AtomArcDelegate } from '../../delegates/atom/AtomArcDelegate';
import { AtomOriginDelegate } from '../../delegates/atom/AtomOriginDelegate';
import { AtomParticleDelegate } from '../../delegates/atom/AtomParticleDelegate';
import { AtomSettingsDelegate } from '../../delegates/atom/AtomSettingsDelegate';
import { AtomShellDelegate } from '../../delegates/atom/AtomShellDelegate';
import { AtomTutorialScreenDelegate } from '../../delegates/atom/AtomTutorialScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class AtomTutorialScreenFactory extends ScreenFactory {
  public createAtomSettingsDelegate(): AtomSettingsDelegate {
    return new AtomSettingsDelegate();
  }

  public createScreenDelegate(
    observableScreen: ObservableAtomTutorialScreen,
  ): AtomTutorialScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();
    const originDelegate = new AtomOriginDelegate(observableScreen);
    const particleDelegate = new AtomParticleDelegate(
      this.observer,
      observableScreen,
    );
    const shellDelegate = new AtomShellDelegate(observableScreen);
    const arcDelegate = new AtomArcDelegate(observableScreen);
    const answerDelegate = new AtomAnswerDelegate(
      observableScreen,
      particleDelegate,
    );

    return new AtomTutorialScreenDelegate(
      observableScreen,
      originDelegate,
      particleDelegate,
      shellDelegate,
      arcDelegate,
      answerDelegate,
      navigatorDelegate,
    );
  }
}
