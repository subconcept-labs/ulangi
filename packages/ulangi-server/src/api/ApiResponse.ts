/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorResponse } from '@ulangi/ulangi-common/interfaces';
import { Response } from 'express';

export class ApiResponse<T> {
  private res: Response;

  public constructor(res: Response) {
    this.res = res;
  }

  public json(obj: T): void {
    this.res.json(obj);
  }

  public binary(data: any): void {
    this.res.end(data, 'binary');
  }

  public error(statusCode: number, obj: ErrorResponse): void {
    this.res.status(statusCode).json(obj);
  }

  public headersSent(): boolean {
    return this.res.headersSent;
  }
}
