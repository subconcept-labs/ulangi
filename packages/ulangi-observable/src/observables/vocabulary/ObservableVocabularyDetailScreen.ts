/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState, ScreenName } from '@ulangi/ulangi-common/enums';
import { IObservableValue, observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';
import { ObservableVocabulary } from '../vocabulary/ObservableVocabulary';

export class ObservableVocabularyDetailScreen extends ObservableScreen {
  public readonly vocabulary: ObservableVocabulary;

  public readonly speakState: IObservableValue<ActivityState>;

  @observable
  public strokeOrderForm: 'traditional' | 'simplified' | 'unknown';

  public constructor(
    vocabulary: ObservableVocabulary,
    speakState: ActivityState,
    strokeOrderForm: 'traditional' | 'simplified' | 'unknown',
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(componentId, screenName, topBar);
    this.vocabulary = vocabulary;
    this.speakState = observable.box(speakState);
    this.strokeOrderForm = strokeOrderForm;
  }
}
