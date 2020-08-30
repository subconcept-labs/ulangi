import { ScreenName } from '@ulangi/ulangi-common/enums';
import { ObservableScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { SignOutScreenFactory } from '../../factories/auth/SignOutScreenFactory';
import { SignOutScreen } from '../auth/SignOutScreen';

@observer
export class SignOutScreenContainer extends Container {
  private screenFactory = new SignOutScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.SIGN_OUT_SCREEN,
    null,
  );

  private screenDelegate = this.screenFactory.createScreenDelegate();

  public componentDidMount(): void {
    // Make sure all screens are unmounted before calling signOut
    this.observer.when(
      (): boolean =>
        this.screenDelegate.didAllScreenNameUnmountedExceptSignOutScreen(),
      (): void => {
        this.screenDelegate.signOut();
      },
    );
  }

  public render(): React.ReactElement<any> {
    return <SignOutScreen />;
  }
}
