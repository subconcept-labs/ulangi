import { ScreenName } from '@ulangi/ulangi-common/enums';
import {
  ObservableSignUpScreen,
  ObservableTitleTopBar,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { SignUpScreenFactory } from '../../factories/auth/SignUpScreenFactory';
import { SignUpScreen } from './SignUpScreen';

@observer
export class SignUpScreenContainer extends Container {
  private screenFactory = new SignUpScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableSignUpScreen(
    '',
    '',
    '',
    false,
    false,
    this.props.componentId,
    ScreenName.SIGN_UP_SCREEN,
    new ObservableTitleTopBar('Sign Up', null, null),
  );

  private screenDelegate = this.screenFactory.createScreenDelegate();

  public render(): React.ReactElement {
    return (
      <SignUpScreen
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
