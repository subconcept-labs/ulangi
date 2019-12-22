/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ExtraFieldDetail } from './ExtraFieldDetail';

export class ExampleExtraFieldDetail extends ExtraFieldDetail {
  public readonly name = 'Example';
  public readonly description = 'Example for the definition';
  public readonly kind = 'definition';
  public readonly targetLanguageCodes = 'any';
  public readonly parseDirection = 'right';
  public readonly templateName = 'example';

  public readonly params = [
    {
      description: 'text',
      rule: Joi.string().required(),
      isSpeakable: false,
    },
  ];

  public readonly shortcodes = [
    {
      value: '[example: ]',
      cursor: 10,
    },
  ];
}
