/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Env } from '../interfaces/Env';
import { HomeController } from './controllers/HomeController';
import { WebController } from './controllers/WebController';

export class WebControllerFactory {
  private env: Env;

  public constructor(env: Env) {
    this.env = env;
  }

  public makeControllers(): readonly WebController[] {
    return [new HomeController(this.env)];
  }
}
