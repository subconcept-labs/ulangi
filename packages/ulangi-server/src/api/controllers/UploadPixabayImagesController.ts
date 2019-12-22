/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  UploadPixabayImagesRequest,
  UploadPixabayImagesResponse,
} from '@ulangi/ulangi-common/interfaces';
import { UploadPixabayImagesRequestResolver } from '@ulangi/ulangi-common/resolvers';

import { ImageUploaderAdapter } from '../../adapters/ImageUploaderAdapter';
import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { Config } from '../../interfaces/Config';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class UploadPixabayImagesController extends ApiController<
  UploadPixabayImagesRequest,
  UploadPixabayImagesResponse
> {
  private imageUploader: ImageUploaderAdapter;
  private config: Config;

  public constructor(imageUploader: ImageUploaderAdapter, config: Config) {
    super();
    this.imageUploader = imageUploader;
    this.config = config;
  }

  public options(): ControllerOptions<UploadPixabayImagesRequest> {
    return {
      paths: ['/upload-pixabay-images'],
      allowedMethod: 'post',
      authStrategies: [
        AuthenticationStrategy.ACCESS_TOKEN,
        AuthenticationStrategy.SYNC_API_KEY,
      ],
      requestResolver: new UploadPixabayImagesRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<UploadPixabayImagesRequest>,
    res: ApiResponse<UploadPixabayImagesResponse>
  ): Promise<void> {
    const { images } = req.body;

    const fileNames = await this.imageUploader.uploadImages(
      images,
      this.config.pixabay.bucketName,
      this.config.pixabay.folderName
    );

    res.json({
      urls: fileNames.map(
        (fileName): string => this.config.pixabay.imageUrl + '/' + fileName
      ),
    });
  }
}
