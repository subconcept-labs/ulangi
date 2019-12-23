/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableAtomPlayScreen } from '@ulangi/ulangi-observable';

import { AtomAnswerDelegate } from '../../delegates/atom/AtomAnswerDelegate';
import { AtomArcDelegate } from '../../delegates/atom/AtomArcDelegate';
import { AtomOriginDelegate } from '../../delegates/atom/AtomOriginDelegate';
import { AtomParticleDelegate } from '../../delegates/atom/AtomParticleDelegate';
import { AtomPlayScreenDelegate } from '../../delegates/atom/AtomPlayScreenDelegate';
import { AtomSettingsDelegate } from '../../delegates/atom/AtomSettingsDelegate';
import { AtomShellDelegate } from '../../delegates/atom/AtomShellDelegate';
import { FetchVocabularyDelegate } from '../../delegates/atom/FetchVocabularyDelegate';
import { AtomQuestionIterator } from '../../iterators/AtomQuestionIterator';
import { ScreenFactory } from '../ScreenFactory';

export class AtomPlayScreenFactory extends ScreenFactory {
  public createAtomSettingsDelegate(): AtomSettingsDelegate {
    return new AtomSettingsDelegate();
  }

  public createScreenDelegate(
    observableScreen: ObservableAtomPlayScreen,
    questionIterator: AtomQuestionIterator,
    startGame: () => void,
  ): AtomPlayScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const fetchVocabularyDelegate = new FetchVocabularyDelegate(this.eventBus);

    const originDelegate = new AtomOriginDelegate(observableScreen);
    const shellDelegate = new AtomShellDelegate(observableScreen);
    const particleDelegate = new AtomParticleDelegate(
      this.observer,
      observableScreen,
    );
    const arcDelegate = new AtomArcDelegate(observableScreen);
    const answerDelegate = new AtomAnswerDelegate(
      observableScreen,
      particleDelegate,
    );

    return new AtomPlayScreenDelegate(
      this.observer,
      this.props.observableLightBox,
      observableScreen,
      questionIterator,
      fetchVocabularyDelegate,
      originDelegate,
      particleDelegate,
      shellDelegate,
      arcDelegate,
      answerDelegate,
      navigatorDelegate,
      startGame,
    );
  }
}
