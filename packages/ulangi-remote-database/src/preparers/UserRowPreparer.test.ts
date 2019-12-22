/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { UserMembership, UserStatus } from '@ulangi/ulangi-common/enums';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';

import { UserRowPreparer } from '../preparers/UserRowPreparer';

describe('UserRowPreparer', (): void => {
  let userRowPreparer: UserRowPreparer;
  let restoreCurrentTime: () => void;

  beforeEach(
    (): void => {
      userRowPreparer = new UserRowPreparer();
      restoreCurrentTime = mockCurrentTime();
    }
  );

  afterEach(
    (): void => {
      restoreCurrentTime();
    }
  );

  test('should prepare row for insert correctly', (): void => {
    const preparedRow = userRowPreparer.prepareInsert(
      {
        userId: 'userId',
        email: 'email@ulangi.com',
        userStatus: UserStatus.ACTIVE,
        membership: UserMembership.SUBSCRIBED_PREMIUM,
        membershipExpiredAt: moment().toDate(),
        createdAt: moment().toDate(),
        updatedAt: moment().toDate(),
        firstSyncedAt: null,
        lastSyncedAt: null,
        extraData: [],
      },
      0,
      'password',
      'accessKey'
    );

    expect(preparedRow).toEqual({
      userId: 'userId',
      shardId: 0,
      email: 'email@ulangi.com',
      password: 'password',
      accessKey: 'accessKey',
      userStatus: UserStatus.ACTIVE,
      membership: UserMembership.SUBSCRIBED_PREMIUM,
      membershipExpiredAt: moment().toDate(),
    });
  });

  test('prepare row for insert requires valid email', (): void => {
    expect(
      (): void => {
        userRowPreparer.prepareInsert(
          {
            userId: 'userId',
            email: 'invalidemail',
            userStatus: UserStatus.ACTIVE,
            membership: UserMembership.SUBSCRIBED_PREMIUM,
            membershipExpiredAt: moment().toDate(),
            createdAt: moment().toDate(),
            updatedAt: moment().toDate(),
            firstSyncedAt: null,
            lastSyncedAt: null,
            extraData: [],
          },
          0,
          'password',
          'accessKey'
        );
      }
    ).toThrowWithMessage(Error, /email/);
  });

  test('should prepare row for update correctly', (): void => {
    const preparedRow = userRowPreparer.prepareUpdate(
      {
        userId: 'userId',
        email: 'newEmail@ulangi.com',
        userStatus: UserStatus.DISABLED,
        membership: UserMembership.SUBSCRIBED_PREMIUM,
        membershipExpiredAt: moment().toDate(),
      },
      'newPassword',
      'newAccessKey'
    );

    expect(preparedRow).toEqual({
      userId: 'userId',
      email: 'newEmail@ulangi.com',
      password: 'newPassword',
      accessKey: 'newAccessKey',
      userStatus: UserStatus.DISABLED,
      membership: UserMembership.SUBSCRIBED_PREMIUM,
      membershipExpiredAt: moment().toDate(),
    });
  });

  test('prepare row for update requires valid email', (): void => {
    expect(
      (): void => {
        userRowPreparer.prepareUpdate(
          {
            userId: 'userId',
            email: 'invalidEmail',
          },
          undefined,
          undefined
        );
      }
    ).toThrowWithMessage(Error, /email/);
  });
});
