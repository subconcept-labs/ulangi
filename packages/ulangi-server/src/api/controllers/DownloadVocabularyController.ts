/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import {
  DownloadVocabularyRequest,
  DownloadVocabularyResponse,
} from '@ulangi/ulangi-common/interfaces';
import { DownloadVocabularyRequestResolver } from '@ulangi/ulangi-common/resolvers';
import {
  DatabaseFacade,
  VocabularyModel,
} from '@ulangi/ulangi-remote-database';
import * as _ from 'lodash';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class DownloadVocabularyController extends ApiController<
  DownloadVocabularyRequest,
  DownloadVocabularyResponse
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

  public options(): ControllerOptions<DownloadVocabularyRequest> {
    return {
      paths: ['/download-vocabulary'],
      allowedMethod: 'get',
      authStrategies: [
        AuthenticationStrategy.ACCESS_TOKEN,
        AuthenticationStrategy.SYNC_API_KEY,
      ],
      requestResolver: new DownloadVocabularyRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<DownloadVocabularyRequest>,
    res: ApiResponse<DownloadVocabularyResponse>
  ): Promise<void> {
    const { startAt, softLimit, setId } = req.query;

    const userId = req.user.userId;
    const shardId = req.userShardId;
    const userDb = this.database.getDb(shardId);

    const {
      vocabularyList,
      vocabularyIdSetIdPairs,
      noMore,
    } = await this.vocabularyModel.getVocabularyListByLastSyncTime(
      userDb,
      userId,
      softLimit,
      startAt,
      setId,
      true
    );

    if (noMore === false && vocabularyList.length > 0) {
      // Since vocabulary with max lastSyncedAt will be downloaded again in
      // the next download request, we need to send only one vocabulary with max
      // lastSyncedAt to reduce bandwidth and local inserts.
      const maxVocabulary = assertExists(
        _.maxBy(vocabularyList, 'lastSyncedAt')
      );
      const prunedVocabularyList = vocabularyList
        .filter(
          (vocabulary): boolean =>
            assertExists(vocabulary.lastSyncedAt) <
            assertExists(maxVocabulary.lastSyncedAt)
        )
        .concat([maxVocabulary]);

      const prunedVocabularyIds = prunedVocabularyList.map(
        (vocabulary): string => vocabulary.vocabularyId
      );
      const prunedVocabularyIdSetIdPairs = vocabularyIdSetIdPairs.filter(
        ([vocabularyId]): boolean =>
          _.includes(prunedVocabularyIds, vocabularyId)
      );

      res.json({
        vocabularyList: prunedVocabularyList,
        vocabularySetIdPairs: prunedVocabularyIdSetIdPairs,
        noMore,
      });
    } else {
      res.json({
        vocabularyList,
        vocabularySetIdPairs: vocabularyIdSetIdPairs,
        noMore,
      });
    }
  }
}
