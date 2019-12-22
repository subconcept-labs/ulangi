/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { RemoteConfig } from '../../interfaces/general/RemoteConfig';
import { AdConfigResolver } from './AdConfigResolver';
import { AppConfigResolver } from './AppConfigResolver';
import { LanguagePairResolver } from './LanguagePairResolver';
import { LanguageResolver } from './LanguageResolver';
import { SyncConfigResolver } from './SyncConfigResolver';

export class RemoteConfigResolver extends AbstractResolver<RemoteConfig> {
  private languageResolver = new LanguageResolver();
  private languagePairResolver = new LanguagePairResolver();

  private appConfigResolver = new AppConfigResolver();
  private adConfigResolver = new AdConfigResolver();
  private syncConfigResolver = new SyncConfigResolver();

  protected rules = {
    languages: Joi.array().items(this.languageResolver.getRules()),
    supportedLanguagePairs: Joi.array().items(
      this.languagePairResolver.getRules()
    ),
    app: this.appConfigResolver.getRules(),
    ad: this.adConfigResolver.getRules(),
    sync: this.syncConfigResolver.getRules(),
  };
}
