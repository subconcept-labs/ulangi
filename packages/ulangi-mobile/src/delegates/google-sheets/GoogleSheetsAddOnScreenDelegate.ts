/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ApiScope, ButtonSize, ScreenName } from '@ulangi/ulangi-common/enums';
import { ButtonStyles } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableGoogleSheetsAddOnScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { Clipboard } from 'react-native';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class GoogleSheetsAddOnScreenDelegate {
  private eventBus: EventBus;
  private observableScreen: ObservableGoogleSheetsAddOnScreen;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableGoogleSheetsAddOnScreen,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public showLink(link: string, screenTitle: string): void {
    this.navigatorDelegate.showModal(ScreenName.BROWSER_SCREEN, {
      link,
      screenTitle,
    });
  }

  public getApiKey(): void {
    this.eventBus.pubsub(
      createAction(ActionType.API_KEY__GET_API_KEY, {
        password: this.observableScreen.password,
        apiScope: ApiScope.SYNC,
      }),
      group(
        on(
          ActionType.API_KEY__GETTING_API_KEY,
          (): void => {
            this.dialogDelegate.show({
              message: 'Getting API key...',
            });
          },
        ),
        once(
          ActionType.API_KEY__GET_API_KEY_SUCCEEDED,
          ({ apiKey, expiredAt }): void => {
            this.observableScreen.apiKey = apiKey;
            this.observableScreen.expiredAt = expiredAt;
            this.dialogDelegate.dismiss();
          },
        ),
        once(
          ActionType.API_KEY__GET_API_KEY_FAILED,
          (errorBag): void => {
            this.dialogDelegate.showFailedDialog(errorBag);
          },
        ),
      ),
    );
  }

  public copyApiKeyToClipboard(): void {
    Clipboard.setString(assertExists(this.observableScreen.apiKey));
    this.dialogDelegate.showSuccessDialog({
      message: 'Copied to clipboard successfully',
    });
  }

  public sendToEmail(): void {
    this.eventBus.pubsub(
      createAction(ActionType.API_KEY__SEND_API_KEY, {
        apiKey: assertExists(this.observableScreen.apiKey),
        expiredAt: this.observableScreen.expiredAt || null,
      }),
      group(
        on(
          ActionType.API_KEY__SENDING_API_KEY,
          (): void => {
            this.dialogDelegate.show({
              message: 'Sending to your email...',
            });
          },
        ),
        once(
          ActionType.API_KEY__SEND_API_KEY_SUCCEEDED,
          (): void => {
            this.dialogDelegate.showSuccessDialog({
              message: 'Sent successfully.',
            });
          },
        ),
        once(
          ActionType.API_KEY__SEND_API_KEY_FAILED,
          (errorBag): void => {
            this.dialogDelegate.showFailedDialog(errorBag);
          },
        ),
      ),
    );
  }

  public showInvalidateApiKeyConfirmation(): void {
    this.dialogDelegate.show({
      message: 'The API key will no longer be valid. Do you want to continue?',
      buttonList: [
        {
          testID: LightBoxDialogIds.CANCEL_BTN,
          text: 'NO',
          onPress: (): void => {
            this.dialogDelegate.dismiss();
          },
          styles: (theme, layout): ButtonStyles =>
            fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
              ButtonSize.SMALL,
              theme,
              layout,
            ),
        },
        {
          testID: LightBoxDialogIds.OKAY_BTN,
          text: 'YES',
          onPress: (): void => {
            this.invalidateApiKey();
          },
          styles: (theme, layout): ButtonStyles =>
            fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
              ButtonSize.SMALL,
              theme,
              layout,
            ),
        },
      ],
    });
  }

  private invalidateApiKey(): void {
    this.eventBus.pubsub(
      createAction(ActionType.API_KEY__DELETE_API_KEY, {
        apiKey: assertExists(this.observableScreen.apiKey),
      }),
      group(
        on(
          ActionType.API_KEY__DELETING_API_KEY,
          (): void => {
            this.dialogDelegate.show({
              message: 'Invalidating API key...',
            });
          },
        ),
        once(
          ActionType.API_KEY__DELETE_API_KEY_SUCCEEDED,
          (): void => {
            this.observableScreen.apiKey = undefined;
            this.observableScreen.expiredAt = undefined;
            this.observableScreen.password = '';
            this.dialogDelegate.dismiss();
          },
        ),
        once(
          ActionType.API_KEY__DELETE_API_KEY_FAILED,
          (errorBag): void => {
            this.dialogDelegate.showFailedDialog(errorBag);
          },
        ),
      ),
    );
  }
}
