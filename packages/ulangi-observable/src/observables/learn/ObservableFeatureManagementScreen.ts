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
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(componentId, screenName, topBar);
    this.featureSettings = featureSettings;
  }
}
