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
  let resetCurrentTime: () => void;

  beforeEach(
    (): void => {
      resetCurrentTime = mockCurrentTime();
      definitionRowPreparer = new DefinitionRowPreparer();
    }
  );

  afterEach(
    (): void => {
      resetCurrentTime();
    }
  );

  test('prepare row for insert correctly', (): void => {
    const preparedRow = definitionRowPreparer.prepareInsert(
      'userId',
      {
        definitionId: 'definitionId',
        definitionStatus: DefinitionStatus.ACTIVE,
        meaning: 'meaning',
        wordClasses: [WordClass.NOUN],
        source: 'source',
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(3, 'hours')
          .toDate(),
      },
      'vocabularyId'
    );

    expect(preparedRow).toEqual({
      userId: 'userId',
      vocabularyId: 'vocabularyId',
      definitionId: 'definitionId',
      definitionStatus: DefinitionStatus.ACTIVE,
      meaning: 'meaning',
      wordClasses: JSON.stringify([WordClass.NOUN]),
      source: 'source',
      createdAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(2, 'hours')
        .toDate(),
      updatedStatusAt: moment()
        .subtract(3, 'hours')
        .toDate(),
    });
  });

  test('prepare row for insert fails because meaning is empty', (): void => {
    expect(
      (): void => {
        definitionRowPreparer.prepareInsert(
          'userId',
          {
            definitionId: 'definitionId',
            definitionStatus: DefinitionStatus.ACTIVE,
            meaning: '',
            wordClasses: [WordClass.NOUN],
            source: 'source',
            createdAt: moment()
              .subtract(1, 'hours')
              .toDate(),
            updatedAt: moment()
              .subtract(2, 'hours')
              .toDate(),
            updatedStatusAt: moment()
              .subtract(3, 'hours')
              .toDate(),
          },
          'vocabularyId'
        );
      }
    ).toThrowWithMessage(Error, /meaning/);
  });

  test('can prepare valid row for insert', (): void => {
    const result = definitionRowPreparer.canPrepareInsert(
      'userId',
      {
        definitionId: 'definitionId',
        definitionStatus: DefinitionStatus.ACTIVE,
        meaning: 'meaning',
        wordClasses: [WordClass.NOUN],
        source: 'source',
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(3, 'hours')
          .toDate(),
      },
      'vocabularyId'
    );
    expect(result).toEqual(true);
  });

  test('cannot prepare row for insert because meaning is empty', (): void => {
    const result = definitionRowPreparer.canPrepareInsert(
      'userId',
      {
        definitionId: 'definitionId',
        definitionStatus: DefinitionStatus.ACTIVE,
        meaning: '',
        wordClasses: [WordClass.NOUN],
        source: 'source',
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(3, 'hours')
          .toDate(),
      },
      'vocabularyId'
    );
    expect(result).toEqual(false);
  });

  test('prepare row for update correctly', (): void => {
    const preparedRow = definitionRowPreparer.prepareInsert(
      'userId',
      {
        definitionId: 'definitionId',
        definitionStatus: DefinitionStatus.ACTIVE,
        meaning: 'meaning',
        wordClasses: [WordClass.NOUN],
        source: 'source',
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(3, 'hours')
          .toDate(),
      },
      'vocabularyId'
    );

    expect(preparedRow).toEqual({
      userId: 'userId',
      vocabularyId: 'vocabularyId',
      definitionId: 'definitionId',
      definitionStatus: DefinitionStatus.ACTIVE,
      meaning: 'meaning',
      wordClasses: JSON.stringify([WordClass.NOUN]),
      source: 'source',
      createdAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(2, 'hours')
        .toDate(),
      updatedStatusAt: moment()
        .subtract(3, 'hours')
        .toDate(),
    });
  });

  test('prepare row for update fails because meaning is empty', (): void => {
    expect(
      (): void => {
        definitionRowPreparer.prepareUpdate(
          'userId',
          {
            definitionId: 'definitionId',
            definitionStatus: DefinitionStatus.ACTIVE,
            meaning: '',
            wordClasses: [WordClass.NOUN],
            source: 'source',
            createdAt: moment()
              .subtract(1, 'hours')
              .toDate(),
            updatedAt: moment()
              .subtract(2, 'hours')
              .toDate(),
            updatedStatusAt: moment()
              .subtract(3, 'hours')
              .toDate(),
          },
          'vocabularyId'
        );
      }
    ).toThrowWithMessage(Error, /meaning/);
  });

  test('can prepare row for update', (): void => {
    const result = definitionRowPreparer.canPrepareUpdate(
      'userId',
      {
        definitionId: 'definitionId',
        definitionStatus: DefinitionStatus.ACTIVE,
        meaning: 'meaning',
        wordClasses: [WordClass.NOUN],
        source: 'source',
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(3, 'hours')
          .toDate(),
      },
      'vocabularyId'
    );
    expect(result).toEqual(true);
  });

  test('cannot prepare row for update because meaning is empty', (): void => {
    const result = definitionRowPreparer.canPrepareUpdate(
      'userId',
      {
        definitionId: 'definitionId',
        definitionStatus: DefinitionStatus.ACTIVE,
        meaning: '',
        wordClasses: [WordClass.NOUN],
        source: 'source',
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
        updatedStatusAt: moment()
          .subtract(3, 'hours')
          .toDate(),
      },
      'vocabularyId'
    );
    expect(result).toEqual(false);
  });
});
