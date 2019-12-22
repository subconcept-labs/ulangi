/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  DeleteApiKeyRequest,
  DeleteApiKeyResponse,
} from '@ulangi/ulangi-common/interfaces';
import { DeleteApiKeyRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { ApiKeyModel, DatabaseFacade } from '@ulangi/ulangi-remote-database';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class DeleteApiKeyController extends ApiController<
  DeleteApiKeyRequest,
  DeleteApiKeyResponse
> {
  private database: DatabaseFacade;
  private apiKeyModel: ApiKeyModel;

  public constructor(database: DatabaseFacade, apiKeyModel: ApiKeyModel) {
    super();
    this.database = database;
    this.apiKeyModel = apiKeyModel;
  }

  public options(): ControllerOptions<DeleteApiKeyRequest> {
    return {
      paths: ['/delete-api-key'],
      allowedMethod: 'post',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new DeleteApiKeyRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<DeleteApiKeyRequest>,
    res: ApiResponse<DeleteApiKeyResponse>
  ): Promise<void> {
    const { apiKey } = req.body;

    const userId = req.user.userId;

    const authDb = this.database.getDb('auth');

    const success = await authDb.transaction(
      async (tx): Promise<boolean> => {
        const valid = await this.apiKeyModel.isApiKeyBelongingToUser(
          tx,
          apiKey,
          userId
        );

        if (valid === true) {
          await this.apiKeyModel.deleteApiKey(tx, apiKey);
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      }
    );

    res.json({ success });
  }
}
