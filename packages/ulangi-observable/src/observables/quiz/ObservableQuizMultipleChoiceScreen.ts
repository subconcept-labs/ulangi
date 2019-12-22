/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { IObservableValue } from 'mobx';

import { ObservableMultipleChoiceFormState } from '../multiple-choice/ObservableMultipleChoiceFormState';
import { ObservableMultipleChoiceResult } from '../multiple-choice/ObservableMultipleChoiceResult';
import { ObservableScreen } from '../screen/ObservableScreen';

export class ObservableQuizMultipleChoiceScreen extends ObservableScreen {
  public readonly multipleChoiceFormState: ObservableMultipleChoiceFormState;

  public readonly multipleChoiceResult: ObservableMultipleChoiceResult;

  public readonly shouldShowResult: IObservableValue<boolean>;

  public constructor(
    multipleChoiceFormState: ObservableMultipleChoiceFormState,
    multipleChoiceResult: ObservableMultipleChoiceResult,
    shouldShowResult: IObservableValue<boolean>,
    screenName: ScreenName
  ) {
    super(screenName);
    this.multipleChoiceFormState = multipleChoiceFormState;
    this.multipleChoiceResult = multipleChoiceResult;
    this.shouldShowResult = shouldShowResult;
  }
}
