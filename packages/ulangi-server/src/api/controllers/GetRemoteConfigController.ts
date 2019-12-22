/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  GetRemoteConfigRequest,
  GetRemoteConfigResponse,
} from '@ulangi/ulangi-common/interfaces';

import { RemoteConfigFacade } from '../../facades/RemoteConfigFacade';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class GetRemoteConfigController extends ApiController<
  GetRemoteConfigRequest,
  GetRemoteConfigResponse
> {
  private remoteConfig: RemoteConfigFacade;

  public constructor(remoteConfig: RemoteConfigFacade) {
    super();
    this.remoteConfig = remoteConfig;
  }

  public options(): ControllerOptions<GetRemoteConfigRequest> {
    return {
      paths: ['/get-remote-config'],
      allowedMethod: 'get',
      authStrategies: null,
      requestResolver: null,
    };
  }

  public async handleRequest(
    _: ApiRequest<GetRemoteConfigRequest>,
    res: ApiResponse<GetRemoteConfigResponse>
  ): Promise<void> {
    res.json({
      remoteConfig: await this.remoteConfig.getRemoteConfig(),
    });
  }
}
