/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

// Use this utility function when typescript cannot differentiaite tuple type from array
export function tuple<T extends any[]>(...args: T): T {
  return args;
}
