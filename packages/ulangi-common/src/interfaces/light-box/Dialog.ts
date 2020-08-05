/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonProps } from '../general/ButtonProps';

export interface Dialog {
  readonly message: string;
  readonly testID?: string;
  readonly title?: string;
  readonly showCloseButton?: boolean;
  readonly closeOnTouchOutside?: boolean;
  readonly buttonList?: readonly ButtonProps[];
  readonly onClose?: () => void;
  readonly onBackgroundPress?: () => void;
}
