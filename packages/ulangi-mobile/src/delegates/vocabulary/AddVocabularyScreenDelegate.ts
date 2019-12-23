/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DefinitionBuilder } from '@ulangi/ulangi-common/builders';
import { ButtonSize } from '@ulangi/ulangi-common/enums';
import { EventBus } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableVocabulary,
  ObservableVocabularyFormState,
} from '@ulangi/ulangi-observable';
import { AnalyticsAdapter } from '@ulangi/ulangi-saga';
import { boundClass } from 'autobind-decorator';
import { runInAction } from 'mobx';

import { AddVocabularyScreenIds } from '../../constants/ids/AddVocabularyScreenIds';
import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { AddEditVocabularyScreenDelegate } from './AddEditVocabularyScreenDelegate';
import { AddVocabularyDelegate } from './AddVocabularyDelegate';
import { VocabularyFormDelegate } from './VocabularyFormDelegate';

@boundClass
export class AddVocabularyScreenDelegate extends AddEditVocabularyScreenDelegate {
  private observableConverter: ObservableConverter;
  private addVocabularyDelegate: AddVocabularyDelegate;
  private vocabularyFormState: ObservableVocabularyFormState;
  private analytics: AnalyticsAdapter;

  public constructor(
    eventBus: EventBus,
    observableConverter: ObservableConverter,
    vocabularyFormState: ObservableVocabularyFormState,
    vocabularyInputDelegate: VocabularyFormDelegate,
    addVocabularyDelegate: AddVocabularyDelegate,
    navigatorDelegate: NavigatorDelegate,
    analytics: AnalyticsAdapter,
  ) {
    super(eventBus, vocabularyInputDelegate, navigatorDelegate);

    this.observableConverter = observableConverter;
    this.addVocabularyDelegate = addVocabularyDelegate;
    this.vocabularyFormState = vocabularyFormState;
    this.analytics = analytics;
  }

  public saveAdd(closeOnSaveSucceeded: boolean): void {
    this.analytics.logEvent('add_vocabulary');
    this.addVocabularyDelegate.saveAdd({
      onSaving: this.showSavingDialog,
      onSaveSucceeded: closeOnSaveSucceeded
        ? this.showSaveSucceededDialog
        : this.showWhatToDoNextDialog,
      onSaveFailed: this.showSaveFailedDialog,
    });
  }

  public createPreview(): ObservableVocabulary {
    return this.addVocabularyDelegate.createPreview();
  }

  private showWhatToDoNextDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.SUCCESS_DIALOG,
        message: 'Saved successfully. What do you want to do next?',
        onBackgroundPress: (): void => {
          this.navigatorDelegate.dismissLightBox();
          this.navigatorDelegate.pop();
        },
        buttonList: [
          {
            testID: LightBoxDialogIds.CLOSE_DIALOG_BTN,
            text: 'CLOSE',
            onPress: (): void => {
              this.navigatorDelegate.dismissLightBox();
              this.navigatorDelegate.pop();
            },
            styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
              ButtonSize.SMALL,
            ),
          },
          {
            testID: AddVocabularyScreenIds.ADD_MORE_BTN,
            text: 'ADD MORE',
            onPress: (): void => {
              this.resetForms();
              this.navigatorDelegate.dismissLightBox();
            },
            styles: FullRoundedButtonStyle.getFullPrimaryBackgroundStyles(
              ButtonSize.SMALL,
            ),
          },
        ],
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private resetForms(): void {
    runInAction(
      (): void => {
        this.vocabularyFormState.reset();
        this.vocabularyFormState.definitions.push(
          this.observableConverter.convertToObservableDefinition(
            new DefinitionBuilder().build({ source: 'N/A' }),
          ),
        );
      },
    );
  }
}
