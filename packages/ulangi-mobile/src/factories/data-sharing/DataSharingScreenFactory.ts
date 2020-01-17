import { ObservableDataSharingScreen } from '@ulangi/ulangi-observable';

import { DataSharingScreenDelegate } from '../../delegates/data-sharing/DataSharingScreenDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class DataSharingScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableDataSharingScreen,
  ): DataSharingScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();
    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    return new DataSharingScreenDelegate(
      this.eventBus,
      observableScreen,
      dialogDelegate,
      navigatorDelegate,
    );
  }
}
