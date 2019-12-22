/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Request, Response } from 'express';

import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { Env } from '../../interfaces/Env';
import { WebRequest } from '../../interfaces/WebRequest';
import { WebController } from './WebController';

export class WhatsNewController extends WebController {
  private env: Env;

  public constructor(env: Env) {
    super();
    this.env = env;
  }

  public options(): ControllerOptions<WebRequest> {
    return {
      paths: ['/whats-new'],
      allowedMethod: 'get',
      authStrategies: null,
      requestResolver: null,
    };
  }

  public async handleRequest(_: Request, res: Response): Promise<void> {
    res.render('normal/whats-new/index', {
      canonicalUrl: this.env.SERVER_URL + '/whats-new',
    });
  }
}
