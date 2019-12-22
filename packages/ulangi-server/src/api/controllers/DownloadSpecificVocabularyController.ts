/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  DownloadSpecificVocabularyRequest,
  DownloadSpecificVocabularyResponse,
} from '@ulangi/ulangi-common/interfaces';
import { DownloadSpecificVocabularyRequestResolver } from '@ulangi/ulangi-common/resolvers';
import {
  DatabaseFacade,
  VocabularyModel,
} from '@ulangi/ulangi-remote-database';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class DownloadSpecificVocabularyController extends ApiController<
  DownloadSpecificVocabularyRequest,
  DownloadSpecificVocabularyResponse
> {
  private database: DatabaseFacade;
  private vocabularyModel: VocabularyModel;

  public constructor(
    database: DatabaseFacade,
    vocabularyModel: VocabularyModel
  ) {
    super();
    this.database = database;
    this.vocabularyModel = vocabularyModel;
  }

  public options(): ControllerOptions<DownloadSpecificVocabularyRequest> {
    return {
      paths: ['/download-specific-vocabulary'],
      allowedMethod: 'post',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new DownloadSpecificVocabularyRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<DownloadSpecificVocabularyRequest>,
    res: ApiResponse<DownloadSpecificVocabularyResponse>
  ): Promise<void> {
    const { vocabularyIds } = req.body;

    const userId = req.user.userId;
    const shardId = req.userShardId;
    const userDb = this.database.getDb(shardId);

    const {
      vocabularyList,
      vocabularyIdSetIdPairs,
    } = await this.vocabularyModel.getVocabularyByIds(
      userDb,
      userId,
      vocabularyIds,
      true
    );

    res.json({
      vocabularyList,
      vocabularySetIdPairs: vocabularyIdSetIdPairs,
    });
  }
}
