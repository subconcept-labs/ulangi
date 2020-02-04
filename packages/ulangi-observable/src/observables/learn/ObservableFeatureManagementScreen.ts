import { ScreenName } from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';
import { ObservableFeatureSettings } from './ObservableFeatureSettings';

export class ObservableFeatureManagementScreen extends ObservableScreen {
  @observable
  public featureSettings: ObservableFeatureSettings;

  public constructor(
    featureSettings: ObservableFeatureSettings,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(screenName, topBar);
    this.featureSettings = featureSettings;
  }
}
