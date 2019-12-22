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

  test('prepare schmea for local insert correctly', (): void => {
    const preparedRow = vocabularyRowPreparer.prepareInsert(
      {
        vocabularyId: 'vocabularyId',
        vocabularyText: 'vocabularyText',
        vocabularyStatus: VocabularyStatus.ACTIVE,
        lastLearnedAt: null,
        level: 0,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        firstSyncedAt: moment().toDate(),
        lastSyncedAt: moment().toDate(),
        definitions: [],
        extraData: [],
      },
      'setId',
      'local'
    );

    expect(preparedRow).toEqual({
      setId: 'setId',
      vocabularyId: 'vocabularyId',
      vocabularyText: 'vocabularyText',
      vocabularyStatus: VocabularyStatus.ACTIVE,
      lastLearnedAt: null,
      level: 0,
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
      updatedStatusAt: moment().unix(),
      firstSyncedAt: null,
      lastSyncedAt: null,
    });
  });

  test('prepare row for local insert should automatically set createdAt, updatedAt and updatedStatusAt', (): void => {
    const preparedRow = vocabularyRowPreparer.prepareInsert(
      {
        vocabularyId: 'vocabularyId',
        vocabularyText: 'vocabularyText',
        vocabularyStatus: VocabularyStatus.ACTIVE,
        lastLearnedAt: null,
        level: 0,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        firstSyncedAt: moment().toDate(),
        lastSyncedAt: moment().toDate(),
        definitions: [],
        extraData: [],
      },
      'setId',
      'local'
    );

    expect(preparedRow.createdAt).toEqual(moment().unix());
    expect(preparedRow.updatedAt).toEqual(moment().unix());
    expect(preparedRow.updatedStatusAt).toEqual(moment().unix());
  });

  test('prepare row for local insert should automatically set firstSyncedAt and lastLearnedAt to null', (): void => {
    const preparedRow = vocabularyRowPreparer.prepareInsert(
      {
        vocabularyId: 'vocabularyId',
        vocabularyText: 'vocabularyText',
        vocabularyStatus: VocabularyStatus.ACTIVE,
        lastLearnedAt: null,
        level: 0,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        firstSyncedAt: moment().toDate(),
        lastSyncedAt: moment().toDate(),
        definitions: [],
        extraData: [],
      },
      'setId',
      'local'
    );

    expect(preparedRow.firstSyncedAt).toEqual(null);
    expect(preparedRow.lastSyncedAt).toEqual(null);
  });

  test('prepare row for local update correctly', (): void => {
    const preparedRow = vocabularyRowPreparer.prepareUpdate(
      {
        vocabularyId: 'vocabularyId',
        vocabularyText: 'vocabularyText',
        vocabularyStatus: VocabularyStatus.ACTIVE,
        lastLearnedAt: null,
        level: 0,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        firstSyncedAt: moment().toDate(),
        lastSyncedAt: moment().toDate(),
        definitions: [],
        extraData: [],
      },
      'setId',
      'local'
    );

    expect(preparedRow).toEqual({
      setId: 'setId',
      vocabularyId: 'vocabularyId',
      vocabularyText: 'vocabularyText',
      vocabularyStatus: VocabularyStatus.ACTIVE,
      lastLearnedAt: null,
      level: 0,
      updatedAt: moment().unix(),
      updatedStatusAt: moment().unix(),
    });
  });

  test('prepare row for local update should automatically remove createdAt', (): void => {
    const preparedRow = vocabularyRowPreparer.prepareUpdate(
      {
        vocabularyId: 'vocabularyId',
        vocabularyText: 'vocabularyText',
      },
      'setId',
      'local'
    );

    expect(preparedRow.createdAt).toBeUndefined();
  });

  test('prepare row for local update should automatically set updatedAt', (): void => {
    const preparedRow = vocabularyRowPreparer.prepareUpdate(
      {
        vocabularyId: 'vocabularyId',
        vocabularyText: 'vocabularyText',
      },
      'setId',
      'local'
    );

    expect(preparedRow.updatedAt).toEqual(moment().unix());
  });

  test('prepare row for remote insert correctly', (): void => {
    const preparedRow = vocabularyRowPreparer.prepareInsert(
      {
        vocabularyId: 'vocabularyId',
        vocabularyText: 'vocabularyText',
        vocabularyStatus: VocabularyStatus.ACTIVE,
        lastLearnedAt: null,
        level: 0,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        firstSyncedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        lastSyncedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        definitions: [],
        extraData: [],
      },
      'setId',
      'remote'
    );

    expect(preparedRow).toEqual({
      setId: 'setId',
      vocabularyId: 'vocabularyId',
      vocabularyText: 'vocabularyText',
      vocabularyStatus: VocabularyStatus.ACTIVE,
      lastLearnedAt: null,
      level: 0,
      createdAt: moment()
        .subtract(1, 'hours')
        .unix(),
      updatedAt: moment()
        .subtract(1, 'hours')
        .unix(),
      updatedStatusAt: moment()
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

  test('prepare row for remote update should remove createdAt', (): void => {
    const preparedRow = vocabularyRowPreparer.prepareUpdate(
      {
        vocabularyId: 'vocabularyId',
        vocabularyText: 'vocabularyText',
      },
      undefined,
      'remote'
    );

    expect(preparedRow.createdAt).toBeUndefined();
  });
});
