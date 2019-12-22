/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Request, Response } from 'express';

import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { WebRequest } from '../../interfaces/WebRequest';

export abstract class WebController {
  public abstract options(): ControllerOptions<WebRequest>;

  public abstract handleRequest(req: Request, res: Response): Promise<void>;
}
