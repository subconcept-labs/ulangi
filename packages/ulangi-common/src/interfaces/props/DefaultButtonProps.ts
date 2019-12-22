/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TouchableOpacityProperties } from 'react-native';

import { ButtonStyles } from '../general/ButtonStyles';

export interface DefaultButtonProps extends TouchableOpacityProperties {
  testID?: string;
  text: string;
  styles?: ButtonStyles;
  disabled?: boolean;
  icon?: React.ReactElement<any>;
  onPress?: () => void;
}
