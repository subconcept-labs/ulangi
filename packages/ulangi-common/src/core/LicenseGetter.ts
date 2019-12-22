/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export class LicenseGetter {
  public getLicenseBySource(source: string): string {
    if (source === 'wiktionary') {
      return 'CC-SA-BY 3.0';
    } else {
      return '';
    }
  }
}
