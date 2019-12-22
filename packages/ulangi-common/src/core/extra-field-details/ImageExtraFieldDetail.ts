/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ExtraFieldDetail } from './ExtraFieldDetail';

export class ImageExtraFieldDetail extends ExtraFieldDetail {
  public readonly name: string;
  public readonly description: string;
  public readonly kind: 'definition';
  public readonly targetLanguageCodes = 'any';
  public readonly parseDirection = 'right';
  public readonly templateName = 'image';

  public readonly params = [
    {
      description: 'url',
      rule: Joi.string().required(),
      isSpeakable: false,
    },
  ];

  public readonly shortcodes = [
    {
      value: '[image: ]',
      cursor: 8,
    },
  ];

  public constructor(name: string, description: string, kind: 'definition') {
    super();
    this.name = name;
    this.description = description;
    this.kind = kind;
  }
}
