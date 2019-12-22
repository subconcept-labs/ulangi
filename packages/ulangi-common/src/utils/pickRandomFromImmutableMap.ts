/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { Map } from 'immutable';
import * as _ from 'lodash';

export function pickRandomFromImmutableMap<K, V>(map: Map<K, V>): [K, V] {
  if (map.size === 0) {
    throw new Error('map is empty');
  }

  const randomNum = _.random(0, map.size - 1);
  return assertExists(map.entrySeq().get(randomNum));
}
