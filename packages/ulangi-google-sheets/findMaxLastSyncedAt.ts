/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export function findMaxLastSyncedAt(list: readonly { lastSyncedAt: string }[]): string {
  return list.reduce((a, b): { lastSyncedAt: string } => {
    return new Date(a.lastSyncedAt) > new Date(b.lastSyncedAt) ? a : b
  }).lastSyncedAt
}
