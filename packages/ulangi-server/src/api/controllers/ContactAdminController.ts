/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import {
  ContactAdminRequest,
  ContactAdminResponse,
} from '@ulangi/ulangi-common/interfaces';
import { ContactAdminRequestResolver } from '@ulangi/ulangi-common/resolvers';

import { MailerAdapter } from '../../adapters/MailerAdapter';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class ContactAdminController extends ApiController<
  ContactAdminRequest,
  ContactAdminResponse
> {
  private mailer: MailerAdapter;

  public constructor(mailer: MailerAdapter) {
    super();
    this.mailer = mailer;
  }

  public options(): ControllerOptions<ContactAdminRequest> {
    return {
      paths: ['/contact-admin'],
      allowedMethod: 'post',
      authStrategies: null,
      requestResolver: new ContactAdminRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<ContactAdminRequest>,
    res: ApiResponse<ContactAdminResponse>
  ): Promise<void> {
    const { adminEmail, replyToEmail, subject, message } = req.body;

    if (adminEmail.endsWith('@ulangi.com')) {
      await this.mailer.sendEmail(
        'bot@ulangi.com',
        adminEmail,
        replyToEmail,
        subject,
        message
      );
      res.json({ success: true });
    } else {
      res.error(400, { errorCode: ErrorCode.GENERAL__INVALID_REQUEST });
    }
  }
}
