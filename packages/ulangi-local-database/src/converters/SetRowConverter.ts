/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import * as _ from 'lodash';
import * as moment from 'moment';

import { SetRow } from '../interfaces/SetRow';

export class SetRowConverter {
  public convertToSet(
    setRow: SetRow,
    extraData: readonly SetExtraDataItem[]
  ): Set {
    return {
      setId: setRow.setId,
      setName: setRow.setName,
      learningLanguageCode: setRow.learningLanguageCode,
      translatedToLanguageCode: setRow.translatedToLanguageCode,
      setStatus: setRow.setStatus,
      createdAt: moment.unix(setRow.createdAt).toDate(),
      updatedAt: moment.unix(setRow.updatedAt).toDate(),
      updatedStatusAt: moment.unix(setRow.updatedStatusAt).toDate(),
      firstSyncedAt:
        setRow.firstSyncedAt !== null
          ? moment.unix(setRow.firstSyncedAt).toDate()
          : null,
      lastSyncedAt:
        setRow.lastSyncedAt !== null
          ? moment.unix(setRow.lastSyncedAt).toDate()
          : null,
      extraData,
    };
  }

  public convertToPartialSet(
    setRow: DeepPartial<SetRow>,
    extraData: undefined | readonly DeepPartial<SetExtraDataItem>[]
  ): DeepPartial<Set> {
    return _.omitBy(
      {
        setId: setRow.setId,
        setName: setRow.setName,
        learningLanguageCode: setRow.learningLanguageCode,
        translatedToLanguageCode: setRow.translatedToLanguageCode,
        setStatus: setRow.setStatus,
        createdAt:
          typeof setRow.createdAt !== 'undefined' && setRow.createdAt !== null
            ? moment.unix(setRow.createdAt).toDate()
            : setRow.createdAt,
        updatedAt:
          typeof setRow.updatedAt !== 'undefined' && setRow.updatedAt !== null
            ? moment.unix(setRow.updatedAt).toDate()
            : setRow.updatedAt,
        updatedStatusAt:
          typeof setRow.updatedStatusAt !== 'undefined' &&
          setRow.updatedStatusAt !== null
            ? moment.unix(setRow.updatedStatusAt).toDate()
            : setRow.updatedStatusAt,
        firstSyncedAt:
          typeof setRow.firstSyncedAt !== 'undefined' &&
          setRow.firstSyncedAt !== null
            ? moment.unix(setRow.firstSyncedAt).toDate()
            : setRow.firstSyncedAt,
        lastSyncedAt:
          typeof setRow.lastSyncedAt !== 'undefined' &&
          setRow.lastSyncedAt !== null
            ? moment.unix(setRow.lastSyncedAt).toDate()
            : setRow.lastSyncedAt,
        extraData,
      },
      _.isUndefined
    );
  }
}
