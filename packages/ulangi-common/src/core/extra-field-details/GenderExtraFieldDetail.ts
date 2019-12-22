/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ExtraFieldDetail } from './ExtraFieldDetail';

export class GenderExtraFieldDetail extends ExtraFieldDetail {
  public readonly name = 'Gender';
  public readonly description = 'Gender of the term';
  public readonly kind = 'term';
  public readonly targetLanguageCodes = ['de', 'fr', 'it', 'es'];
  public readonly parseDirection = 'right';
  public readonly templateName = undefined;

  public readonly params = [
    {
      description: 'value',
      isSpeakable: false,
      rule: Joi.string().valid(['feminine', 'masculine', 'neutral']),
    },
  ];

  public readonly shortcodes = [
    {
      value: '[feminine]',
    },
    {
      value: '[masculine]',
    },
    {
      value: '[neutral]',
    },
  ];
}
