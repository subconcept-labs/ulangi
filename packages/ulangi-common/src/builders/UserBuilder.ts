/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as uuid from 'uuid';

import { UserMembership } from '../enums/UserMembership';
import { UserStatus } from '../enums/UserStatus';
import { User } from '../interfaces/general/User';
import { UserExtraDataItem } from '../types/UserExtraDataItem';
import { UserExtraDataItemBuilder } from './UserExtraDataItemBuilder';

export class UserBuilder {
  private userExtraDataItemBuilder = new UserExtraDataItemBuilder();

  public build(user: DeepPartial<User>): User {
    let extraData: UserExtraDataItem[] = [];
    if (typeof user.extraData !== 'undefined') {
      extraData = user.extraData.map(
        (item): UserExtraDataItem => {
          return this.userExtraDataItemBuilder.build(item);
        }
      );
    }

    return _.merge(
      {
        userId: uuid.v4(),
        email: '',
        userStatus: UserStatus.ACTIVE,
        membership: UserMembership.REGULAR,
        membershipExpiredAt: null,
        createdAt: moment.utc().toDate(),
        updatedAt: moment.utc().toDate(),
        firstSyncedAt: null,
        lastSyncedAt: null,
        extraData,
      },
      user
    );
  }
}
