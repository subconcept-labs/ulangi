/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import {
  SignInRequest,
  SignInResponse,
} from '@ulangi/ulangi-common/interfaces';
import { SignInRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { DatabaseFacade, UserModel } from '@ulangi/ulangi-remote-database';

import { AuthenticatorFacade } from '../../facades/AuthenticatorFacade';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class SignInController extends ApiController<
  SignInRequest,
  SignInResponse
> {
  private authenticator: AuthenticatorFacade;
  private database: DatabaseFacade;
  private userModel: UserModel;

  public constructor(
    authenticator: AuthenticatorFacade,
    database: DatabaseFacade,
    userModel: UserModel
  ) {
    super();
    this.authenticator = authenticator;
    this.database = database;
    this.userModel = userModel;
  }

  public options(): ControllerOptions<SignInRequest> {
    return {
      paths: ['/sign-in'],
      allowedMethod: 'post',
      authStrategies: null,
      requestResolver: new SignInRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<SignInRequest>,
    res: ApiResponse<SignInResponse>
  ): Promise<void> {
    const { email, password } = req.body;

    const db = this.database.getDb('auth');

    const result = await this.userModel.getUserByEmail(db, email, true);

    if (result !== null) {
      const { user, password: encryptedPassword, accessKey } = result;
      const passwordCorrect = await this.authenticator.verifyPassword(
        password,
        encryptedPassword
      );
      if (passwordCorrect === true) {
        const accessToken = this.authenticator.createAccessToken(
          user.userId,
          accessKey
        );

        res.json({ currentUser: user, accessToken });
      } else {
        res.error(401, { errorCode: ErrorCode.USER__WRONG_PASSWORD });
      }
    } else {
      res.error(400, { errorCode: ErrorCode.USER__EMAIL_NOT_FOUND });
    }
  }
}
