/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import {
  ChangeEmailRequest,
  ChangeEmailResponse,
} from '@ulangi/ulangi-common/interfaces';
import { ChangeEmailRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { DatabaseFacade, UserModel } from '@ulangi/ulangi-remote-database';
import * as uuid from 'uuid';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { AuthenticatorFacade } from '../../facades/AuthenticatorFacade';
import { FirebaseFacade } from '../../facades/FirebaseFacade';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class ChangeEmailController extends ApiController<
  ChangeEmailRequest,
  ChangeEmailResponse
> {
  private authenticator: AuthenticatorFacade;
  private database: DatabaseFacade;
  private firebase: FirebaseFacade;
  private userModel: UserModel;

  public constructor(
    authenticator: AuthenticatorFacade,
    database: DatabaseFacade,
    firebase: FirebaseFacade,
    userModel: UserModel
  ) {
    super();
    this.authenticator = authenticator;
    this.database = database;
    this.firebase = firebase;
    this.userModel = userModel;
  }

  public options(): ControllerOptions<ChangeEmailRequest> {
    return {
      paths: ['/change-email'],
      allowedMethod: 'post',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new ChangeEmailRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<ChangeEmailRequest>,
    res: ApiResponse<ChangeEmailResponse>
  ): Promise<void> {
    const { newEmail, password } = req.body;

    const authDb = this.database.getDb('auth');

    const passwordCorrect = await this.authenticator.verifyPassword(
      password,
      req.userEncryptedPassword
    );

    // Check if password is correct
    if (passwordCorrect === true) {
      const newAccessKey = uuid.v4();

      const userId = req.user.userId;

      const { errorCode } = await authDb.transaction(
        (tx): Promise<{ errorCode: null | string }> => {
          return new Promise(
            async (resolve, reject): Promise<void> => {
              try {
                const existed = await this.userModel.emailExists(tx, newEmail);
                if (existed) {
                  resolve({
                    errorCode: ErrorCode.USER__EMAIL_ALREADY_REGISTERED,
                  });
                } else {
                  await this.userModel.updateUser(
                    tx,
                    {
                      userId,
                      email: newEmail,
                    },
                    undefined,
                    newAccessKey
                  );
                  resolve({ errorCode: null });
                }
              } catch (error) {
                reject(error);
              }
            }
          );
        }
      );

      if (errorCode !== null) {
        res.error(400, { errorCode });
      } else {
        const accessToken = this.authenticator.createAccessToken(
          userId,
          newAccessKey
        );

        res.json({
          success: true,
          accessToken,
        });

        await this.firebase.notifyUserChange(authDb, userId);
      }
    } else {
      res.error(401, { errorCode: ErrorCode.USER__WRONG_PASSWORD });
    }
  }
}
