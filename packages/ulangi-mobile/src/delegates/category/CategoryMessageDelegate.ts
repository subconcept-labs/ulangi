/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DialogDelegate } from '../dialog/DialogDelegate';

export class CategoryMessageDelegate {
  private dialogDelegate: DialogDelegate;

  public constructor(dialogDelegate: DialogDelegate) {
    this.dialogDelegate = dialogDelegate;
  }

  public showSelectSpecificCategoryMessage(): void {
    this.dialogDelegate.show({
      message:
        'To select specific categories to learn or practice, please go to Manage screen.',
      showCloseButton: true,
      closeOnTouchOutside: true,
    });
  }
}
