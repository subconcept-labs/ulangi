/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DefaultButtonProps } from '../props/DefaultButtonProps';
import { SelectionItem } from './SelectionItem';

export interface SelectionMenu<T> {
  readonly testID?: string;
  readonly items: Map<T, SelectionItem>;
  readonly selectedIds: readonly T[];
  readonly rightButton?: DefaultButtonProps;
  readonly leftButton?: DefaultButtonProps;
  readonly title: string;
  readonly onClose?: () => void;
}
