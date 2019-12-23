/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ButtonSize } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableCategorizeScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { CategoryFormDelegate } from './CategoryFormDelegate';

@boundClass
export class CategorizeScreenDelegate {
  private eventBus: EventBus;
  private observableScreen: ObservableCategorizeScreen;
  private categoryFormDelegate: CategoryFormDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableCategorizeScreen,
    categoryFormDelegate: CategoryFormDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.categoryFormDelegate = categoryFormDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public save(selectedVocabularyIds: readonly string[]): void {
    if (selectedVocabularyIds.length === 1) {
      this.saveSingle(selectedVocabularyIds[0]);
    } else {
      this.saveMultiple(selectedVocabularyIds);
    }
  }

  public setCategoryName(categoryName: string): void {
    this.categoryFormDelegate.setCategoryName(categoryName);
  }

  public prepareAndFetchCategorySuggestions(): void {
    this.categoryFormDelegate.prepareAndFetchSuggestions(
      this.observableScreen.categoryFormState.categoryName,
    );
  }

  public fetchCategorySuggestions(): void {
    this.categoryFormDelegate.fetchSuggestions();
  }

  public clearFetchCategorySuggestions(): void {
    this.categoryFormDelegate.clearFetchSuggestions();
  }

  public showAllCategories(): void {
    this.categoryFormDelegate.showAllCategories();
  }

  public autoRefreshCategorySuggestionsOnNameChange(
    debounceTime: number,
  ): void {
    this.categoryFormDelegate.autoRefreshCategorySuggestionsOnNameChange(
      debounceTime,
    );
  }

  private saveSingle(vocabularyId: string): void {
    const editedVocabulary = {
      vocabularyId,
      category: {
        categoryName:
          this.observableScreen.categoryFormState.categoryName === ''
            ? 'Uncategorized'
            : this.observableScreen.categoryFormState.categoryName,
      },
    };

    this.eventBus.pubsub(
      createAction(ActionType.VOCABULARY__EDIT, {
        vocabulary: editedVocabulary,
        setId: undefined,
      }),
      group(
        on(
          ActionType.VOCABULARY__EDITING,
          (): void => {
            this.dialogDelegate.show({
              message: 'Saving...',
            });
          },
        ),
        once(
          ActionType.VOCABULARY__EDIT_SUCCEEDED,
          (): void => {
            this.dialogDelegate.showSuccessDialog({
              message: 'Save successfully.',
              onClose: (): void => {
                this.navigatorDelegate.dismissLightBox();
                this.navigatorDelegate.pop();
              },
            });
          },
        ),
        once(
          ActionType.VOCABULARY__EDIT_FAILED,
          ({ errorCode }): void => {
            this.dialogDelegate.showFailedDialog(errorCode, {
              title: 'SAVE FAILED',
            });
          },
        ),
      ),
    );
  }

  public showMoveToUncategorizedDialog(proceedCallback: () => void): void {
    this.navigatorDelegate.showDialog(
      {
        message:
          'You are moving the term(s) to Uncategorized. If you want to proceed, press OKAY.',
        onBackgroundPress: (): void => {
          this.navigatorDelegate.dismissLightBox();
        },
        buttonList: [
          {
            testID: LightBoxDialogIds.CANCEL_BTN,
            text: 'CANCEL',
            onPress: (): void => {
              this.navigatorDelegate.dismissLightBox();
            },
            styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
              ButtonSize.SMALL,
            ),
          },
          {
            testID: LightBoxDialogIds.OKAY_BTN,
            text: 'OKAY',
            onPress: proceedCallback,
            styles: FullRoundedButtonStyle.getFullPrimaryBackgroundStyles(
              ButtonSize.SMALL,
            ),
          },
        ],
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private saveMultiple(vocabularyIds: readonly string[]): void {
    const editedVocabularyList = vocabularyIds.map(
      (vocabularyId): DeepPartial<Vocabulary> => {
        return {
          vocabularyId,
          category: {
            categoryName:
              this.observableScreen.categoryFormState.categoryName === ''
                ? 'Uncategorized'
                : this.observableScreen.categoryFormState.categoryName,
          },
        };
      },
    );

    this.eventBus.pubsub(
      createAction(ActionType.VOCABULARY__EDIT_MULTIPLE, {
        vocabularyList: editedVocabularyList,
        vocabularyIdSetIdPairs: [],
      }),
      group(
        on(
          ActionType.VOCABULARY__EDITING_MULTIPLE,
          (): void => {
            this.dialogDelegate.show({
              message: 'Saving...',
            });
          },
        ),
        once(
          ActionType.VOCABULARY__EDIT_MULTIPLE_SUCCEEDED,
          (): void => {
            this.dialogDelegate.showSuccessDialog({
              message: 'Save successfully.',
              onClose: (): void => {
                this.navigatorDelegate.dismissLightBox();
                this.navigatorDelegate.pop();
              },
            });
          },
        ),
        once(
          ActionType.VOCABULARY__EDIT_MULTIPLE_FAILED,
          ({ errorCode }): void => {
            this.dialogDelegate.showFailedDialog(errorCode, {
              title: 'SAVE FAILED',
            });
          },
        ),
      ),
    );
  }
}
