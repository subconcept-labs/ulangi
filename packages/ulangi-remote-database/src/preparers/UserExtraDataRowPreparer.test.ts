/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { UserExtraDataName } from '@ulangi/ulangi-common/enums';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';

import { UserExtraDataRowPreparer } from '../preparers/UserExtraDataRowPreparer';

describe('UserExtraDataRowPreparer', (): void => {
  let userExtraDataRowPreparer: UserExtraDataRowPreparer;
  let reuserCurrentTime: () => void;

  beforeEach(
    (): void => {
      userExtraDataRowPreparer = new UserExtraDataRowPreparer();
      reuserCurrentTime = mockCurrentTime();
    }
  );

  afterEach(
    (): void => {
      reuserCurrentTime();
    }
  );

  test('prepare row for upsert correctly', (): void => {
    const preparedRow = userExtraDataRowPreparer.prepareUpsert('userId', {
      dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
      dataValue: {
        autoArchiveEnabled: true,
        spacedRepetitionLevelThreshold: 10,
        writingLevelThreshold: 8,
      },
      createdAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(2, 'hours')
        .toDate(),
      firstSyncedAt: moment()
        .subtract(3, 'hours')
        .toDate(),
      lastSyncedAt: moment()
        .subtract(4, 'hours')
        .toDate(),
    });

    expect(preparedRow).toEqual({
      userId: 'userId',
      dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
      dataValue: JSON.stringify({
        autoArchiveEnabled: true,
        spacedRepetitionLevelThreshold: 10,
        writingLevelThreshold: 8,
      }),
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
        userExtraDataRowPreparer.prepareUpsert('userId', {
          dataName: '',
          dataValue: {
            autoArchiveEnabled: true,
            spacedRepetitionLevelThreshold: 10,
            writingLevelThreshold: 8,
          },
          createdAt: moment()
            .subtract(1, 'hours')
            .toDate(),
          updatedAt: moment()
            .subtract(2, 'hours')
            .toDate(),
        });
      }
    ).toThrowWithMessage(Error, /dataName/);
  });

  test('can prepare row for upsert', (): void => {
    const result = userExtraDataRowPreparer.canPrepareUpsert('userId', {
      dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
      dataValue: {
        autoArchiveEnabled: true,
        spacedRepetitionLevelThreshold: 10,
        writingLevelThreshold: 8,
      },
      createdAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(2, 'hours')
        .toDate(),
      firstSyncedAt: moment()
        .subtract(3, 'hours')
        .toDate(),
      lastSyncedAt: moment()
        .subtract(4, 'hours')
        .toDate(),
    });

    expect(result).toEqual(true);
  });
});
