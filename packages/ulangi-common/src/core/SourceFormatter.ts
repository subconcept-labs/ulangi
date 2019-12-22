/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

export class SourceFormatter {
  public format(source: string): string {
    if (_.includes(['wiktionary', 'google', 'ulangi', 'wikibooks'], source)) {
      return _.upperFirst(source);
    } else {
      return source;
    }
  }
}
