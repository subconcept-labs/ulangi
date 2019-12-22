/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import {
  DownloadUserRequest,
  DownloadUserResponse,
} from '@ulangi/ulangi-common/interfaces';
import { DatabaseFacade, UserModel } from '@ulangi/ulangi-remote-database';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class DownloadUserController extends ApiController<
  DownloadUserRequest,
  DownloadUserResponse
> {
  private database: DatabaseFacade;
  private userModel: UserModel;

  public constructor(database: DatabaseFacade, userModel: UserModel) {
    super();
    this.database = database;
    this.userModel = userModel;
  }

  public options(): ControllerOptions<DownloadUserRequest> {
    return {
      paths: ['/download-user'],
      allowedMethod: 'get',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: null,
    };
  }

  public async handleRequest(
    req: ApiRequest<DownloadUserRequest>,
    res: ApiResponse<DownloadUserResponse>
  ): Promise<void> {
    const authDb = this.database.getDb('auth');

    const userId = req.user.userId;

    const result = await this.userModel.getUserById(authDb, userId, true);

    if (result !== null) {
      const { user } = result;
      res.json({
        user,
        currentUser: user, // For backward compatible
      });
    } else {
      res.error(400, { errorCode: ErrorCode.USER__USER_NOT_FOUND });
    }
  }
}
