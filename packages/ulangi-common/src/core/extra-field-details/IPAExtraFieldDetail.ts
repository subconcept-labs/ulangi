/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ExtraFieldDetail } from './ExtraFieldDetail';

export class IPAExtraFieldDetail extends ExtraFieldDetail {
  public readonly name = 'IPA';
  public readonly description = 'International Phonetic Alphabet of the term';
  public readonly kind = 'term';
  public readonly targetLanguageCodes = 'any';
  public readonly parseDirection = 'right';
  public readonly templateName = 'ipa';

  public readonly params = [
    {
      description: 'text',
      rule: Joi.string().required(),
      isSpeakable: false,
    },
  ];

  public readonly shortcodes = [
    {
      value: '[ipa: ]',
      cursor: 6,
    },
  ];
}
