/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ExtraFieldDetail } from './ExtraFieldDetail';

export class AntonymExtraFieldDetail extends ExtraFieldDetail {
  public readonly name = 'Antonym';
  public readonly description = 'Antonym of the term';
  public readonly kind = 'definition';
  public readonly parseDirection = 'right';
  public readonly targetLanguageCodes = 'any';
  public readonly templateName = 'antonym';

  public readonly params = [
    {
      description: 'term',
      isSpeakable: true,
      rule: Joi.string().required(),
    },
  ];

  public readonly shortcodes = [
    {
      value: '[antonym: ]',
      cursor: 10,
    },
  ];
}
