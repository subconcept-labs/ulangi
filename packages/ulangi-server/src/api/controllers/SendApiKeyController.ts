/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  SendApiKeyRequest,
  SendApiKeyResponse,
} from '@ulangi/ulangi-common/interfaces';
import { SendApiKeyRequestResolver } from '@ulangi/ulangi-common/resolvers';
import * as moment from 'moment';

import { MailerAdapter } from '../../adapters/MailerAdapter';
import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class SendApiKeyController extends ApiController<
  SendApiKeyRequest,
  SendApiKeyResponse
> {
  private mailer: MailerAdapter;

  public constructor(mailer: MailerAdapter) {
    super();
    this.mailer = mailer;
  }

  public options(): ControllerOptions<SendApiKeyRequest> {
    return {
      paths: ['/send-api-key'],
      allowedMethod: 'post',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new SendApiKeyRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<SendApiKeyRequest>,
    res: ApiResponse<SendApiKeyResponse>
  ): Promise<void> {
    const { apiKey, expiredAt } = req.body;

    const email = req.user.email;

    const expiredTime =
      expiredAt === null ? 'N/A' : moment(expiredAt).format('MMM Do YYYY');

    await this.mailer.sendEmail(
      'noreply@ulangi.com',
      email,
      'noreply@ulangi.com',
      'The API key for your Ulangi account',
      [
        'Hello,',
        '',
        'You have requested to have the API key sent to your email.',
        '',
        `API key: ${apiKey}`,
        `Expiration date: ${expiredTime}.`,
        '',
        'If the API key is expired, please renew it from the app.',
        'If you have any questions, please send email to support@ulangi.com.',
        '',
        'Regards,',
        'The Ulangi Team',
      ].join('\n')
    );

    res.json({ success: true });
  }
}
