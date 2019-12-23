/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  ButtonSize,
  LightBoxState,
  ScreenName,
} from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { EventBus } from '@ulangi/ulangi-event';
import {
  ObservableLightBox,
  ObservableSetFormState,
  Observer,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import * as _ from 'lodash';

import { CreateFirstSetScreenIds } from '../../constants/ids/CreateFirstSetScreenIds';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { RootScreenDelegate } from '../root/RootScreenDelegate';
import { AddSetDelegate } from '../set/AddSetDelegate';
import { PickerDelegate } from '../set/PickerDelegate';
import { SetFormDelegate } from '../set/SetFormDelegate';
import { AddEditSetScreenDelegate } from './AddEditSetScreenDelegate';

@boundClass
export class CreateFirstSetScreenDelegate extends AddEditSetScreenDelegate {
  private eventBus: EventBus;
  private observer: Observer;
  private observableLightBox: ObservableLightBox;
  private setFormState: ObservableSetFormState;
  private addSetDelegate: AddSetDelegate;
  private rootScreenDelegate: RootScreenDelegate;

  public constructor(
    eventBus: EventBus,
    observer: Observer,
    observableLightBox: ObservableLightBox,
    setFormState: ObservableSetFormState,
    setFormDelegate: SetFormDelegate,
    pickerDelegate: PickerDelegate,
    addSetDelegate: AddSetDelegate,
    rootScreenDelegate: RootScreenDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    super(setFormDelegate, pickerDelegate, dialogDelegate, navigatorDelegate);
    this.eventBus = eventBus;
    this.observer = observer;
    this.observableLightBox = observableLightBox;
    this.setFormState = setFormState;
    this.addSetDelegate = addSetDelegate;
    this.rootScreenDelegate = rootScreenDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public handleLanguageSelect(lanaguageCode: string): void {
    this.setFormState.learningLanguageCode = lanaguageCode;
    this.setFormState.pickerState.disabled = true;

    this.addSetDelegate.saveAdd({
      onSaving: this.showSavingDialog,
      onSaveSucceeded: (set: Set): void => {
        this.selectSet(set.setId);
        // avoid light box dismissing too fast
        _.delay((): void => {
          this.navigatorDelegate.dismissLightBox();
          this.observer.when(
            (): boolean =>
              this.observableLightBox.state === LightBoxState.UNMOUNTED,
            (): void => {
              this.navigateToTabBasedScreen();
            },
          );
        }, 1000);
      },
      onSaveFailed: this.showSaveFailedDialog,
    });
  }

  public showConfirmLogout(): void {
    this.dialogDelegate.show({
      message: 'Do you want to log out?',
      onBackgroundPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
      },
      buttonList: [
        {
          testID: CreateFirstSetScreenIds.NO_BTN,
          text: 'NO',
          onPress: (): void => {
            this.navigatorDelegate.dismissLightBox();
          },
          styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
        {
          testID: CreateFirstSetScreenIds.YES_BTN,
          text: 'YES',
          onPress: (): void => {
            this.navigatorDelegate.dismissLightBox();
            this.observer.when(
              (): boolean => this.observableLightBox.state === 'unmounted',
              (): void => {
                this.rootScreenDelegate.setRootToSingleScreen(
                  ScreenName.SIGN_OUT_SCREEN,
                );
              },
            );
          },
          styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
      ],
    });
  }

  private navigateToTabBasedScreen(): void {
    this.rootScreenDelegate.setRootToTabBasedScreen();
  }

  private selectSet(setId: string): void {
    this.eventBus.publish(createAction(ActionType.SET__SELECT, { setId }));
  }
}
