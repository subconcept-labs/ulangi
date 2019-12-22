/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';

import { VocabularyCategoryRowPreparer } from './VocabularyCategoryRowPreparer';

describe('VocabularyCategoryRowPreparer', (): void => {
  let vocabularyCategoryRowPreparer: VocabularyCategoryRowPreparer;
  let resetCurrentTime: () => void;

  beforeEach(
    (): void => {
      vocabularyCategoryRowPreparer = new VocabularyCategoryRowPreparer();
      resetCurrentTime = mockCurrentTime();
    }
  );

  afterEach(
    (): void => {
      resetCurrentTime();
    }
  );

  test('prepare row for upsert correctly', (): void => {
    const preparedRow = vocabularyCategoryRowPreparer.prepareUpsert(
      'userId',
      {
        categoryName: 'categoryName',
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
      },
      'vocabularyId'
    );

    expect(preparedRow).toEqual({
      userId: 'userId',
      vocabularyId: 'vocabularyId',
      categoryName: 'categoryName',
      createdAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(2, 'hours')
        .toDate(),
    });
  });

  test('prepare row for upsert fails because categoryName is empty', (): void => {
    expect(
      (): void => {
        vocabularyCategoryRowPreparer.prepareUpsert(
          'userId',
          {
            categoryName: '',
            createdAt: moment()
              .subtract(1, 'hours')
              .toDate(),
            updatedAt: moment()
              .subtract(2, 'hours')
              .toDate(),
          },
          'vocabularyId'
        );
      }
    ).toThrowWithMessage(Error, /categoryName/);
  });

  test('can prepare row for upsert', (): void => {
    const result = vocabularyCategoryRowPreparer.canPrepareUpsert(
      'userId',
      {
        categoryName: 'categoryName',
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
      },
      'vocabularyId'
    );
    expect(result).toEqual(true);
  });

  test('cannot prepare row for upsert because categoryName is empty', (): void => {
    const result = vocabularyCategoryRowPreparer.canPrepareUpsert(
      'userId',
      {
        categoryName: '',
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
      },
      'vocabularyId'
    );
    expect(result).toEqual(false);
  });
});
