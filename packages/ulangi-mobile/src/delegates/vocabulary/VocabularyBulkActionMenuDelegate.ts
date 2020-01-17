/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { Options } from '@ulangi/react-native-navigation';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  LightBoxState,
  ScreenName,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { SelectionItem, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableLightBox,
  ObservableVocabularyListState,
  Observer,
} from '@ulangi/ulangi-observable';
import { runInAction } from 'mobx';

import { VocabularyBulkActionMenuIds } from '../../constants/ids/VocabularyBulkActionMenuIds';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { SetSelectionMenuDelegate } from '../set/SetSelectionMenuDelegate';

export class VocabularyBulkActionMenuDelegate {
  private eventBus: EventBus;
  private observer: Observer;
  private observableLightBox: ObservableLightBox;
  private vocabularyListState: ObservableVocabularyListState;
  private setSelectionMenuDelegate: SetSelectionMenuDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private styles: {
    light: Options;
    dark: Options;
  };

  public constructor(
    eventBus: EventBus,
    observer: Observer,
    observableLightBox: ObservableLightBox,
    vocabularyListState: ObservableVocabularyListState,
    setSelectionMenuDelegate: SetSelectionMenuDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
    styles: {
      light: Options;
      dark: Options;
    },
  ) {
    this.eventBus = eventBus;
    this.observer = observer;
    this.observableLightBox = observableLightBox;
    this.vocabularyListState = vocabularyListState;
    this.setSelectionMenuDelegate = setSelectionMenuDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.styles = styles;
  }

  public show(): void {
    const items: SelectionItem[] = [
      this.getSelectAllFetchedTermsBtn(),
      this.getCategorizeSelectedButton(),
      this.getMoveSelectedButton(),
      this.getRestoreSelectedButton(),
      this.getArchiveSelectedButton(),
      this.getDeleteSelectedButton(),
    ];

    this.observableLightBox.actionMenu = {
      testID: VocabularyBulkActionMenuIds.ACTION_MENU,
      title: 'Action',
      items,
    };

    this.navigatorDelegate.showLightBox(
      ScreenName.LIGHT_BOX_ACTION_MENU_SCREEN,
      {},
      this.styles,
    );
  }

  private getSelectAllFetchedTermsBtn(): SelectionItem {
    return {
      testID: VocabularyBulkActionMenuIds.SELECT_ALL_FETCHED_TERMS_BTN,
      text: 'Select all fetched terms',
      onPress: (): void => {
        runInAction(
          (): void => {
            if (this.vocabularyListState.vocabularyList !== null) {
              Array.from(
                this.vocabularyListState.vocabularyList.values(),
              ).forEach(
                (vocabulary): void => {
                  vocabulary.isSelected.set(true);
                },
              );
            }
          },
        );
        this.navigatorDelegate.dismissLightBox();
      },
    };
  }

  private getCategorizeSelectedButton(): SelectionItem {
    return {
      testID: VocabularyBulkActionMenuIds.CATEGORIZE_SELECTED_BTN,
      text: 'Categorize selected',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.CATEGORIZE_SCREEN, {
          categoryName: '',
          selectedVocabularyIds: this.vocabularyListState.selectedVocabularyIds.slice(),
        });
      },
    };
  }

  private getMoveSelectedButton(): SelectionItem {
    return {
      testID: VocabularyBulkActionMenuIds.MOVE_SELECTED_BTN,
      text: 'Move selected',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.observer.when(
          (): boolean =>
            this.observableLightBox.state === LightBoxState.UNMOUNTED,
          (): void => {
            this.setSelectionMenuDelegate.showActiveSets(
              (selectedSetId): void => {
                const editedVocabularyList = this.vocabularyListState.selectedVocabularyIds.map(
                  (vocabularyId): DeepPartial<Vocabulary> => {
                    return { vocabularyId };
                  },
                );

                const vocabularyIdSetIdPairs = this.vocabularyListState.selectedVocabularyIds.map(
                  (vocabularyId): [string, string] => {
                    return [vocabularyId, selectedSetId];
                  },
                );

                this.navigatorDelegate.dismissLightBox();
                this.observer.when(
                  (): boolean =>
                    this.observableLightBox.state === LightBoxState.UNMOUNTED,
                  (): void => {
                    this.saveMultipleEdit(
                      editedVocabularyList,
                      vocabularyIdSetIdPairs,
                    );
                  },
                );
              },
              {
                title: 'Move to...',
                hideLeftButton: true,
                hideRightButton: true,
              },
            );
          },
        );
      },
    };
  }

  private getArchiveSelectedButton(): SelectionItem {
    return {
      testID: VocabularyBulkActionMenuIds.ARCHIVE_SELECTED_BTN,
      text: 'Archive selected',
      onPress: (): void => {
        const editedVocabularyList = this.vocabularyListState.selectedVocabularyIds.map(
          (vocabularyId): DeepPartial<Vocabulary> => {
            return {
              vocabularyId,
              vocabularyStatus: VocabularyStatus.ARCHIVED,
            };
          },
        );

        this.navigatorDelegate.dismissLightBox();
        this.observer.when(
          (): boolean =>
            this.observableLightBox.state === LightBoxState.UNMOUNTED,
          (): void => {
            this.saveMultipleEdit(editedVocabularyList, []);
          },
        );
      },
    };
  }

  private getRestoreSelectedButton(): SelectionItem {
    return {
      testID: VocabularyBulkActionMenuIds.RESTORE_SELECTED_BTN,
      text: 'Restore selected',
      onPress: (): void => {
        const editedVocabularyList = this.vocabularyListState.selectedVocabularyIds.map(
          (vocabularyId): DeepPartial<Vocabulary> => {
            return {
              vocabularyId,
              vocabularyStatus: VocabularyStatus.ACTIVE,
            };
          },
        );

        this.navigatorDelegate.dismissLightBox();
        this.observer.when(
          (): boolean =>
            this.observableLightBox.state === LightBoxState.UNMOUNTED,
          (): void => {
            this.saveMultipleEdit(editedVocabularyList, []);
          },
        );
      },
    };
  }

  private getDeleteSelectedButton(): SelectionItem {
    return {
      testID: VocabularyBulkActionMenuIds.DELETE_SELECTED_BTN,
      text: 'Delete selected',
      textColor: 'red',
      onPress: (): void => {
        const editedVocabularyList = this.vocabularyListState.selectedVocabularyIds.map(
          (vocabularyId): DeepPartial<Vocabulary> => {
            return {
              vocabularyId,
              vocabularyStatus: VocabularyStatus.DELETED,
            };
          },
        );
        this.navigatorDelegate.dismissLightBox();
        this.observer.when(
          (): boolean => this.observableLightBox.state === 'unmounted',
          (): void => {
            this.saveMultipleEdit(editedVocabularyList, []);
          },
        );
      },
    };
  }

  private saveMultipleEdit(
    vocabularyList: DeepPartial<Vocabulary>[],
    vocabularyIdSetIdPairs: readonly [string, string][],
  ): void {
    this.eventBus.pubsub(
      createAction(ActionType.VOCABULARY__EDIT_MULTIPLE, {
        vocabularyList,
        vocabularyIdSetIdPairs,
      }),
      group(
        on(
          ActionType.VOCABULARY__EDITING_MULTIPLE,
          (): void => this.showPerformingBulkActionDialog(),
        ),
        once(
          ActionType.VOCABULARY__EDIT_MULTIPLE_SUCCEEDED,
          (): void => this.showPerformedBulkActionSuccessfully(),
        ),
        once(
          ActionType.VOCABULARY__EDIT_MULTIPLE_FAILED,
          (errorBag): void => this.dialogDelegate.showFailedDialog(errorBag),
        ),
      ),
    );
  }

  private showPerformingBulkActionDialog(): void {
    this.dialogDelegate.show({
      message: 'Performing bulk action. Please wait...',
    });
  }

  private showPerformedBulkActionSuccessfully(): void {
    this.dialogDelegate.showSuccessDialog({
      message: 'Performed bulk action successfully.',
    });
  }
}
