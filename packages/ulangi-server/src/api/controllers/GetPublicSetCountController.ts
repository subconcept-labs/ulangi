/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  GetPublicSetCountRequest,
  GetPublicSetCountResponse,
} from '@ulangi/ulangi-common/interfaces';
import { GetPublicSetCountRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { LibraryFacade } from '@ulangi/ulangi-library';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class GetPublicSetCountController extends ApiController<
  GetPublicSetCountRequest,
  GetPublicSetCountResponse
> {
  private library: LibraryFacade;

  public constructor(library: LibraryFacade) {
    super();
    this.library = library;
  }

  public options(): ControllerOptions<GetPublicSetCountRequest> {
    return {
      paths: ['/get-public-set-count'],
      allowedMethod: 'get',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new GetPublicSetCountRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<GetPublicSetCountRequest>,
    res: ApiResponse<GetPublicSetCountResponse>
  ): Promise<void> {
    const { languageCodePair } = req.query;

    const count = await this.library.getPublicSetCount(languageCodePair);

    res.json({ count });
  }
}
