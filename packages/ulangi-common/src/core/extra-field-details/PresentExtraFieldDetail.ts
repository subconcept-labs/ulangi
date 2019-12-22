/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ExtraFieldDetail } from './ExtraFieldDetail';

export class PresentExtraFieldDetail extends ExtraFieldDetail {
  public readonly name = 'Present';
  public readonly description = 'Present form of the term';
  public readonly kind = 'term';
  public readonly targetLanguageCodes = ['en'];
  public readonly parseDirection = 'right';
  public readonly templateName = 'present';

  public readonly params = [
    {
      description: 'term',
      rule: Joi.string().required(),
      isSpeakable: true,
    },
  ];

  public readonly shortcodes = [
    {
      value: '[present: ]',
      cursor: 10,
    },
  ];
}
