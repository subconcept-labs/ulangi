/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Request } from '@ulangi/ulangi-common/interfaces';

import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';

export abstract class ApiController<R extends Request, P extends object> {
  public abstract options(): ControllerOptions<R>;

  public abstract handleRequest(
    req: ApiRequest<R>,
    res: ApiResponse<P>
  ): Promise<void>;
}
