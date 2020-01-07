/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableFlashcardPlayerScreen,
  ObservableSetStore,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { Linking } from 'react-native';

import { env } from '../../constants/env';
import { CategoryMessageDelegate } from '../category/CategoryMessageDelegate';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class FlashcardPlayerScreenDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private observableScreen: ObservableFlashcardPlayerScreen;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private categoryMessageDelegate: CategoryMessageDelegate;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    observableScreen: ObservableFlashcardPlayerScreen,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
    categoryMessageDelegate: CategoryMessageDelegate,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableScreen = observableScreen;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.categoryMessageDelegate = categoryMessageDelegate;
  }

  public uploadToFlashcardPlayer(): void {
    if (env.FLASHCARD_PLAYER_URL !== null) {
      this.eventBus.pubsub(
        createAction(ActionType.FLASHCARD_PLAYER__UPLOAD, {
          playerUrl: env.FLASHCARD_PLAYER_URL,
          setId: this.setStore.existingCurrentSetId,
          languagePair:
            this.setStore.existingCurrentSet.learningLanguageCode +
            '-' +
            this.setStore.existingCurrentSet.translatedToLanguageCode,
          selectedCategoryNames:
            typeof this.observableScreen.selectedCategoryNames !== 'undefined'
              ? this.observableScreen.selectedCategoryNames.slice()
              : undefined,
        }),
        group(
          on(
            ActionType.FLASHCARD_PLAYER__UPLOADING,
            (): void => {
              this.dialogDelegate.show({
                message: 'Uploading to flashcardplayer.com...',
              });
            },
          ),
          once(
            ActionType.FLASHCARD_PLAYER__UPLOAD_SUCCEEDED,
            ({ playlistId }): void => {
              this.navigateToFlashcardPlayer(playlistId);
            },
          ),
          once(
            ActionType.FLASHCARD_PLAYER__UPLOAD_FAILED,
            ({ errorCode }): void => {
              this.dialogDelegate.showFailedDialog(errorCode, {});
            },
          ),
        ),
      );
    }
  }

  public back(): void {
    this.navigatorDelegate.pop();
  }

  public openFlashcardPlayerHomePage(): void {
    if (env.FLASHCARD_PLAYER_URL !== null) {
      Linking.openURL(env.FLASHCARD_PLAYER_URL).catch(
        (): void => {
          this.dialogDelegate.show({
            message:
              'Cannot open link flashcardplayer.com. Please check internet connection',
          });
        },
      );
    } else {
      console.warn('FlashcardPlayer is not configured');
    }
  }

  public showSelectSpecificCategoryMessage(): void {
    this.categoryMessageDelegate.showSelectSpecificCategoryMessage();
  }

  private navigateToFlashcardPlayer(playlistId: string): void {
    const link = env.FLASHCARD_PLAYER_URL + `/player?playlistId=${playlistId}`;

    Linking.openURL(link).catch(
      (): void => {
        this.dialogDelegate.show({
          message:
            'Cannot open link flashcardplayer.com. Please check internet connection',
        });
      },
    );
  }
}
