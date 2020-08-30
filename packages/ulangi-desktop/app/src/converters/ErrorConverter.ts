/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';

import { config } from '../constants/config';

export class ErrorConverter {
  public convertToMessage(errorBag: ErrorBag): string {
    let message: string;
    switch (errorBag.errorCode) {
      case ErrorCode.USER__USER_NOT_FOUND:
        message = 'This account is not yet registered.';
        break;
      case ErrorCode.USER__USER_DISABLED:
        message = 'This account has been disabled.';
        break;
      case ErrorCode.USER__INVALID_EMAIL:
        message = 'Email is not valid.';
        break;
      case ErrorCode.USER__EMAIL_NOT_FOUND:
        message = 'This email is not yet registered.';
        break;
      case ErrorCode.USER__EMAIL_ALREADY_REGISTERED:
        message = 'This email is already registered.';
        break;
      case ErrorCode.USER__WRONG_EMAIL_OR_PASSWORD:
        message = 'The email or password is incorrect.';
        break;
      case ErrorCode.USER__WRONG_PASSWORD:
        message = 'The password is not correct.';
        break;
      case ErrorCode.USER__WEAK_PASSWORD:
        message = `The password must have at least ${
          config.user.passwordMinLength
        } characters`;
        break;
      case ErrorCode.USER__CONFIRM_PASSWORD_MISMATCHED:
        message = 'The confirm password does not match.';
        break;

      case ErrorCode.SET__EMPTY_SET_NAME:
        message = 'Set name cannot be empty.';
        break;

      case ErrorCode.VOCABULARY__EMPTY_VOCABULARY_TEXT:
        message = 'Vocabulary term cannot be empty.';
        break;
      case ErrorCode.VOCABULARY__NO_DEFINITIONS:
        message = 'At least 1 definition is required.';
        break;
      case ErrorCode.VOCABULARY__LANGUAGE_NOT_SUPPORTED_FOR_SYNTHESIZE_SPEECH:
        message = 'This language is currently not supported for speech.';
        break;

      case ErrorCode.DEFINITION__EMPTY_MEANING:
        message = 'Definition cannot to be empty.';
        break;

      case ErrorCode.ATOM__INSUFFICIENT_VOCABULARY:
        message = `This game requires at least ${
          config.atom.fetchLimit
        } vocabulary terms that you learned (from Spaced repetition) or Writing to play.`;
        break;

      case ErrorCode.REFLEX__INSUFFICIENT_VOCABULARY:
        message = `This game requires at least ${
          config.reflex.fetchLimit
        } vocabulary terms that you learned (from Spaced repetition or Writing) to play.`;
        break;

      case ErrorCode.IAP__INVALID_RECEIPT:
        message = 'Purchase receipt is invalid.';
        break;
      case ErrorCode.IAP__NO_PURCHASES:
        message = 'No purchases available.';
        break;

      case ErrorCode.IAP__PURCHASES_ALREADY_APPLIED:
        message = 'Purchases have already been applied to this account.';
        break;

      case ErrorCode.REMINDER__PERMISSION_REQUIRED:
        message =
          "Notifications for Ulangi has been disabled. Please go to Settings > Notifications > Ulangi > Turn on 'Allow Notifications'";
        break;

      case ErrorCode.GENERAL__FAILED_TO_GRANT_PERMISSION:
        message = 'Failed to grant permission.';
        break;

      case ErrorCode.GENERAL__UNAUTHENTICATED:
        message =
          'Authentication is required to process your request. Please log in.';
        break;

      case ErrorCode.GENERAL__INVALID_REQUEST:
        message = 'The request is invalid.';
        break;

      case ErrorCode.GENERAL__INVALID_DATA:
        message = 'The payload data is invalid.';
        break;

      case ErrorCode.GENERAL__NETWORK_ERROR:
        message = 'Network Error. Please check internet connection.';
        break;

      case ErrorCode.GENERAL__USER_CANCELLED:
        message = 'User canceled.';
        break;

      case ErrorCode.GENERAL__SERVER_ERROR:
        message =
          'Something is wrong with our servers. Please try again later.';
        break;

      case ErrorCode.GENERAL__UNKNOWN_ERROR:
        message =
          'Oops! An unknown error occurred. Make sure you have the latest version installed. If the problem still persists, please try again later.';
        break;

      default:
        message =
          'Oops! An unknown error occurred. Make sure you have the latest version installed. If the problem still persists, please try again later.';
    }

    return message;
  }
}

export const errorConverter = new ErrorConverter();
