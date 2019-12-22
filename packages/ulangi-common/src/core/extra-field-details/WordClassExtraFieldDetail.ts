/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ExtraFieldDetail } from './ExtraFieldDetail';

export class WordClassExtraFieldDetail extends ExtraFieldDetail {
  public readonly name = 'Word Class';
  public readonly description = 'Word Class (Part of Speech) of the definition';
  public readonly kind = 'definition';
  public readonly targetLanguageCodes = 'any';
  public readonly parseDirection = 'left';
  public readonly templateName = undefined;

  public readonly params = [
    {
      description: 'word class',
      rule: Joi.string().required(),
      isSpeakable: false,
    },
  ];

  public readonly shortcodes = [
    {
      value: '[]',
      cursor: 1,
    },
    {
      value: '[n]',
      cursor: 3,
    },
    {
      value: '[v]',
      cursor: 3,
    },
    {
      value: '[adj]',
      cursor: 5,
    },
    {
      value: '[adv]',
      cursor: 5,
    },
  ];
}
