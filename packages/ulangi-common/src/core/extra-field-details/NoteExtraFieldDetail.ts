/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ExtraFieldDetail } from './ExtraFieldDetail';

export class NoteExtraFieldDetail extends ExtraFieldDetail {
  public readonly name: string;
  public readonly description: string;
  public readonly kind: 'term' | 'definition';
  public readonly targetLanguageCodes = 'any';
  public readonly parseDirection = 'right';
  public readonly templateName = 'note';

  public readonly params = [
    {
      description: 'text',
      rule: Joi.string().required(),
      isSpeakable: false,
    },
  ];

  public readonly shortcodes = [
    {
      value: '[note: ]',
      cursor: 7,
    },
  ];

  public constructor(
    name: string,
    description: string,
    kind: 'term' | 'definition'
  ) {
    super();
    this.name = name;
    this.description = description;
    this.kind = kind;
  }
}
