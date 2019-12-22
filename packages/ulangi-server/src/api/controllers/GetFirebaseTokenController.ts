/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  GetFirebaseTokenRequest,
  GetFirebaseTokenResponse,
} from '@ulangi/ulangi-common/interfaces';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { FirebaseFacade } from '../../facades/FirebaseFacade';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class GetFirebaseTokenController extends ApiController<
  GetFirebaseTokenRequest,
  GetFirebaseTokenResponse
> {
  private firebase: FirebaseFacade;

  public constructor(firebase: FirebaseFacade) {
    super();
    this.firebase = firebase;
  }

  public options(): ControllerOptions<GetFirebaseTokenRequest> {
    return {
      paths: ['/get-firebase-token'],
      allowedMethod: 'get',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: null,
    };
  }

  public async handleRequest(
    req: ApiRequest<GetFirebaseTokenRequest>,
    res: ApiResponse<GetFirebaseTokenResponse>
  ): Promise<void> {
    const userId = req.user.userId;
    const existed = await this.firebase.userExists(userId);
    if (existed === false) {
      await this.firebase.createUser(userId);
    }

    const firebaseToken = await this.firebase.createCustomToken(userId);

    res.json({ firebaseToken });
  }
}
