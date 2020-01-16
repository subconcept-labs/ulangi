/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import { ErrorResponseResolver } from '@ulangi/ulangi-common/resolvers';
import * as _ from 'lodash';

import { AdmobErrorConverter } from './AdmobErrorConverter';
import { IapErrorConverter } from './IapErrorConverter';
import { JoiErrorConverter } from './JoiErrorConverter';

export class ErrorConverter {
  private joiErrorConverter = new JoiErrorConverter();
  private iapErrorConverter = new IapErrorConverter();
  private admobErrorConverter = new AdmobErrorConverter();
  private errorResponseResolver = new ErrorResponseResolver();

  public getErrorCode(error: any): ErrorCode {
    let errorCode;

    if (this.joiErrorConverter.isJoiError(error)) {
      errorCode = this.joiErrorConverter.convertFirstErrorToErrorCode(error);
    } else if (this.iapErrorConverter.isIapError(error)) {
      errorCode = this.iapErrorConverter.convertToErrorCode(error);
    } else if (this.admobErrorConverter.isAdMobError(error)) {
      errorCode = this.admobErrorConverter.convertToErrorCode(error);
    } else if (error && error.code === 'ENSURLERRORDOMAIN-1009') {
      // Network error from react-native-fs downloadFile
      errorCode = ErrorCode.GENERAL__NETWORK_ERROR;
    } else if (
      error &&
      error.response &&
      error.response.data &&
      this.errorResponseResolver.isValid(error.response.data, true)
    ) {
      const result = this.errorResponseResolver.resolve(
        error.response.data,
        true
      );
      errorCode = result.errorCode;
    } else if (
      error instanceof Error &&
      _.includes(_.values(ErrorCode), error.message)
    ) {
      errorCode = error.message;
    } else if (error instanceof Error && error.message === 'Network Error') {
      errorCode = ErrorCode.GENERAL__NETWORK_ERROR;
    } else if (
      error instanceof Error &&
      error.message === 'Failed to grant permission'
    ) {
      errorCode = ErrorCode.GENERAL__FAILED_TO_GRANT_PERMISSION;
    } else if (_.includes(_.values(ErrorCode), error)) {
      errorCode = error;
    } else {
      errorCode = ErrorCode.GENERAL__UNKNOWN_ERROR;
    }

    return errorCode;
  }
}

export const errorConverter = new ErrorConverter();
