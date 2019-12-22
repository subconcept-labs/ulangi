/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DefinitionStatus, WordClass } from '@ulangi/ulangi-common/enums';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';

import { DefinitionRowPreparer } from '../preparers/DefinitionRowPreparer';

describe('DefinitionRowPreparer', (): void => {
  let definitionRowPreparer: DefinitionRowPreparer;
  let restoreCurrentTime: () => void;

  beforeEach(
    (): void => {
      restoreCurrentTime = mockCurrentTime();
      definitionRowPreparer = new DefinitionRowPreparer();
    }
  );

  afterEach(
    (): void => {
      restoreCurrentTime();
    }
  );

  test('prepare row for local insert correctly', (): void => {
    const preparedRow = definitionRowPreparer.prepareInsert(
      {
        definitionId: 'definitionId',
        definitionStatus: DefinitionStatus.ACTIVE,
        meaning: 'meaning',
        wordClasses: [WordClass.ADJECTIVE],
        source: 'source',
        createdAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        firstSyncedAt: moment().toDate(),
        lastSyncedAt: moment().toDate(),
        extraData: [],
      },
      'vocabularyId',
      'local'
    );

    expect(preparedRow).toEqual({
      vocabularyId: 'vocabularyId',
      definitionId: 'definitionId',
      definitionStatus: DefinitionStatus.ACTIVE,
      meaning: 'meaning',
      wordClasses: JSON.stringify([WordClass.ADJECTIVE]),
      source: 'source',
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
      updatedStatusAt: moment().unix(),
      firstSyncedAt: null,
      lastSyncedAt: null,
    });
  });

  test('prepare row for local insert should automatically set createdAt, updated and updatedStatusAt', (): void => {
    const preparedRow = definitionRowPreparer.prepareInsert(
      {
        definitionId: 'definitionId',
        definitionStatus: DefinitionStatus.ACTIVE,
        meaning: 'meaning',
        wordClasses: [WordClass.ADJECTIVE],
        source: 'source',
        createdAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        firstSyncedAt: moment().toDate(),
        lastSyncedAt: moment().toDate(),
        extraData: [],
      },
      'vocabularyId',
      'local'
    );

    expect(preparedRow.createdAt).toEqual(moment().unix());
    expect(preparedRow.updatedAt).toEqual(moment().unix());
    expect(preparedRow.updatedStatusAt).toEqual(moment().unix());
  });

  test('prepare row for local insert should automatically set firstSyncedAt, lastSyncedAt to null', (): void => {
    const preparedRow = definitionRowPreparer.prepareInsert(
      {
        definitionId: 'definitionId',
        definitionStatus: DefinitionStatus.ACTIVE,
        meaning: 'meaning',
        wordClasses: [WordClass.ADJECTIVE],
        source: 'source',
        createdAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        firstSyncedAt: moment().toDate(),
        lastSyncedAt: moment().toDate(),
        extraData: [],
      },
      'vocabularyId',
      'local'
    );

    expect(preparedRow.firstSyncedAt).toEqual(null);
    expect(preparedRow.lastSyncedAt).toEqual(null);
  });

  test('prepare row for local update correctly', (): void => {
    const preparedRow = definitionRowPreparer.prepareUpdate(
      {
        definitionId: 'definitionId',
        definitionStatus: DefinitionStatus.DELETED,
        meaning: 'meaning',
        wordClasses: [WordClass.NOUN],
        source: 'source',
        createdAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        firstSyncedAt: moment().toDate(),
        lastSyncedAt: moment().toDate(),
        extraData: [],
      },
      'vocabularyId',
      'local'
    );

    // Automatically remove createdAt, firstSyncedAt and lastSyncedAt
    expect(preparedRow).toEqual({
      vocabularyId: 'vocabularyId',
      definitionId: 'definitionId',
      definitionStatus: DefinitionStatus.DELETED,
      meaning: 'meaning',
      wordClasses: JSON.stringify([WordClass.NOUN]),
      source: 'source',
      updatedAt: moment().unix(), // automatically set updatedAt
      updatedStatusAt: moment().unix(), // automatically set updatedStatusAt
    });
  });

  test('prepare row for local update should remove createdAt, firstSyncedAt and lastSyncedAt', (): void => {
    const preparedRow = definitionRowPreparer.prepareUpdate(
      {
        definitionId: 'definitionId',
        createdAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        firstSyncedAt: moment().toDate(),
        lastSyncedAt: moment().toDate(),
      },
      'vocabularyId',
      'local'
    );

    expect(preparedRow.createdAt).toBeUndefined();
    expect(preparedRow.firstSyncedAt).toBeUndefined();
    expect(preparedRow.lastSyncedAt).toBeUndefined();
  });

  test('prepare row for local update should automatically set updatedStatusAt when definitionStatus changed', (): void => {
    const preparedRow = definitionRowPreparer.prepareUpdate(
      {
        definitionId: 'definitionId',
        definitionStatus: DefinitionStatus.DELETED,
      },
      'vocabularyId',
      'local'
    );

    expect(preparedRow.updatedStatusAt).toEqual(moment().unix());
  });

  test('prepare row for local update should automatically set updatedAt', (): void => {
    const preparedRow = definitionRowPreparer.prepareUpdate(
      {
        definitionId: 'definitionId',
      },
      'vocabularyId',
      'local'
    );

    expect(preparedRow.updatedAt).toEqual(moment().unix());
  });

  test('remote prepare insert should match object', (): void => {
    const preparedRow = definitionRowPreparer.prepareInsert(
      {
        definitionId: 'definitionId',
        definitionStatus: DefinitionStatus.ACTIVE,
        meaning: 'meaning',
        wordClasses: [WordClass.ADJECTIVE],
        source: 'source',
        createdAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        updatedStatusAt: moment().toDate(),
        firstSyncedAt: moment()
          .subtract(2, 'hour')
          .toDate(),
        lastSyncedAt: moment()
          .subtract(2, 'hour')
          .toDate(),
        extraData: [],
      },
      'vocabularyId',
      'remote'
    );

    expect(preparedRow).toEqual({
      vocabularyId: 'vocabularyId',
      definitionId: 'definitionId',
      definitionStatus: DefinitionStatus.ACTIVE,
      meaning: 'meaning',
      wordClasses: JSON.stringify([WordClass.ADJECTIVE]),
      source: 'source',
      createdAt: moment()
        .subtract(1, 'hour')
        .unix(),
      updatedAt: moment()
        .subtract(1, 'hour')
        .unix(),
      updatedStatusAt: moment().unix(),
      firstSyncedAt: moment()
        .subtract(2, 'hour')
        .unix(),
      lastSyncedAt: moment()
        .subtract(2, 'hour')
        .unix(),
    });
  });

  test('remote prepare update should match object', (): void => {
    const preparedRow = definitionRowPreparer.prepareUpdate(
      {
        definitionId: 'definitionId',
        definitionStatus: DefinitionStatus.DELETED,
        meaning: 'meaning',
        wordClasses: [WordClass.ADJECTIVE],
        source: 'source',
        createdAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        firstSyncedAt: moment()
          .subtract(2, 'hour')
          .toDate(),
        lastSyncedAt: moment()
          .subtract(2, 'hour')
          .toDate(),
        extraData: [],
      },
      'vocabularyId',
      'remote'
    );

    expect(preparedRow).toEqual({
      vocabularyId: 'vocabularyId',
      definitionId: 'definitionId',
      definitionStatus: DefinitionStatus.DELETED,
      meaning: 'meaning',
      wordClasses: JSON.stringify([WordClass.ADJECTIVE]),
      source: 'source',
      updatedAt: moment()
        .subtract(1, 'hour')
        .unix(),
      updatedStatusAt: moment()
        .subtract(1, 'hour')
        .unix(),
      firstSyncedAt: moment()
        .subtract(2, 'hour')
        .unix(),
      lastSyncedAt: moment()
        .subtract(2, 'hour')
        .unix(),
    });
  });

  test('remote prepare update should remove createdAt', (): void => {
    const preparedRow = definitionRowPreparer.prepareUpdate(
      {
        definitionId: 'definitionId',
        createdAt: moment()
          .subtract(1, 'hour')
          .toDate(),
      },
      'vocabularyId',
      'remote'
    );

    expect(preparedRow.createdAt).toBeUndefined();
  });
});
