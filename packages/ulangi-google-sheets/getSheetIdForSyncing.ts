/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export function getSheetIdForSyncing(): null | number {
  const sheetId = PropertiesService.getDocumentProperties().getProperty("sheetIdForSyncing")
  return sheetId !== null ? parseInt(sheetId) : null
}
