/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  SearchPixabayImagesRequest,
  SearchPixabayImagesResponse,
} from '@ulangi/ulangi-common/interfaces';
import {
  SearchPixabayImagesRequestResolver,
  SearchPixabayImagesResponseResolver,
} from '@ulangi/ulangi-common/resolvers';
import axios from 'axios';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { Config } from '../../interfaces/Config';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class SearchPixabayImagesController extends ApiController<
  SearchPixabayImagesRequest,
  SearchPixabayImagesResponse
> {
  private searchPixabayImageResponseResolver = new SearchPixabayImagesResponseResolver();

  private config: Config;

  public constructor(config: Config) {
    super();
    this.config = config;
  }

  public options(): ControllerOptions<SearchPixabayImagesRequest> {
    return {
      paths: ['/search-pixabay-images'],
      allowedMethod: 'get',
      authStrategies: [
        AuthenticationStrategy.ACCESS_TOKEN,
        AuthenticationStrategy.SYNC_API_KEY,
      ],
      requestResolver: new SearchPixabayImagesRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<SearchPixabayImagesRequest>,
    res: ApiResponse<SearchPixabayImagesResponse>
  ): Promise<void> {
    const { q, image_type, page, safesearch } = req.query;

    const response = await axios.get(this.config.pixabay.apiUrl, {
      params: {
        key: this.config.pixabay.developerKey,
        q,
        image_type,
        page,
        safesearch,
      },
    });

    const { hits } = this.searchPixabayImageResponseResolver.resolve(
      response.data,
      true
    );

    res.json({ hits });
  }
}
