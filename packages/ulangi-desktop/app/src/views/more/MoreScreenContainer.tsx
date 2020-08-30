import { ScreenName } from '@ulangi/ulangi-common/enums';
import {
  ObservableMoreScreen,
  ObservableTitleTopBar,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { MoreScreen } from './MoreScreen';

@observer
export class MoreScreenContainer extends Container {
  protected observableScreen = new ObservableMoreScreen(
    0,
    observable.array(),
    observable.box(0),
    this.props.componentId,
    ScreenName.MORE_SCREEN,
    new ObservableTitleTopBar('More', null, null),
  );

  public render(): React.ReactElement {
    return <MoreScreen observableScreen={this.observableScreen} />;
  }
}
