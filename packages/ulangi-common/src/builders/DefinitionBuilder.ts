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

import { DefinitionStatus } from '../enums/DefinitionStatus';
import { Definition } from '../interfaces/general/Definition';

export class DefinitionBuilder {
  public build(definition: DeepPartial<Definition>): Definition {
    return _.merge(
      {
        definitionId: uuid.v4(),
        wordClasses: [],
        meaning: '',
        source: '',
        definitionStatus: DefinitionStatus.ACTIVE,
        updatedAt: moment.utc().toDate(),
        createdAt: moment.utc().toDate(),
        updatedStatusAt: moment.utc().toDate(),
        firstSyncedAt: null,
        lastSyncedAt: null,
        extraData: [],
      },
      definition
    );
  }
}
