/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { Options } from '@ulangi/react-native-navigation';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  LightBoxState,
  ScreenName,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { SelectionItem } from '@ulangi/ulangi-common/interfaces';
import { EventBus } from '@ulangi/ulangi-event';
import {
  ObservableLightBox,
  ObservableVocabulary,
  Observer,
} from '@ulangi/ulangi-observable';

import { VocabularyActionMenuIds } from '../../constants/ids/VocabularyActionMenuIds';
import { VocabularySelectionDelegate } from '../../delegates/vocabulary/VocabularySelectionDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { SetSelectionMenuDelegate } from '../set/SetSelectionMenuDelegate';

export class VocabularyActionMenuDelegate {
  private eventBus: EventBus;
  private observer: Observer;
  private observableLightBox: ObservableLightBox;
  private setSelectionMenuDelegate: SetSelectionMenuDelegate;
  private vocabularySelectionDelegate: undefined | VocabularySelectionDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private styles: {
    light: Options;
    dark: Options;
  };

  public constructor(
    eventBus: EventBus,
    observer: Observer,
    observableLightBox: ObservableLightBox,
    setSelectionMenuDelegate: SetSelectionMenuDelegate,
    vocabularySelectionDelegate: undefined | VocabularySelectionDelegate,
    navigatorDelegate: NavigatorDelegate,
    styles: {
      light: Options;
      dark: Options;
    },
  ) {
    this.eventBus = eventBus;
    this.observer = observer;
    this.observableLightBox = observableLightBox;
    this.setSelectionMenuDelegate = setSelectionMenuDelegate;
    this.vocabularySelectionDelegate = vocabularySelectionDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.styles = styles;
  }

  public show(vocabulary: ObservableVocabulary): void {
    const items: SelectionItem[] = [];

    if (typeof this.vocabularySelectionDelegate !== 'undefined') {
      items.push(this.getToggleSelectButton(vocabulary.vocabularyId));
    }

    switch (vocabulary.vocabularyStatus) {
      case VocabularyStatus.ACTIVE:
        items.push(
          this.getEditButton(vocabulary),
          this.getCategorizeButton(vocabulary),
          this.getMoveButton(vocabulary),
          this.getArchiveButton(vocabulary),
          this.getDeleteButton(vocabulary),
        );
        break;

      case VocabularyStatus.ARCHIVED:
        items.push(
          this.getEditButton(vocabulary),
          this.getCategorizeButton(vocabulary),
          this.getMoveButton(vocabulary),
          this.getRestoreButton(vocabulary),
          this.getDeleteButton(vocabulary),
        );
        break;

      case VocabularyStatus.DELETED:
        items.push(
          this.getEditButton(vocabulary),
          this.getCategorizeButton(vocabulary),
          this.getMoveButton(vocabulary),
          this.getRestoreButton(vocabulary),
          this.getArchiveButton(vocabulary),
        );
        break;

      default:
        throw new Error('Default branch should not be reached');
    }

    this.observableLightBox.actionMenu = {
      testID: VocabularyActionMenuIds.ACTION_MENU,
      title: 'Action',
      items,
    };

    this.navigatorDelegate.showLightBox(
      ScreenName.LIGHT_BOX_ACTION_MENU_SCREEN,
      {},
      this.styles,
    );
  }

  private getToggleSelectButton(vocabularyId: string): SelectionItem {
    const vocabularySelectionDelegate = assertExists(
      this.vocabularySelectionDelegate,
      'vocabularySelectionDelegate is required to render toggle select button',
    );
    return {
      testID: VocabularyActionMenuIds.TOGGLE_SELECT_BTN,
      text: 'Select',
      onPress: (): void => {
        vocabularySelectionDelegate.toggleSelection(vocabularyId);
        this.navigatorDelegate.dismissLightBox();
      },
    };
  }

  private getEditButton(vocabulary: ObservableVocabulary): SelectionItem {
    return {
      testID: VocabularyActionMenuIds.EDIT_BTN,
      text: 'Edit',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.EDIT_VOCABULARY_SCREEN, {
          originalVocabulary: vocabulary.toRaw(),
        });
      },
    };
  }

  private getCategorizeButton(vocabulary: ObservableVocabulary): SelectionItem {
    return {
      testID: VocabularyActionMenuIds.CATEGORIZE_BTN,
      text: 'Categorize',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.showModal(ScreenName.CATEGORIZE_SCREEN, {
          categoryName: '',
          selectedVocabularyIds: [vocabulary.vocabularyId],
        });
      },
    };
  }

  private getArchiveButton(vocabulary: ObservableVocabulary): SelectionItem {
    return {
      testID: VocabularyActionMenuIds.ARCHIVE_BTN,
      text: 'Archive',
      onPress: (): void => {
        const editedVocabulary = {
          vocabularyId: vocabulary.vocabularyId,
          vocabularyStatus: VocabularyStatus.ARCHIVED,
        };
        this.eventBus.publish(
          createAction(ActionType.VOCABULARY__EDIT, {
            vocabulary: editedVocabulary,
            setId: undefined,
          }),
        );
        this.navigatorDelegate.dismissLightBox();
      },
    };
  }

  private getMoveButton(vocabulary: ObservableVocabulary): SelectionItem {
    return {
      testID: VocabularyActionMenuIds.MOVE_BTN,
      text: 'Move',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.observer.when(
          (): boolean =>
            this.observableLightBox.state === LightBoxState.UNMOUNTED,
          (): void => {
            this.setSelectionMenuDelegate.showActiveSets(
              (selectedSetId): void => {
                this.eventBus.publish(
                  createAction(ActionType.VOCABULARY__EDIT, {
                    vocabulary: {
                      vocabularyId: vocabulary.vocabularyId,
                    },
                    setId: selectedSetId,
                  }),
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

  private getRestoreButton(vocabulary: ObservableVocabulary): SelectionItem {
    return {
      testID: VocabularyActionMenuIds.RESTORE_BTN,
      text: 'Restore',
      onPress: (): void => {
        const editedVocabulary = {
          vocabularyId: vocabulary.vocabularyId,
          vocabularyStatus: VocabularyStatus.ACTIVE,
        };
        this.eventBus.publish(
          createAction(ActionType.VOCABULARY__EDIT, {
            vocabulary: editedVocabulary,
            setId: undefined,
          }),
        );
        this.navigatorDelegate.dismissLightBox();
      },
    };
  }

  private getDeleteButton(vocabulary: ObservableVocabulary): SelectionItem {
    return {
      testID: VocabularyActionMenuIds.DELETE_BTN,
      text: 'Delete',
      textColor: 'red',
      onPress: (): void => {
        const editedVocabulary = {
          vocabularyId: vocabulary.vocabularyId,
          vocabularyStatus: VocabularyStatus.DELETED,
        };
        this.eventBus.publish(
          createAction(ActionType.VOCABULARY__EDIT, {
            vocabulary: editedVocabulary,
            setId: undefined,
          }),
        );
        this.navigatorDelegate.dismissLightBox();
      },
    };
  }
}
