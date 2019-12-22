/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';

import { VocabularyWritingRowPreparer } from './VocabularyWritingRowPreparer';

describe('VocabularyWritingRowPreparer', (): void => {
  let vocabularyWritingRowPreparer: VocabularyWritingRowPreparer;
  let resetCurrentTime: () => void;

  beforeEach(
    (): void => {
      resetCurrentTime = mockCurrentTime();
      vocabularyWritingRowPreparer = new VocabularyWritingRowPreparer();
    }
  );

  afterEach(
    (): void => {
      resetCurrentTime();
    }
  );

  test('prepare row for local upsert should prepare row correctly', (): void => {
    const preparedRow = vocabularyWritingRowPreparer.prepareUpsert(
      {
        lastWrittenAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        level: 5,
        disabled: true,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        firstSyncedAt: moment().toDate(),
        lastSyncedAt: moment().toDate(),
      },
      'vocabularyId',
      'local'
    );

    expect(preparedRow).toEqual({
      vocabularyId: 'vocabularyId',
      lastWrittenAt: moment()
        .subtract(1, 'hours')
        .unix(),
      level: 5,
      disabled: 1,
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
      firstSyncedAt: null,
      lastSyncedAt: null,
    });
  });

  test('prepare row for local upsert automatically set createdAt and updatedAt', (): void => {
    const preparedRow = vocabularyWritingRowPreparer.prepareUpsert(
      {
        lastWrittenAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        level: 5,
        disabled: true,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        firstSyncedAt: moment().toDate(),
        lastSyncedAt: moment().toDate(),
      },
      'vocabularyId',
      'local'
    );

    expect(preparedRow.createdAt).toEqual(moment().unix());
    expect(preparedRow.updatedAt).toEqual(moment().unix());
  });

  test('prepare row for local upsert automatically set firstSyncedAt and lastSyncedAt to null', (): void => {
    const preparedRow = vocabularyWritingRowPreparer.prepareUpsert(
      {
        lastWrittenAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        level: 5,
        disabled: true,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        firstSyncedAt: null,
        lastSyncedAt: null,
      },
      'vocabularyId',
      'local'
    );

    expect(preparedRow.firstSyncedAt).toEqual(null);
    expect(preparedRow.lastSyncedAt).toEqual(null);
  });

  test('prepare row for local upsert allow level, lastWrittenAt and disabled to be optional', (): void => {
    const preparedRow = vocabularyWritingRowPreparer.prepareUpsert(
      {
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hours')
          .toDate(),
      },
      'vocabularyId',
      'local'
    );

    expect(preparedRow.level).toBeUndefined();
    expect(preparedRow.lastWrittenAt).toBeUndefined();
    expect(preparedRow.disabled).toBeUndefined();
  });

  test('prepare row for remote upsert should prepare row correctly', (): void => {
    const preparedRow = vocabularyWritingRowPreparer.prepareUpsert(
      {
        lastWrittenAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        level: 5,
        disabled: true,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        firstSyncedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        lastSyncedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
      },
      'vocabularyId',
      'remote'
    );

    expect(preparedRow).toEqual({
      vocabularyId: 'vocabularyId',
      lastWrittenAt: moment()
        .subtract(1, 'hours')
        .unix(),
      level: 5,
      disabled: 1,
      createdAt: moment()
        .subtract(1, 'hours')
        .unix(),
      updatedAt: moment()
        .subtract(1, 'hours')
        .unix(),
      firstSyncedAt: moment()
        .subtract(2, 'hours')
        .unix(),
      lastSyncedAt: moment()
        .subtract(2, 'hours')
        .unix(),
    });
  });
});
