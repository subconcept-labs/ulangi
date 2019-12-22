/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { Version } from '../../interfaces/general/Version';

export class VersionResolver extends AbstractResolver<Version> {
  protected rules = {
    comparableVersion: Joi.string().regex(/^\d{4}\.\d{4}\.\d{4}$/),
  };
}
