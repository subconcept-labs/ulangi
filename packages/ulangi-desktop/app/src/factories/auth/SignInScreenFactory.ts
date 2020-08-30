import {
  AuthDelegate,
  FetchSetDelegate,
  SetListDelegate,
  SyncDelegate,
} from '@ulangi/ulangi-delegate';
import { ObservableSignInScreen } from '@ulangi/ulangi-observable';

import { SignInScreenDelegate } from '../../delegates/auth/SignInScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class SignInScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableSignInScreen,
  ): SignInScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate();

    const authDelegate = new AuthDelegate(this.eventBus);

    const fetchSetDelegate = new FetchSetDelegate(this.eventBus);

    const setListDelegate = new SetListDelegate(this.eventBus);

    const syncDelegate = new SyncDelegate(this.eventBus);

    return new SignInScreenDelegate(
      observableScreen,
      authDelegate,
      setListDelegate,
      fetchSetDelegate,
      syncDelegate,
      dialogDelegate,
      navigatorDelegate,
    );
  }
}
