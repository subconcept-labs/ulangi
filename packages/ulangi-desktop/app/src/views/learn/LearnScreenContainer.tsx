import { ScreenName } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreen,
  ObservableTouchableTopBar,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { LearnScreen } from './LearnScreen';

@observer
export class LearnScreenContainer extends Container {
  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.LEARN_SCREEN,
    new ObservableTouchableTopBar('', '', '', _.noop, null, null),
  );

  public render(): React.ReactElement {
    return (
      <LearnScreen 
        observableScreen={this.observableScreen} 
        setStore={this.props.rootStore.setStore}
      />
    )
  }
}
