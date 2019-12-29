/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableContactUsScreen } from '@ulangi/ulangi-observable';

import { ContactUsScreenDelegate } from '../../delegates/contact-us/ContactUsScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class ContactUsScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableContactUsScreen,
  ): ContactUsScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    return new ContactUsScreenDelegate(
      this.eventBus,
      this.props.rootStore.userStore,
      observableScreen,
      navigatorDelegate,
    );
  }
}
