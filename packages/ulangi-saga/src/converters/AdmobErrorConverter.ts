/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import * as _ from 'lodash';

export class AdmobErrorConverter {
  private errorMapping: { [P in string]: string } = {
    ERROR_CODE_INTERNAL_ERROR: ErrorCode.AD__INTERNAL_ERROR,
    ERROR_CODE_INVALID_REQUEST: ErrorCode.AD__INVALID_REQUEST,
    ERROR_CODE_NETWORK_ERROR: ErrorCode.AD__NETWORK_ERROR,
    ERROR_CODE_NO_FILL: ErrorCode.AD__NO_FILL,
  };

  public isAdMobError(errorCode: string): boolean {
    return _.includes(_.keys(this.errorMapping), errorCode);
  }

  public convertToErrorCode(errorCode: string): string {
    return this.errorMapping[errorCode] || ErrorCode.GENERAL__UNKNOWN_ERROR;
  }
}
