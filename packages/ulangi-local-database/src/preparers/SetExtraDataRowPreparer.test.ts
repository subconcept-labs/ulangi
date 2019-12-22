/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SetExtraDataName } from '@ulangi/ulangi-common/enums';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';

import { FieldState } from '../enums/FieldState';
import { SetExtraDataRowPreparer } from '../preparers/SetExtraDataRowPreparer';

describe('SetExtraDataRowPreparer', (): void => {
  let setExtraDataRowPreparer: SetExtraDataRowPreparer;
  let restoreCurrentTime: () => void;

  beforeEach(
    (): void => {
      restoreCurrentTime = mockCurrentTime();
      setExtraDataRowPreparer = new SetExtraDataRowPreparer();
    }
  );

  afterEach(
    (): void => {
      restoreCurrentTime();
    }
  );

  test('prepare row for local upsert correctly', (): void => {
    const preparedRow = setExtraDataRowPreparer.prepareUpsert(
      {
        dataName: SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
        dataValue: 12,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        firstSyncedAt: moment().toDate(),
        lastSyncedAt: moment().toDate(),
      },
      'setId',
      'local'
    );

    expect(preparedRow).toEqual({
      setId: 'setId',
      dataName: SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
      dataValue: JSON.stringify(12),
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
      firstSyncedAt: null,
      lastSyncedAt: null,
      fieldState: FieldState.TO_BE_SYNCED,
    });
  });

  test('prepare row for local upsert automatically set createdAt and updatedAt', (): void => {
    const preparedRow = setExtraDataRowPreparer.prepareUpsert(
      {
        dataName: SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
        dataValue: 12,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        firstSyncedAt: moment().toDate(),
        lastSyncedAt: moment().toDate(),
      },
      'setId',
      'local'
    );

    expect(preparedRow.createdAt).toEqual(moment().unix());
    expect(preparedRow.updatedAt).toEqual(moment().unix());
  });

  test('prepare schmea for local upsert automatically set firstSyncedAt and lastSyncedAt to null', (): void => {
    const preparedRow = setExtraDataRowPreparer.prepareUpsert(
      {
        dataName: SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
        dataValue: 12,
        createdAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hour')
          .toDate(),
        firstSyncedAt: moment().toDate(),
        lastSyncedAt: moment().toDate(),
      },
      'setId',
      'local'
    );

    expect(preparedRow.firstSyncedAt).toEqual(null);
    expect(preparedRow.lastSyncedAt).toEqual(null);
  });

  test('prepare row for local upsert should set fieldState to TO_BE_SYNCED', (): void => {
    const preparedRow = setExtraDataRowPreparer.prepareUpsert(
      {
        dataName: SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
        dataValue: 12,
        createdAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        updatedAt: moment()
          .subtract(1, 'hours')
          .toDate(),
        firstSyncedAt: moment().toDate(),
        lastSyncedAt: moment().toDate(),
      },
      'setId',
      'local'
    );

    expect(preparedRow.fieldState).toEqual(FieldState.TO_BE_SYNCED);
  });

  test('prepare row for remote upsert correctly', (): void => {
    const preparedRow = setExtraDataRowPreparer.prepareUpsert(
      {
        dataName: SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
        dataValue: 12,
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
      'setId',
      'remote'
    );

    expect(preparedRow).toEqual({
      setId: 'setId',
      dataName: SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
      dataValue: JSON.stringify(12),
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
      fieldState: FieldState.SYNCED,
    });
  });

  test('prepare row for remote upsert should set FieldState to SYNCED', (): void => {
    const preparedRow = setExtraDataRowPreparer.prepareUpsert(
      {
        dataName: SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
        dataValue: 12,
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
      'setId',
      'remote'
    );

    expect(preparedRow.fieldState).toEqual(FieldState.SYNCED);
  });
});
