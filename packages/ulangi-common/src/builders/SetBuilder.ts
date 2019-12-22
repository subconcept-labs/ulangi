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

import { SetStatus } from '../enums/SetStatus';
import { Set } from '../interfaces/general/Set';
import { SetExtraDataItem } from '../types/SetExtraDataItem';
import { SetExtraDataItemBuilder } from './SetExtraDataItemBuilder';

export class SetBuilder {
  private setExtraDataItemBuilder = new SetExtraDataItemBuilder();

  public build(set: DeepPartial<Set>): Set {
    let extraData: SetExtraDataItem[] = [];
    if (typeof set.extraData !== 'undefined') {
      extraData = set.extraData.map(
        (item): SetExtraDataItem => {
          return this.setExtraDataItemBuilder.build(item);
        }
      );
    }
    return _.merge(
      {
        setId: uuid.v4(),
        setName: '',
        learningLanguageCode: '',
        translatedToLanguageCode: '',
        setStatus: SetStatus.ACTIVE,
        createdAt: moment.utc().toDate(),
        updatedAt: moment.utc().toDate(),
        updatedStatusAt: moment.utc().toDate(),
        firstSyncedAt: null,
        lastSyncedAt: null,
        extraData,
      },
      set
    );
  }
}
