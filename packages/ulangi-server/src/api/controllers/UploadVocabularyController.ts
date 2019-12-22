/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import {
  UploadVocabularyRequest,
  UploadVocabularyResponse,
  Vocabulary,
} from '@ulangi/ulangi-common/interfaces';
import { UploadVocabularyRequestResolver } from '@ulangi/ulangi-common/resolvers';
import {
  DatabaseFacade,
  SetModel,
  VocabularyModel,
} from '@ulangi/ulangi-remote-database';
import * as _ from 'lodash';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { FirebaseFacade } from '../../facades/FirebaseFacade';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class UploadVocabularyController extends ApiController<
  UploadVocabularyRequest,
  UploadVocabularyResponse
> {
  private database: DatabaseFacade;
  private firebase: FirebaseFacade;
  private vocabularyModel: VocabularyModel;
  private setModel: SetModel;

  public constructor(
    database: DatabaseFacade,
    firebase: FirebaseFacade,
    vocabularyModel: VocabularyModel,
    setModel: SetModel
  ) {
    super();
    this.database = database;
    this.firebase = firebase;
    this.vocabularyModel = vocabularyModel;
    this.setModel = setModel;
  }

  public options(): ControllerOptions<UploadVocabularyRequest> {
    return {
      paths: ['/upload-vocabulary'],
      allowedMethod: 'post',
      authStrategies: [
        AuthenticationStrategy.ACCESS_TOKEN,
        AuthenticationStrategy.SYNC_API_KEY,
      ],
      requestResolver: new UploadVocabularyRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<UploadVocabularyRequest>,
    res: ApiResponse<UploadVocabularyResponse>
  ): Promise<void> {
    const { vocabularyList, vocabularySetIdPairs } = req.body;

    const userId = req.user.userId;
    const shardDb = this.database.getDb(req.userShardId);

    const vocabularyIdSetIdMap = _.fromPairs(vocabularySetIdPairs);

    // check setIds exist
    const { existingSetIds } = await this.setModel.getExistingSetIds(
      shardDb,
      userId,
      vocabularySetIdPairs.map(([, setId]): string => setId)
    );

    // filter invalid
    const invalidVocabularyIds = vocabularySetIdPairs
      .filter(
        ([, setId]): boolean => {
          return !_.includes(existingSetIds, setId);
        }
      )
      .map(([vocabularyId]): string => vocabularyId);

    const validVocabularyList = vocabularyList.filter(
      (vocabulary): boolean => {
        return !_.includes(invalidVocabularyIds, vocabulary.vocabularyId);
      }
    );

    await shardDb.transaction(
      async (tx): Promise<void> => {
        return this.vocabularyModel.upsertMultipleVocabulary(
          tx,
          userId,
          validVocabularyList.map(
            (vocabulary): [DeepPartial<Vocabulary>, undefined | string] => {
              return [
                vocabulary,
                vocabularyIdSetIdMap[assertExists(vocabulary.vocabularyId)],
              ];
            }
          )
        );
      }
    );

    res.json({
      acknowledged: validVocabularyList.map(
        (vocabulary): string => assertExists(vocabulary.vocabularyId)
      ),
    });

    await this.firebase.notifyVocabularyChange(shardDb, userId);
  }
}
