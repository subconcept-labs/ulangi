/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import * as _ from 'lodash';

export class IapErrorConverter {
  private errorCodeMapping: { [P in string]: ErrorCode } = {
    E_USER_CANCELLED: ErrorCode.GENERAL__USER_CANCELLED,
  };

  public isIapError(error: any): boolean {
    return _.includes(_.keys(this.errorCodeMapping), _.get(error, 'code'));
  }

  public convertToErrorCode(error: any): string {
    if (this.isIapError(error)) {
      return this.errorCodeMapping[error.code];
    } else {
      return ErrorCode.GENERAL__UNKNOWN_ERROR;
    }
  }
}
