/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ExtraFieldDetail } from './ExtraFieldDetail';

export class KatakanaExtraFieldDetail extends ExtraFieldDetail {
  public readonly name = 'Katakana';
  public readonly description = 'Katakana of the term';
  public readonly kind = 'term';
  public readonly targetLanguageCodes = ['ja'];
  public readonly templateName = 'katakana';
  public readonly parseDirection = 'right';

  public readonly params = [
    {
      description: 'term',
      rule: Joi.string().required(),
      isSpeakable: false,
    },
  ];

  public readonly shortcodes = [
    {
      value: '[katakana: ]',
      cursor: 11,
    },
  ];
}
