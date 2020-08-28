/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractAlternativeResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { UserExtraDataItem } from '../../types/UserExtraDataItem';
import { AutoShowInAppRatingResolver } from './AutoShowInAppRatingResolver';
import { GlobalAutoArchiveResolver } from './GlobalAutoArchiveResolver';
import { GlobalDataSharingResolver } from './GlobalDataSharingResolver';
import { GlobalReminderResolver } from './GlobalReminderResolver';
import { GlobalThemeResolver } from './GlobalThemeResolver';
import { UserRatingResolver } from './UserRatingResolver';

export class UserExtraDataItemResolver extends AbstractAlternativeResolver<
  UserExtraDataItem
> {
  private globalAutoArchiveResolver = new GlobalAutoArchiveResolver();
  private globalReminderResolver = new GlobalReminderResolver();
  private globalThemeResolver = new GlobalThemeResolver();
  private globalDataSharingResolver = new GlobalDataSharingResolver();
  private autoShowInAppRatingResolver = new AutoShowInAppRatingResolver();
  private userRatingResolver = new UserRatingResolver();

  protected rules: Joi.AlternativesSchema;

  public constructor() {
    super();
    this.rules = Joi.alternatives().try(
      this.globalAutoArchiveResolver.getRules(),
      this.globalReminderResolver.getRules(),
      this.globalThemeResolver.getRules(),
      this.globalDataSharingResolver.getRules(),
      this.autoShowInAppRatingResolver.getRules(),
      this.userRatingResolver.getRules()
    );
  }
}
