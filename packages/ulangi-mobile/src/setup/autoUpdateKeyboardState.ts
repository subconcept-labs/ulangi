/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableKeyboard } from '@ulangi/ulangi-observable';
import { Keyboard } from 'react-native';

export function autoUpdateKeyboardState(
  observableKeyboard: ObservableKeyboard,
): () => void {
  const showingSubscription = Keyboard.addListener(
    'keyboardDidShow',
    (): void => {
      observableKeyboard.state = 'showing';
    },
  );
  const hiddenSubscription = Keyboard.addListener(
    'keyboardDidHide',
    (): void => {
      observableKeyboard.state = 'hidden';
    },
  );

  return (): void => {
    showingSubscription.remove();
    hiddenSubscription.remove();
  };
}
