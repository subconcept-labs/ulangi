/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';

export class ObservableQuizSettingsScreen extends ObservableScreen {
  @observable
  public selectedVocabularyPool: 'learned' | 'active';

  @observable
  public multipleChoiceSettings: {
    selectedQuizSize: number;
  };

  @observable
  public writingSettings: {
    selectedQuizSize: number;
    selectedAutoShowKeyboard: boolean;
  };

  public constructor(
    quizPool: 'learned' | 'active',
    multipleChoiceSettings: {
      selectedQuizSize: number;
    },
    writingSettings: {
      selectedQuizSize: number;
      selectedAutoShowKeyboard: boolean;
    },
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(componentId, screenName, topBar);
    this.selectedVocabularyPool = quizPool;
    this.multipleChoiceSettings = multipleChoiceSettings;
    this.writingSettings = writingSettings;
  }
}
