/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SecurityScreenDelegate } from '../../delegates/account/SecurityScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class SecurityScreenFactory extends ScreenFactory {
  public createScreenDelegate(): SecurityScreenDelegate {
    return new SecurityScreenDelegate(this.createNavigatorDelegate());
  }
}
