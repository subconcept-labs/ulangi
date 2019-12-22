/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ApiScope, ErrorCode } from '@ulangi/ulangi-common/enums';
import {
  GetApiKeyRequest,
  GetApiKeyResponse,
} from '@ulangi/ulangi-common/interfaces';
import { GetApiKeyRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { ApiKeyModel, DatabaseFacade } from '@ulangi/ulangi-remote-database';
import * as moment from 'moment';
import * as uuid from 'uuid';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { AuthenticatorFacade } from '../../facades/AuthenticatorFacade';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class GetApiKeyController extends ApiController<
  GetApiKeyRequest,
  GetApiKeyResponse
> {
  private authenticator: AuthenticatorFacade;
  private database: DatabaseFacade;
  private apiKeyModel: ApiKeyModel;

  public constructor(
    authenticator: AuthenticatorFacade,
    database: DatabaseFacade,
    apiKeyModel: ApiKeyModel
  ) {
    super();
    this.authenticator = authenticator;
    this.database = database;
    this.apiKeyModel = apiKeyModel;
  }

  public options(): ControllerOptions<GetApiKeyRequest> {
    return {
      paths: ['/get-api-key'],
      allowedMethod: 'post',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new GetApiKeyRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<GetApiKeyRequest>,
    res: ApiResponse<GetApiKeyResponse>
  ): Promise<void> {
    const { password, apiScope, createIfNotExists } = req.body;

    const authDb = this.database.getDb('auth');

    const passwordCorrect = await this.authenticator.verifyPassword(
      password,
      req.userEncryptedPassword
    );

    // Check if password is correct
    if (passwordCorrect === true) {
      const userId = req.user.userId;

      const result = await this.apiKeyModel.getValidApiKeyByUserIdAndScope(
        authDb,
        userId,
        ApiScope.SYNC
      );

      if (result !== null) {
        res.json({
          apiKey: result.apiKey,
          expiredAt: result.expiredAt,
        });
      } else if (createIfNotExists === true) {
        const apiKey = uuid.v4();
        const expiredAt = moment()
          .add(6, 'months')
          .toDate();

        await authDb.transaction(
          (tx): Promise<void> => {
            return this.apiKeyModel.insertApiKey(tx, {
              apiKey,
              apiScope,
              userId,
              expiredAt,
            });
          }
        );
        res.json({
          apiKey,
          expiredAt,
        });
      } else {
        res.json({ apiKey: null, expiredAt: null });
      }
    } else {
      res.error(401, { errorCode: ErrorCode.USER__WRONG_PASSWORD });
    }
  }
}
