/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { LightBoxState } from '@ulangi/ulangi-common/enums';
import {
  ActionMenu,
  Dialog,
  SelectionMenu,
} from '@ulangi/ulangi-common/interfaces';
import { IObservableArray, action, observable } from 'mobx';

export class ObservableLightBox {
  @observable
  public componentId: null | string = null;

  @observable
  public dialog: null | Dialog = null;

  @observable
  public actionMenu: null | ActionMenu = null;

  @observable
  public selectionMenu: null | SelectionMenu<any> = null;

  @observable
  public state: LightBoxState = LightBoxState.UNMOUNTED;

  @observable
  public pendingAnimations: IObservableArray<string> = observable([]);

  @action
  public removePendingAnimation(name: string): void {
    const index = this.pendingAnimations.findIndex(
      (animationName): boolean => animationName === name
    );
    if (index !== -1) {
      this.pendingAnimations.splice(index, 1);
    }
  }
}
