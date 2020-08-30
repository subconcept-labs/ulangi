import { ScreenName } from '@ulangi/ulangi-common/enums';
import {
  ObservableSignInScreen,
  ObservableTitleTopBar,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { SignInScreenFactory } from '../../factories/auth/SignInScreenFactory';
import { SignInScreen } from './SignInScreen';

@observer
export class SignInScreenContainer extends Container {
  private screenFactory = new SignInScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableSignInScreen(
    '',
    '',
    false,
    this.props.componentId,
    ScreenName.SIGN_IN_SCREEN,
    new ObservableTitleTopBar('Sign In', null, null),
  );

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public render(): React.ReactElement<any> {
    return (
      <SignInScreen
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
