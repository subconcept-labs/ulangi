/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';

import { FieldState } from '../enums/FieldState';
import { VocabularyCategoryRowPreparer } from './VocabularyCategoryRowPreparer';

describe('VocabularyCategoryRowPreparer', (): void => {
  let vocabularyCategoryRowPreparer: VocabularyCategoryRowPreparer;
  let restoreCurrentTime: () => void;

  beforeEach(
    (): void => {
      restoreCurrentTime = mockCurrentTime();
      vocabularyCategoryRowPreparer = new VocabularyCategoryRowPreparer();
    }
  );

  afterEach(
    (): void => {
      restoreCurrentTime();
    }
  );

  test('prepare row for local upsert correctly', (): void => {
    const preparedRow = vocabularyCategoryRowPreparer.prepareUpsert(
      {
        categoryName: 'categoryName',
      },
      'vocabularyId',
      'local'
    );

    expect(preparedRow).toEqual({
      vocabularyId: 'vocabularyId',
      categoryName: 'categoryName',
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
      firstSyncedAt: null,
      lastSyncedAt: null,
      fieldState: FieldState.TO_BE_SYNCED,
    });
  });

  test('prepare row for local upsert requires categoryName', (): void => {
    expect(
      (): void => {
        vocabularyCategoryRowPreparer.prepareUpsert(
          {},
          'vocabularyId',
          'local'
        );
      }
    ).toThrowWithMessage(Error, /categoryName/);
  });

  test('prepare row for local upsert should automatically set createdAt and updatedAt to current time', (): void => {
    const preparedRow = vocabularyCategoryRowPreparer.prepareUpsert(
      {
        categoryName: 'categoryName',
      },
      'vocabularyId',
      'local'
    );

    expect(preparedRow).toMatchObject({
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
    });
  });

  test('prepare row for local upsert should set fieldState to TO_BE_SYNCED', (): void => {
    const preparedRow = vocabularyCategoryRowPreparer.prepareUpsert(
      {
        categoryName: 'categoryName',
      },
      'vocabularyId',
      'local'
    );

    expect(preparedRow).toMatchObject({
      fieldState: FieldState.TO_BE_SYNCED,
    });
  });

  test('prepare row for remote upsert should prepare row correctly', (): void => {
    const preparedRow = vocabularyCategoryRowPreparer.prepareUpsert(
      {
        categoryName: 'categoryName',
        createdAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        updatedAt: moment()
          .subtract(2, 'hour')
          .toDate(),
        firstSyncedAt: moment()
          .subtract(3, 'hour')
          .toDate(),
        lastSyncedAt: moment()
          .subtract(4, 'hour')
          .toDate(),
      },
      'vocabularyId',
      'remote'
    );

    expect(preparedRow).toEqual({
      vocabularyId: 'vocabularyId',
      categoryName: 'categoryName',
      createdAt: moment()
        .subtract(1, 'hour')
        .unix(),
      updatedAt: moment()
        .subtract(2, 'hour')
        .unix(),
      firstSyncedAt: moment()
        .subtract(3, 'hour')
        .unix(),
      lastSyncedAt: moment()
        .subtract(4, 'hour')
        .unix(),
      fieldState: FieldState.SYNCED,
    });
  });

  test('prepare row for remote upsert requires firstSyncedAt & lastSyncedAt', (): void => {
    expect(
      (): void => {
        vocabularyCategoryRowPreparer.prepareUpsert(
          {
            categoryName: 'categoryName',
          },
          'vocabularyId',
          'remote'
        );
      }
    ).toThrowWithMessage(Error, /firstSyncedAt/);

    expect(
      (): void => {
        vocabularyCategoryRowPreparer.prepareUpsert(
          {
            categoryName: 'categoryName',
            firstSyncedAt: moment().unix(),
          },
          'vocabularyId',
          'remote'
        );
      }
    ).toThrowWithMessage(Error, /lastSyncedAt/);
  });

  test('prepare row for remote upsert should set fieldState to SYNCED', (): void => {
    const preparedRow = vocabularyCategoryRowPreparer.prepareUpsert(
      {
        categoryName: 'categoryName',
        firstSyncedAt: moment().unix(),
        lastSyncedAt: moment().unix(),
      },
      'vocabularyId',
      'remote'
    );

    expect(preparedRow).toMatchObject({ fieldState: FieldState.SYNCED });
  });
});
