import { ScreenName } from '@ulangi/ulangi-common/enums';
import {
  ObservableForgotPasswordScreen,
  ObservableTitleTopBar,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { ForgotPasswordScreenFactory } from '../../factories/auth/ForgotPasswordScreenFactory';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';

@observer
export class ForgotPasswordScreenContainer extends Container {
  private screenFactory = new ForgotPasswordScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableForgotPasswordScreen(
    '',
    this.props.componentId,
    ScreenName.FORGOT_PASSWORD_SCREEN,
    new ObservableTitleTopBar('Forgot Password', null, null),
  );

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public render(): React.ReactElement<any> {
    return (
      <ForgotPasswordScreen
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
