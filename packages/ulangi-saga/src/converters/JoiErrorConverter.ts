/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { ErrorCode } from '@ulangi/ulangi-common/enums';
import { ValidationError } from 'joi';
import * as _ from 'lodash';

export class JoiErrorConverter {
  public isJoiError(error: any): boolean {
    return _.get(error, 'isJoi') === true;
  }

  public convertFirstErrorToErrorCode(error: ValidationError): string {
    const firstError = assertExists(
      _.first(error.details),
      'error details should not empty'
    );
    const path = firstError.path.join('.');
    const type = firstError.type;
    const context = firstError.context;

    if (path === 'email') {
      if (
        type === 'string.email' ||
        (typeof context !== 'undefined' &&
          context.name === 'notEndsWithGuestDomain')
      ) {
        return ErrorCode.USER__INVALID_EMAIL;
      } else {
        return ErrorCode.GENERAL__UNKNOWN_ERROR;
      }
    } else if (path === 'password' && type === 'string.min') {
      return ErrorCode.USER__WEAK_PASSWORD;
    } else if (path === 'confirmPassword' && type === 'any.allowOnly') {
      return ErrorCode.USER__CONFIRM_PASSWORD_MISMATCHED;
    } else if (path === 'setName' && type === 'any.empty') {
      return ErrorCode.SET__EMPTY_SET_NAME;
    } else if (path === 'vocabularyText' && type === 'any.empty') {
      return ErrorCode.VOCABULARY__EMPTY_VOCABULARY_TEXT;
    } else if (path === 'meaning' && type === 'any.empty') {
      return ErrorCode.DEFINITION__EMPTY_MEANING;
    } else {
      return ErrorCode.GENERAL__UNKNOWN_ERROR;
    }
  }
}
