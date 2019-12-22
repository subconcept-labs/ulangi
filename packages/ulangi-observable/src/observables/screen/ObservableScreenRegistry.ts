/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { IObservableArray, observable } from 'mobx';

import { ObservableScreen } from './ObservableScreen';

export class ObservableScreenRegistry {
  @observable
  public screenList: IObservableArray<ObservableScreen>;

  public constructor(screenList?: ObservableScreen[]) {
    this.screenList = observable(screenList || []);
  }

  public getByScreenName(screenName: string): undefined | ObservableScreen {
    return this.screenList.find(
      (screen): boolean => screenName === screen.screenName
    );
  }

  public removeByScreenName(screenName: string): void {
    this.screenList = observable(
      this.screenList.filter(
        (screen): boolean => {
          return screen.screenName !== screenName;
        }
      )
    );
  }
}
