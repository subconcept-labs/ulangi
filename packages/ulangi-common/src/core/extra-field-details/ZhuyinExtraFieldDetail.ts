/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ExtraFieldDetail } from './ExtraFieldDetail';

export class ZhuyinExtraFieldDetail extends ExtraFieldDetail {
  public readonly name = 'Zhuyin';
  public readonly description = 'Zhuyin of the term';
  public readonly kind = 'term';
  public readonly targetLanguageCodes = ['zh'];
  public readonly parseDirection = 'right';
  public readonly templateName = 'zhuyin';

  public readonly params = [
    {
      description: 'text',
      rule: Joi.string().required(),
      isSpeakable: false,
    },
  ];

  public readonly shortcodes = [
    {
      value: '[zhuyin: ]',
      cursor: 9,
    },
  ];
}
