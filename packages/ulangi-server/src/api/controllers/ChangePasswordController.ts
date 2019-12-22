/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '@ulangi/ulangi-common/interfaces';
import { ChangePasswordRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { DatabaseFacade, UserModel } from '@ulangi/ulangi-remote-database';
import * as uuid from 'uuid';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { AuthenticatorFacade } from '../../facades/AuthenticatorFacade';
import { Config } from '../../interfaces/Config';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class ChangePasswordController extends ApiController<
  ChangePasswordRequest,
  ChangePasswordResponse
> {
  private authenticator: AuthenticatorFacade;
  private database: DatabaseFacade;
  private userModel: UserModel;
  private config: Config;

  public constructor(
    authenticator: AuthenticatorFacade,
    database: DatabaseFacade,
    userModel: UserModel,
    config: Config
  ) {
    super();
    this.authenticator = authenticator;
    this.database = database;
    this.userModel = userModel;
    this.config = config;
  }

  public options(): ControllerOptions<ChangePasswordRequest> {
    return {
      paths: ['/change-password'],
      allowedMethod: 'post',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new ChangePasswordRequestResolver(
        this.config.user.passwordMinLength
      ),
    };
  }

  public async handleRequest(
    req: ApiRequest<ChangePasswordRequest>,
    res: ApiResponse<ChangePasswordResponse>
  ): Promise<void> {
    const { currentPassword, newPassword } = req.body;

    const db = this.database.getDb('auth');

    const userId = req.user.userId;

    const passwordCorrect = await this.authenticator.verifyPassword(
      currentPassword,
      req.userEncryptedPassword
    );

    if (passwordCorrect === true) {
      const encryptedPassword = await this.authenticator.encryptPassword(
        newPassword,
        this.config.user.passwordEncryptionSaltRounds
      );

      const newAccessKey = uuid.v4();

      await db.transaction(
        (tx): Promise<void> => {
          return this.userModel.updateUser(
            tx,
            { userId },
            encryptedPassword,
            newAccessKey
          );
        }
      );

      const accessToken = this.authenticator.createAccessToken(
        userId,
        newAccessKey
      );

      res.json({
        success: true,
        accessToken,
      });
    } else {
      res.error(401, { errorCode: ErrorCode.USER__WRONG_PASSWORD });
    }
  }
}
