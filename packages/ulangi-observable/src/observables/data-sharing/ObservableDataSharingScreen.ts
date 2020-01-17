import { ScreenName } from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';

export class ObservableDataSharingScreen extends ObservableScreen {
  @observable
  public optedIn: boolean;

  public constructor(
    optedIn: boolean,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(screenName, topBar);
    this.optedIn = optedIn;
  }
}
