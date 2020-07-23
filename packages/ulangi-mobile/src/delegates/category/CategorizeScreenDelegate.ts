/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableCategorizeScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { Keyboard } from 'react-native';

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
  private selectedVocabularyIds: readonly string[];

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableCategorizeScreen,
    categoryFormDelegate: CategoryFormDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
    selectedVocabularyIds: readonly string[],
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.categoryFormDelegate = categoryFormDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.selectedVocabularyIds = selectedVocabularyIds;
  }

  public handleInputChange(searchInput: string): void {
    this.categoryFormDelegate.handleInputChange(searchInput);
  }

  public selectCategory(categoryName: string): void {
    Keyboard.dismiss();
    this.save(categoryName, this.selectedVocabularyIds);
  }

  public prepareAndFetchCategorySuggestions(): void {
    this.categoryFormDelegate.prepareAndFetchSuggestions(
      this.observableScreen.categoryFormState.searchInput,
    );
  }

  public fetchCategorySuggestions(): void {
    this.categoryFormDelegate.fetchSuggestions();
  }

  public clearFetchCategorySuggestions(): void {
    this.categoryFormDelegate.clearFetchSuggestions();
  }

  public clear(): void {
    this.categoryFormDelegate.clear();
  }

  public autoRefreshCategorySuggestionsOnInputChange(
    debounceTime: number,
  ): void {
    this.categoryFormDelegate.autoRefreshCategorySuggestionsOnInputChange(
      debounceTime,
    );
  }

  private save(
    categoryName: string,
    selectedVocabularyIds: readonly string[],
  ): void {
    if (selectedVocabularyIds.length === 1) {
      this.saveSingle(categoryName, selectedVocabularyIds[0]);
    } else {
      this.saveMultiple(categoryName, selectedVocabularyIds);
    }
  }

  private saveSingle(categoryName: string, vocabularyId: string): void {
    const editedVocabulary = {
      vocabularyId,
      category: {
        categoryName: categoryName === '' ? 'Uncategorized' : categoryName,
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
                this.dialogDelegate.dismiss();
                this.navigatorDelegate.pop();
              },
            });
          },
        ),
        once(
          ActionType.VOCABULARY__EDIT_FAILED,
          (errorBag): void => {
            this.dialogDelegate.showFailedDialog(errorBag, {
              title: 'SAVE FAILED',
            });
          },
        ),
      ),
    );
  }

  private saveMultiple(
    categoryName: string,
    vocabularyIds: readonly string[],
  ): void {
    const editedVocabularyList = vocabularyIds.map(
      (vocabularyId): DeepPartial<Vocabulary> => {
        return {
          vocabularyId,
          category: {
            categoryName: categoryName === '' ? 'Uncategorized' : categoryName,
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
          (errorBag): void => {
            this.dialogDelegate.showFailedDialog(errorBag, {
              title: 'SAVE FAILED',
            });
          },
        ),
      ),
    );
  }
}
