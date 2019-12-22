/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ExtraFieldDetail } from './ExtraFieldDetail';

export class PluralExtraFieldDetail extends ExtraFieldDetail {
  public readonly name = 'Plural';
  public readonly description = 'Plural form of the term';
  public readonly kind = 'term';
  public readonly targetLanguageCodes = [
    'en',
    'de',
    'nl',
    'da',
    'sv',
    'nb',
    'it',
    'pt',
    'es',
    'fr',
    'hu',
    'el',
    'hi',
    'tr',
  ];
  public readonly parseDirection = 'right';
  public readonly templateName = 'plural';

  public readonly params = [
    {
      description: 'term',
      rule: Joi.string().required(),
      isSpeakable: true,
    },
  ];

  public readonly shortcodes = [
    {
      value: '[plural: ]',
      cursor: 9,
    },
  ];
}
