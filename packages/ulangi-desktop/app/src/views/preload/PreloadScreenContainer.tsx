import { ScreenName } from '@ulangi/ulangi-common/enums';
import { ObservablePreloadScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { PreloadScreenFactory } from '../../factories/preload/PreloadScreenFactory';
import { PreloadScreen } from './PreloadScreen';

@observer
export class PreloadScreenContainer extends Container {
  public observableScreen = new ObservablePreloadScreen(
    '',
    this.props.componentId,
    ScreenName.PRELOAD_SCREEN,
  );

  private screenFactory = new PreloadScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public componentDidMount(): void {
    this.screenDelegate.preload();
  }

  public render(): React.ReactElement<any> {
    return <PreloadScreen />;
  }
}
