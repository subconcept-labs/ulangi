/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import {
  RequestPasswordResetRequest,
  RequestPasswordResetResponse,
} from '@ulangi/ulangi-common/interfaces';
import { RequestPasswordResetRequestResolver } from '@ulangi/ulangi-common/resolvers';
import {
  DatabaseFacade,
  ResetPasswordModel,
  UserModel,
} from '@ulangi/ulangi-remote-database';
import * as uuid from 'uuid';

import { MailerAdapter } from '../../adapters/MailerAdapter';
import { AuthenticatorFacade } from '../../facades/AuthenticatorFacade';
import { Config } from '../../interfaces/Config';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { Env } from '../../interfaces/Env';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class RequestPasswordResetController extends ApiController<
  RequestPasswordResetRequest,
  RequestPasswordResetResponse
> {
  private authenticator: AuthenticatorFacade;
  private database: DatabaseFacade;
  private mailer: MailerAdapter;
  private userModel: UserModel;
  private resetPasswordModel: ResetPasswordModel;
  private env: Env;
  private config: Config;

  public constructor(
    authenticator: AuthenticatorFacade,
    database: DatabaseFacade,
    mailer: MailerAdapter,
    userModel: UserModel,
    resetPasswordModel: ResetPasswordModel,
    env: Env,
    config: Config
  ) {
    super();
    this.authenticator = authenticator;
    this.database = database;
    this.mailer = mailer;
    this.userModel = userModel;
    this.resetPasswordModel = resetPasswordModel;
    this.env = env;
    this.config = config;
  }

  public options(): ControllerOptions<RequestPasswordResetRequest> {
    return {
      paths: ['/request-password-reset'],
      allowedMethod: 'post',
      authStrategies: null,
      requestResolver: new RequestPasswordResetRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<RequestPasswordResetRequest>,
    res: ApiResponse<RequestPasswordResetResponse>
  ): Promise<void> {
    const { email } = req.body;

    const authDb = this.database.getDb('auth');

    const userId = await this.userModel.getUserIdByEmail(authDb, email);

    const resetPasswordKey = uuid.v4();

    if (userId !== null) {
      await authDb.transaction(
        (tx): Promise<void> => {
          return this.resetPasswordModel.upsertResetPasswordRequest(
            tx,
            {
              userId,
              resetPasswordKey,
            },
            this.config.user.resetPasswordRequestExpirationHours
          );
        }
      );

      const resetPasswordToken = this.authenticator.createResetPasswordToken(
        userId,
        resetPasswordKey
      );

      // Send email with resetPasswordToken
      await this.mailer.sendResetPasswordEmail(
        this.env.SERVER_URL,
        email,
        resetPasswordToken,
        this.config.user.resetPasswordRequestExpirationHours
      );

      res.json({ success: true });
    } else {
      res.error(400, { errorCode: ErrorCode.USER__EMAIL_NOT_FOUND });
    }
  }
}
