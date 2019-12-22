/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export function parserErrorHandler(
  err: any,
  _req: any,
  res: any,
  next: any
): any {
  // body-parser will set this to 400 if the json is in error
  if (err.status === 400)
    return res.status(err.status).send('Invalid parameters');

  // if it's not a 400, let the default error handling do it.
  return next(err);
}
