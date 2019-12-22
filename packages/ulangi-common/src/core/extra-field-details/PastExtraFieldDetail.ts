/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ExtraFieldDetail } from './ExtraFieldDetail';

export class PastExtraFieldDetail extends ExtraFieldDetail {
  public readonly name = 'Past';
  public readonly description = 'Past form of the term';
  public readonly kind = 'term';
  public readonly targetLanguageCodes = ['en'];
  public readonly parseDirection = 'right';
  public readonly templateName = 'past';

  public readonly params = [
    {
      description: 'term',
      rule: Joi.string().required(),
      isSpeakable: true,
    },
  ];

  public readonly shortcodes = [
    {
      value: '[past: ]',
      cursor: 7,
    },
  ];
}
