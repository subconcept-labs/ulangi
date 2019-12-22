/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SetStatus } from '@ulangi/ulangi-common/enums';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';

import { SetRowPreparer } from '../preparers/SetRowPreparer';

describe('SetRowPreparer', (): void => {
  let setRowPreparer: SetRowPreparer;
  let resetCurrentTime: () => void;

  beforeEach(
    (): void => {
      setRowPreparer = new SetRowPreparer();
      resetCurrentTime = mockCurrentTime();
    }
  );

  afterEach(
    (): void => {
      resetCurrentTime();
    }
  );

  test('prepare row for local insert correctly', (): void => {
    const preparedRow = setRowPreparer.prepareInsert(
      {
        setId: 'setId',
        setName: 'setName',
        learningLanguageCode: 'en',
        translatedToLanguageCode: 'vn',
        setStatus: SetStatus.ACTIVE,
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
        extraData: [],
      },
      'local'
    );

    expect(preparedRow).toEqual({
      setId: 'setId',
      setName: 'setName',
      learningLanguageCode: 'en',
      translatedToLanguageCode: 'vn',
      setStatus: SetStatus.ACTIVE,
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
      updatedStatusAt: moment().unix(),
      firstSyncedAt: null,
      lastSyncedAt: null,
    });
  });

  test('prepare row for local insert automatically set createdAt, updatedAt, updatedStatusAt', (): void => {
    const preparedRow = setRowPreparer.prepareInsert(
      {
        setId: 'setId',
        setName: 'setName',
        learningLanguageCode: 'en',
        translatedToLanguageCode: 'vn',
        setStatus: SetStatus.ACTIVE,
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
        extraData: [],
      },
      'local'
    );

    expect(preparedRow.createdAt).toEqual(moment().unix());
    expect(preparedRow.updatedAt).toEqual(moment().unix());
    expect(preparedRow.updatedStatusAt).toEqual(moment().unix());
  });

  test('prepare row for local insert automatically set firstSyncedAt, lastSyncedAt to null', (): void => {
    const preparedRow = setRowPreparer.prepareInsert(
      {
        setId: 'setId',
        setName: 'setName',
        learningLanguageCode: 'en',
        translatedToLanguageCode: 'vn',
        setStatus: SetStatus.ACTIVE,
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
        extraData: [],
      },
      'local'
    );

    expect(preparedRow.firstSyncedAt).toEqual(null);
    expect(preparedRow.lastSyncedAt).toEqual(null);
  });

  test('prepare row for local update automatically remove createdAt', (): void => {
    const preparedRow = setRowPreparer.prepareUpdate(
      {
        setId: 'setId',
        setName: 'setName',
      },
      'local'
    );

    expect(preparedRow.createdAt).toBeUndefined();
  });

  test('prepare row for local update automatically set updatedAt', (): void => {
    const preparedRow = setRowPreparer.prepareUpdate(
      {
        setId: 'setId',
        setName: 'setName',
      },
      'local'
    );

    expect(preparedRow.updatedAt).toEqual(moment().unix());
  });

  test('local update automatically set updatedStatusAt when setStatus changes', (): void => {
    const preparedRow = setRowPreparer.prepareUpdate(
      {
        setId: 'setId',
        setStatus: SetStatus.ACTIVE,
      },
      'local'
    );

    expect(preparedRow.updatedStatusAt).toEqual(moment().unix());
  });

  test('prepare row for remote insert should prepare row correctly', (): void => {
    const preparedRow = setRowPreparer.prepareInsert(
      {
        setId: 'setId',
        setName: 'setName',
        learningLanguageCode: 'en',
        translatedToLanguageCode: 'vn',
        setStatus: SetStatus.ACTIVE,
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
        extraData: [],
      },
      'remote'
    );

    expect(preparedRow).toEqual({
      setId: 'setId',
      setName: 'setName',
      learningLanguageCode: 'en',
      translatedToLanguageCode: 'vn',
      setStatus: SetStatus.ACTIVE,
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

  test('prepare row for remote update should prepare update correctly', (): void => {
    const preparedRow = setRowPreparer.prepareUpdate(
      {
        setId: 'setId',
        setName: 'setName',
        learningLanguageCode: 'en',
        translatedToLanguageCode: 'vn',
        setStatus: SetStatus.ACTIVE,
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
        extraData: [],
      },
      'remote'
    );

    expect(preparedRow).toEqual({
      setId: 'setId',
      setName: 'setName',
      learningLanguageCode: 'en',
      translatedToLanguageCode: 'vn',
      setStatus: SetStatus.ACTIVE,
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
    const preparedRow = setRowPreparer.prepareUpdate(
      {
        setId: 'setId',
        setName: 'setName',
        learningLanguageCode: 'en',
        translatedToLanguageCode: 'vn',
        setStatus: SetStatus.ACTIVE,
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
        extraData: [],
      },
      'remote'
    );

    expect(preparedRow.createdAt).toBeUndefined();
  });
});
