/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ContactUsScreenDelegate } from '../../delegates/contact-us/ContactUsScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class ContactUsScreenFactory extends ScreenFactory {
  public createScreenDelegate(): ContactUsScreenDelegate {
    return new ContactUsScreenDelegate(
      this.eventBus,
      this.createNavigatorDelegate()
    );
  }
}
