/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { UserExtraDataName, UserMembership } from '@ulangi/ulangi-common/enums';
import {
  AutoArchiveSettings,
  AutoShowInAppRating,
  GlobalAutoArchive,
  GlobalDataSharing,
  GlobalReminder,
  GlobalTheme,
  ReminderSettings,
  ThemeSettings,
} from '@ulangi/ulangi-common/interfaces';
import { UserExtraDataItem } from '@ulangi/ulangi-common/types';
import { computed, observable } from 'mobx';

export class ObservableUser {
  @observable
  public userId: string;

  @observable
  public email: string;

  @observable
  public membership: UserMembership;

  @observable
  public membershipExpiredAt: null | Date;

  @observable
  public updatedAt: null | Date;

  @observable
  public createdAt: null | Date;

  @observable
  public extraData: readonly UserExtraDataItem[];

  @observable
  public isSessionValid: null | boolean;

  @computed
  public get isPremium(): boolean {
    return (
      this.membership === UserMembership.LIFETIME_PREMIUM ||
      this.membership === UserMembership.SUBSCRIBED_PREMIUM
    );
  }

  @computed
  public get globalAutoArchive(): undefined | AutoArchiveSettings {
    const data = this.extraData.find(
      (data): data is GlobalAutoArchive =>
        data.dataName === UserExtraDataName.GLOBAL_AUTO_ARCHIVE
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get globalReminder(): undefined | ReminderSettings {
    const data = this.extraData.find(
      (data): data is GlobalReminder =>
        data.dataName === UserExtraDataName.GLOBAL_REMINDER
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get globalDataSharing(): undefined | boolean {
    const data = this.extraData.find(
      (data): data is GlobalDataSharing =>
        data.dataName === UserExtraDataName.GLOBAL_DATA_SHARING
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get themeSettings(): undefined | ThemeSettings {
    const data = this.extraData.find(
      (data): data is GlobalTheme =>
        data.dataName === UserExtraDataName.GLOBAL_THEME
    );
    return data ? data.dataValue : undefined;
  }

  @computed
  public get autoShowInAppRating(): undefined | boolean {
    const data = this.extraData.find(
      (data): data is AutoShowInAppRating =>
        data.dataName === UserExtraDataName.AUTO_SHOW_IN_APP_RATING
    );
    return data ? data.dataValue : undefined;
  }

  public constructor(
    userId: string,
    email: string,
    membership: UserMembership,
    membershipExpiredAt: null | Date,
    updatedAt: null | Date,
    createdAt: null | Date,
    extraData: readonly any[],
    isSessionValid: null | boolean
  ) {
    this.userId = userId;
    this.email = email;
    this.membership = membership;
    this.membershipExpiredAt = membershipExpiredAt;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
    this.extraData = extraData;
    this.isSessionValid = isSessionValid;
  }
}
