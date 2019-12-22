/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export function getLastSyncTime(): null | string {
  const lastSyncTime = PropertiesService.getDocumentProperties().getProperty("lastSyncTime")

  return lastSyncTime 
}
