/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SetExtraDataName } from '@ulangi/ulangi-common/enums';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';

import { SetExtraDataRowPreparer } from './SetExtraDataRowPreparer';

describe('SetExtraDataRowPreparer', (): void => {
  let setExtraDataRowPreparer: SetExtraDataRowPreparer;
  let resetCurrentTime: () => void;

  beforeEach(
    (): void => {
      setExtraDataRowPreparer = new SetExtraDataRowPreparer();
      resetCurrentTime = mockCurrentTime();
    }
  );

  afterEach(
    (): void => {
      resetCurrentTime();
    }
  );

  test('prepare row for upsert correctly', (): void => {
    const preparedRow = setExtraDataRowPreparer.prepareUpsert(
      'userId',
      {
        dataName: SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
        dataValue: 12,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
      },
      'setId'
    );

    expect(preparedRow).toEqual({
      userId: 'userId',
      setId: 'setId',
      dataName: SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
      dataValue: JSON.stringify(12),
      createdAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(2, 'hours')
        .toDate(),
    });
  });

  test('prepare row for upsert failed because dataName is empty', (): void => {
    expect(
      (): void => {
        setExtraDataRowPreparer.prepareUpsert(
          'userId',
          {
            dataName: '',
            dataValue: 12,
            createdAt: moment()
              .subtract(1, 'hours')
              .toDate(),
            updatedAt: moment()
              .subtract(2, 'hours')
              .toDate(),
          },
          'setId'
        );
      }
    ).toThrowWithMessage(Error, /dataName/);
  });

  test('can prepare row for upsert', (): void => {
    const result = setExtraDataRowPreparer.canPrepareUpsert(
      'userId',
      {
        dataName: SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
        dataValue: 12,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
      },
      'setId'
    );

    expect(result).toEqual(true);
  });

  test('cannot prepare row for upsert because dataName is empty', (): void => {
    const result = setExtraDataRowPreparer.canPrepareUpsert(
      'userId',
      {
        dataName: '',
        dataValue: 12,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(2, 'hours')
          .toDate(),
      },
      'setId'
    );

    expect(result).toEqual(false);
  });
});
