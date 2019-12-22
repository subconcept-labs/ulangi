/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@ulangi/ulangi-common/interfaces';
import { ResetPasswordRequestResolver } from '@ulangi/ulangi-common/resolvers';
import {
  DatabaseFacade,
  ResetPasswordModel,
  UserModel,
} from '@ulangi/ulangi-remote-database';
import * as uuid from 'uuid';

import { AuthenticatorFacade } from '../../facades/AuthenticatorFacade';
import { Config } from '../../interfaces/Config';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class ResetPasswordController extends ApiController<
  ResetPasswordRequest,
  ResetPasswordResponse
> {
  private authenticator: AuthenticatorFacade;
  private database: DatabaseFacade;
  private userModel: UserModel;
  private resetPasswordModel: ResetPasswordModel;
  private config: Config;

  public constructor(
    authenticator: AuthenticatorFacade,
    database: DatabaseFacade,
    userModel: UserModel,
    resetPasswordModel: ResetPasswordModel,
    config: Config
  ) {
    super();
    this.authenticator = authenticator;
    this.database = database;
    this.userModel = userModel;
    this.resetPasswordModel = resetPasswordModel;
    this.config = config;
  }

  public options(): ControllerOptions<ResetPasswordRequest> {
    return {
      paths: ['/reset-password'],
      allowedMethod: 'post',
      authStrategies: null,
      requestResolver: new ResetPasswordRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<ResetPasswordRequest>,
    res: ApiResponse<ResetPasswordResponse>
  ): Promise<void> {
    const { resetPasswordToken, newPassword } = req.body;

    const valid = await this.authenticator.isResetPasswordTokenValid(
      resetPasswordToken
    );

    if (valid === true) {
      const { userId } = await this.authenticator.decodeResetPasswordToken(
        resetPasswordToken
      );

      const newEncryptedPassword = await this.authenticator.encryptPassword(
        newPassword,
        this.config.user.passwordEncryptionSaltRounds
      );

      const newAccessKey = uuid.v4();

      const authDb = this.database.getDb('auth');

      await authDb.transaction(
        (tx): Promise<void[]> => {
          return Promise.all([
            this.userModel.updateUser(
              tx,
              { userId },
              newEncryptedPassword,
              newAccessKey
            ),
            this.resetPasswordModel.deleteResetPasswordRequest(tx, userId),
          ]);
        }
      );

      res.json({ success: true });
    } else {
      res.error(400, { errorCode: ErrorCode.GENERAL__INVALID_REQUEST });
    }
  }
}
