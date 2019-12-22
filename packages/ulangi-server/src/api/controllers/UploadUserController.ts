/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import {
  UploadUserRequest,
  UploadUserResponse,
} from '@ulangi/ulangi-common/interfaces';
import { UploadUserRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { DatabaseFacade, UserModel } from '@ulangi/ulangi-remote-database';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { FirebaseFacade } from '../../facades/FirebaseFacade';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class UploadUserController extends ApiController<
  UploadUserRequest,
  UploadUserResponse
> {
  private database: DatabaseFacade;
  private firebase: FirebaseFacade;
  private userModel: UserModel;

  public constructor(
    database: DatabaseFacade,
    firebase: FirebaseFacade,
    userModel: UserModel
  ) {
    super();
    this.database = database;
    this.firebase = firebase;
    this.userModel = userModel;
  }

  public options(): ControllerOptions<UploadUserRequest> {
    return {
      paths: ['/upload-user'],
      allowedMethod: 'post',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new UploadUserRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<UploadUserRequest>,
    res: ApiResponse<UploadUserResponse>
  ): Promise<void> {
    const { user } = req.body;

    const userId = req.user.userId;
    if (userId === user.userId) {
      const authDb = this.database.getDb('auth');

      await authDb.transaction(
        (tx): Promise<void> => {
          return this.userModel.updateUser(
            tx,
            {
              userId,
              // Upload can only change updatedAt and extraData
              updatedAt: user.updatedAt,
              extraData: user.extraData,
            },
            undefined,
            undefined
          );
        }
      );

      res.json({ success: true });

      await this.firebase.notifyUserChange(authDb, userId);
    } else {
      res.error(400, { errorCode: ErrorCode.GENERAL__INVALID_REQUEST });
    }
  }
}
