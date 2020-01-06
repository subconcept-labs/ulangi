/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import {
  ChangeEmailAndPasswordRequest,
  ChangeEmailAndPasswordResponse,
} from '@ulangi/ulangi-common/interfaces';
import { ChangeEmailAndPasswordRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { DatabaseFacade, UserModel } from '@ulangi/ulangi-remote-database';
import * as uuid from 'uuid';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { AuthenticatorFacade } from '../../facades/AuthenticatorFacade';
import { FirebaseFacade } from '../../facades/FirebaseFacade';
import { Config } from '../../interfaces/Config';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class ChangeEmailAndPasswordController extends ApiController<
  ChangeEmailAndPasswordRequest,
  ChangeEmailAndPasswordResponse
> {
  private authenticator: AuthenticatorFacade;
  private database: DatabaseFacade;
  private firebase: null | FirebaseFacade;
  private userModel: UserModel;
  private config: Config;

  public constructor(
    authenticator: AuthenticatorFacade,
    database: DatabaseFacade,
    firebase: null | FirebaseFacade,
    userModel: UserModel,
    config: Config
  ) {
    super();
    this.authenticator = authenticator;
    this.database = database;
    this.firebase = firebase;
    this.userModel = userModel;
    this.config = config;
  }

  public options(): ControllerOptions<ChangeEmailAndPasswordRequest> {
    return {
      paths: ['/change-email-and-password'],
      allowedMethod: 'post',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new ChangeEmailAndPasswordRequestResolver(
        this.config.user.passwordMinLength
      ),
    };
  }

  public async handleRequest(
    req: ApiRequest<ChangeEmailAndPasswordRequest>,
    res: ApiResponse<ChangeEmailAndPasswordResponse>
  ): Promise<void> {
    const { newEmail, newPassword, currentPassword } = req.body;

    const userId = req.user.userId;

    const authDb = this.database.getDb('auth');

    const passwordCorrect = await this.authenticator.verifyPassword(
      currentPassword,
      req.userEncryptedPassword
    );

    if (passwordCorrect === true) {
      const newEncryptedPassword = await this.authenticator.encryptPassword(
        newPassword,
        this.config.user.passwordEncryptionSaltRounds
      );
      const newAccessKey = uuid.v4();

      await authDb.transaction(
        (tx): Promise<void> => {
          return this.userModel.updateUser(
            tx,
            {
              userId,
              email: newEmail,
            },
            newEncryptedPassword,
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

      if (this.firebase !== null) {
        await this.firebase.notifyUserChange(authDb, userId);
      }
    } else {
      res.error(401, { errorCode: ErrorCode.USER__WRONG_PASSWORD });
    }
  }
}
