/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export class LinkGenerator {
  public generateLinkBySourceAndValue(
    source: string,
    value: string
  ): undefined | string {
    if (source === 'wiktionary') {
      return 'https://en.wiktionary.org/wiki/' + value;
    } else {
      return undefined;
    }
  }
}
