/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ExtraFieldDetail } from './ExtraFieldDetail';

export class SynonymExtraFieldDetail extends ExtraFieldDetail {
  public readonly name = 'Synonym';
  public readonly description = 'Synonym of the term';
  public readonly kind = 'definition';
  public readonly targetLanguageCodes = 'any';
  public readonly parseDirection = 'right';
  public readonly templateName = 'synonym';

  public readonly params = [
    {
      description: 'term',
      rule: Joi.string().required(),
      isSpeakable: false,
    },
  ];

  public readonly shortcodes = [
    {
      value: '[synonym: ]',
      cursor: 10,
    },
  ];
}
