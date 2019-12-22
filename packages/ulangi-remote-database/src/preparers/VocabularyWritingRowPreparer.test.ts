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
  let restoreCurrentTime: () => void;

  beforeEach(
    (): void => {
      vocabularyWritingRowPreparer = new VocabularyWritingRowPreparer();
      restoreCurrentTime = mockCurrentTime();
    }
  );

  afterEach(
    (): void => {
      restoreCurrentTime();
    }
  );

  test('prepare row for upsert correctly', (): void => {
    const preparedRow = vocabularyWritingRowPreparer.prepareUpsert(
      'userId',
      {
        level: 2,
        lastWrittenAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        disabled: false,
        createdAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(3, 'hours')
          .toDate(),
        firstSyncedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        secondSyncedAt: moment()
          .subtract(3, 'hours')
          .toDate(),
      },
      'vocabularyId'
    );

    expect(preparedRow).toEqual({
      userId: 'userId',
      vocabularyId: 'vocabularyId',
      level: 2,
      lastWrittenAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      disabled: 0,
      createdAt: moment()
        .subtract(2, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(3, 'hours')
        .toDate(),
    });
  });

  test('prepare row for upsert fails because level is invalid', (): void => {
    expect(
      (): void => {
        vocabularyWritingRowPreparer.prepareUpsert(
          'userId',
          {
            level: 'invalid',
            lastWrittenAt: moment()
              .subtract(1, 'hours')
              .toDate(),
            disabled: false,
            createdAt: moment()
              .subtract(2, 'hours')
              .toDate(),
            updatedAt: moment()
              .subtract(3, 'hours')
              .toDate(),
            firstSyncedAt: moment()
              .subtract(2, 'hours')
              .toDate(),
            secondSyncedAt: moment()
              .subtract(3, 'hours')
              .toDate(),
          },
          'vocabularyId'
        );
      }
    ).toThrowWithMessage(Error, /level/);
  });

  test('can prepare row for upsert', (): void => {
    const result = vocabularyWritingRowPreparer.canPrepareUpsert(
      'userId',
      {
        level: 2,
        lastWrittenAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        disabled: false,
        createdAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(3, 'hours')
          .toDate(),
        firstSyncedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        secondSyncedAt: moment()
          .subtract(3, 'hours')
          .toDate(),
      },
      'vocabularyId'
    );

    expect(result).toEqual(true);
  });

  test('cannot prepare row for upsert because level is invalid', (): void => {
    const result = vocabularyWritingRowPreparer.canPrepareUpsert(
      'userId',
      {
        level: 'invalid',
        lastWrittenAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        disabled: false,
        createdAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(3, 'hours')
          .toDate(),
        firstSyncedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        secondSyncedAt: moment()
          .subtract(3, 'hours')
          .toDate(),
      },
      'vocabularyId'
    );

    expect(result).toEqual(false);
  });
});
