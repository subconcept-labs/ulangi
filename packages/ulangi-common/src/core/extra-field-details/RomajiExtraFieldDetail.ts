/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ExtraFieldDetail } from './ExtraFieldDetail';

export class RomajiExtraFieldDetail extends ExtraFieldDetail {
  public readonly name = 'Romaji';
  public readonly description = 'Romaji of the term';
  public readonly kind = 'term';
  public readonly targetLanguageCodes = ['ja'];
  public readonly parseDirection = 'right';
  public readonly templateName = 'romaji';

  public readonly params = [
    {
      description: 'text',
      rule: Joi.string().required(),
      isSpeakable: false,
    },
  ];

  public readonly shortcodes = [
    {
      value: '[romaji: ]',
      cursor: 9,
    },
  ];
}
