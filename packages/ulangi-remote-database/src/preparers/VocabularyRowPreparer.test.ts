/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';

import { VocabularyRowPreparer } from './VocabularyRowPreparer';

describe('VocabularyRowPreparer', (): void => {
  let vocabularyRowPreparer: VocabularyRowPreparer;
  let resetCurrentTime: () => void;

  beforeEach(
    (): void => {
      vocabularyRowPreparer = new VocabularyRowPreparer();
      resetCurrentTime = mockCurrentTime();
    }
  );

  afterEach(
    (): void => {
      resetCurrentTime();
    }
  );

  test('prepare row for insert correctly', (): void => {
    const preparedRow = vocabularyRowPreparer.prepareInsert(
      'userId',
      {
        vocabularyId: 'vocabularyId',
        vocabularyStatus: VocabularyStatus.ACTIVE,
        vocabularyText: 'vocabularyText',
        level: 2,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        lastLearnedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(3, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(4, 'hours')
          .toDate(),
      },
      'setId'
    );

    expect(preparedRow).toEqual({
      userId: 'userId',
      setId: 'setId',
      vocabularyId: 'vocabularyId',
      vocabularyStatus: VocabularyStatus.ACTIVE,
      vocabularyText: 'vocabularyText',
      level: 2,
      createdAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      lastLearnedAt: moment()
        .subtract(2, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(3, 'hours')
        .toDate(),
      updatedStatusAt: moment()
        .subtract(4, 'hours')
        .toDate(),
    });
  });

  test('prepare row for insert fails because vocabularyText is empty', (): void => {
    expect(
      (): void => {
        vocabularyRowPreparer.prepareInsert(
          'userId',
          {
            vocabularyId: 'vocabularyId',
            vocabularyStatus: VocabularyStatus.ACTIVE,
            vocabularyText: '',
            level: 2,
            createdAt: moment()
              .subtract(1, 'hours')
              .toDate(),
            lastLearnedAt: moment()
              .subtract(2, 'hours')
              .toDate(),
            updatedAt: moment()
              .subtract(3, 'hours')
              .toDate(),
            updatedStatusAt: moment()
              .subtract(4, 'hours')
              .toDate(),
          },
          'setId'
        );
      }
    ).toThrowWithMessage(Error, /vocabularyText/);
  });

  test('can prepare row for insert', (): void => {
    const result = vocabularyRowPreparer.canPrepareInsert(
      'userId',
      {
        vocabularyId: 'vocabularyId',
        vocabularyStatus: VocabularyStatus.ACTIVE,
        vocabularyText: 'vocabularyText',
        level: 2,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        lastLearnedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(3, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(4, 'hours')
          .toDate(),
      },
      'setId'
    );
    expect(result).toEqual(true);
  });

  test('cannot prepare row for insert because vocabularyText is empty', (): void => {
    const result = vocabularyRowPreparer.canPrepareUpdate(
      'userId',
      {
        vocabularyId: 'vocabularyId',
        vocabularyStatus: VocabularyStatus.ACTIVE,
        vocabularyText: '',
        level: 2,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        lastLearnedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(3, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(4, 'hours')
          .toDate(),
      },
      'setId'
    );
    expect(result).toEqual(false);
  });

  test('prepare row for update correctly', (): void => {
    const preparedRow = vocabularyRowPreparer.prepareUpdate(
      'userId',
      {
        vocabularyId: 'vocabularyId',
        vocabularyStatus: VocabularyStatus.ACTIVE,
        vocabularyText: 'vocabularyText',
        level: 2,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        lastLearnedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(3, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(4, 'hours')
          .toDate(),
      },
      'setId'
    );

    expect(preparedRow).toEqual({
      userId: 'userId',
      setId: 'setId',
      vocabularyId: 'vocabularyId',
      vocabularyStatus: VocabularyStatus.ACTIVE,
      vocabularyText: 'vocabularyText',
      level: 2,
      createdAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      lastLearnedAt: moment()
        .subtract(2, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(3, 'hours')
        .toDate(),
      updatedStatusAt: moment()
        .subtract(4, 'hours')
        .toDate(),
    });
  });

  test('prepare row for update fails because vocabularyText is empty', (): void => {
    expect(
      (): void => {
        vocabularyRowPreparer.prepareUpdate(
          'userId',
          {
            vocabularyId: 'vocabularyId',
            vocabularyStatus: VocabularyStatus.ACTIVE,
            vocabularyText: '',
            level: 2,
            createdAt: moment()
              .subtract(1, 'hours')
              .toDate(),
            lastLearnedAt: moment()
              .subtract(2, 'hours')
              .toDate(),
            updatedAt: moment()
              .subtract(3, 'hours')
              .toDate(),
            updatedStatusAt: moment()
              .subtract(4, 'hours')
              .toDate(),
          },
          'setId'
        );
      }
    ).toThrowWithMessage(Error, /vocabularyText/);
  });

  test('can prepare row for update', (): void => {
    const result = vocabularyRowPreparer.canPrepareUpdate(
      'userId',
      {
        vocabularyId: 'vocabularyId',
        vocabularyStatus: VocabularyStatus.ACTIVE,
        vocabularyText: 'vocabularyText',
        level: 2,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        lastLearnedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(3, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(4, 'hours')
          .toDate(),
      },
      'setId'
    );
    expect(result).toEqual(true);
  });

  test('cannot prepare row for update because vocabularyText is empty', (): void => {
    const result = vocabularyRowPreparer.canPrepareUpdate(
      'userId',
      {
        vocabularyId: 'vocabularyId',
        vocabularyStatus: VocabularyStatus.ACTIVE,
        vocabularyText: '',
        level: 2,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        lastLearnedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(3, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(4, 'hours')
          .toDate(),
      },
      'setId'
    );
    expect(result).toEqual(false);
  });
});
