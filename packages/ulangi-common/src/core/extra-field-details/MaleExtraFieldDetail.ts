/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ExtraFieldDetail } from './ExtraFieldDetail';

export class MaleExtraFieldDetail extends ExtraFieldDetail {
  public readonly name = 'Male';
  public readonly description = 'Male form of the term';
  public readonly kind = 'term';
  public readonly targetLanguageCodes = ['de', 'fr', 'it', 'es'];
  public readonly parseDirection = 'right';
  public readonly templateName = 'male';

  public readonly params = [
    {
      description: 'term',
      rule: Joi.string().required(),
      isSpeakable: true,
    },
  ];

  public readonly shortcodes = [
    {
      value: '[male: ]',
      cursor: 7,
    },
  ];
}
