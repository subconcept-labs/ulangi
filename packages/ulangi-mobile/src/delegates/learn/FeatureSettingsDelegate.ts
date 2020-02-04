import { FeatureSettings } from '@ulangi/ulangi-common/interfaces';
import { ObservableSetStore } from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';

export class FeatureSettingsDelegate {
  private setStore: ObservableSetStore;

  public constructor(setStore: ObservableSetStore) {
    this.setStore = setStore;
  }

  public getCurrentSettings(): FeatureSettings {
    return typeof this.setStore.existingCurrentSet.featureSettings !==
      'undefined'
      ? this.setStore.existingCurrentSet.featureSettings
      : config.set.defaultFeatureSettings;
  }
}
