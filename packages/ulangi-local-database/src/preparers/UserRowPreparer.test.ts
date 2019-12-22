/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { UserMembership, UserStatus } from '@ulangi/ulangi-common/enums';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';

import { UserRowPreparer } from './UserRowPreparer';

describe('UserRowPreparer', (): void => {
  let userRowPreparer: UserRowPreparer;
  let resetCurrentTime: () => void;

  beforeEach(
    (): void => {
      userRowPreparer = new UserRowPreparer();
      resetCurrentTime = mockCurrentTime();
    }
  );

  afterEach(
    (): void => {
      resetCurrentTime();
    }
  );

  test('prepare row for local insert should throw error', (): void => {
    expect(
      (): void => {
        userRowPreparer.prepareInsert(
          {
            userId: 'userId',
            email: 'test@ulangi.com',
            userStatus: UserStatus.ACTIVE,
            membership: UserMembership.SUBSCRIBED_PREMIUM,
            membershipExpiredAt: moment().toDate(),
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
            extraData: [],
          },
          'local'
        );
      }
    ).toThrow();
  });

  test('prepare row for remote insert correctly', (): void => {
    const preparedRow = userRowPreparer.prepareInsert(
      {
        userId: 'userId',
        email: 'test@ulangi.com',
        userStatus: UserStatus.ACTIVE,
        membership: UserMembership.SUBSCRIBED_PREMIUM,
        membershipExpiredAt: moment().toDate(),
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
        extraData: [],
      },
      'remote'
    );

    expect(preparedRow).toEqual({
      userId: 'userId',
      email: 'test@ulangi.com',
      userStatus: UserStatus.ACTIVE,
      membership: UserMembership.SUBSCRIBED_PREMIUM,
      membershipExpiredAt: moment().unix(),
      createdAt: moment()
        .subtract(1, 'hours')
        .unix(),
      updatedAt: moment()
        .subtract(2, 'hours')
        .unix(),
      firstSyncedAt: moment()
        .subtract(3, 'hours')
        .unix(),
      lastSyncedAt: moment()
        .subtract(4, 'hours')
        .unix(),
    });
  });

  test('prepare row for local update correctly', (): void => {
    const preparedRow = userRowPreparer.prepareUpdate(
      {
        userId: 'userId',
        email: 'test@ulangi.com',
        userStatus: UserStatus.ACTIVE,
        membership: UserMembership.SUBSCRIBED_PREMIUM,
        membershipExpiredAt: moment().toDate(),
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
        extraData: [],
      },
      'local'
    );

    expect(preparedRow).toEqual({
      userId: 'userId',
      updatedAt: moment().unix(),
    });
  });

  test('prepare row for local update should not allow to set email, membership, membershipExpiredAt, userStatus, createdAt, firstSynced, lastSynced', (): void => {
    const preparedRow = userRowPreparer.prepareUpdate(
      {
        userId: 'userId',
        email: 'test@ulangi.com',
        userStatus: UserStatus.ACTIVE,
        membership: UserMembership.SUBSCRIBED_PREMIUM,
        membershipExpiredAt: moment().toDate(),
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
        extraData: [],
      },
      'local'
    );

    expect(preparedRow).toEqual({
      userId: 'userId',
      updatedAt: moment().unix(),
    });
  });

  test('prepare row for local update should automatically set updatedAt', (): void => {
    const preparedRow = userRowPreparer.prepareUpdate(
      {
        userId: 'userId',
        email: 'test@ulangi.com',
        userStatus: UserStatus.ACTIVE,
        membership: UserMembership.SUBSCRIBED_PREMIUM,
        membershipExpiredAt: moment().toDate(),
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
        extraData: [],
      },
      'local'
    );

    expect(preparedRow.updatedAt).toEqual(moment().unix());
  });
});
