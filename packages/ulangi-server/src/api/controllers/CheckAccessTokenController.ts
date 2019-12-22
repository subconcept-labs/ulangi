/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  CheckAccessTokenRequest,
  CheckAccessTokenResponse,
} from '@ulangi/ulangi-common/interfaces';
import { CheckAccessTokenRequestResolver } from '@ulangi/ulangi-common/resolvers';

import { AuthenticatorFacade } from '../../facades/AuthenticatorFacade';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class CheckAccessTokenController extends ApiController<
  CheckAccessTokenRequest,
  CheckAccessTokenResponse
> {
  private authenticator: AuthenticatorFacade;

  public constructor(authenticator: AuthenticatorFacade) {
    super();
    this.authenticator = authenticator;
  }

  public options(): ControllerOptions<CheckAccessTokenRequest> {
    return {
      paths: ['/check-access-token'],
      allowedMethod: 'post',
      authStrategies: null,
      requestResolver: new CheckAccessTokenRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<CheckAccessTokenRequest>,
    res: ApiResponse<CheckAccessTokenResponse>
  ): Promise<void> {
    const { accessToken } = req.body;

    const valid = await this.authenticator.isAccessTokenValid(accessToken);
    res.json({ valid });
  }
}
