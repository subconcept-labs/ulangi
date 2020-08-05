/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '../../enums/Theme';
import { ButtonStyles } from '../general/ButtonStyles';

export interface ButtonProps {
  testID?: string;
  text: string;
  styles?: (
    theme: Theme,
    layout: { width: number; height: number }
  ) => ButtonStyles;
  disabled?: boolean;
  icon?: React.ReactElement<any>;
  onPress?: () => void;
}
